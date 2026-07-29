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
const sessions = new Set()

app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }))
app.use(compression())
app.use(cors())
app.use(express.json({ limit: '2mb' }))

const defaultData = { manualNews: [], breaking: [
  { id:'default-breaking-1', text:'ब्रेकिंग न्यूज़: देश-दुनिया की ताज़ा खबरों के लिए भारत समाचार के साथ जुड़े रहें', active:true, createdAt:new Date().toISOString() },
  { id:'default-breaking-2', text:'दैनिक पंचांग, राशिफल और व्रत-त्योहार की संपूर्ण जानकारी पढ़ें', active:true, createdAt:new Date().toISOString() }
], contacts: [], panchang: {} }
function loadData(){
  try { return { ...defaultData, ...JSON.parse(fs.readFileSync(dataFile,'utf8')) } }
  catch { fs.writeFileSync(dataFile, JSON.stringify(defaultData,null,2)); return structuredClone(defaultData) }
}
function saveData(data){ fs.writeFileSync(dataFile, JSON.stringify(data,null,2)) }
function auth(req,res,next){
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/,'')
  if(!sessions.has(token)) return res.status(401).json({ error:'Unauthorized' })
  next()
}

const categoryQueries = { top:'', nation:'भारत', world:'विश्व', business:'व्यापार शेयर बाजार', technology:'टेक्नोलॉजी', sports:'खेल क्रिकेट', entertainment:'मनोरंजन बॉलीवुड', health:'स्वास्थ्य' }
const cache = new Map()
const CACHE_MS = 2 * 60 * 1000
function rssUrl(category){ const q=categoryQueries[category]??''; return q?`https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=hi&gl=IN&ceid=IN:hi`:'https://news.google.com/rss?hl=hi&gl=IN&ceid=IN:hi' }

app.get('/api/health', (_req,res) => res.json({ ok:true, version:'3.1.0', source:'Google News RSS + Editorial Desk' }))
app.get('/robots.txt',(_req,res)=>res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: /sitemap.xml'))
app.get('/sitemap.xml',(_req,res)=>{const base=process.env.PUBLIC_URL||`${req.protocol}://${req.get('host')}`;const paths=['/','/#/about','/#/contact','/#/editorial-policy','/#/privacy','/#/terms'];res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(x=>`<url><loc>${base}${x}</loc></url>`).join('')}</urlset>`)})
app.get('/api/news', async (req,res) => {
  const category=String(req.query.category||'top')
  const dataStore=loadData()
  const manual=dataStore.manualNews.filter(n=>n.status==='published' && (category==='top'||n.category===category)).sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate))
  const cached=cache.get(category)
  if(cached && Date.now()-cached.time<CACHE_MS) return res.json({ ...cached.data, articles:[...manual,...cached.data.articles] })
  try{
    const feed=await parser.parseURL(rssUrl(category))
    const articles=feed.items.slice(0,35).map((item,index)=>{ const pieces=(item.title||'').split(' - '); const source=pieces.length>1?pieces.pop():'Google News'; return { id:item.guid||item.link||`${category}-${index}`, title:pieces.join(' - ')||'समाचार', description:item.contentSnippet||'', link:item.link, pubDate:item.isoDate||item.pubDate||new Date().toISOString(), source, image:'', category, origin:'rss' } })
    const payload={ category, updatedAt:new Date().toISOString(), articles }
    cache.set(category,{time:Date.now(),data:payload})
    res.json({ ...payload, articles:[...manual,...articles] })
  }catch(error){
    console.error('RSS error:',error.message)
    const stale=cache.get(category)
    if(stale) return res.json({ ...stale.data, stale:true, articles:[...manual,...stale.data.articles] })
    res.json({ category,updatedAt:new Date().toISOString(),stale:true,articles:manual })
  }
})
app.get('/api/breaking',(_req,res)=>{ const active=(loadData().breaking||[]).filter(x=>x.active&&x.text); res.json(active.length?active:defaultData.breaking) })
app.get('/api/panchang',(_req,res)=>{ const d=loadData(); res.json({date:new Date().toLocaleDateString('hi-IN',{timeZone:'Asia/Kolkata',weekday:'long',day:'numeric',month:'long',year:'numeric'}),...d.panchang}) })
app.post('/api/contact',(req,res)=>{
  const {name,email,phone='',subject,message}=req.body||{}
  if(!name||!email||!subject||!message) return res.status(400).json({error:'सभी आवश्यक फ़ील्ड भरें।'})
  const data=loadData(); data.contacts.unshift({id:crypto.randomUUID(),name,email,phone,subject,message,status:'new',createdAt:new Date().toISOString()}); saveData(data)
  res.status(201).json({ok:true,message:'आपका संदेश संपादकीय टीम तक पहुँच गया है।'})
})

app.post('/api/admin/login',(req,res)=>{
  const {email,password}=req.body||{}
  if(email!==ADMIN_EMAIL||password!==ADMIN_PASSWORD) return res.status(401).json({error:'ईमेल या पासवर्ड गलत है।'})
  const token=crypto.randomBytes(24).toString('hex'); sessions.add(token); res.json({token,user:{email,name:'Editorial Admin'}})
})
app.get('/api/admin/dashboard',auth,(_req,res)=>{ const d=loadData(); res.json({news:d.manualNews,breaking:d.breaking,contacts:d.contacts}) })
app.post('/api/admin/news',auth,(req,res)=>{
  const d=loadData(); const body=req.body||{}; if(!body.title||!body.description) return res.status(400).json({error:'शीर्षक और विवरण आवश्यक हैं।'})
  const article={id:crypto.randomUUID(),title:body.title,description:body.description,category:body.category||'top',source:body.source||'भारत समाचार',image:body.image||'',link:body.link||'#',status:body.status||'published',pubDate:body.pubDate||new Date().toISOString(),origin:'editorial'}
  d.manualNews.unshift(article); saveData(d); res.status(201).json(article)
})
app.put('/api/admin/news/:id',auth,(req,res)=>{ const d=loadData(); const i=d.manualNews.findIndex(x=>x.id===req.params.id); if(i<0)return res.status(404).json({error:'News not found'}); d.manualNews[i]={...d.manualNews[i],...req.body,id:d.manualNews[i].id}; saveData(d); res.json(d.manualNews[i]) })
app.delete('/api/admin/news/:id',auth,(req,res)=>{ const d=loadData(); d.manualNews=d.manualNews.filter(x=>x.id!==req.params.id); saveData(d); res.json({ok:true}) })
app.post('/api/admin/breaking',auth,(req,res)=>{ const d=loadData(); if(!req.body?.text)return res.status(400).json({error:'Breaking text required'}); const item={id:crypto.randomUUID(),text:req.body.text,active:true,createdAt:new Date().toISOString()}; d.breaking.unshift(item); saveData(d); res.status(201).json(item) })
app.put('/api/admin/breaking/:id',auth,(req,res)=>{ const d=loadData(); const i=d.breaking.findIndex(x=>x.id===req.params.id); if(i<0)return res.status(404).json({error:'Not found'}); d.breaking[i]={...d.breaking[i],...req.body}; saveData(d); res.json(d.breaking[i]) })
app.delete('/api/admin/breaking/:id',auth,(req,res)=>{ const d=loadData(); d.breaking=d.breaking.filter(x=>x.id!==req.params.id); saveData(d); res.json({ok:true}) })
app.put('/api/admin/contact/:id',auth,(req,res)=>{ const d=loadData(); const i=d.contacts.findIndex(x=>x.id===req.params.id); if(i<0)return res.status(404).json({error:'Not found'}); d.contacts[i]={...d.contacts[i],status:req.body.status||'read'}; saveData(d); res.json(d.contacts[i]) })

app.use(express.static(distPath,{maxAge:'1h'}))
app.get('/{*splat}',(req,res,next)=>{ if(req.path.startsWith('/api/'))return next(); res.sendFile(path.join(distPath,'index.html'),err=>err&&next(err)) })
app.listen(PORT,'0.0.0.0',()=>console.log(`Bharat Samachar v3.1 running on port ${PORT}`))
