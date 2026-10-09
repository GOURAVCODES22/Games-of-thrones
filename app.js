const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const canvas=$('#hero-canvas'), ctx=canvas.getContext('2d',{alpha:false});
const frameNo=$('#frameNo'), frameProgress=$('#frameProgress'), chapter=$('#chapter');
const storyKicker=$('#storyKicker'), storyTitle=$('#storyTitle'), storyText=$('#storyText'), heroStory=$('#heroStory');
const TOTAL_FRAMES=1114;
const FRAME_PATH=i=>`assets/frames/frame_${String(i+1).padStart(4,'0')}.jpg`;
const chapters=[['THE BOOK',0],['THE NORTH AWAKENS',.13],['A REALM TAKES SHAPE',.30],['POWER & RUIN',.49],['THE LONG NIGHT',.68],['THE IRON THRONE',.88]];
const stories=[
 {from:0,to:.105,k:'THE STORY BEGINS',t:'GAME OF THRONES',d:''},
 {from:.105,to:.22,k:'BEYOND THE PAGE',t:'WINTER ARRIVES',d:'The map opens onto a world where the cold is older than any crown.'},
 {from:.22,to:.36,k:'THE NORTH',t:'A KINGDOM OF ICE',d:'Stone, snow and ancient walls mark the first edge of the realm.'},
 {from:.36,to:.50,k:'THE REALM',t:'CROWNS TAKE SHAPE',d:'Cities rise from the map. Power gathers wherever ambition finds a throne.'},
 {from:.50,to:.66,k:'THE PRICE OF POWER',t:'WAR LEAVES A SCAR',d:'Alliances fracture. Steel closes around the kingdoms, and every victory costs more.'},
 {from:.66,to:.82,k:'THE LONG NIGHT',t:'WHEN THE WORLD DARKENS',d:'The realm is surrounded by fear, fire and the consequences of every oath.'},
 {from:.82,to:.93,k:'THE LAST CLAIM',t:'EVERY CROWN HAS A COST',d:'The wheel turns toward the seat everyone wants—and few survive.'},
 {from:.93,to:1.001,k:'THE END OF THE JOURNEY',t:'THE IRON THRONE',d:'After fire, blood and winter, one throne remains at the heart of the story.'}
];
const frames=new Array(TOTAL_FRAMES); const loading=new Set(); let currentFrame=0,lastP=-1;
let dpr=1;
function resizeCanvas(){dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(innerWidth*dpr);canvas.height=Math.round(innerHeight*dpr);canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';drawFrame(currentFrame,true);}
function loadFrame(i){if(i<0||i>=TOTAL_FRAMES||frames[i]||loading.has(i))return; loading.add(i); const im=new Image(); im.decoding='async'; im.src=FRAME_PATH(i); im.onload=()=>{frames[i]=im;loading.delete(i);if(i===currentFrame)drawFrame(i,true)}; im.onerror=()=>loading.delete(i);}
function preloadAround(i){loadFrame(i); const radius=innerWidth<700?34:70; for(let n=1;n<=radius;n++){loadFrame(i+n);loadFrame(i-n)} }
function drawFrame(i,force=false){i=Math.max(0,Math.min(TOTAL_FRAMES-1,Math.round(i)));currentFrame=i;const im=frames[i];if(!im){preloadAround(i);return}const cw=canvas.width,ch=canvas.height,iw=im.naturalWidth,ih=im.naturalHeight;ctx.fillStyle='#000';ctx.fillRect(0,0,cw,ch);const scale=Math.max(cw/iw,ch/ih);const dw=iw*scale,dh=ih*scale;const dx=(cw-dw)/2,dy=(ch-dh)/2;ctx.drawImage(im,dx,dy,dw,dh)}
function setStory(p){const item=stories.find(x=>p>=x.from&&p<x.to)||stories[stories.length-1];const key=item.t;if(heroStory.dataset.key===key)return;heroStory.dataset.key=key;heroStory.classList.remove('story-show');requestAnimationFrame(()=>{storyKicker.textContent=item.k;storyTitle.textContent=item.t;storyText.textContent=item.d;heroStory.classList.add('story-show')});}
function getProgress(){const hero=document.querySelector('.hero-scroll');return Math.max(0,Math.min(1,(scrollY-hero.offsetTop)/Math.max(1,hero.offsetHeight-innerHeight)))}
function updateHero(force=false){const p=getProgress();if(!force&&Math.abs(p-lastP)<.0002)return;lastP=p;const idx=Math.round((TOTAL_FRAMES-1)*p);preloadAround(idx);drawFrame(idx);frameNo.textContent=String(idx+1).padStart(4,'0');frameProgress.style.width=(p*100)+'%';let c=chapters[0][0];for(const x of chapters)if(p>=x[1])c=x[0];chapter.textContent=c;setStory(p);updateMusic(p)}
let ticking=false;addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{updateHero();ticking=false});ticking=true;}},{passive:true});addEventListener('resize',()=>resizeCanvas(),{passive:true});
for(let i=0;i<Math.min(80,TOTAL_FRAMES);i++)loadFrame(i);addEventListener('load',()=>{resizeCanvas();updateHero(true)});
resizeCanvas();
const audioTracks=[{el:document.querySelector('#audioCastamere'),from:0,to:.40},{el:document.querySelector('#audioLight'),from:.40,to:.72},{el:document.querySelector('#audioNight'),from:.72,to:1.01}];let audioMuted=false,audioStarted=false,currentTrack=-1;
function updateMusic(p){if(audioMuted)return;let target=audioTracks.findIndex(x=>p>=x.from&&p<x.to);if(target<0)return;if(target!==currentTrack){currentTrack=target;audioTracks.forEach((x,i)=>{if(i===target){x.el.currentTime=0;if(audioStarted)x.el.play().catch(()=>{})}else{x.el.pause();x.el.currentTime=0}})}}
function startAudio(){if(audioStarted)return;audioStarted=true;updateMusic(getProgress());const t=audioTracks[currentTrack<0?0:currentTrack]?.el;t?.play().catch(()=>{})}
['pointerdown','touchstart','wheel','keydown'].forEach(ev=>addEventListener(ev,startAudio,{once:true,passive:true}));
const audioToggle=$('#audioToggle');audioToggle?.addEventListener('click',()=>{audioMuted=!audioMuted;audioToggle.textContent=audioMuted?'◌':'◖';audioToggle.setAttribute('aria-pressed',String(audioMuted));audioToggle.setAttribute('aria-label',audioMuted?'Unmute music':'Mute music');if(audioMuted)audioTracks.forEach(x=>x.el.pause());else{startAudio();updateMusic(getProgress());audioTracks[currentTrack]?.el.play().catch(()=>{})}});

$$('nav a').forEach(a=>a.addEventListener('click',()=>{$$('nav a').forEach(x=>x.classList.remove('active'));a.classList.add('active')}));
$$('[data-scroll]').forEach(b=>b.addEventListener('click',()=>document.querySelector(b.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));
$('#menuBtn').onclick=()=>$('#drawer').classList.add('open');$('#drawerClose').onclick=()=>$('#drawer').classList.remove('open');$$('#drawer a').forEach(a=>a.onclick=()=>$('#drawer').classList.remove('open'));

const houses=[
 ['STARK','The North remembers.','assets/houses/stark.jpg','Jon Snow','WINTER IS COMING','assets/characters/source/e5998ebee6a749084aee81271eedea41.jpg'],
 ['LANNISTER','A house built on power, debt and gold.','assets/houses/lannister.jpg','Tyrion Lannister','HEAR ME ROAR','assets/characters/source/debf8dabfd8b568ecc628b6ba3819026.jpg'],
 ['TARGARYEN','Fire and blood. The dragon bloodline returns to Westeros.','assets/houses/targaryen.jpg','Daenerys Targaryen','FIRE & BLOOD','assets/characters/source/46afc92a1f13920c54a152dd594e7add.jpg'],
 ['BARATHEON','The ruling house of the Stormlands.','assets/houses/baratheon.jpg','Robert Baratheon','OURS IS THE FURY','assets/characters/source/a2b1db707dc2f92192185c2ca921137e.jpg'],
 ['TYRELL','The Reach is wealthy, fertile and politically influential.','assets/houses/tyrell.jpg','Margaery Tyrell','GROWING STRONG','assets/characters/source/90fcf0b7397b608e3dc3cb6f1ae24075.jpg'],
 ['MARTELL','Dorne keeps its own traditions and answers to no easy crown.','assets/houses/martell.jpg','Oberyn Martell','UNBOWED, UNBENT, UNBROKEN','assets/characters/source/a3eb6a4f6fa0cf0695fd5849b2d26847.jpg'],
 ['GREYJOY','The Iron Islands are ruled by the sea-born Greyjoys.','assets/houses/greyjoy.jpg','Theon Greyjoy','WE DO NOT SOW','assets/characters/source/theon-greyjoy.jpg']
];
$('#houseGrid').innerHTML=houses.map((h,i)=>`<article class="house-card" data-i="${i}" tabindex="0" aria-label="${h[0]} house card"><div class="house-inner"><div class="house-face house-front"><img src="${h[2]}" alt="House ${h[0]}" loading="lazy" decoding="async"><div class="house-front-copy"><small>HOUSE</small><h3>${h[0]}</h3><p>${h[1]}</p></div></div><div class="house-face house-back"><img class="house-character" src="${h[5]}" alt="${h[3]}" loading="lazy" decoding="async"><div class="house-back-overlay"></div><div class="house-back-copy"><small>${h[0]} · ${h[4]}</small><h3>${h[3]}</h3><p>${h[1]}</p><span>↺ TAP TO RETURN</span></div></div></div></article>`).join('');
$$('.house-card').forEach(c=>{c.addEventListener('click',()=>c.classList.toggle('flipped'));c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();c.classList.toggle('flipped')}})});

const chars=[
 ['Jon Snow','The White Wolf','HOUSE STARK','THE NORTH','THE NIGHT’S WATCH','assets/characters/source/e5998ebee6a749084aee81271eedea41.jpg','Raised at Winterfell, Jon joins the Night’s Watch and becomes one of the North’s defining figures.'],
 ['Tyrion Lannister','The Hand of the King','HOUSE LANNISTER','KING’S LANDING','POLITICS & SURVIVAL','assets/characters/source/debf8dabfd8b568ecc628b6ba3819026.jpg','A sharp political mind who repeatedly survives through wit, courage and hard-earned judgment.'],
 ['Daenerys Targaryen','Mother of Dragons','HOUSE TARGARYEN','DRAGONSTONE','FIRE & BLOOD','assets/characters/source/46afc92a1f13920c54a152dd594e7add.jpg','The last surviving Targaryen heir who rises from exile with dragons and a claim to rule.'],
 ['Arya Stark','NO ONE','HOUSE STARK','THE NORTH','BRAAVOS & BEYOND','assets/characters/arya.jpg','A Stark who trains in Braavos, learns the Faceless Men’s craft and returns with a deadly purpose.'],
 ['Robert Baratheon','THE USURPER KING','HOUSE BARATHEON','THE STORMLANDS','THE IRON THRONE','assets/characters/source/a2b1db707dc2f92192185c2ca921137e.jpg','The former Lord of Storm’s End who takes the Iron Throne after Robert’s Rebellion.'],
 ['Margaery Tyrell','THE ROSE OF HIGHGARDEN','HOUSE TYRELL','THE REACH','COURT & POWER','assets/characters/source/90fcf0b7397b608e3dc3cb6f1ae24075.jpg','A politically astute Tyrell who understands that influence at court can be wielded as carefully as a sword.'],
 ['Oberyn Martell','THE RED VIPER','HOUSE MARTELL','DORNE','VIPER’S SPEAR','assets/characters/source/a3eb6a4f6fa0cf0695fd5849b2d26847.jpg','The charismatic prince of Dorne, famed for his skill with a spear and his fierce pursuit of justice.'],
 ['Ramsay Bolton','THE BASTARD OF BOLTON','HOUSE BOLTON','THE NORTH','WINTERFELL','assets/characters/source/42646f3a325b8c0c4b2a89d7dbd82bcd.jpg','A brutal Bolton who seizes Winterfell and becomes one of the North’s most feared enemies.']
];let ci=0;
function renderChar(){const c=chars[ci];$('#charImage').src=c[5];$('#charLore').textContent=c[6];$('#charName').textContent=c[0];$('#charTitle').textContent=c[1];$('#charHouse').textContent=c[2];$('#charAllegiance').textContent=c[3];$('#charLegacy').textContent=c[4];$('#charNumber').textContent=String(ci+1).padStart(2,'0')+' / 08';$('#charDots').innerHTML=chars.map((_,i)=>`<i class="dot ${i===ci?'active':''}"></i>`).join('')}
$('#charNext').onclick=()=>{ci=(ci+1)%chars.length;renderChar()};$('#charPrev').onclick=()=>{ci=(ci-1+chars.length)%chars.length;renderChar()};renderChar();

const battleData=[
 ['THE LONG NIGHT','Winterfell faces the Army of the Dead and the Night King.'],
 ['HARDHOME','Jon Snow and the Free Folk confront the White Walkers and their dead.'],
 ['BATTLE OF THE BASTARDS','Jon Snow fights Ramsay Bolton for control of Winterfell.'],
 ['THE DEAD RISE','The dead overwhelm the living as the Long Night closes in.']
];
const battleFiles=['assets/battles/35c1e13db884f0b946c363985b51459c.jpg','assets/battles/94fb5de211cffc65f172ee9763517911.jpg','assets/battles/e20848060fc758def4b5a50a9a422c45.jpg','assets/battles/ecc21aa872967baef7ca3883e7903fe6.jpg'];
$('#battleGrid').innerHTML=battleData.map((b,i)=>`<article class="battle-card"><img src="${battleFiles[i]}" alt="${b[0]}" loading="lazy" decoding="async"><div class="battle-copy"><small>CHRONICLE ${String(i+1).padStart(2,'0')}</small><h3>${b[0]}</h3><p>${b[1]}</p></div></article>`).join('');

const regions={
 'THE NORTH':['STARK','DIREWOLF','The North is the ancestral Stark homeland, stretching from the Wall to the Neck.'],
 'THE VALE':['ARRYN','FALCON','The Vale is the mountain realm of House Arryn, protected by the Eyrie and the Mountains of the Moon.'],
 'RIVERLANDS':['TULLY','TROUT','The Riverlands sit at the crossroads of Westeros and are repeatedly caught between rival armies.'],
 'WESTERLANDS':['LANNISTER','LION','The Westerlands are the western realm associated with House Lannister and its gold-rich lands.'],
 'CROWNLANDS':['THE CROWN','CROWN','The Crownlands surround King’s Landing and are administered directly by the royal crown.'],
 'THE REACH':['TYRELL','ROSE','The Reach is Westeros’s fertile southern heartland, traditionally ruled from Highgarden by House Tyrell.'],
 'STORMLANDS':['BARATHEON','STAG','The Stormlands are the traditional seat of House Baratheon, including Storm’s End.'],
 'DORNE':['MARTELL','SUN','Dorne is the southernmost region, ruled by House Martell from Sunspear.'],
 'IRON ISLANDS':['GREYJOY','KRAKEN','The Iron Islands are the sea-bound domain of House Greyjoy, ruled from Pyke.']
};
function selectRegion(name){const d=regions[name]; if(!d)return; $$('.region').forEach(x=>x.classList.toggle('active',x.dataset.region===name)); $$('[data-region-shape]').forEach(x=>x.classList.toggle('active',x.dataset.regionShape===name)); $('#regionName').textContent=name;$('#regionHouse').textContent=d[0];$('#regionSymbol').textContent=d[1];$('#regionText').textContent=d[2];} $$('[data-region-shape]').forEach(x=>x.addEventListener('click',()=>selectRegion(x.dataset.regionShape))); $$('.region').forEach(b=>b.onclick=()=>selectRegion(b.dataset.region)); selectRegion('THE NORTH');

const powers={
 ice:{name:'ICE',kicker:'THE FROZEN NORTH',desc:'The cold does not chase you. It waits.',icon:'❄',video:'assets/powers/ice-snow.mp4',image:'assets/powers/ice-north.jpg',preview:'assets/powers/frost.jpg',tint:'ice'},
 dragonfire:{name:'DRAGONFIRE',kicker:'THE SKY BURNS',desc:'Unleash the wrath. The skies burn, the earth trembles.',icon:'ϟ',video:'assets/powers/dragonfire.mp4',image:'assets/1000382536.jpg',preview:'assets/1000382536.jpg',tint:'fire'},
 shadow:{name:'SHADOW',kicker:'THE DEAD ARE WALKING',desc:'Silence moves before the army does.',icon:'◐',video:'assets/powers/shadow.mp4',image:'assets/powers/shadow.jpg',preview:'assets/powers/shadow.jpg',tint:'shadow'},
 storm:{name:'STORM',kicker:'THE SKY ANSWERS',desc:'Thunder announces what armies cannot.',icon:'ϟ',video:'assets/powers/lightning.mp4',image:'assets/powers/storm.jpg',preview:'assets/powers/storm.jpg',tint:'storm'},
 sea:{name:'SEA POWER',kicker:'THE IRON ISLANDS',desc:'The sea gives nothing. It only takes.',icon:'≈',video:'assets/powers/sea.mp4',image:'assets/powers/sea.jpg',preview:'assets/powers/sea.jpg',tint:'sea'}
};
let activePower='ice';
const pv=$('#powerVideo'),pi=$('#powerImage');
function particles(type){
 const wrap=$('#particles');wrap.innerHTML='';
 const counts={ice:55,fire:45,shadow:22,storm:30,sea:26};
 const n=counts[type]||18;
 for(let i=0;i<n;i++){
  const s=document.createElement('i');
  s.className='power-particle '+type+'-particle';
  s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';
  s.style.setProperty('--delay',(-Math.random()*6)+'s');
  s.style.setProperty('--duration',(type==='ice'?3+Math.random()*7:type==='sea'?4+Math.random()*5:1.2+Math.random()*2.8)+'s');
  s.style.setProperty('--size',(2+Math.random()*5)+'px');
  wrap.appendChild(s);
 }
}
function ensurePowerVideo(){
 const p=powers[activePower];
 if(!p.video) return;
 if(pv.dataset.src!==p.video){
  pv.pause(); pv.removeAttribute('src'); pv.load();
  pv.dataset.src=p.video; pv.src=p.video; pv.load();
 }
 pv.style.display='block'; pi.style.display='none';
 if(!document.hidden) pv.play().catch(()=>{});
}
function setPower(key){
 activePower=key; const p=powers[key]; $$('#powerSwitcher button').forEach(x=>x.classList.toggle('active',x.dataset.power===key));
 $('#powerKicker').textContent=p.kicker; $('#powerName').textContent=p.name; $('#powerDesc').textContent=p.desc; $('#powerIcon').textContent=p.icon;
 $('#previewName').textContent=p.name; $('#powerPreview').src=p.preview;
 pi.src=p.image; pi.alt=p.name+' power artwork';
 document.body.dataset.power=p.tint; particles(p.tint);
 $('#powerStatus').textContent=p.name+' / READY';
 ensurePowerVideo();
}
$$('#powerSwitcher button').forEach(b=>b.addEventListener('click',()=>{setPower(b.dataset.power);$$('#powerSwitcher button').forEach(x=>x.classList.toggle('active',x===b));}));
$$('[data-power]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();setPower(a.dataset.power);document.querySelector('#powers').scrollIntoView({behavior:'smooth'})}));
['intensity','range','duration'].forEach(id=>{const el=$('#'+id),val=$('#'+id+'Value');el.oninput=()=>{val.textContent=el.value+'%';if(id==='intensity'){const v=.45+el.value/200;pi.style.filter=`brightness(${v}) saturate(${.65+el.value/250}) contrast(${.95+el.value/400})`;pv.style.opacity=.45+el.value/180} if(id==='range') $('#particles').style.transform=`scale(${.75+el.value/250})`;if(id==='duration') $('#particles').querySelectorAll('.power-particle').forEach(x=>x.style.setProperty('--duration',(1.5+el.value/12)+'s'))}});
$('#activatePower').onclick=()=>{
 const btn=$('#activatePower'),stage=$('#powerStage');
 ensurePowerVideo(); pv.play().catch(()=>{}); btn.textContent='◉ POWER ENGAGED';btn.classList.add('engaged');stage.classList.remove('power-burst');void stage.offsetWidth;stage.classList.add('power-burst');
 setTimeout(()=>{btn.textContent='◉ ACTIVATE';btn.classList.remove('engaged');stage.classList.remove('power-burst')},1800)
};
setPower('ice');
const powerObserver=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){ensurePowerVideo();$('#powerStatus').textContent=powers[activePower].name+' / ACTIVE';}},{rootMargin:'240px 0px'});
powerObserver.observe($('#powers'));

const eras=[
 ['01','THE OLD GODS','Before the great crowns, the old gods were worshipped beneath the weirwoods.','assets/powers/ice-north.jpg'],
 ['02','THE TARGARYEN RISE','Aegon the Conqueror and his dragons forge a new royal dynasty in Westeros.','assets/characters/source/46afc92a1f13920c54a152dd594e7add.jpg'],
 ['03','ROBERT’S REBELLION','A rebellion brings Robert Baratheon to the Iron Throne and ends Targaryen rule.','assets/characters/source/a2b1db707dc2f92192185c2ca921137e.jpg'],
 ['04','THE WAR OF FIVE KINGS','The realm fractures as rival kings and claimants fight for power.','assets/battles/e20848060fc758def4b5a50a9a422c45.jpg'],
 ['05','THE LONG NIGHT','The Army of the Dead reaches Winterfell and the living make their stand.','assets/battles/35c1e13db884f0b946c363985b51459c.jpg'],
 ['06','THE IRON THRONE','The struggle for the throne leaves Westeros permanently changed.','assets/1000382418.jpg']
];
$('#timeline').innerHTML=eras.map(e=>`<article class="era"><img src="${e[3]}" alt="${e[1]}" loading="lazy"><div class="era-overlay"></div><div class="era-content"><div class="year">${e[0]}</div><h3>${e[1]}</h3><p>${e[2]}</p></div></article>`).join('');

const pre=$('#preloader'),bar=$('.pre-bar i');
function dismissPreloader(){bar.style.width='100%';pre.classList.add('ready');setTimeout(()=>pre.remove(),520);}
if(document.readyState==='complete') setTimeout(dismissPreloader,180); else addEventListener('load',()=>setTimeout(dismissPreloader,180),{once:true});
updateMaster();
if(matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('reduce-motion');}
