import React,{useEffect,useMemo,useState} from 'react'
import Header from './components/layout/Header'
const categories=[['top','होम'],['nation','राष्ट्रीय'],['world','दुनिया'],['business','व्यापार'],['technology','टेक्नोलॉजी'],['sports','खेल'],['entertainment','मनोरंजन'],['health','स्वास्थ्य']]
const labels=Object.fromEntries(categories)
const defaultBreaking=[{id:'live-default-1',text:'भारत समाचार: देश-दुनिया की ताज़ा खबरों के लिए जुड़े रहें'},{id:'live-default-2',text:'दैनिक पंचांग, राशिफल, व्रत और त्योहार की पूरी जानकारी अब उपलब्ध है'}]
const fallback=Array.from({length:12},(_,i)=>({id:`fallback-${i}`,title:i?'लाइव हिंदी समाचार अपडेट':'भारत समाचार में आपका स्वागत है',description:'ताज़ा समाचार लोड किए जा रहे हैं।',link:'#',source:'भारत समाचार',pubDate:new Date().toISOString(),image:'',category:'top'}))
const fmt=v=>{try{return new Date(v).toLocaleString('hi-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}catch{return''}}

const categoryImages={
 top:['https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=82','https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1400&q=82','https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1400&q=82'],
 nation:['https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1400&q=82','https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1400&q=82','https://images.unsplash.com/photo-1532664189809-02133fee698d?auto=format&fit=crop&w=1400&q=82'],
 world:['https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=82','https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1400&q=82','https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1400&q=82'],
 business:['https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=82','https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=82','https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=82'],
 technology:['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=82','https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=82','https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1400&q=82'],
 sports:['https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=82','https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1400&q=82','https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1400&q=82'],
 entertainment:['https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=82','https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=82','https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1400&q=82'],
 health:['https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1400&q=82','https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=82','https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1400&q=82']
}
const stableIndex=value=>Array.from(String(value||'')).reduce((a,c)=>a+c.charCodeAt(0),0)%3
function Visual({item,className=''}){
 const pool=categoryImages[item?.category||'top']||categoryImages.top
 const fallbackImage=pool[stableIndex(item?.id||item?.title)]
 const src=item?.image||fallbackImage
 return <div className={`visual visual-${item?.category||'top'} ${className}`}><img src={src} alt={item?.title||'समाचार चित्र'} loading="lazy" onError={e=>{if(e.currentTarget.src!==fallbackImage)e.currentTarget.src=fallbackImage;else e.currentTarget.style.display='none'}}/><em>{labels[item?.category]||'खबर'}</em></div>
}
function Footer(){return <footer><div className="container footer-grid"><div><b>भारत समाचार</b><p>खबर जो मायने रखे</p></div><div className="footer-links"><a href="#/about">हमारे बारे में</a><a href="#/contact">संपर्क</a><a href="#/editorial-policy">संपादकीय नीति</a><a href="#/privacy">गोपनीयता नीति</a><a href="#/terms">नियम व शर्तें</a><a href="#/admin">Editorial Panel</a><a href="#/bookmarks">बुकमार्क</a></div><small>© 2026 Bharat Samachar. All rights reserved.</small></div></footer>}

function InfoPage({title,kicker,children}){return <main className="container page-shell info-page"><div className="page-title"><span>{kicker}</span><h1>{title}</h1></div><article>{children}</article></main>}

function Field({label,...p}){return <label className="field"><span>{label}</span><input {...p}/></label>}

export default function App(){
 const [category,setCategory]=useState('top'),[news,setNews]=useState([]),[breaking,setBreaking]=useState([]),[panchang,setPanchang]=useState(null),[loading,setLoading]=useState(true),[query,setQuery]=useState(''),[dark,setDark]=useState(()=>localStorage.getItem('theme')==='dark'),[route,setRoute]=useState(location.hash||'#/'),[menu,setMenu]=useState(false),[bookmarks,setBookmarks]=useState(()=>JSON.parse(localStorage.getItem('bookmarks')||'[]'))
 const load=async()=>{setLoading(true);try{const [n,b,p]=await Promise.all([fetch(`/api/news?category=${category}`).then(r=>r.json()),fetch('/api/breaking').then(r=>r.json()),fetch('/api/panchang').then(r=>r.json())]);setNews(n.articles?.length?n.articles:fallback);setBreaking(Array.isArray(b)&&b.length?b:defaultBreaking);setPanchang(p)}catch{setNews(fallback);setBreaking(defaultBreaking)}finally{setLoading(false)}}
 useEffect(()=>{load();const timer=setInterval(load,120000);return()=>clearInterval(timer)},[category]);useEffect(()=>{const f=()=>setRoute(location.hash||'#/');addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);useEffect(()=>{localStorage.setItem('theme',dark?'dark':'light')},[dark]);useEffect(()=>localStorage.setItem('bookmarks',JSON.stringify(bookmarks)),[bookmarks])
 const filtered=useMemo(()=>{const q=query.toLowerCase().trim();return q?news.filter(n=>`${n.title} ${n.description}`.toLowerCase().includes(q)):news},[news,query])
 const open=n=>{location.hash=`#/news/${encodeURIComponent(n.id)}`;scrollTo(0,0)}
 const selectedId=route.startsWith('#/news/')?decodeURIComponent(route.slice(7)):'';const selected=news.find(n=>String(n.id)===selectedId)||bookmarks.find(n=>String(n.id)===selectedId)
 const header = (
  <Header
    category={category}
    onCategoryChange={setCategory}
    query={query}
    onQueryChange={setQuery}
    dark={dark}
    onThemeToggle={() => setDark(current => !current)}
    menuOpen={menu}
    onMenuToggle={() => setMenu(current => !current)}
  />
  const header = (
    <Header
      category={category}
      onCategoryChange={setCategory}
      query={query}
      onQueryChange={setQuery}
      dark={dark}
      onThemeToggle={() => setDark(current => !current)}
      menuOpen={menu}
      onMenuToggle={() => setMenu(current => !current)}
    />
  )

  const shell = content => (
    <div className={dark ? 'app dark' : 'app'}>
      {header}
      {content}
      <Footer />
    </div>
  )
 if(route==='#/about')return shell(<InfoPage title="हमारे बारे में" kicker="ABOUT BHARAT SAMACHAR"><p>भारत समाचार एक स्वतंत्र हिंदी डिजिटल न्यूज़ प्लेटफ़ॉर्म है। हमारा उद्देश्य सत्यापित, उपयोगी और पाठक-केंद्रित समाचार सरल भाषा में प्रस्तुत करना है।</p><p>पोर्टल पर राष्ट्रीय, अंतरराष्ट्रीय, व्यापार, तकनीक, खेल, मनोरंजन, स्वास्थ्य, दैनिक पंचांग, राशिफल तथा व्रत-त्योहार से जुड़ी सामग्री उपलब्ध है।</p></InfoPage>)
 if(route==='#/editorial-policy')return shell(<InfoPage title="संपादकीय नीति" kicker="EDITORIAL STANDARDS"><p>हम तथ्य-जाँच, स्रोत की स्पष्टता, निष्पक्ष भाषा और त्रुटि-सुधार को प्राथमिकता देते हैं। किसी खबर में गलती मिलने पर संपर्क पृष्ठ के माध्यम से सूचना भेजी जा सकती है।</p><p>RSS से प्राप्त खबरों के मूल स्रोत का उल्लेख किया जाता है। संपादकीय टीम द्वारा प्रकाशित सामग्री को अलग स्रोत पहचान के साथ दिखाया जाता है।</p></InfoPage>)
 if(route==='#/privacy')return shell(<InfoPage title="गोपनीयता नीति" kicker="PRIVACY"><p>संपर्क फ़ॉर्म में दी गई जानकारी केवल पाठक के संदेश का उत्तर देने और संपादकीय कार्य के लिए उपयोग की जाती है। हम अनावश्यक व्यक्तिगत जानकारी नहीं मांगते।</p><p>बुकमार्क और थीम प्राथमिकताएँ उपयोगकर्ता के ब्राउज़र में स्थानीय रूप से सुरक्षित रहती हैं।</p></InfoPage>)
 if(route==='#/terms')return shell(<InfoPage title="नियम व शर्तें" kicker="TERMS"><p>वेबसाइट की सामग्री सूचना के उद्देश्य से है। बाहरी स्रोतों पर प्रकाशित सामग्री की जिम्मेदारी संबंधित स्रोत की होती है। बिना अनुमति मूल संपादकीय सामग्री का व्यावसायिक पुनर्प्रकाशन न करें।</p></InfoPage>)
 if(route==='#/contact')return shell(<ContactPage/>)
 if(route==='#/admin')return shell(<AdminPanel onPublished={load}/>)
 if(route==='#/bookmarks')return shell(<main className="container page-shell"><div className="page-title"><span>आपकी सूची</span><h1>बुकमार्क</h1></div>{bookmarks.length?<div className="bookmark-grid">{bookmarks.map(n=><button className="bookmark-card" key={n.id} onClick={()=>open(n)}><Visual item={n}/><h3>{n.title}</h3></button>)}</div>:<div className="empty-state"><h2>अभी कोई खबर सेव नहीं है</h2><a href="#/">होम पर जाएँ</a></div>}</main>)
 if(selectedId)return shell(<main className="container article-page">{selected?<article className="article-layout"><div className="article-main"><span className="category-tag">{labels[selected.category]}</span><h1>{selected.title}</h1><div className="article-meta">{selected.source} • {fmt(selected.pubDate)}</div><Visual item={selected} className="article-visual"/><p className="article-intro">{selected.description}</p>{selected.link!=='#'&&<a className="source-button" href={selected.link} target="_blank" rel="noreferrer">मूल स्रोत पर पूरी खबर पढ़ें →</a>}</div><aside className="article-aside"><button className="save" onClick={()=>setBookmarks(b=>b.some(x=>x.id===selected.id)?b.filter(x=>x.id!==selected.id):[selected,...b])}>{bookmarks.some(x=>x.id===selected.id)?'★ सेव किया गया':'☆ बुकमार्क करें'}</button></aside></article>:<div className="not-found"><h1>खबर नहीं मिली</h1><a href="#/">होम पर जाएँ</a></div>}</main>)
 const hero=filtered[0]||fallback[0],secondary=filtered.slice(1,3),latest=filtered.slice(3),ticker=(breaking.length?breaking:defaultBreaking).map(x=>({id:x.id,title:x.text})).filter(x=>x&&x.title)
 return shell(<><div className="bbc-breaking"><div className="container bbc-breaking-inner"><strong>ब्रेकिंग</strong><div className="bbc-breaking-window"><div className="bbc-breaking-track">{[...ticker,...ticker].map((n,i)=><span key={`${n.id}-${i}`}>● {n.title}</span>)}</div></div></div></div><main className="container bbc-main">{loading&&!news.length?<p>समाचार लोड हो रहे हैं...</p>:<><section className="bbc-top-grid"><button className="bbc-lead" onClick={()=>open(hero)}><Visual item={hero}/><h1>{hero.title}</h1><p>{hero.description}</p><small>{fmt(hero.pubDate)}</small></button><div className="bbc-mini-grid">{filtered.slice(1,5).map(n=><button className="bbc-mini-card" key={n.id} onClick={()=>open(n)}><Visual item={n}/><h2>{n.title}</h2><small>{fmt(n.pubDate)}</small></button>)}</div></section><section className="bbc-section"><h2>आज की प्रमुख खबरें</h2><div className="bbc-news-grid">{filtered.slice(5,13).map(n=><button className="bbc-news-card" key={n.id} onClick={()=>open(n)}><Visual item={n}/><span>{labels[n.category||category]}</span><h3>{n.title}</h3><p>{n.description}</p><small>{n.source} • {fmt(n.pubDate)}</small></button>)}</div></section><PanchangSection data={panchang}/><SocialPopular news={filtered} onOpen={open}/></>}</main></>)
}


function PanchangSection({data}){
 const [rashiTab,setRashiTab]=useState('daily')
 const d=data||{}
 const basics=[
  ['पक्ष',d.paksha||'—'],['तिथि',d.tithi||'—'],['नक्षत्र',d.nakshatra||'—'],['योग',d.yoga||'—'],['करण',d.karan||'—'],
  ['सूर्योदय',d.sunrise||'—'],['सूर्यास्त',d.sunset||'—'],['चंद्रोदय',d.moonrise||'—'],['चंद्रास्त',d.moonset||'—'],
  ['राहुकाल',d.rahukaal||'—'],['अभिजीत मुहूर्त',d.abhijit||'—'],['ब्रह्म मुहूर्त',d.brahmaMuhurta||'—'],['चौघड़िया',d.choghadiya||'—']
 ]
 const rashis=d.rashifal?.[rashiTab]||[]
 const rashiLabels={daily:'दैनिक',monthly:'मासिक',yearly:'वार्षिक'}
 return <section className="panchang-hub">
  <nav className="panchang-quick-nav" aria-label="पंचांग अनुभाग"><a href="#panchang">दैनिक पंचांग</a><a href="#rashifal">राशिफल</a><a href="#vrat-festival">व्रत और त्योहार</a></nav>
  <div className="panchang-section" id="panchang">
   <div className="panchang-head"><div><span>आज का धार्मिक कैलेंडर</span><h2>दैनिक पंचांग</h2><p>{d.date||new Date().toLocaleDateString('hi-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}{d.location?` • ${d.location}`:''}</p></div><div className="panchang-sun">☀</div></div>
   <div className="panchang-grid">{basics.map(([k,v])=><div key={k}><small>{k}</small><b>{v}</b></div>)}</div>
   <div className="panchang-extra"><div><small>शुभ समय</small><b>{d.shubhSamay||'—'}</b></div><div><small>अशुभ समय</small><b>{d.ashubhSamay||'—'}</b></div><div><small>दिशाशूल</small><b>{d.dishashool||'—'}</b></div><div><small>चंद्र राशि</small><b>{d.chandraRashi||'—'}</b></div></div>
   <p className="panchang-note">पंचांग के समय स्थान के अनुसार बदल सकते हैं। स्थानीय प्रमाणित पंचांग से मिलान करें।</p>
  </div>

  <section className="rashifal-section" id="rashifal">
   <div className="section-title-row"><div><span>ज्योतिष</span><h2>राशिफल</h2></div><div className="rashi-tabs">{Object.entries(rashiLabels).map(([id,label])=><button key={id} className={rashiTab===id?'active':''} onClick={()=>setRashiTab(id)}>{label}</button>)}</div></div>
   <div className="rashi-grid">{rashis.length?rashis.map((r,i)=><article key={`${r.name}-${i}`}><div className="rashi-symbol">{r.symbol}</div><div><h3>{r.name} <small>{rashiLabels[rashiTab]}</small></h3><p>{r.text}</p></div></article>):<div className="section-empty">राशिफल अपडेट किया जा रहा है।</div>}</div>
  </section>

  <section className="vrat-festival-section" id="vrat-festival">
   <div className="section-title-row"><div><span>धर्म एवं संस्कृति</span><h2>व्रत और त्योहार</h2></div></div>
   <div className="festival-grid">
    <div className="festival-list"><h3>आगामी व्रत</h3>{(d.vrats||[]).length?(d.vrats||[]).map((x,i)=><article key={i}><time>{x.date}</time><div><b>{x.name}</b><p>{x.detail}</p></div></article>):<p className="section-empty">व्रत सूची अपडेट की जा रही है।</p>}</div>
    <div className="festival-list"><h3>प्रमुख त्योहार</h3>{(d.festivals||[]).length?(d.festivals||[]).map((x,i)=><article key={i}><time>{x.date}</time><div><b>{x.name}</b><p>{x.detail}</p></div></article>):<p className="section-empty">त्योहार सूची अपडेट की जा रही है।</p>}</div>
   </div>
  </section>
 </section>
}

function SocialPopular({news,onOpen}){
 const social=[
  {name:'WhatsApp',icon:'◉',className:'whatsapp',url:'https://www.whatsapp.com/'},
  {name:'Facebook',icon:'f',className:'facebook',url:'https://www.facebook.com/'},
  {name:'X',icon:'𝕏',className:'x',url:'https://x.com/'},
  {name:'YouTube',icon:'▶',className:'youtube',url:'https://www.youtube.com/'},
  {name:'Instagram',icon:'◎',className:'instagram',url:'https://www.instagram.com/'}
 ]
 const popular=(news?.length?news:fallback).slice(0,10)
 return <section className="social-popular"><div className="social-follow"><h2>सोशल मीडिया पर फ़ॉलो करें</h2><div className="social-links">{social.map(x=><a key={x.name} href={x.url} target="_blank" rel="noreferrer"><span className={`social-icon ${x.className}`}>{x.icon}</span><b>{x.name}</b></a>)}</div></div><div className="popular-block"><h2>सबसे अधिक लोकप्रिय</h2><div className="popular-grid">{popular.map((n,i)=><button key={`${n.id}-${i}`} onClick={()=>onOpen(n)}><span>{i+1}</span><h3>{n.title}</h3></button>)}</div></div></section>
}

function ContactPage(){const [form,setForm]=useState({name:'',email:'',phone:'',subject:'',message:''}),[status,setStatus]=useState('');const submit=async e=>{e.preventDefault();setStatus('भेजा जा रहा है...');const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});const d=await r.json();setStatus(d.message||d.error);if(r.ok)setForm({name:'',email:'',phone:'',subject:'',message:''})};return <main className="container page-shell"><div className="page-title"><span>READER CONNECT</span><h1>Contact Us</h1><p>समाचार सुझाव, सुधार, विज्ञापन या संपादकीय सहयोग के लिए हमसे संपर्क करें।</p></div><div className="contact-layout"><section className="contact-card"><h2>संपादकीय कार्यालय</h2><p><b>Email:</b> editor@bharatsamachar.in</p><p><b>News Desk:</b> news@bharatsamachar.in</p><p><b>Advertising:</b> ads@bharatsamachar.in</p><p><b>समय:</b> सोमवार–शनिवार, सुबह 10 से शाम 6 बजे</p><div className="contact-note">किसी खबर में त्रुटि हो तो headline और article link अवश्य भेजें।</div></section><form className="contact-form" onSubmit={submit}><div className="form-two"><Field label="नाम *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><Field label="ईमेल *" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div><div className="form-two"><Field label="फोन" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><Field label="विषय *" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/></div><label className="field"><span>संदेश *</span><textarea rows="7" value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/></label><button className="primary-btn">संदेश भेजें</button>{status&&<p className="form-status">{status}</p>}</form></div></main>}

function AdminPanel({onPublished}){const [token,setToken]=useState(()=>sessionStorage.getItem('adminToken')||''),[login,setLogin]=useState({email:'editor@bharatsamachar.in',password:''}),[data,setData]=useState({news:[],breaking:[],contacts:[]}),[tab,setTab]=useState('news'),[msg,setMsg]=useState(''),[article,setArticle]=useState({title:'',description:'',category:'top',source:'भारत समाचार',image:'',link:'',status:'published'}),[breakingText,setBreakingText]=useState('')
 const api=async(url,opt={})=>{const r=await fetch(url,{...opt,headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`,...opt.headers}});const d=await r.json();if(!r.ok)throw new Error(d.error||'Request failed');return d}
 const refresh=async()=>{try{setData(await api('/api/admin/dashboard'))}catch(e){setMsg(e.message)}};useEffect(()=>{if(token)refresh()},[token])
 const doLogin=async e=>{e.preventDefault();setMsg('');try{const d=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(login)}).then(async r=>{const x=await r.json();if(!r.ok)throw new Error(x.error);return x});sessionStorage.setItem('adminToken',d.token);setToken(d.token)}catch(e){setMsg(e.message)}}
 const publish=async e=>{e.preventDefault();try{await api('/api/admin/news',{method:'POST',body:JSON.stringify(article)});setArticle({...article,title:'',description:'',image:'',link:''});setMsg('खबर प्रकाशित हो गई।');refresh();onPublished?.()}catch(e){setMsg(e.message)}}
 const delNews=async id=>{if(!confirm('यह खबर हटाएँ?'))return;await api(`/api/admin/news/${id}`,{method:'DELETE'});refresh();onPublished?.()}
 const addBreaking=async e=>{e.preventDefault();await api('/api/admin/breaking',{method:'POST',body:JSON.stringify({text:breakingText})});setBreakingText('');refresh()}
 if(!token)return <main className="container admin-login"><form onSubmit={doLogin}><span>SECURE EDITORIAL ACCESS</span><h1>Admin Login</h1><Field label="ईमेल" type="email" value={login.email} onChange={e=>setLogin({...login,email:e.target.value})}/><Field label="पासवर्ड" type="password" value={login.password} onChange={e=>setLogin({...login,password:e.target.value})}/><button className="primary-btn">Login</button>{msg&&<p className="form-status error">{msg}</p>}<small>Default login README में दिया गया है। Production में environment variables बदलें।</small></form></main>
 return <main className="container admin-shell"><div className="admin-top"><div><span>BHARAT SAMACHAR CMS</span><h1>Editorial Panel</h1></div><button onClick={()=>{sessionStorage.removeItem('adminToken');setToken('')}}>Logout</button></div><div className="admin-stats"><div><b>{data.news.length}</b><span>Original News</span></div><div><b>{data.breaking.filter(x=>x.active).length}</b><span>Breaking</span></div><div><b>{data.contacts.filter(x=>x.status==='new').length}</b><span>New Messages</span></div></div><div className="admin-tabs"><button className={tab==='news'?'active':''} onClick={()=>setTab('news')}>News Desk</button><button className={tab==='breaking'?'active':''} onClick={()=>setTab('breaking')}>Breaking News</button><button className={tab==='contacts'?'active':''} onClick={()=>setTab('contacts')}>Contact Inbox</button></div>{msg&&<p className="admin-message">{msg}</p>}{tab==='news'&&<div className="admin-columns"><form className="editor-form" onSubmit={publish}><h2>नई खबर प्रकाशित करें</h2><Field label="Headline *" value={article.title} onChange={e=>setArticle({...article,title:e.target.value})}/><label className="field"><span>विवरण *</span><textarea rows="7" value={article.description} onChange={e=>setArticle({...article,description:e.target.value})}/></label><div className="form-two"><label className="field"><span>Category</span><select value={article.category} onChange={e=>setArticle({...article,category:e.target.value})}>{categories.map(([id,l])=><option value={id} key={id}>{l}</option>)}</select></label><Field label="Source" value={article.source} onChange={e=>setArticle({...article,source:e.target.value})}/></div><Field label="Image URL" value={article.image} onChange={e=>setArticle({...article,image:e.target.value})}/><Field label="External Link" value={article.link} onChange={e=>setArticle({...article,link:e.target.value})}/><button className="primary-btn">Publish News</button></form><section className="admin-list"><h2>Published News</h2>{data.news.map(n=><article key={n.id}><div><span>{labels[n.category]}</span><h3>{n.title}</h3><small>{fmt(n.pubDate)}</small></div><button onClick={()=>delNews(n.id)}>Delete</button></article>)}</section></div>}{tab==='breaking'&&<div className="admin-columns"><form className="editor-form" onSubmit={addBreaking}><h2>Breaking Update</h2><label className="field"><span>Ticker Text</span><textarea rows="4" value={breakingText} onChange={e=>setBreakingText(e.target.value)}/></label><button className="primary-btn">Add Breaking</button></form><section className="admin-list"><h2>Active Ticker</h2>{data.breaking.map(x=><article key={x.id}><h3>{x.text}</h3><button onClick={async()=>{await api(`/api/admin/breaking/${x.id}`,{method:'DELETE'});refresh()}}>Delete</button></article>)}</section></div>}{tab==='contacts'&&<section className="message-list">{data.contacts.length?data.contacts.map(x=><article className={x.status==='new'?'new':''} key={x.id}><div><span>{x.subject}</span><h3>{x.name} — {x.email}</h3><p>{x.message}</p><small>{fmt(x.createdAt)} {x.phone&&`• ${x.phone}`}</small></div>{x.status==='new'&&<button onClick={async()=>{await api(`/api/admin/contact/${x.id}`,{method:'PUT',body:JSON.stringify({status:'read'})});refresh()}}>Mark Read</button>}</article>):<p>अभी कोई संदेश नहीं है।</p>}</section>}</main>}
