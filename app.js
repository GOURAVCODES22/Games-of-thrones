(() => {
  const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const video=$('#storyVideo');
  const drawer=$('#drawer'); const modal=$('#modal');
  const modalTitle=$('#modalTitle'), modalMeta=$('#modalMeta'), modalText=$('#modalText'), modalStats=$('#modalStats');
  const data={
    Stark:{meta:'The North · Winterfell',text:'An ancient northern house built around duty, family and the old words: Winter Is Coming.',stats:['Wolf','Winterfell','North']},
    Lannister:{meta:'The West · Casterly Rock',text:'A wealthy and powerful house whose ambition, alliances and debts reshape the realm.',stats:['Lion','Casterly Rock','West']},
    Targaryen:{meta:'Dragonstone · Fire and Blood',text:'The dragonlords return to a realm where memory, bloodline and conquest collide.',stats:['Dragon','Dragonstone','Fire']},
    Baratheon:{meta:'The Stormlands · Storm’s End',text:'A warlike royal house whose claim becomes central to the struggle for the crown.',stats:['Stag','Storm’s End','Stormlands']},
    Greyjoy:{meta:'The Iron Islands · Pyke',text:'A seafaring house shaped by the harsh islands and the Old Way.',stats:['Kraken','Pyke','Iron Islands']},
    Tyrell:{meta:'The Reach · Highgarden',text:'A powerful southern house associated with fertile lands, diplomacy and court influence.',stats:['Rose','Highgarden','The Reach']},
    Martell:{meta:'Dorne · Sunspear',text:'A southern house with its own customs, politics and a long memory of resistance.',stats:['Sun','Sunspear','Dorne']},
    Arryn:{meta:'The Vale · Eyrie',text:'An ancient house ruling from a mountain fortress above the Vale.',stats:['Falcon','The Eyrie','The Vale']},
    Jon:{meta:'Character · The North',text:'A central figure whose identity, vows and place in the realm connect several major storylines.',stats:['North','Night’s Watch','Legacy']},
    Daenerys:{meta:'Character · Targaryen',text:'A claimant whose journey moves from exile to power, dragons and a contested vision of rule.',stats:['Targaryen','Dragons','Queen']},
    Tyrion:{meta:'Character · Lannister',text:'A sharp political mind whose wit and survival instincts carry him through shifting alliances.',stats:['Lannister','King’s Landing','Hand']},
    Arya:{meta:'Character · Stark',text:'A survivor whose journey crosses noble courts, war zones and a path of personal transformation.',stats:['Stark','Faceless Men','North']},
    Winterfell:{meta:'Location · The North',text:'The ancestral seat of House Stark and one of the oldest strongholds in the realm.',stats:['Stark','North','Castle']},
    Wall:{meta:'Location · The Far North',text:'A colossal defensive structure separating the realms of men from the lands beyond.',stats:['The Wall','Night’s Watch','North']},
    KingsLanding:{meta:'Location · The Crownlands',text:'The capital city and political heart of the Seven Kingdoms.',stats:['Capital','Iron Throne','Crownlands']},
    Dragonstone:{meta:'Location · Blackwater Bay',text:'A volcanic island fortress strongly associated with House Targaryen.',stats:['Targaryen','Volcanic','Island']},
    Dorne:{meta:'Location · The South',text:'A southern region known for its distinct customs, landscapes and the seat of Sunspear.',stats:['Martell','Sunspear','Dorne']}
  };
  const openModal=(key)=>{const d=data[key];if(!d)return;modalTitle.textContent=key;modalMeta.textContent=d.meta;modalText.textContent=d.text;modalStats.innerHTML=d.stats.map((x,i)=>`<div class="stat"><small>${['Sigil / identity','Seat / place','Theme / region'][i]}</small><strong>${x}</strong></div>`).join('');modal.classList.add('open');document.body.classList.add('lock');modal.setAttribute('aria-hidden','false')};
  const closeModal=()=>{modal.classList.remove('open');document.body.classList.remove('lock');modal.setAttribute('aria-hidden','true')};
  $$('.house-card,.character-card').forEach(el=>el.addEventListener('click',()=>openModal(el.dataset.key)));
  $$('.hotspot').forEach(el=>el.addEventListener('click',()=>openModal(el.dataset.key)));
  $$('.battle-card').forEach(el=>el.addEventListener('click',()=>openModal(el.dataset.key)));
  $('#menuBtn').addEventListener('click',()=>{drawer.classList.add('open');document.body.classList.add('lock')});
  $('#drawerClose').addEventListener('click',()=>{drawer.classList.remove('open');document.body.classList.remove('lock')});
  $$('#drawer a').forEach(a=>a.addEventListener('click',()=>{drawer.classList.remove('open');document.body.classList.remove('lock')}));
  $('#modalClose').addEventListener('click',closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();drawer.classList.remove('open');document.body.classList.remove('lock')}});
  const sound=$('#soundBtn'); let muted=true;
  const updateCanonical=()=>{const c=document.querySelector('link[rel=canonical]'); if(c && location.origin) c.href=location.origin + location.pathname.replace(/\/$/,'/')}; updateCanonical();
  sound.addEventListener('click',()=>{muted=!muted;video.muted=muted;sound.classList.toggle('off',muted);sound.setAttribute('aria-label',muted?'Enable sound':'Mute sound');if(!muted)video.play().catch(()=>{})});
  if(!reduce && window.gsap){gsap.registerPlugin(ScrollTrigger);
    if(video){video.addEventListener('loadedmetadata',()=>{gsap.to(video,{currentTime:Math.max(.01,video.duration-.05),ease:'none',scrollTrigger:{trigger:'#story',start:'top top',end:'+=240%',scrub:.65,pin:true,anticipatePin:1}})})}
    gsap.from('.hero-content',{opacity:0,y:50,duration:1.5,ease:'power3.out',delay:.15});
    gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{opacity:0,y:55,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 82%',once:true}}));
    gsap.utils.toArray('.card').forEach((el,i)=>gsap.from(el,{opacity:0,y:35,duration:.7,delay:(i%4)*.07,scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
    gsap.utils.toArray('.parallax').forEach(el=>gsap.to(el,{yPercent:-10,ease:'none',scrollTrigger:{trigger:el.closest('.chapter'),start:'top bottom',end:'bottom top',scrub:1}}));
    gsap.to('.progress i',{height:'100%',ease:'none',scrollTrigger:{start:0,end:'max',scrub:.2}});
    gsap.utils.toArray('.battle-stage').forEach(el=>gsap.to($('.battle-bg',el),{scale:1.18,xPercent:5,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1}}));
    gsap.to('.dragon-shape',{xPercent:15,rotation:5,ease:'none',scrollTrigger:{trigger:'#dragons',start:'top bottom',end:'bottom top',scrub:1}});
  }
  const sections=$$('main section[id]'); const label=$('#chapterLabel'); const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){const name=e.target.dataset.label||e.target.id;label.textContent=name.replaceAll('-',' ')} }),{threshold:.45});sections.forEach(s=>observer.observe(s));
  const filterButtons=$$('.pill[data-filter]'); const characterCards=$$('.character-card');filterButtons.forEach(btn=>btn.addEventListener('click',()=>{filterButtons.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;characterCards.forEach(c=>{c.style.display=(f==='all'||c.dataset.house===f)?'block':'none'})}));
})();
