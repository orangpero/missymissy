import { useState, useEffect, useRef } from "react";

// ── PALETTE ──────────────────────────────────────────────────────────────────
const G="#00ff41";const DG="#00aa2b";const DDG="#003d0f";
const BG="#0a0e0a";const BG2="#0c110c";const BORDER="#1a271a";
const R="#ff4444";const Y="#f7931a";const W="#d8ffd8";const GRAY="#3a4a3a";
const CY="#00cfff";

const SPIN=["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];

// ── BIG MISSY LOGO ───────────────────────────────────────────────────────────
const BIG_LOGO=`
███╗   ███╗██╗███████╗███████╗██╗   ██╗
████╗ ████║██║██╔════╝██╔════╝╚██╗ ██╔╝
██╔████╔██║██║███████╗███████╗ ╚████╔╝
██║╚██╔╝██║██║╚════██║╚════██║  ╚██╔╝
██║ ╚═╝ ██║██║███████║███████║   ██║
╚═╝     ╚═╝╚═╝╚══════╝╚══════╝   ╚═╝

  Multi-OSINT Intelligence Suite for Yielding
  ─────────────────────────────────────────────────────
  v4.0.0  |  16 Modules  |  AI-Powered  |  Open-Source
`;

// ── API KEYS
//  ─────────────────────────────────────────
const KEYS={
  gemini:   "GEMINI_API_KEY_HERE",        // https://aistudio.google.com/app/apikey
  hunter:   "HUNTER_IO_KEY_HERE",         // https://hunter.io/api-keys
  hibp:     "HIBP_KEY_HERE",              // https://haveibeenpwned.com/API/Key
  numverify:"NUMVERIFY_KEY_HERE",         // https://numverify.com
  whoisxml: "WHOISXML_KEY_HERE",          // https://whois.whoisxmlapi.com
  ipgeo:    "IPGEO_KEY_HERE",             // https://ipgeolocation.io
  shodan:   "SHODAN_KEY_HERE",            // https://shodan.io
  veriphone:"VERIPHONE_KEY_HERE",         // https://veriphone.io
};

// ── MODULES ──────────────────────────────────────────────────────────────────
const MODULES=[
  {id:"username", label:"Username",    icon:"◈",color:G},
  {id:"email",    label:"Email",       icon:"◉",color:G},
  {id:"phone",    label:"Phone",       icon:"◎",color:G},
  {id:"domain",   label:"Domain",      icon:"◆",color:G},
  {id:"ip",       label:"IP Intel",    icon:"◇",color:G},
  {id:"social",   label:"Social",      icon:"⬡",color:G},
  {id:"image",    label:"Image",       icon:"⬖",color:G},
  {id:"geo",      label:"Geo",         icon:"⊕",color:G},
  {id:"breach",   label:"Breach",      icon:"⚠",color:R},
  {id:"crypto",   label:"Crypto",      icon:"₿",color:Y},
  {id:"news",     label:"News",        icon:"◑",color:G},
  {id:"darkweb",  label:"Dark Web",    icon:"☠",color:R},
  {id:"network",  label:"Network",     icon:"⬗",color:G},
  {id:"document", label:"Document",    icon:"⬡",color:G},
  {id:"ai",       label:"AI — MISSY",  icon:"✦",color:CY},
  {id:"deploy",   label:"Deploy",      icon:"📡",color:"#aaffaa"},
];

const HINTS={
  username:{h:"Username tanpa @ atau spasi",ex:["johndoe","hackerman99","budi_osint"]},
  email:   {h:"Email lengkap",ex:["target@gmail.com","user@yahoo.com"]},
  phone:   {h:"Format internasional +kode negara+nomor",ex:["+6281234567890","+1-555-0100","+447911123456"]},
  domain:  {h:"Domain tanpa http:// atau www",ex:["google.com","example.co.id","github.com"]},
  ip:      {h:"IPv4/IPv6 — kosong = auto-detect IP kamu",ex:["8.8.8.8","1.1.1.1","(kosong)"]},
  social:  {h:"Nama / username target",ex:["johndoe","John Doe","budi_santoso"]},
  image:   {h:"URL gambar langsung",ex:["https://example.com/photo.jpg"]},
  geo:     {h:"IP / koordinat / nama kota",ex:["Jakarta","8.8.8.8","-6.2088,106.8456"]},
  breach:  {h:"Email / username / domain",ex:["target@gmail.com","user123","company.com"]},
  crypto:  {h:"Wallet address atau TX hash",ex:["1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf6N","0x742d35Cc66"]},
  news:    {h:"Nama orang / topik",ex:["Elon Musk","PT Telkom Indonesia","cybersecurity"]},
  darkweb: {h:"Email / username / keyword",ex:["target@email.com","username_target"]},
  network: {h:"Domain atau IP target",ex:["example.com","8.8.8.8"]},
  document:{h:"Upload file atau paste URL dokumen",ex:["https://example.com/file.pdf"]},
  ai:      {h:"Tanya apa saja tentang OSINT",ex:["Cara trace IP?","Apa itu OSINT?","Cara cek breach?"]},
};

// ── SOCIAL PLATFORMS ─────────────────────────────────────────────────────────
const SOCIALS=[
  {n:"Facebook",    u:(q)=>`https://www.facebook.com/search/people/?q=${encodeURIComponent(q)}`},
  {n:"Instagram",   u:(q)=>`https://www.instagram.com/${q}`},
  {n:"Twitter/X",   u:(q)=>`https://twitter.com/${q}`},
  {n:"TikTok",      u:(q)=>`https://www.tiktok.com/@${q}`},
  {n:"YouTube",     u:(q)=>`https://www.youtube.com/@${q}`},
  {n:"Reddit",      u:(q)=>`https://www.reddit.com/user/${q}`},
  {n:"LinkedIn",    u:(q)=>`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(q)}`},
  {n:"Pinterest",   u:(q)=>`https://www.pinterest.com/${q}`},
  {n:"Threads",     u:(q)=>`https://www.threads.net/@${q}`},
  {n:"Snapchat",    u:(q)=>`https://www.snapchat.com/add/${q}`},
  {n:"Telegram",    u:(q)=>`https://t.me/${q}`},
  {n:"Discord",     u:(q)=>`https://discord.com/`},
  {n:"Quora",       u:(q)=>`https://www.quora.com/profile/${q}`},
  {n:"OnlyFans",    u:(q)=>`https://onlyfans.com/${q}`},
  {n:"GitHub",      u:(q)=>`https://github.com/${q}`},
  {n:"Twitch",      u:(q)=>`https://www.twitch.tv/${q}`},
  {n:"Medium",      u:(q)=>`https://medium.com/@${q}`},
  {n:"Tumblr",      u:(q)=>`https://${q}.tumblr.com`},
  {n:"VK",          u:(q)=>`https://vk.com/${q}`},
  {n:"Mastodon",    u:(q)=>`https://mastodon.social/@${q}`},
  {n:"Spotify",     u:(q)=>`https://open.spotify.com/search/${encodeURIComponent(q)}`},
  {n:"Steam",       u:(q)=>`https://steamcommunity.com/id/${q}`},
  {n:"Patreon",     u:(q)=>`https://www.patreon.com/${q}`},
  {n:"Linktree",    u:(q)=>`https://linktr.ee/${q}`},
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
const fmtKV=(pairs)=>pairs.map(([k,v])=>({type:"info",text:`    ${k.padEnd(18)}: ${v}`}));
const blank={type:"blank",text:""};
const banner=(mod)=>[
  {type:"banner",text:"╔══════════════════════════════════════════════════════════════╗"},
  {type:"banner",text:"║   MISSY  —  Multi-OSINT Intelligence Suite for Yielding     ║"},
  {type:"banner",text:"╚══════════════════════════════════════════════════════════════╝"},
  {type:"meta",  text:`  Module: ${mod} | ${new Date().toLocaleString()}`},
  blank,
];
const mkLinks=(links)=>({type:"links",text:"",links});
const err=(msg)=>({type:"error",text:`[✗] ${msg}`});
const ok=(msg) =>({type:"success",text:`[+] ${msg}`});
const info=(msg)=>({type:"info",text:`    ${msg}`});
const warn=(msg)=>({type:"warn",text:`[!] ${msg}`});

// ── API QUERIES ───────────────────────────────────────────────────────────────
async function queryIP(ip){
  const url=ip?`https://ipapi.co/${ip}/json/`:`https://ipapi.co/json/`;
  const r=await fetch(url);
  const d=await r.json();
  if(d.error)throw new Error(d.reason||"IP lookup failed");
  return d;
}

async function queryIPGeo(ip){
  if(KEYS.ipgeo==="IPGEO_KEY_HERE")throw new Error("No ipgeolocation.io key");
  const r=await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${KEYS.ipgeo}&ip=${ip}`);
  return r.json();
}

async function queryHunter(email){
  if(KEYS.hunter==="HUNTER_IO_KEY_HERE")throw new Error("No Hunter.io key");
  const r=await fetch(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${KEYS.hunter}`);
  const d=await r.json();
  return d.data;
}

async function queryNumverify(phone){
  if(KEYS.numverify==="NUMVERIFY_KEY_HERE")throw new Error("No Numverify key");
  const r=await fetch(`http://apilayer.net/api/validate?access_key=${KEYS.numverify}&number=${encodeURIComponent(phone)}`);
  return r.json();
}

async function queryVeriphone(phone){
  if(KEYS.veriphone==="VERIPHONE_KEY_HERE")throw new Error("No Veriphone key");
  const r=await fetch(`https://api.veriphone.io/v2/verify?phone=${encodeURIComponent(phone)}&key=${KEYS.veriphone}`);
  return r.json();
}

async function queryWHOIS(domain){
  // Free WHOIS via RDAP
  const tld=domain.split(".").pop();
  const r=await fetch(`https://rdap.org/domain/${domain}`);
  if(!r.ok)throw new Error("RDAP lookup failed");
  return r.json();
}

async function queryWHOISXML(domain){
  if(KEYS.whoisxml==="WHOISXML_KEY_HERE")throw new Error("No WhoisXML key");
  const r=await fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${KEYS.whoisxml}&domainName=${domain}&outputFormat=JSON`);
  return r.json();
}

async function queryDNS(domain){
  const types=["A","MX","NS","TXT","CNAME"];
  const results={};
  await Promise.all(types.map(async t=>{
    try{
      const r=await fetch(`https://dns.google/resolve?name=${domain}&type=${t}`);
      const d=await r.json();
      results[t]=(d.Answer||[]).map(a=>a.data).join(", ")||"—";
    }catch{results[t]="error";}
  }));
  return results;
}

async function queryCRT(domain){
  const r=await fetch(`https://crt.sh/?q=${domain}&output=json`);
  if(!r.ok)throw new Error("crt.sh failed");
  const d=await r.json();
  const names=[...new Set(d.slice(0,10).map(c=>c.name_value).join("\n").split("\n").filter(n=>n.includes(domain)))];
  return names.slice(0,15);
}

async function queryShodan(ip){
  if(KEYS.shodan==="SHODAN_KEY_HERE")throw new Error("No Shodan key");
  const r=await fetch(`https://api.shodan.io/shodan/host/${ip}?key=${KEYS.shodan}`);
  return r.json();
}

async function queryGemini(prompt){
  if(KEYS.gemini==="GEMINI_API_KEY_HERE")throw new Error("No Gemini key");
  const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${KEYS.gemini}`,{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({contents:[{parts:[{text:
      `Kamu adalah MISSY, asisten AI OSINT profesional. Jawab dalam Bahasa Indonesia, singkat & to-the-point. Format terminal CLI.\n\nPertanyaan: ${prompt}`
    }]}]})
  });
  const d=await r.json();
  if(d.error)throw new Error(d.error.message);
  return d.candidates?.[0]?.content?.parts?.[0]?.text||"";
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function MISSYv4(){
  const [phase,setPhase]       =useState("loading");
  const [loadPct,setLoadPct]   =useState(0);
  const [authMode,setAuthMode] =useState("signin");
  const [users,setUsers]       =useState([{username:"admin",email:"admin@missy.local",password:"missy2024"}]);
  const [me,setMe]             =useState(null);
  const [activeTab,setTab]     =useState("username");
  const [switching,setSw]      =useState(false);
  const [authForm,setAF]       =useState({username:"",email:"",password:"",confirm:""});
  const [authErr,setAE]        =useState("");
  const [authMsg,setAM]        =useState("");
  const [inputs,setInputs]     =useState({});
  const [outputs,setOutputs]   =useState({});
  const [thinking,setThinking] =useState({});
  const [spinIdx,setSpin]      =useState(0);
  const [cur,setCur]           =useState(true);
  const [showHint,setShowHint] =useState(true);
  const termRef=useRef(null);

  useEffect(()=>{
    let p=0;const iv=setInterval(()=>{p+=Math.random()*14+4;if(p>=100){p=100;clearInterval(iv);setTimeout(()=>setPhase("auth"),350);}setLoadPct(Math.min(p,100));},70);
    return()=>clearInterval(iv);
  },[]);
  useEffect(()=>{const iv=setInterval(()=>setSpin(i=>(i+1)%SPIN.length),80);return()=>clearInterval(iv);},[]);
  useEffect(()=>{const iv=setInterval(()=>setCur(c=>!c),530);return()=>clearInterval(iv);},[]);
  useEffect(()=>{if(termRef.current)termRef.current.scrollTop=termRef.current.scrollHeight;},[outputs,thinking]);

  const addOut=(mod,lines)=>setOutputs(p=>({...p,[mod]:[...(p[mod]||[]),...lines]}));
  const clearOut=()=>setOutputs(p=>({...p,[activeTab]:[]}));
  const openLink=(url,label)=>{addOut(activeTab,[{type:"info",text:`[→] Opening ${label}...`}]);setTimeout(()=>window.open(url,"_blank"),200);};

  // ── RUN QUERY ───────────────────────────────────────────────────────────────
  const runQuery=async(mod)=>{
    const q=(inputs[mod]||"").trim();
    if(!q&&!["ip","geo"].includes(mod)){addOut(mod,[warn("Input kosong. Lihat contoh di panel hint.")]);return;}
    const ts=new Date().toLocaleTimeString("en-GB",{hour12:false});
    addOut(mod,[{type:"cmd",text:`[${ts}] ${me?.username}@missy:~/${mod}$ run "${q||"(auto)"}"`}]);
    setInputs(p=>({...p,[mod]:""}));
    setThinking(p=>({...p,[mod]:true}));
    await new Promise(r=>setTimeout(r,900+Math.random()*600));
    setThinking(p=>({...p,[mod]:false}));

    try{
      // ─── IP MODULE ──────────────────────────────────────────────────────────
      if(mod==="ip"){
        const d=await queryIP(q);
        addOut(mod,[...banner("IP Intelligence"),
          ok(`IP Report — ${d.ip}`),blank,
          ...fmtKV([
            ["IP Address",d.ip],
            ["City",d.city||"—"],
            ["Region",d.region||"—"],
            ["Country",`${d.country_name||"—"} (${d.country_code||"—"})`],
            ["Latitude",d.latitude||"—"],
            ["Longitude",d.longitude||"—"],
            ["ISP / Org",d.org||"—"],
            ["ASN",d.asn||"—"],
            ["Timezone",d.timezone||"—"],
            ["Postal",d.postal||"—"],
            ["Currency",d.currency_name||"—"],
            ["Languages",d.languages||"—"],
          ]),
          blank,
          mkLinks([
            {label:"IPInfo.io",url:`https://ipinfo.io/${d.ip}`},
            {label:"AbuseIPDB",url:`https://www.abuseipdb.com/check/${d.ip}`},
            {label:"Shodan",url:`https://www.shodan.io/host/${d.ip}`},
            {label:"GreyNoise",url:`https://www.greynoise.io/viz/ip/${d.ip}`},
            {label:"Censys",url:`https://search.censys.io/hosts/${d.ip}`},
            {label:"Google Maps",url:`https://maps.google.com/?q=${d.latitude},${d.longitude}`},
          ]),blank,
          // Try Shodan
          ...(async()=>{try{const s=await queryShodan(d.ip);return[ok("Shodan Data"),...fmtKV([["Open Ports",(s.ports||[]).join(", ")||"none"],["Vulns",(s.vulns?(Object.keys(s.vulns).join(", ")):("none"))],["OS",s.os||"unknown"],["Org",s.org||"—"]])];}catch(e){return[info(`Shodan: ${e.message}`)];}})()||[],
          blank,
        ]);return;
      }

      // ─── GEO MODULE ─────────────────────────────────────────────────────────
      if(mod==="geo"){
        const d=await queryIP(q);
        addOut(mod,[...banner("Geolocation"),
          ok(`Geolocation — ${d.ip}`),blank,
          ...fmtKV([
            ["IP",d.ip],["City",d.city||"—"],["Region",d.region||"—"],
            ["Country",`${d.country_name} (${d.country_code})`],
            ["Coordinates",`${d.latitude}, ${d.longitude}`],
            ["Timezone",d.timezone||"—"],["ISP",d.org||"—"],
          ]),
          blank,
          mkLinks([
            {label:"Google Maps",url:`https://maps.google.com/?q=${d.latitude},${d.longitude}`},
            {label:"OpenStreetMap",url:`https://www.openstreetmap.org/?mlat=${d.latitude}&mlon=${d.longitude}&zoom=12`},
            {label:"SunCalc",url:`https://suncalc.org/#/${d.latitude},${d.longitude},12`},
            {label:"Satellites.pro",url:`https://satellites.pro/#${d.latitude},${d.longitude},14`},
          ]),blank,
        ]);return;
      }

      // ─── DOMAIN MODULE ──────────────────────────────────────────────────────
      if(mod==="domain"){
        const lines=[...banner("Domain Intelligence"),ok(`Domain Report — ${q}`),blank];
        // DNS via Google
        try{
          const dns=await queryDNS(q);
          lines.push(info("── DNS Records ──────────────────"));
          lines.push(...fmtKV(Object.entries(dns)));
          lines.push(blank);
        }catch(e){lines.push(err(`DNS: ${e.message}`));}
        // CRT subdomains
        try{
          const subs=await queryCRT(q);
          lines.push(info("── SSL/TLS Subdomains (crt.sh) ──"));
          subs.forEach(s=>lines.push(info(s)));
          lines.push(blank);
        }catch(e){lines.push(err(`CRT: ${e.message}`));}
        // WhoisXML if keyed
        if(KEYS.whoisxml!=="WHOISXML_KEY_HERE"){
          try{
            const w=await queryWHOISXML(q);
            const wr=w.WhoisRecord||{};
            lines.push(info("── WHOIS ────────────────────────"));
            lines.push(...fmtKV([
              ["Registrar",wr.registrarName||"—"],
              ["Created",wr.createdDate||"—"],
              ["Expires",wr.expiresDate||"—"],
              ["Updated",wr.updatedDate||"—"],
              ["Status",wr.status||"—"],
              ["Registrant",wr.registrant?.name||"—"],
            ]));
            lines.push(blank);
          }catch(e){lines.push(err(`WHOIS: ${e.message}`));}
        }else{
          lines.push(warn("Set WHOISXML_KEY_HERE untuk WHOIS data"));
        }
        lines.push(mkLinks([
          {label:"DNSDumpster",url:`https://dnsdumpster.com/`},
          {label:"SecurityTrails",url:`https://securitytrails.com/domain/${q}/history/a`},
          {label:"crt.sh (SSL)",url:`https://crt.sh/?q=${q}`},
          {label:"URLScan.io",url:`https://urlscan.io/search/#domain:${q}`},
          {label:"VirusTotal",url:`https://www.virustotal.com/gui/domain/${q}`},
          {label:"ViewDNS",url:`https://viewdns.info/whois/?domain=${q}`},
          {label:"Who.is",url:`https://who.is/whois/${q}`},
          {label:"Shodan",url:`https://www.shodan.io/search?query=${q}`},
        ]));
        lines.push(blank);
        addOut(mod,lines);return;
      }

      // ─── EMAIL MODULE ───────────────────────────────────────────────────────
      if(mod==="email"){
        const lines=[...banner("Email Intelligence"),ok(`Email Report — ${q}`),blank];
        // Hunter.io
        if(KEYS.hunter!=="HUNTER_IO_KEY_HERE"){
          try{
            const h=await queryHunter(q);
            lines.push(info("── Hunter.io Verification ───────"));
            lines.push(...fmtKV([
              ["Status",h?.status||"—"],
              ["Score",h?.score!=null?`${h.score}/100`:"—"],
              ["Deliverable",h?.result||"—"],
              ["Disposable",h?.disposable?"YES":"no"],
              ["Webmail",h?.webmail?"YES":"no"],
              ["SMTP Valid",h?.smtp_check?"yes":"no"],
              ["Block Listed",h?.block?"YES":"no"],
            ]));
            lines.push(blank);
          }catch(e){lines.push(err(`Hunter: ${e.message}`));}
        }else{
          lines.push(warn("Set HUNTER_IO_KEY_HERE untuk verifikasi email"));
        }
        // Domain from email
        const domain=q.split("@")[1];
        if(domain){
          try{
            const dns=await queryDNS(domain);
            lines.push(info("── Email Domain DNS ─────────────"));
            lines.push(...fmtKV([["MX Records",dns.MX||"—"],["SPF/TXT",dns.TXT||"—"]]));
            lines.push(blank);
          }catch{}
        }
        lines.push(mkLinks([
          {label:"HaveIBeenPwned",url:`https://haveibeenpwned.com/account/${encodeURIComponent(q)}`},
          {label:"Hunter.io",url:`https://hunter.io/email-verifier/${encodeURIComponent(q)}`},
          {label:"EmailRep.io",url:`https://emailrep.io/${encodeURIComponent(q)}`},
          {label:"Epieos",url:`https://epieos.com/?q=${encodeURIComponent(q)}&t=email`},
          {label:"DeHashed",url:`https://dehashed.com/search?query=${encodeURIComponent(q)}`},
          {label:"Skymem",url:`https://skymem.info/srch?q=${encodeURIComponent(q)}`},
          {label:"LeakCheck",url:`https://leakcheck.io/`},
        ]));
        lines.push(blank);
        addOut(mod,lines);return;
      }

      // ─── PHONE MODULE ───────────────────────────────────────────────────────
      if(mod==="phone"){
        const lines=[...banner("Phone Lookup"),ok(`Phone Report — ${q}`),blank];
        // Numverify
        if(KEYS.numverify!=="NUMVERIFY_KEY_HERE"){
          try{
            const d=await queryNumverify(q);
            lines.push(info("── Numverify ────────────────────"));
            lines.push(...fmtKV([
              ["Valid",d.valid?"✓ YES":"✗ NO"],
              ["Number",d.number||"—"],
              ["Local",d.local_format||"—"],
              ["Intl Format",d.international_format||"—"],
              ["Country",`${d.country_name||"—"} (${d.country_code||"—"})`],
              ["Carrier",d.carrier||"—"],
              ["Line Type",d.line_type||"—"],
            ]));
            lines.push(blank);
          }catch(e){lines.push(err(`Numverify: ${e.message}`));}
        }
        // Veriphone
        if(KEYS.veriphone!=="VERIPHONE_KEY_HERE"){
          try{
            const d=await queryVeriphone(q);
            lines.push(info("── Veriphone ────────────────────"));
            lines.push(...fmtKV([
              ["Status",d.status||"—"],
              ["Phone Type",d.phone_type||"—"],
              ["Country",d.country||"—"],
              ["Carrier",d.carrier||"—"],
            ]));
            lines.push(blank);
          }catch(e){lines.push(err(`Veriphone: ${e.message}`));}
        }
        if(KEYS.numverify==="NUMVERIFY_KEY_HERE"&&KEYS.veriphone==="VERIPHONE_KEY_HERE"){
          lines.push(warn("Set NUMVERIFY_KEY_HERE atau VERIPHONE_KEY_HERE untuk data lengkap"));
        }
        lines.push(info("── Format Input ─────────────────"));
        lines.push(info(`Input: ${q}`));
        lines.push(info(`Contoh: +6281234567890 (Indonesia)`));
        lines.push(blank);
        lines.push(mkLinks([
          {label:"TrueCaller",url:`https://www.truecaller.com/`},
          {label:"GetContact",url:`https://www.getcontact.com/en/search`},
          {label:"ShouldIAnswer",url:`https://www.shouldianswer.com/phone-number/${q.replace(/[^0-9+]/g,"")}`},
          {label:"NumVerify",url:`https://numverify.com/`},
          {label:"Veriphone",url:`https://veriphone.io/`},
          {label:"Spy Dialer",url:`https://www.spydialer.com/`},
          {label:"WhitePages",url:`https://www.whitepages.com/phone/${q.replace(/[^0-9+]/g,"")}`},
        ]));
        lines.push(blank);
        addOut(mod,lines);return;
      }

      // ─── USERNAME MODULE ────────────────────────────────────────────────────
      if(mod==="username"){
        const lines=[...banner("Username Tracking"),ok(`Username Report — ${q}`),blank];
        // Direct platform checks
        lines.push(info("── Platform Links ───────────────"));
        lines.push(info("Klik tombol di bawah untuk cek tiap platform:"));
        lines.push(blank);
        lines.push(mkLinks([
          {label:"WhatsMyName ★",url:`https://whatsmyname.app/?q=${encodeURIComponent(q)}`},
          {label:"Sherlock (online)",url:`https://sherlock-project.github.io/?username=${encodeURIComponent(q)}`},
          {label:"CheckUsernames",url:`https://checkusernames.com/`},
          {label:"NameChk",url:`https://namechk.com/`},
          {label:"KnowEm",url:`https://knowem.com/checkusernames.php?u=${encodeURIComponent(q)}`},
          {label:"InstantUsername",url:`https://instantusername.com/#${q}`},
          {label:"Social Searcher",url:`https://www.social-searcher.com/?q=${encodeURIComponent(q)}`},
          {label:"OSINT Industries",url:`https://osint.industries/`},
        ]));
        lines.push(blank);
        lines.push(info("── Direct Platform URLs ─────────"));
        [
          ["Twitter/X",`https://twitter.com/${q}`],
          ["GitHub",`https://github.com/${q}`],
          ["Instagram",`https://instagram.com/${q}`],
          ["Reddit",`https://reddit.com/user/${q}`],
          ["TikTok",`https://tiktok.com/@${q}`],
          ["Telegram",`https://t.me/${q}`],
          ["YouTube",`https://youtube.com/@${q}`],
          ["Steam",`https://steamcommunity.com/id/${q}`],
        ].forEach(([n,u])=>lines.push(info(`${n.padEnd(15)}: ${u}`)));
        lines.push(blank);
        addOut(mod,lines);return;
      }

      // ─── SOCIAL MODULE ──────────────────────────────────────────────────────
      if(mod==="social"){
        const lines=[...banner("Social Media OSINT"),ok(`Social Search — "${q}"`),blank,
          info("── 24 Platform Direct Links ─────"),blank,
          mkLinks(SOCIALS.map(s=>({label:s.n,url:s.u(q)}))),
          blank,
          info("── Aggregator Tools ─────────────"),
          mkLinks([
            {label:"WhatsMyName",url:`https://whatsmyname.app/?q=${encodeURIComponent(q)}`},
            {label:"Social Searcher",url:`https://www.social-searcher.com/?q=${encodeURIComponent(q)}`},
            {label:"IDCrawl",url:`https://www.idcrawl.com/`},
            {label:"PeekYou",url:`https://www.peekyou.com/`},
            {label:"Google Search",url:`https://www.google.com/search?q="${encodeURIComponent(q)}"`},
          ]),blank,
        ];
        addOut(mod,lines);return;
      }

      // ─── BREACH MODULE ──────────────────────────────────────────────────────
      if(mod==="breach"){
        const lines=[...banner("Data Breach Intelligence"),
          {type:"warn",text:"⚠ FOR DEFENSIVE & RESEARCH USE ONLY"},blank,
          ok(`Breach Search — "${q}"`),blank,
          mkLinks([
            {label:"HaveIBeenPwned ★",url:`https://haveibeenpwned.com/account/${encodeURIComponent(q)}`},
            {label:"DeHashed ★",url:`https://dehashed.com/search?query=${encodeURIComponent(q)}`},
            {label:"IntelX",url:`https://intelx.io/?s=${encodeURIComponent(q)}`},
            {label:"LeakCheck",url:`https://leakcheck.io/`},
            {label:"BreachDirectory",url:`https://breachdirectory.org/`},
            {label:"Snusbase",url:`https://snusbase.com/`},
            {label:"CyberNews",url:`https://cybernews.com/personal-data-leak-check/`},
            {label:"LeakPeek",url:`https://leakpeek.com/`},
          ]),blank,
          info("Paste query ke tool di atas untuk cek breach."),blank,
        ];
        addOut(mod,lines);return;
      }

      // ─── IMAGE MODULE ────────────────────────────────────────────────────────
      if(mod==="image"){
        const lines=[...banner("Image Intelligence"),ok(`Image Analysis — ${q||"(upload)"}`),blank,
          info("── Reverse Image Search ──────────"),blank,
          mkLinks([
            {label:"TinEye ★",url:`https://tineye.com/`},
            {label:"Google Images",url:`https://images.google.com/`},
            {label:"Yandex Images",url:`https://yandex.com/images/`},
            {label:"PimEyes (Face)",url:`https://pimeyes.com/`},
            {label:"Bing Visual",url:`https://www.bing.com/images/`},
            {label:"Berify",url:`https://berify.com/`},
          ]),blank,
          info("── EXIF / Metadata ──────────────"),blank,
          mkLinks([
            {label:"EXIF.tools ★",url:`https://exif.tools/`},
            {label:"FotoForensics",url:`https://fotoforensics.com/`},
            {label:"AperiSolve",url:`https://www.aperisolve.com/`},
            {label:"Jimpl",url:`https://jimpl.com/`},
            {label:"Metadata2Go",url:`https://www.metadata2go.com/`},
          ]),blank,
          q?info(`URL disimpan: ${q}`):{type:"blank",text:""},blank,
        ];
        addOut(mod,lines);return;
      }

      // ─── DOCUMENT MODULE ─────────────────────────────────────────────────────
      if(mod==="document"){
        const lines=[...banner("Document Metadata"),ok("Document Analysis Tools"),blank,
          mkLinks([
            {label:"EXIF.tools ★",url:`https://exif.tools/`},
            {label:"Metadata2Go",url:`https://www.metadata2go.com/`},
            {label:"Get-Metadata",url:`https://www.get-metadata.com/`},
            {label:"Jimpl",url:`https://jimpl.com/`},
            {label:"VirusTotal",url:`https://www.virustotal.com/`},
            {label:"Hybrid Analysis",url:`https://www.hybrid-analysis.com/`},
          ]),blank,
          info("Upload file ke tool di atas untuk ekstrak metadata."),
          info("Metadata bisa mengungkap: GPS, author, software, timestamps."),blank,
        ];
        addOut(mod,lines);return;
      }

      // ─── CRYPTO MODULE ───────────────────────────────────────────────────────
      if(mod==="crypto"){
        const lines=[...banner("Crypto Tracking"),ok(`Crypto Search — ${q}`),blank,
          mkLinks([
            {label:"Blockchair ★",url:`https://blockchair.com/search?q=${encodeURIComponent(q)}`},
            {label:"Etherscan (ETH)",url:`https://etherscan.io/search?q=${q}`},
            {label:"Blockchain.com",url:`https://www.blockchain.com/explorer/search?search=${encodeURIComponent(q)}`},
            {label:"SolScan (SOL)",url:`https://solscan.io/account/${q}`},
            {label:"BSCScan (BNB)",url:`https://bscscan.com/address/${q}`},
            {label:"OXT.me (BTC)",url:`https://oxt.me/transaction/${q}`},
            {label:"BitInfoCharts",url:`https://bitinfocharts.com/bitcoin/address/${q}`},
          ]),blank,
        ];
        addOut(mod,lines);return;
      }

      // ─── NETWORK MODULE ──────────────────────────────────────────────────────
      if(mod==="network"){
        const lines=[...banner("Network Mapping"),ok(`Network Map — ${q}`),blank];
        // DNS lookup
        try{
          const dns=await queryDNS(q);
          lines.push(info("── Live DNS ─────────────────────"));
          lines.push(...fmtKV(Object.entries(dns)));
          lines.push(blank);
        }catch(e){lines.push(err(`DNS: ${e.message}`));}
        lines.push(mkLinks([
          {label:"DNSDumpster ★",url:`https://dnsdumpster.com/`},
          {label:"ViewDNS RevIP",url:`https://viewdns.info/reverseip/?host=${encodeURIComponent(q)}&t=1`},
          {label:"HackerTarget",url:`https://hackertarget.com/reverse-ip-lookup/?q=${encodeURIComponent(q)}`},
          {label:"Censys",url:`https://search.censys.io/search?resource=hosts&q=${encodeURIComponent(q)}`},
          {label:"Maltego",url:`https://www.maltego.com/`},
          {label:"SpiderFoot",url:`https://www.spiderfoot.net/`},
          {label:"OSINT Framework",url:`https://osintframework.com/`},
        ]));
        lines.push(blank);
        addOut(mod,lines);return;
      }

      // ─── NEWS MODULE ─────────────────────────────────────────────────────────
      if(mod==="news"){
        const lines=[...banner("News & Public Records"),ok(`News Search — "${q}"`),blank,
          mkLinks([
            {label:"Google News",url:`https://news.google.com/search?q=${encodeURIComponent(q)}`},
            {label:"Wayback Machine",url:`https://web.archive.org/web/*/${encodeURIComponent(q)}`},
            {label:"PublicWWW",url:`https://publicwww.com/websites/${encodeURIComponent(q)}/`},
            {label:"Google Scholar",url:`https://scholar.google.com/scholar?q=${encodeURIComponent(q)}`},
            {label:"PDF Search",url:`https://www.google.com/search?q=${encodeURIComponent(q)}+filetype:pdf`},
            {label:"Gov Records",url:`https://www.google.com/search?q=site:gov+${encodeURIComponent(q)}`},
          ]),blank,
        ];
        addOut(mod,lines);return;
      }

      // ─── DARK WEB MODULE ─────────────────────────────────────────────────────
      if(mod==="darkweb"){
        const lines=[...banner("Dark Web Monitor"),
          {type:"warn",text:"⚠ FOR SECURITY RESEARCH & MONITORING ONLY"},blank,
          ok(`Dark Web Search — "${q}"`),blank,
          mkLinks([
            {label:"Ahmia (Tor Index)",url:`https://ahmia.fi/search/?q=${encodeURIComponent(q)}`},
            {label:"IntelX ★",url:`https://intelx.io/?s=${encodeURIComponent(q)}`},
            {label:"ONYPHE",url:`https://www.onyphe.io/search/?q=${encodeURIComponent(q)}`},
            {label:"DarkOwl",url:`https://www.darkowl.com/`},
            {label:"Shodan",url:`https://www.shodan.io/search?query=${encodeURIComponent(q)}`},
          ]),blank,
        ];
        addOut(mod,lines);return;
      }

      // ─── AI MODULE ───────────────────────────────────────────────────────────
      if(mod==="ai"){
        const lines=[...banner("AI — MISSY Intelligence")];
        if(KEYS.gemini==="GEMINI_API_KEY_HERE"){
          lines.push(warn("Gemini API key belum diset."));
          lines.push(info("Edit file dan ganti GEMINI_API_KEY_HERE"));
          lines.push(info("Dapatkan key gratis: https://aistudio.google.com/app/apikey"));
          lines.push(blank);
        }else{
          try{
            const ans=await queryGemini(q);
            lines.push(ok("MISSY AI Response:"));lines.push(blank);
            ans.split("\n").forEach(l=>lines.push({type:"ai",text:l||""}));
            lines.push(blank);
          }catch(e){lines.push(err(`AI: ${e.message}`));}
        }
        addOut(mod,lines);return;
      }

    }catch(globalErr){
      addOut(mod,[err(`Unexpected: ${globalErr.message}`),blank]);
    }
  };

  // ── AUTH ─────────────────────────────────────────────────────────────────────
  const handleAuth=()=>{
    setAE("");
    if(authMode==="signin"){
      const u=users.find(u=>u.username===authForm.username&&u.password===authForm.password);
      if(!u){setAE("ERROR: Invalid credentials.");return;}
      setMe(u);setPhase("dashboard");
    }else{
      const{username,email,password,confirm}=authForm;
      if(!username||!email||!password){setAE("ERROR: All fields required.");return;}
      if(password!==confirm){setAE("ERROR: Passwords do not match.");return;}
      if(password.length<6){setAE("ERROR: Minimum 6 chars.");return;}
      if(users.find(u=>u.username===username)){setAE("ERROR: Username taken.");return;}
      setUsers(p=>[...p,{username,email,password}]);
      setAM("Account created. Sign in.");
      setAuthMode("signin");
      setAF(p=>({...p,username,password:"",confirm:"",email:""}));
    }
  };

  const switchTab=(id)=>{if(id===activeTab)return;setSw(true);setTimeout(()=>{setTab(id);setSw(false);setShowHint(true);},160);};

  // ── RENDER LINE ───────────────────────────────────────────────────────────────
  const renderLine=(line,i)=>{
    const col={cmd:"#80ffb0",success:G,error:R,warn:Y,info:W,meta:DG,banner:"#00ff88",ai:"#c0ffc0"};
    if(line.type==="blank")return<div key={i}style={{height:"5px"}}/>;
    if(line.type==="links")return(
      <div key={i}style={{marginBottom:"8px",display:"flex",flexWrap:"wrap",gap:"5px",paddingLeft:"4px"}}>
        {line.links.map((lk,j)=>(
          <button key={j}onClick={()=>openLink(lk.url,lk.label)}style={{
            padding:"3px 10px",background:"transparent",border:`1px solid ${DG}`,color:DG,
            cursor:"pointer",fontSize:"10px",fontFamily:"inherit",transition:"all 0.15s",
          }}
          onMouseOver={e=>{e.currentTarget.style.color=G;e.currentTarget.style.borderColor=G;e.currentTarget.style.background=DDG;}}
          onMouseOut={e=>{e.currentTarget.style.color=DG;e.currentTarget.style.borderColor=DG;e.currentTarget.style.background="transparent";}}>
            ↗ {lk.label}
          </button>
        ))}
      </div>
    );
    return<div key={i}style={{color:col[line.type]||W,fontSize:"12px",lineHeight:"1.75",fontWeight:line.type==="banner"?"bold":"normal",textShadow:line.type==="banner"?`0 0 8px ${G}`:"none",whiteSpace:"pre-wrap"}}>{line.text}</div>;
  };

  // ── DEPLOY TAB ────────────────────────────────────────────────────────────────
  const DeployTab=()=>(
    <div style={{padding:"20px",overflowY:"auto",flex:1,fontSize:"11px",lineHeight:"1.9",color:W}}>
      <div style={{color:G,fontWeight:"bold",marginBottom:"16px",fontSize:"13px",textShadow:`0 0 8px ${G}`}}>📡 MISSY — Deployment Guide</div>
      <div style={{color:CY,padding:"10px 14px",border:`1px solid ${CY}44`,background:`${CY}0a`,marginBottom:"20px",fontSize:"11px"}}>
        ✦ MISSY use AI for OSINT — Aktifkan modul AI dengan Gemini API key gratis dari Google AI Studio.
      </div>
      {[
        ["METHOD 1: Vercel (Recommended)",[
          "1. Install Node.js → https://nodejs.org",
          "2. Buat Vite project:","   $ npm create vite@latest missy -- --template react",
          "   $ cd missy && npm install",
          "3. Ganti src/App.jsx dengan file MISSY_v4.jsx ini",
          "4. Deploy:","   $ npm install -g vercel","   $ vercel",
          "5. Live di: yourproject.vercel.app ✓",
        ]],
        ["METHOD 2: Netlify (Drag & Drop)",[
          "1. Build: $ npm run build",
          "2. Buka https://netlify.com","3. Drag folder 'dist' ke dashboard",
          "4. Live di: yoursite.netlify.app ✓",
        ]],
        ["SETUP API KEYS (untuk hasil live)",[
          "Edit bagian KEYS di awal file MISSY_v4.jsx:",
          "  gemini   → https://aistudio.google.com/app/apikey (FREE)",
          "  hunter   → https://hunter.io/api-keys (free tier)",
          "  hibp     → https://haveibeenpwned.com/API/Key",
          "  numverify→ https://numverify.com (free tier)",
          "  whoisxml → https://whois.whoisxmlapi.com (free tier)",
          "  ipgeo    → https://ipgeolocation.io (free tier)",
          "  shodan   → https://shodan.io (free tier)",
          "  veriphone→ https://veriphone.io (free tier)",
        ]],
        ["DOMAIN CUSTOM (Opsional)",[
          "1. Beli domain di Niagahoster / Namecheap",
          "2. Deploy ke Vercel dulu","3. Dashboard → Add Custom Domain",
          "4. Arahkan DNS sesuai instruksi → HTTPS otomatis ✓",
        ]],
      ].map(([title,steps])=>(
        <div key={title}style={{marginBottom:"20px"}}>
          <div style={{color:G,marginBottom:"6px",fontSize:"12px"}}>▶ {title}</div>
          {steps.map((s,i)=><div key={i}style={{color:s.startsWith(" ")||s.startsWith("   ")?DG:W,paddingLeft:"14px",fontSize:"11px"}}>{s}</div>)}
        </div>
      ))}
    </div>
  );

  // ── LOADING ───────────────────────────────────────────────────────────────────
  if(phase==="loading")return(
    <div style={{background:BG,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Share Tech Mono',monospace"}}>
      <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet"/>
      <style>{`@keyframes glow{0%,100%{text-shadow:0 0 10px ${G};}50%{text-shadow:0 0 28px ${G},0 0 56px ${G};}}`}</style>
      <div style={{textAlign:"center"}}>
        <pre style={{color:G,fontSize:"14px",lineHeight:"1.2",margin:"0 0 20px",animation:"glow 2s infinite",fontFamily:"inherit",userSelect:"none"}}>{BIG_LOGO}</pre>
        <div style={{width:"320px",height:"2px",background:BORDER,margin:"0 auto 8px",overflow:"hidden",borderRadius:"2px"}}>
          <div style={{height:"100%",width:`${loadPct}%`,background:G,transition:"width 0.08s",boxShadow:`0 0 8px ${G}`}}/>
        </div>
        <div style={{color:DG,fontSize:"10px"}}>{Math.round(loadPct)}% — Initializing modules...</div>
      </div>
    </div>
  );

  // ── AUTH ──────────────────────────────────────────────────────────────────────
  if(phase==="auth")return(
    <div style={{background:BG,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Share Tech Mono',monospace",padding:"20px"}}>
      <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes glow{0%,100%{text-shadow:0 0 10px ${G};}50%{text-shadow:0 0 24px ${G};}}
        @keyframes scanline{0%{top:-5%;}100%{top:105%;}}
        input::placeholder{color:#1a4a1a;}input:focus{outline:none;border-color:${G}!important;}
        .ab:hover{background:${DG}!important;color:${BG}!important;}
        .ts:hover{background:${DDG}!important;}
      `}</style>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",overflow:"hidden"}}>
        <div style={{position:"absolute",left:0,right:0,height:"2px",background:`linear-gradient(transparent,${G}33,transparent)`,animation:"scanline 5s linear infinite"}}/>
        <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,rgba(0,0,0,0.1) 0px,rgba(0,0,0,0.1) 1px,transparent 1px,transparent 2px)"}}/>
      </div>
      <div style={{width:"100%",maxWidth:"820px",display:"flex",gap:"40px",alignItems:"flex-start"}}>
        {/* Branding */}
        <div style={{flex:"0 0 320px"}}>
          <pre style={{color:G,fontSize:"10px",lineHeight:"1.15",margin:"0 0 16px",animation:"glow 3s infinite",fontFamily:"inherit",userSelect:"none"}}>{BIG_LOGO}</pre>
          <div style={{width:"260px",height:"1px",background:`linear-gradient(to right,${G},transparent)`,margin:"8px 0 14px"}}/>
          <div style={{color:GRAY,fontSize:"9px",lineHeight:"2.1"}}>
            {["16 OSINT Modules","AI-Powered (Gemini)","Real API Integrations","Kitty Terminal UI","90+ Intelligence Tools","24+ Social Platforms"].map(t=><div key={t}>◈ {t}</div>)}
          </div>
        </div>
        {/* Auth window */}
        <div style={{flex:1}}>
          <div style={{background:"#192419",padding:"10px 16px",display:"flex",alignItems:"center",gap:"8px",borderRadius:"8px 8px 0 0",border:`1px solid ${BORDER}`,borderBottom:"none"}}>
            {["#ff5f56","#ffbd2e","#27c93f"].map((c,i)=><div key={i}style={{width:"12px",height:"12px",borderRadius:"50%",background:c}}/>)}
            <span style={{marginLeft:"8px",fontSize:"10px",color:DG,letterSpacing:"2px"}}>missy — authentication</span>
          </div>
          <div style={{background:BG2,border:`1px solid ${BORDER}`,borderTop:"none",padding:"24px",borderRadius:"0 0 8px 8px"}}>
            <div style={{fontSize:"11px",color:DG,marginBottom:"18px"}}>{authMode==="signin"?"missy@osint:~$ authenticate --user":"missy@osint:~$ useradd --register"}</div>
            <div style={{display:"flex",gap:"4px",marginBottom:"18px"}}>
              {[["signin","SIGN IN"],["signup","SIGN UP"]].map(([m,l])=>(
                <button key={m}className="ts"onClick={()=>{setAuthMode(m);setAE("");setAM("");}}style={{
                  flex:1,padding:"8px",background:authMode===m?DDG:"transparent",
                  border:`1px solid ${authMode===m?G:BORDER}`,color:authMode===m?G:GRAY,
                  cursor:"pointer",fontSize:"10px",fontFamily:"inherit",letterSpacing:"2px",transition:"all 0.2s",
                }}>{l}</button>
              ))}
            </div>
            {(authMode==="signin"
              ?[["USERNAME","username","text"],["PASSWORD","password","password"]]
              :[["USERNAME","username","text"],["EMAIL","email","email"],["PASSWORD","password","password"],["CONFIRM","confirm","password"]]
            ).map(([label,key,type])=>(
              <div key={key}style={{marginBottom:"13px"}}>
                <div style={{fontSize:"9px",color:DG,letterSpacing:"3px",marginBottom:"5px"}}>{label}</div>
                <input type={type}value={authForm[key]||""}placeholder={`enter ${label.toLowerCase()}`}
                  onChange={e=>setAF(p=>({...p,[key]:e.target.value}))}
                  onKeyDown={e=>e.key==="Enter"&&handleAuth()}
                  style={{width:"100%",background:BG,border:`1px solid ${BORDER}`,color:G,padding:"9px 13px",fontSize:"12px",fontFamily:"inherit",boxSizing:"border-box"}}/>
              </div>
            ))}
            <button className="ab"onClick={handleAuth}style={{width:"100%",padding:"11px",background:DDG,border:`1px solid ${G}`,color:G,cursor:"pointer",fontSize:"11px",fontFamily:"inherit",letterSpacing:"3px",marginTop:"8px",transition:"all 0.2s"}}>
              {authMode==="signin"?"[ AUTHENTICATE ]":"[ CREATE ACCOUNT ]"}
            </button>
            {authErr&&<div style={{color:R,fontSize:"10px",marginTop:"11px",padding:"8px",border:`1px solid ${R}44`,background:"#1a000033"}}>{authErr}</div>}
            {authMsg&&<div style={{color:G,fontSize:"10px",marginTop:"11px",padding:"8px",border:`1px solid ${G}44`,background:DDG+"33"}}>{authMsg}</div>}
            <div style={{marginTop:"14px",fontSize:"9px",color:DDG,textAlign:"center"}}>demo: username=admin | password=missy2024</div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── DASHBOARD ─────────────────────────────────────────────────────────────────
  const mod=MODULES.find(m=>m.id===activeTab);
  const curOut=outputs[activeTab]||[];
  const isTh=thinking[activeTab];
  const hint=HINTS[activeTab];
  const phText=activeTab==="ai"?"Tanya MISSY AI tentang OSINT...":activeTab==="ip"||activeTab==="geo"?"IP address (kosong = auto-detect)...":`${mod?.label} query...`;

  return(
    <div style={{background:BG,minHeight:"100vh",fontFamily:"'Share Tech Mono',monospace",display:"flex",flexDirection:"column"}}>
      <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes glow{0%,100%{text-shadow:0 0 6px ${G};}50%{text-shadow:0 0 16px ${G};}}
        @keyframes fadeSlide{from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.25;}}
        @keyframes think{0%{opacity:0.2;}50%{opacity:1;}100%{opacity:0.2;}}
        input::placeholder{color:#1a4a1a;}input:focus{outline:none;}
        ::-webkit-scrollbar{width:4px;height:3px;}::-webkit-scrollbar-track{background:${BG};}::-webkit-scrollbar-thumb{background:${DG};}
        .tabbtn:hover{color:${G}!important;background:${DDG}!important;}
      `}</style>
      <div style={{position:"fixed",inset:0,backgroundImage:"repeating-linear-gradient(0deg,rgba(0,0,0,0.07) 0px,rgba(0,0,0,0.07) 1px,transparent 1px,transparent 2px)",pointerEvents:"none",zIndex:9999}}/>

      {/* TOPBAR */}
      <div style={{background:"#0c140c",borderBottom:`1px solid ${BORDER}`,padding:"7px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
          <span style={{color:G,fontSize:"14px",fontWeight:"bold",letterSpacing:"4px",animation:"glow 3s infinite"}}>MISSY</span>
          <span style={{color:GRAY,fontSize:"9px",borderLeft:`1px solid ${BORDER}`,paddingLeft:"12px",letterSpacing:"1px"}}>Multi-OSINT Intelligence Suite for Yielding</span>
          <span style={{fontSize:"9px",color:G,animation:"pulse 2s infinite"}}>● v4.0.0</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"14px",fontSize:"10px"}}>
          <span style={{color:GRAY}}>USER: <span style={{color:G}}>{me?.username?.toUpperCase()}</span></span>
          <button onClick={()=>setPhase("auth")}style={{background:"transparent",border:`1px solid ${BORDER}`,color:GRAY,padding:"3px 10px",cursor:"pointer",fontSize:"9px",fontFamily:"inherit"}}>[logout]</button>
        </div>
      </div>

      {/* KITTY WINDOW */}
      <div style={{flex:1,display:"flex",flexDirection:"column",padding:"12px",overflow:"hidden"}}>
        {/* Title bar */}
        <div style={{background:"#172117",padding:"9px 16px",display:"flex",alignItems:"center",gap:"8px",borderRadius:"8px 8px 0 0",border:`1px solid ${BORDER}`,borderBottom:"none",flexShrink:0}}>
          {["#ff5f56","#ffbd2e","#27c93f"].map((c,i)=><div key={i}style={{width:"11px",height:"11px",borderRadius:"50%",background:c,cursor:i===0?"pointer":"default"}}onClick={i===0?()=>setPhase("auth"):undefined}/>)}
          <div style={{flex:1,textAlign:"center",fontSize:"10px",color:DG,letterSpacing:"1.5px"}}>
            {mod?.icon} missy — {mod?.label?.toLowerCase()} — {me?.username}@osint
          </div>
          <button onClick={clearOut}style={{background:"transparent",border:"none",color:GRAY,cursor:"pointer",fontSize:"9px",fontFamily:"inherit"}}>[clear]</button>
        </div>

        {/* TAB BAR */}
        <div style={{background:"#111811",borderLeft:`1px solid ${BORDER}`,borderRight:`1px solid ${BORDER}`,overflowX:"auto",display:"flex",flexShrink:0}}>
          {MODULES.map(m=>(
            <button key={m.id}className="tabbtn"onClick={()=>switchTab(m.id)}style={{
              padding:"8px 12px",background:activeTab===m.id?BG2:"transparent",
              border:"none",borderBottom:activeTab===m.id?`2px solid ${m.color}`:"2px solid transparent",
              color:activeTab===m.id?m.color:GRAY,cursor:"pointer",fontSize:"10px",fontFamily:"inherit",
              letterSpacing:"0.5px",transition:"all 0.15s",flexShrink:0,whiteSpace:"nowrap",
            }}>
              {m.icon} {m.label}
              {thinking[m.id]&&<span style={{marginLeft:"4px",animation:"think 0.8s infinite"}}>{SPIN[spinIdx]}</span>}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div style={{flex:1,background:BG2,border:`1px solid ${BORDER}`,borderTop:"none",borderBottom:"none",display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>
          {activeTab==="deploy"?<DeployTab/>:(
            <>
              {/* Output */}
              <div ref={termRef}style={{flex:1,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:"1px"}}>
                {curOut.length===0&&(
                  <div style={{animation:"fadeSlide 0.4s ease"}}>
                    <pre style={{color:G,fontSize:"11px",lineHeight:"1.15",margin:"0 0 16px",opacity:0.7,fontFamily:"inherit",userSelect:"none"}}>{BIG_LOGO}</pre>
                    <div style={{color:GRAY,fontSize:"11px"}}>Module: <span style={{color:mod?.color}}>{mod?.label}</span> — {hint?.h||"Masukkan query di bawah"}</div>
                    <div style={{color:DDG,fontSize:"10px",marginTop:"6px"}}>ENTER atau klik [ SEND ] untuk jalankan</div>
                  </div>
                )}
                <div style={{opacity:switching?0.3:1,transition:"opacity 0.16s"}}>
                  {curOut.map((line,i)=>renderLine(line,i))}
                </div>
                {isTh&&(
                  <div style={{display:"flex",alignItems:"center",gap:"8px",marginTop:"4px"}}>
                    <span style={{color:G,animation:"think 0.5s infinite"}}>{SPIN[spinIdx]}</span>
                    <span style={{color:DG,fontSize:"11px"}}>missy {activeTab==="ai"?"thinking":"scanning"}</span>
                    {[0,1,2].map(j=><span key={j}style={{color:G,animation:`think 1s ${j*0.33}s infinite`}}>.</span>)}
                  </div>
                )}
              </div>

              {/* HINT PANEL */}
              {hint&&showHint&&(
                <div style={{borderTop:`1px solid ${BORDER}`,background:"#0a0f0a",padding:"9px 16px",display:"flex",alignItems:"flex-start",gap:"16px",flexShrink:0}}>
                  <div style={{flex:1}}>
                    <span style={{color:DG,fontSize:"9px",letterSpacing:"2px"}}>[ HOW TO USE ] </span>
                    <span style={{color:GRAY,fontSize:"9px"}}>{hint.h}</span>
                    <div style={{marginTop:"5px",display:"flex",flexWrap:"wrap",gap:"5px"}}>
                      {hint.ex.map((ex,i)=>(
                        <button key={i}onClick={()=>setInputs(p=>({...p,[activeTab]:ex==="(kosong)"?"":ex}))}style={{
                          padding:"2px 10px",background:DDG,border:`1px solid ${DG}`,color:DG,
                          cursor:"pointer",fontSize:"9px",fontFamily:"inherit",transition:"all 0.15s",
                        }}
                        onMouseOver={e=>{e.currentTarget.style.color=G;e.currentTarget.style.borderColor=G;}}
                        onMouseOut={e=>{e.currentTarget.style.color=DG;e.currentTarget.style.borderColor=DG;}}>
                          eg: {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={()=>setShowHint(false)}style={{background:"transparent",border:"none",color:GRAY,cursor:"pointer",fontSize:"10px",fontFamily:"inherit",flexShrink:0}}>[×]</button>
                </div>
              )}

              {/* INPUT */}
              <div style={{padding:"9px 14px",borderTop:`1px solid ${BORDER}`,display:"flex",alignItems:"center",gap:"8px",background:"#0b100b",flexShrink:0}}>
                <span style={{color:DG,fontSize:"11px",whiteSpace:"nowrap"}}>
                  {me?.username}@osint <span style={{color:G}}>~/{mod?.id}</span> $
                </span>
                <input
                  value={inputs[activeTab]||""}
                  onChange={e=>setInputs(p=>({...p,[activeTab]:e.target.value}))}
                  onKeyDown={e=>{if(e.key==="Enter")runQuery(activeTab);if(e.key==="l"&&e.ctrlKey){e.preventDefault();clearOut();}if(e.key==="?"&&!inputs[activeTab])setShowHint(h=>!h);}}
                  placeholder={phText}
                  disabled={isTh}
                  style={{flex:1,background:"transparent",border:"none",color:G,fontSize:"12px",fontFamily:"inherit",caretColor:G}}
                />
                {cur&&!isTh&&<span style={{color:G,fontSize:"14px"}}>▌</span>}
                <button onClick={()=>runQuery(activeTab)}disabled={isTh}style={{
                  padding:"6px 16px",background:isTh?BORDER:DDG,border:`1px solid ${isTh?BORDER:G}`,
                  color:isTh?GRAY:G,cursor:isTh?"default":"pointer",fontFamily:"inherit",fontSize:"10px",
                  letterSpacing:"2px",transition:"all 0.15s",whiteSpace:"nowrap",
                }}>
                  {isTh?`${SPIN[spinIdx]} SCANNING`:"[ SEND ]"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* BOTTOM BAR */}
        <div style={{background:"#172117",padding:"5px 16px",borderRadius:"0 0 8px 8px",border:`1px solid ${BORDER}`,borderTop:"none",display:"flex",justifyContent:"space-between",fontSize:"9px",color:DDG,flexShrink:0}}>
          <span>{mod?.icon} {mod?.label} | {curOut.length} lines | ENTER=send | Ctrl+L=clear | ?=hint</span>
          <span style={{animation:"pulse 2s infinite",color:DG}}>● LIVE</span>
        </div>
      </div>
    </div>
  );
}
