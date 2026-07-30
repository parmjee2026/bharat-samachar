import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import Parser from 'rss-parser'
import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const app = express()
const parser = new Parser({ timeout: 12000 })
const PORT = process.env.PORT || 3001
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.resolve(__dirname, '../dist')
const dataFile = path.resolve(__dirname, 'editorial-data.json')

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'editor@bharatsamachar.in'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Bharat@2026'
const GNEWS_API_KEY = String(process.env.GNEWS_API_KEY || '').trim()
const CACHE_MS = Math.max(60, Number(process.env.CACHE_SECONDS || 180)) * 1000
const sessions = new Set()
const cache = new Map()

app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }))
app.use(compression())
app.use(cors())
app.use(express.json({ limit: '2mb' }))

const defaultData = {
  manualNews: [],
  breaking: [
    { id:'default-breaking-1', text:'ब्रेकिंग न्यूज़: देश-दुनिया की ताज़ा खबरों के लिए भारत समाचार के साथ जुड़े रहें', active:true, createdAt:new Date().toISOString() },
    { id:'default-breaking-2', text:'दैनिक पंचांग, राशिफल और व्रत-त्योहार की संपूर्ण जानकारी पढ़ें', active:true, createdAt:new Date().toISOString() }
  ],
  contacts: [],
  panchang: {}
}

function loadData(){
  try { return { ...defaultData, ...JSON.parse(fs.readFileSync(dataFile,'utf8')) } }
  catch { fs.writeFileSync(dataFile, JSON.stringify(defaultData,null,2)); return structuredClone(defaultData) }
}
function saveData(data){ fs.writeFileSync(dataFile, JSON.stringify(data,null,2)) }
function auth(req,res,next){
  const token=String(req.headers.authorization||'').replace(/^Bearer\s+/,'')
  if(!sessions.has(token)) return res.status(401).json({error:'Unauthorized'})
  next()
}

const categoryQueries = {
  top:'', nation:'भारत', world:'विश्व', business:'व्यापार शेयर बाजार',
  technology:'टेक्नोलॉजी', sports:'खेल क्रिकेट',
  entertainment:'मनोरंजन बॉलीवुड', health:'स्वास्थ्य'
}
const gnewsCategories = {
  top:'general', nation:'nation', world:'world', business:'business',
  technology:'technology', sports:'sports', entertainment:'entertainment', health:'health'
}

function rssUrl(category){
  const q=categoryQueries[category]??''
  return q
    ? `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=hi&gl=IN&ceid=IN:hi`
    : 'https://news.google.com/rss?hl=hi&gl=IN&ceid=IN:hi'
}

function cleanText(value=''){
  return String(value)
    .replace(/<[^>]*>/g,' ')
    .replace(/&nbsp;/gi,' ')
    .replace(/&amp;/gi,'&')
    .replace(/\s+/g,' ')
    .trim()
}

function titleKey(value=''){
  return cleanText(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu,'')
    .replace(/\s+/g,' ')
    .trim()
}

function deduplicateArticles(articles=[]){
  const links=new Set()
  const titles=new Set()

  return articles.filter(article=>{
    const link=String(article.link||'').split('?')[0].trim()
    const title=titleKey(article.title)

    if(!title) return false
    if(link && links.has(link)) return false
    if(titles.has(title)) return false

    if(link) links.add(link)
    titles.add(title)
    return true
  })
}

function sortNewestFirst(articles=[]){
  return [...articles].sort((a,b)=>new Date(b.pubDate||0)-new Date(a.pubDate||0))
}

async function fetchGNews(category){
  if(!GNEWS_API_KEY) return []

  const params=new URLSearchParams({
    category:gnewsCategories[category]||'general',
    country:'in',
    lang:'hi',
    max:'10',
    apikey:GNEWS_API_KEY
  })

  const controller=new AbortController()
  const timeout=setTimeout(()=>controller.abort(),12000)

  try{
    const response=await fetch(`https://gnews.io/api/v4/top-headlines?${params.toString()}`,{
      signal:controller.signal,
      headers:{Accept:'application/json'}
    })

    const responseBody=await response.text()

    console.log('GNews key loaded:',Boolean(GNEWS_API_KEY))
    console.log('GNews status:',response.status)

    if(!response.ok){
      console.error('GNews body:',responseBody.slice(0,1000))
      throw new Error(`GNews returned ${response.status}`)
    }

    let payload
    try{
      payload=JSON.parse(responseBody)
    }catch{
      throw new Error('GNews returned invalid JSON')
    }
    return (payload.articles||[]).map((item,index)=>({
      id:item.url||`gnews-${category}-${index}`,
      title:cleanText(item.title)||'समाचार',
      description:cleanText(item.description||item.content||''),
      link:item.url||'#',
      pubDate:item.publishedAt||new Date().toISOString(),
      source:cleanText(item.source?.name||'GNews'),
      image:item.image||'',
      category,
      origin:'gnews'
    }))
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchGoogleNewsRss(category){
  const feed=await parser.parseURL(rssUrl(category))
  return feed.items.slice(0,40).map((item,index)=>{
    const pieces=cleanText(item.title).split(' - ')
    const source=pieces.length>1?pieces.pop():'Google News'

    return {
      id:item.guid||item.link||`rss-${category}-${index}`,
      title:pieces.join(' - ')||'समाचार',
      description:cleanText(item.contentSnippet||item.content||''),
      link:item.link||'#',
      pubDate:item.isoDate||item.pubDate||new Date().toISOString(),
      source:cleanText(source),
      image:'',
      category,
      origin:'rss'
    }
  })
}

async function fetchLiveNews(category){
  const [gnewsResult,rssResult]=await Promise.allSettled([
    fetchGNews(category),
    fetchGoogleNewsRss(category)
  ])

  const gnews=gnewsResult.status==='fulfilled'?gnewsResult.value:[]
  const rss=rssResult.status==='fulfilled'?rssResult.value:[]

  if(gnewsResult.status==='rejected') console.error('GNews error:',gnewsResult.reason?.message||gnewsResult.reason)
  if(rssResult.status==='rejected') console.error('RSS error:',rssResult.reason?.message||rssResult.reason)

  return {
    articles:deduplicateArticles(sortNewestFirst([...gnews,...rss])).slice(0,50),
    providers:[
      ...(gnews.length?['gnews']:[]),
      ...(rss.length?['google-news-rss']:[])
    ]
  }
}

app.get('/api/health',(_req,res)=>res.json({
  ok:true,
  version:'4.0.0',
  source:GNEWS_API_KEY
    ? 'GNews API + Google News RSS + Editorial Desk'
    : 'Google News RSS + Editorial Desk',
  gnewsConfigured:Boolean(GNEWS_API_KEY),
  cacheSeconds:Math.round(CACHE_MS/1000)
}))

app.get('/robots.txt',(_req,res)=>res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: /sitemap.xml'))

app.get('/sitemap.xml',(req,res)=>{
  const base=process.env.PUBLIC_URL||`${req.protocol}://${req.get('host')}`
  const paths=['/','/#/about','/#/contact','/#/editorial-policy','/#/privacy','/#/terms']
  const urls=paths.map(route=>`<url><loc>${base}${route}</loc></url>`).join('')
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`)
})

app.get('/api/news',async(req,res)=>{
  const category=String(req.query.category||'top')
  const dataStore=loadData()
  const manual=dataStore.manualNews
    .filter(n=>n.status==='published'&&(category==='top'||n.category===category))
    .sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate))

  const cached=cache.get(category)
  if(cached&&Date.now()-cached.time<CACHE_MS){
    return res.json({...cached.data,articles:deduplicateArticles([...manual,...cached.data.articles])})
  }

  try{
    const live=await fetchLiveNews(category)
    if(!live.articles.length) throw new Error('All live providers returned no articles')

    const payload={
      category,
      updatedAt:new Date().toISOString(),
      providers:live.providers,
      articles:live.articles
    }
    cache.set(category,{time:Date.now(),data:payload})

    return res.json({...payload,articles:deduplicateArticles([...manual,...live.articles])})
  }catch(error){
    console.error('News aggregator error:',error.message)

    const stale=cache.get(category)
    if(stale){
      return res.json({...stale.data,stale:true,articles:deduplicateArticles([...manual,...stale.data.articles])})
    }

    return res.json({
      category,
      updatedAt:new Date().toISOString(),
      providers:['editorial'],
      stale:true,
      articles:manual
    })
  }
})

function isPlaceholderBreaking(item){
  const text=cleanText(item?.text)
  return (
    !text ||
    text.includes('देश-दुनिया की ताज़ा खबरों के लिए भारत समाचार के साथ जुड़े रहें') ||
    text.includes('दैनिक पंचांग, राशिफल और व्रत-त्योहार')
  )
}

app.get('/api/breaking',async(_req,res)=>{
  const editorial=(loadData().breaking||[])
    .filter(item=>item.active&&item.text&&!isPlaceholderBreaking(item))
    .map(item=>({
      id:item.id,
      text:cleanText(item.text),
      active:true,
      createdAt:item.createdAt||new Date().toISOString(),
      source:'editorial'
    }))

  try{
    const live=await fetchLiveNews('top')
    const liveBreaking=live.articles
      .filter(article=>article.title)
      .slice(0,8)
      .map((article,index)=>({
        id:article.id||`live-breaking-${index}`,
        text:cleanText(article.title),
        active:true,
        createdAt:article.pubDate||new Date().toISOString(),
        source:article.source||article.origin||'live',
        link:article.link||'#'
      }))

    const combined=[]
    const seen=new Set()

    for(const item of [...editorial,...liveBreaking]){
      const key=titleKey(item.text)
      if(!key||seen.has(key)) continue
      seen.add(key)
      combined.push(item)
    }

    if(combined.length) return res.json(combined.slice(0,10))

    return res.json(defaultData.breaking)
  }catch(error){
    console.error('Breaking news error:',error.message)
    return res.json(editorial.length?editorial:defaultData.breaking)
  }
})

app.get('/api/panchang',(_req,res)=>{
  const d=loadData()
  res.json({
    date:new Date().toLocaleDateString('hi-IN',{
      timeZone:'Asia/Kolkata',
      weekday:'long',
      day:'numeric',
      month:'long',
      year:'numeric'
    }),
    ...d.panchang
  })
})

app.post('/api/contact',(req,res)=>{
  const {name,email,phone='',subject,message}=req.body||{}
  if(!name||!email||!subject||!message) return res.status(400).json({error:'सभी आवश्यक फ़ील्ड भरें।'})

  const data=loadData()
  data.contacts.unshift({
    id:crypto.randomUUID(),
    name,email,phone,subject,message,
    status:'new',
    createdAt:new Date().toISOString()
  })
  saveData(data)
  res.status(201).json({ok:true,message:'आपका संदेश संपादकीय टीम तक पहुँच गया है।'})
})

app.post('/api/admin/login',(req,res)=>{
  const {email,password}=req.body||{}
  if(email!==ADMIN_EMAIL||password!==ADMIN_PASSWORD) return res.status(401).json({error:'ईमेल या पासवर्ड गलत है।'})

  const token=crypto.randomBytes(24).toString('hex')
  sessions.add(token)
  res.json({token,user:{email,name:'Editorial Admin'}})
})

app.get('/api/admin/dashboard',auth,(_req,res)=>{
  const d=loadData()
  res.json({news:d.manualNews,breaking:d.breaking,contacts:d.contacts})
})

app.post('/api/admin/news',auth,(req,res)=>{
  const d=loadData()
  const body=req.body||{}
  if(!body.title||!body.description) return res.status(400).json({error:'शीर्षक और विवरण आवश्यक हैं।'})

  const article={
    id:crypto.randomUUID(),
    title:body.title,
    description:body.description,
    category:body.category||'top',
    source:body.source||'भारत समाचार',
    image:body.image||'',
    link:body.link||'#',
    status:body.status||'published',
    pubDate:body.pubDate||new Date().toISOString(),
    origin:'editorial'
  }

  d.manualNews.unshift(article)
  saveData(d)
  res.status(201).json(article)
})

app.put('/api/admin/news/:id',auth,(req,res)=>{
  const d=loadData()
  const i=d.manualNews.findIndex(x=>x.id===req.params.id)
  if(i<0) return res.status(404).json({error:'News not found'})
  d.manualNews[i]={...d.manualNews[i],...req.body,id:d.manualNews[i].id}
  saveData(d)
  res.json(d.manualNews[i])
})

app.delete('/api/admin/news/:id',auth,(req,res)=>{
  const d=loadData()
  d.manualNews=d.manualNews.filter(x=>x.id!==req.params.id)
  saveData(d)
  res.json({ok:true})
})

app.post('/api/admin/breaking',auth,(req,res)=>{
  const d=loadData()
  if(!req.body?.text) return res.status(400).json({error:'Breaking text required'})
  const item={id:crypto.randomUUID(),text:req.body.text,active:true,createdAt:new Date().toISOString()}
  d.breaking.unshift(item)
  saveData(d)
  res.status(201).json(item)
})

app.put('/api/admin/breaking/:id',auth,(req,res)=>{
  const d=loadData()
  const i=d.breaking.findIndex(x=>x.id===req.params.id)
  if(i<0) return res.status(404).json({error:'Not found'})
  d.breaking[i]={...d.breaking[i],...req.body}
  saveData(d)
  res.json(d.breaking[i])
})

app.delete('/api/admin/breaking/:id',auth,(req,res)=>{
  const d=loadData()
  d.breaking=d.breaking.filter(x=>x.id!==req.params.id)
  saveData(d)
  res.json({ok:true})
})

app.put('/api/admin/contact/:id',auth,(req,res)=>{
  const d=loadData()
  const i=d.contacts.findIndex(x=>x.id===req.params.id)
  if(i<0) return res.status(404).json({error:'Not found'})
  d.contacts[i]={...d.contacts[i],status:req.body.status||'read'}
  saveData(d)
  res.json(d.contacts[i])
})

app.use(express.static(distPath,{maxAge:'1h'}))
app.get('/{*splat}',(req,res,next)=>{
  if(req.path.startsWith('/api/')) return next()
  res.sendFile(path.join(distPath,'index.html'),err=>err&&next(err))
})

app.listen(PORT,'0.0.0.0',()=>console.log(`Bharat Samachar v4.0 running on port ${PORT}`))
