(() => {
  'use strict';
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const houses = [
    ['ST','HOUSE STARK','WINTER IS COMING','Winterfell','The North remembers. Duty, family and endurance define the house that stands beneath the wolf banner.'],
    ['LA','HOUSE LANNISTER','HEAR ME ROAR','Casterly Rock','A house built on wealth, strategy and an unshakeable belief that power is a language of its own.'],
    ['TA','HOUSE TARGARYEN','FIRE AND BLOOD','Dragonstone','The blood of old Valyria. Dragons, conquest and a claim that refuses to disappear.'],
    ['BA','HOUSE BARATHEON','OURS IS THE FURY','Storm’s End','A storm-born dynasty whose rise changed the balance of the Seven Kingdoms.'],
    ['TY','HOUSE TYRELL','GROWING STRONG','Highgarden','Beauty, harvest and political intelligence wrapped in the scent of roses.'],
    ['MA','HOUSE MARTELL','UNBOWED, UNBENT, UNBROKEN','Sunspear','Dorne keeps its own rhythm—proud, patient and fiercely independent.'],
    ['GR','HOUSE GREYJOY','WE DO NOT SOW','Pyke','Salt, stone and the sea. The Ironborn answer to no easy crown.'],
    ['AR','HOUSE ARRYN','AS HIGH AS HONOR','The Eyrie','High above the mountains, honor is held as tightly as the falcon sigil.']
  ];
  const characters = [
    ['JON SNOW','ST','THE NORTH'],['DAENERYS TARGARYEN','TA','DRAGONS'],['TYRION LANNISTER','LA','THE LANNISTERS'],['ARYA STARK','ST','THE NORTH'],['CERSEI LANNISTER','LA','THE LANNISTERS'],['JAIME LANNISTER','LA','THE LANNISTERS'],['SANSA STARK','ST','THE NORTH'],['BRAN STARK','ST','THE NORTH'],['THE NIGHT KING','NW','THE NORTH'],['SAMWELL TARLY','TY','THE NORTH'],['BRIENNE OF TARTH','BA','THE NORTH'],['THEON GREYJOY','GR','THE IRONBORN']
  ];
  const battles = [
    ['01','THE BATTLE OF BLACKWATER','A city, a wildfire chain and a night that changed the politics of the capital.'],
    ['02','HARDHOME','Beyond the Wall, the living discover that the dead do not negotiate.'],
    ['03','THE BATTLE OF THE BASTARDS','Mud, snow and a charge into chaos becomes one of the North’s defining moments.'],
    ['04','THE LONG NIGHT','At the edge of dawn, every house is reduced to one question: who survives?']
  ];
  const timeline = [
    ['THE BEGINNING','THE OLD WORLD','Ancient powers, old bloodlines and stories that existed long before the throne.'],
    ['01','THE NORTH','A quiet kingdom learns that winter is not a metaphor.'],
    ['02','THE CAPITAL','The game of alliances begins beneath the shadow of the crown.'],
    ['03','THE DRAGONS','Fire returns to the world and every political calculation changes.'],
    ['04','THE WALL','The threat beyond the frontier becomes impossible to ignore.'],
    ['05','THE WAR','Houses collide, loyalties fracture and the map itself becomes unstable.'],
    ['06','THE END','The wheel turns again. The throne remains a question.']
  ];
  const places = {
    'The Wall':['The Wall','A frontier of ice where the old stories stop being stories.'],
    'Winterfell':['Winterfell','The ancient seat of House Stark and the emotional heart of the North.'],
    "King's Landing":["King's Landing",'The capital—where ambition, rumor and power meet beneath the crown.'],
    'Dragonstone':['Dragonstone','A volcanic island fortress and a symbol of Targaryen power.'],
    'Dorne':['Dorne','The southernmost realm, known for its heat, independence and distinct traditions.']
  };

  // Preloader
  const preloader = $('#preloader'); const preloadLine = $('.preloader-line span');
  requestAnimationFrame(() => preloadLine.style.width = '100%');
  window.addEventListener('load', () => setTimeout(() => preloader.classList.add('done'), 500), {once:true});
  setTimeout(() => preloader.classList.add('done'), 2400);

  // Navigation
  const nav = $('#navPanel'), scrim = $('#navScrim');
  const setNav = open => { nav.classList.toggle('open', open); scrim.classList.toggle('open', open); nav.setAttribute('aria-hidden', String(!open)); document.body.classList.toggle('lock', open); };
  $('#menuToggle').onclick = () => setNav(true); $('#closeNav').onclick = () => setNav(false); scrim.onclick = () => setNav(false);
  $$('#navPanel a').forEach(a => a.addEventListener('click', () => setNav(false)));

  // Sound affordance (visual + optional ambient readiness; no autoplay audio).


  // Power dashboard — visual strength is proportional to the selected power.
  const powers = [
    {name:'ICE', type:'ELEMENTAL', symbol:'❄', intensity:88, range:82, duration:76, effect:'snow', effectName:'SNOW / FROST', description:'Cold, control and the stillness of the North.', note:'Frost spreads farther as the power range increases.'},
    {name:'DRAGONFIRE', type:'ELEMENTAL', symbol:'✦', intensity:100, range:92, duration:72, effect:'fire', effectName:'FIRE / EMBERS', description:'Living flame, heat and overwhelming force.', note:'Heat blooms outward according to intensity and range.'},
    {name:'THREE-EYED SIGHT', type:'MYSTIC', symbol:'◉', intensity:78, range:96, duration:94, effect:'vision', effectName:'RAVEN / MEMORY', description:'Sight through time, memory and hidden connections.', note:'The field expands instead of burning or freezing.'},
    {name:'SHADOW', type:'DARK', symbol:'◌', intensity:84, range:70, duration:68, effect:'shadow', effectName:'SHADOW / SMOKE', description:'A quiet force that changes the atmosphere around it.', note:'Darkness gathers inside the active range.'},
    {name:'STORM', type:'ELEMENTAL', symbol:'ϟ', intensity:91, range:88, duration:61, effect:'storm', effectName:'LIGHTNING / WIND', description:'Pressure, wind and sudden violent energy.', note:'The storm radius follows the selected range.'},
    {name:'SEA POWER', type:'ELEMENTAL', symbol:'≈', intensity:72, range:90, duration:83, effect:'sea', effectName:'WATER / MIST', description:'The strength of the sea, distance and relentless movement.', note:'Mist and waves extend toward the outer range.'}
  ];
  const powerList=$('#powerList'), powerCore=$('#powerCore'), powerField=$('#powerField');
  function renderPower(p){
    $('#powerType').textContent=p.type; $('#powerName').textContent=p.name; $('#powerDescription').textContent=p.description; $('#powerSymbol').textContent=p.symbol;
    $('#powerIntensity').textContent=p.intensity+'%'; $('#powerRange').textContent=p.range+'%'; $('#powerDuration').textContent=p.duration+'%';
    $('#intensityBar').style.width=p.intensity+'%'; $('#rangeBar').style.width=p.range+'%'; $('#durationBar').style.width=p.duration+'%';
    $('#effectName').textContent=p.effectName; $('#effectText').textContent=p.note;
    powerCore.dataset.effect=p.effect; powerField.dataset.effect=p.effect; powerField.style.setProperty('--power-range',p.range+'%'); powerField.style.setProperty('--power-intensity',p.intensity+'%');
    $$('.power-choice',powerList).forEach(b=>b.classList.toggle('active',b.dataset.power===p.name));
  }
  powers.forEach((p,i)=>{const b=document.createElement('button');b.className='power-choice'+(i===0?' active':'');b.type='button';b.dataset.power=p.name;b.innerHTML=`<span>${p.symbol}</span><strong>${p.name}</strong><small>${p.type}</small>`;b.onclick=()=>renderPower(p);powerList.appendChild(b)});
  renderPower(powers[0]);

  // Houses
  const houseGrid = $('#houseGrid'), detail = $('#houseDetail');
  houses.forEach((h, i) => {
    const card = document.createElement('button'); card.className='house-card'; card.type='button';
    card.innerHTML = `<span class="house-no">0${i+1}</span><div class="sigil">${h[0]}</div><h3>${h[1]}</h3><p>${h[2]}</p>`;
    card.onclick = () => { $('#detailSigil').textContent=h[0]; $('#detailMotto').textContent=h[2]; $('#detailName').textContent=h[1]; $('#detailText').textContent=h[4]; $('#detailSeat').textContent=h[3]; $('#detailWords').textContent='OPEN CHAPTER'; detail.classList.add('open'); detail.setAttribute('aria-hidden','false'); };
    houseGrid.appendChild(card);
  });
  $$('[data-close]', detail).forEach(b => b.onclick=()=>{detail.classList.remove('open');detail.setAttribute('aria-hidden','true')});

  // Map
  const placeCard=$('#placeCard'); $$('.map-pin').forEach(pin=>pin.addEventListener('click',()=>{const d=places[pin.dataset.place];if(!d)return;$('#placeName').textContent=d[0];$('#placeText').textContent=d[1];placeCard.classList.add('open')}));
  $$('[data-close]',placeCard).forEach(b=>b.onclick=()=>placeCard.classList.remove('open'));

  // Characters
  const stage=$('#characterStage'), filters=$('#charFilters');
  const cats=['ALL','THE NORTH','THE LANNISTERS','DRAGONS','THE IRONBORN'];
  cats.forEach((cat,i)=>{const b=document.createElement('button');b.className='filter'+(i===0?' active':'');b.textContent=cat;b.onclick=()=>{ $$('.filter',filters).forEach(x=>x.classList.remove('active'));b.classList.add('active');renderChars(cat); };filters.appendChild(b)});
  function renderChars(filter='ALL'){
    stage.innerHTML=''; const list=filter==='ALL'?characters:characters.filter(c=>c[2]===filter);
    list.forEach((c,i)=>{const el=document.createElement('article');el.className='character';el.innerHTML=`<span class="character-num">${String(i+1).padStart(2,'0')}</span><span class="character-mark">${c[1]}</span><h3>${c[0]}</h3><p>${c[2]}</p>`;stage.appendChild(el)});
  }
  renderChars();

  // Battles
  const battleTrack=$('#battleTrack'); battles.forEach(b=>{const el=document.createElement('article');el.className='battle-card';el.innerHTML=`<span class="battle-year">${b[0]}</span><h3>${b[1]}</h3><p>${b[2]}</p>`;battleTrack.appendChild(el)});
  // Timeline
  const tl=$('#timeline'); timeline.forEach((t)=>{const el=document.createElement('article');el.className='timeline-item';el.innerHTML=`<span class="timeline-dot"></span><span class="timeline-year">${t[0]}</span><h3>${t[1]}</h3><p>${t[2]}</p>`;tl.appendChild(el)});

  // Scroll-driven video + story text. The same currentTime is used for forward and reverse scrolling.
  const video=$('#storyVideo'), story=$('#storyScrub'), bar=$('#progressBar'), chapter=$('#chapterName'), num=$('#progressNumber'), beat=$('#storyBeat');
  $('#soundToggle').onclick = e => { e.currentTarget.classList.toggle('sound-off'); video.muted = !video.muted; };
  const beats=[
    [0,'THE NORTH','THE NORTH REMEMBERS','Every kingdom begins with a promise.'],
    [.17,'THE CAPITAL','THE GAME BEGINS','A crown turns whispers into weapons.'],
    [.34,'THE DRAGONS','FIRE RETURNS','Old blood wakes beneath a new sky.'],
    [.52,'THE WALL','THE DEAD MARCH','The frontier was never the end of the world.'],
    [.72,'THE WAR','KINGDOMS COLLIDE','Every oath has a price. Every victory leaves a scar.'],
    [.88,'THE THRONE','THE WHEEL TURNS','In the end, the throne is only a chair.']
  ];
  let videoReady=false, duration=37.13;
  video.addEventListener('loadedmetadata',()=>{videoReady=true;duration=video.duration||duration;video.currentTime=0;});
  const unlockVideo=()=>{ if(!videoReady)return; const p=video.play(); if(p&&p.then)p.then(()=>video.pause()).catch(()=>{}); window.removeEventListener('pointerdown',unlockVideo); window.removeEventListener('touchstart',unlockVideo); };
  window.addEventListener('pointerdown',unlockVideo,{passive:true}); window.addEventListener('touchstart',unlockVideo,{passive:true});
  function setStory(p){
    p=Math.max(0,Math.min(1,p)); bar.style.width=(p*100)+'%';
    let current=beats[0], idx=0; beats.forEach((b,i)=>{if(p>=b[0]){current=b;idx=i;}});
    chapter.textContent=current[1];num.textContent=`0${idx+1} / 06`;
    beat.querySelector('p').textContent=current[2];beat.querySelector('h2').textContent=current[3];
    if(videoReady && Number.isFinite(duration)){const t=Math.max(0,Math.min(duration-.03,p*duration));if(Math.abs(video.currentTime-t)>.035) video.currentTime=t;}
  }
  if(window.gsap && window.ScrollTrigger && !reduceMotion){
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({trigger:story,start:'top top',end:'bottom bottom',scrub:0.05,onUpdate:self=>setStory(self.progress)});
    gsap.utils.toArray('.manifesto-grid>div,.house-card,.character,.battle-card,.timeline-item').forEach(el=>gsap.from(el,{y:35,opacity:0,duration:1,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none reverse'}}));
    gsap.from('.map-stage',{scale:.92,opacity:0,scrollTrigger:{trigger:'.map-stage',start:'top 75%',end:'top 25%',scrub:1}});
    gsap.to('.dragon-core',{scale:1.12,scrollTrigger:{trigger:'.dragons',start:'top bottom',end:'bottom top',scrub:1}});
    gsap.from('.throne-copy',{y:90,opacity:0,scrollTrigger:{trigger:'.throne',start:'top 70%',end:'top 25%',scrub:1}});
  }
  // fallback if ScrollTrigger unavailable / reduced motion
  if(reduceMotion){setStory(0);}

  // Subtle pointer parallax on the hero and map, disabled for touch.
  if(!matchMedia('(pointer:coarse)').matches && !reduceMotion){
    window.addEventListener('pointermove',e=>{const x=(e.clientX/innerWidth-.5)*10,y=(e.clientY/innerHeight-.5)*8;const bg=$('.hero:before');document.documentElement.style.setProperty('--mx',x+'px');document.documentElement.style.setProperty('--my',y+'px');}, {passive:true});
  }

  // Basic interaction analytics events when GA is configured.
  const GA_READY = !!(window.GA_MEASUREMENT_ID && !window.GA_MEASUREMENT_ID.includes("XXXXXXXXXX")); document.addEventListener('click',e=>{const link=e.target.closest('a');if(link&&GA_READY&&typeof window.gtag==='function') window.gtag('event','navigation_click',{target:link.getAttribute('href')});});
})();
