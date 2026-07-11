(() => {
  'use strict';

  /* ============ Data ============ */

  const SOURCES = [
    {
      id: 'incentive', categories: ['policy','solutions'], outlet: 'The Oxford Eagle', date: 'March 11, 2026',
      title: 'Tax incentives for affordable rental units',
      summary: 'Oxford officials considered a voluntary program allowing qualifying rental properties to receive a different tax assessment when units are rented to households earning up to 80% of area median income.',
      fact: 'The proposed assessment would be based on net operating income rather than appraised property value, aiming to make lower rents more financially viable.',
      url: 'https://oxfordeagle.com/2026/03/11/new-ordinance-would-encourage-affordable-housing/'
    },
    {
      id: 'turnover', categories: ['experience','demand','policy'], outlet: 'The Oxford Eagle / UM Housing Insecurity Lab', date: 'February 17, 2026',
      title: 'Frequent moves reveal housing instability',
      summary: 'A local research report combined resident survey and interview data with federal sources to examine why people move within the Lafayette–Oxford–University community.',
      fact: '45% of respondents were frequent movers, and 58% identified affordability as the main reason for their most recent move.',
      url: 'https://oxfordeagle.com/2026/02/17/report-points-to-limited-affordable-housing-high-turnover/'
    },
    {
      id: 'grad', categories: ['experience','demand'], outlet: 'The Oxford Eagle', date: 'January 29, 2026',
      title: 'Graduate students face a stipend–rent mismatch',
      summary: 'Graduate assistants described overcrowding, long commutes, and financial stress as fixed stipends collided with Oxford housing costs.',
      fact: 'The article reported average rent rising from $1,500 in 2022 to $2,236 by September 2025; it also cited a city report finding more than one-third of residents spend at least half their income on housing.',
      url: 'https://oxfordeagle.com/2026/01/29/grad-students-struggle-to-find-affordable-housing/'
    },
    {
      id: 'bedroom', categories: ['demand','experience'], outlet: 'The Daily Mississippian', date: 'October 16, 2024',
      title: 'Rent-by-the-bedroom reshapes the market',
      summary: 'Residents, housing officials, and a landlord offered competing explanations for rising rents, including enrollment growth, second homes, taxes, insurance, and student-oriented leasing models.',
      fact: 'The report noted that many complexes cater to students and rent by the bedroom, allowing a shared unit to generate more revenue than a family-oriented lease.',
      url: 'https://thedmonline.com/oxford-locals-struggle-with-housing-costs/'
    },
    {
      id: 'student-survey', categories: ['experience','demand'], outlet: 'The Daily Mississippian / ASB', date: 'February 19, 2025',
      title: 'Students report insecurity and a leasing-season gap',
      summary: 'An Associated Student Body survey documented problems with affordability, availability, safety, roommates, and the gap between leases.',
      fact: '24.5% of 731 respondents reported experiencing housing insecurity; difficulty with the leasing season was the most commonly selected reason.',
      url: 'https://thedmonline.com/asb-runs-the-numbers-on-student-housing-insecurity/'
    },
    {
      id: 'energy', categories: ['solutions','policy'], outlet: 'TVA EnergyRight', date: '2020',
      title: 'Energy efficiency as part of affordability',
      summary: 'A partnership among the city, Oxford Utilities, TVA, and a developer used incentives to support cost-restricted housing and reduce ongoing utility expenses.',
      fact: 'Qualifying developments used all-electric, energy-saving construction standards, treating monthly utility costs as part of the affordability equation.',
      url: 'https://energyright.com/thecurrent/residential/more-residents-can-find-affordable-housing-in-oxford-thanks-to-a-partnership-with-the-city-builder-local-power-company-and-tva/'
    },
    {
      id: 'commission', categories: ['policy','solutions'], outlet: 'City of Oxford', date: 'Current city resource',
      title: 'Affordable Housing Commission and local planning',
      summary: 'The city commission was formed in 2021 to address housing needs and maintains reports, incentives, work products, and planning resources.',
      fact: 'The commission is a formal city body dedicated to serving residents across income levels and supporting affordable development strategies.',
      url: 'https://www.oxfordms.net/affordable-housing-commission'
    },
    {
      id: 'new-beds', categories: ['demand','solutions'], outlet: 'Multi-Housing News', date: 'March 27, 2026',
      title: 'Large on-campus projects add student beds',
      summary: 'A public-private partnership began a 1,282-bed project planned for the 2027 academic year, with a second phase planned later.',
      fact: 'Purpose-built student beds may absorb some demand, but the simulation asks students to test whether supply alone improves affordability for graduate students and local workers.',
      url: 'https://www.multihousingnews.com/greystar-university-of-mississippi-kick-off-student-project/'
    }
  ];

  const TOOL_DATA = {
    mixed:     { label:'Mixed-income homes',  cost:35, units:12, color:'#7cb56a' },
    student:   { label:'Student apartments',  cost:30, units:18, color:'#c76a4a' },
    workforce: { label:'Workforce housing',   cost:40, units:10, color:'#d9b356' },
    transit:   { label:'Transit link',        cost:15, units:0,  color:'#57a8b4' },
    energy:    { label:'Efficient homes',     cost:28, units:8,  color:'#e3d268' },
    tenant:    { label:'Tenant advocacy',     cost:20, units:0,  color:'#b4a4cc' },
    park:      { label:'Public space',        cost:12, units:0,  color:'#5f9c6a' },
    clear:     { label:'Clear parcel',        cost:5,  units:0,  color:'#3a4a50' }
  };

  const MODE_DATA = {
    ground:  { label:'Build from Scratch',   objective:'Raise affordability above 65 while keeping displacement risk below 40.', budget:200,
               check: m => m.affordability > 65 && m.displacement < 40 },
    chaos:   { label:'Fix the Chaotic City', objective:'Cut displacement risk below 45 without letting housing supply fall.', budget:180,
               check: (m, s) => m.displacement < 45 && m.supply >= s.startMetrics.supply },
    shock:   { label:'Enrollment Shock',     objective:'Absorb recurring demand while keeping affordability above 55 and commute burden below 45.', budget:210,
               check: m => m.affordability > 55 && m.commute < 45 },
    council: { label:'Council Table',        objective:'Use evidence to pass a balanced plan within 10 turns: affordability above 55, displacement below 50, at least 2 saved sources.', budget:150,
               check: (m, s) => m.affordability > 55 && m.displacement < 50 && s.notebook.filter(n=>n.type==='Evidence').length >= 2 }
  };

  // Random civic events fire every few turns and force replanning.
  const CITY_EVENTS = [
    { title:'Insurance premiums spike', text:'Regional insurers raise premiums; operating costs climb and landlords pass them to renters.', apply: s => { s.metrics.affordability -= 4; }, tone:'bad' },
    { title:'State infrastructure grant', text:'A competitive grant adds $25m to the public budget for housing and transit.', apply: s => { s.budget += 25; }, tone:'good' },
    { title:'Second-home buying wave', text:'Game-weekend demand converts more houses into part-time residences, tightening year-round supply.', apply: s => { s.metrics.displacement += 5; s.metrics.affordability -= 2; }, tone:'bad' },
    { title:'University adds on-campus beds', text:'A public-private dorm project opens, absorbing some student demand.', apply: s => { s.metrics.affordability += 3; s.metrics.supply += 3; }, tone:'good' },
    { title:'Construction costs rise', text:'Materials and labor cost more; every project this year strains the budget further.', apply: s => { s.budget -= 15; }, tone:'bad' },
    { title:'Leasing-season crunch', text:'The gap between leases leaves students scrambling; pressure grows on rentals near campus.', apply: s => { s.metrics.displacement += 4; }, tone:'bad' }
  ];

  /* ============ State ============ */

  const state = {
    screen: 'landing', mode: 'ground', selectedTool: 'mixed', gridSize: 10, grid: [], history: [],
    turn: 0, year: 1, budget: 200, selectedTile: {x:4,y:4}, notebook: [], survey: [],
    cursor: {x:4,y:4}, hover: null, lastFocus: null, eventIndex: 0, ended: false,
    startMetrics: { affordability:42, supply:28, displacement:64, commute:58 },
    metrics: { affordability:42, supply:28, displacement:64, commute:58 }
  };

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const clamp = (n,min=0,max=100) => Math.max(min,Math.min(max,n));

  /* ============ Persistence ============ */

  const STORE_KEY = 'studentification-v1';
  function saveLocal() {
    try {
      const reflections = ['problem','tradeoff','evidence','next'].map(k => $(`#reflection-${k}`).value);
      localStorage.setItem(STORE_KEY, JSON.stringify({ notebook: state.notebook, survey: state.survey, reflections }));
    } catch (e) { /* private mode */ }
  }
  function loadLocal() {
    try {
      const data = JSON.parse(localStorage.getItem(STORE_KEY));
      if (!data) return;
      state.notebook = data.notebook || [];
      state.survey = data.survey || [];
      (data.reflections || []).forEach((v,i) => { const el = $(`#reflection-${['problem','tradeoff','evidence','next'][i]}`); if (el) el.value = v; });
    } catch (e) { /* ignore */ }
  }

  /* ============ UI helpers ============ */

  function showToast(message) {
    const toast = $('#toast'); toast.textContent = message; toast.classList.add('is-visible');
    clearTimeout(showToast.t); showToast.t = setTimeout(() => toast.classList.remove('is-visible'), 2400);
  }

  function showScreen(name) {
    state.screen = name;
    $$('.screen').forEach(s => s.classList.toggle('is-active', s.id === `screen-${name}`));
    window.scrollTo({top:0,behavior:document.body.classList.contains('reduce-motion')?'auto':'smooth'});
    if (name === 'game') requestAnimationFrame(resizeCanvas);
    const video = $('#hero-video');
    if (video) { name === 'landing' ? video.play().catch(()=>{}) : video.pause(); }
  }

  function openPanel(name) {
    closePanels(); closeModals();
    const panel = $(`#panel-${name}`); if (!panel) return;
    state.lastFocus = document.activeElement;
    panel.classList.add('is-open'); panel.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('.drawer-close',panel)?.focus(),80);
    if (name === 'notebook') renderNotebook();
    if (name === 'survey') renderSurvey();
  }

  function closePanels() {
    $$('.drawer.is-open').forEach(p => { p.classList.remove('is-open'); p.setAttribute('aria-hidden','true'); });
    document.body.style.overflow = '';
    state.lastFocus?.focus?.();
  }

  function closeModals() {
    $$('.modal.is-open').forEach(m => { m.classList.remove('is-open'); m.setAttribute('aria-hidden','true'); });
  }

  function escapeHTML(str='') { return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

  /* ============ Sources & notebook ============ */

  function renderSources(filter='all') {
    const list = $('#source-list');
    const data = filter === 'all' ? SOURCES : SOURCES.filter(s => s.categories.includes(filter));
    list.innerHTML = data.map((s,i) => `
      <article class="source-card" data-index="${String(i+1).padStart(2,'0')}">
        <div class="source-meta"><span>${s.outlet}</span><span>•</span><span>${s.date}</span></div>
        <h3>${s.title}</h3><p>${s.summary}</p><div class="source-fact">${s.fact}</div>
        <div class="source-actions"><a href="${s.url}" target="_blank" rel="noopener">Read source ↗</a><button data-save-source="${s.id}">Save to notebook</button></div>
      </article>`).join('');
  }

  function addNotebook(type, title, text, sourceId='') {
    state.notebook.push({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()+Math.random()), type, title, text, sourceId, time:new Date().toLocaleString() });
    updateNotebookCount(); renderNotebook(); saveLocal(); showToast('Saved to your notebook');
    if (state.screen === 'game') { calculateMetrics(); updateUI(); }
  }

  function updateNotebookCount() {
    $('#note-count').textContent = state.notebook.length;
    $('#evidence-count').textContent = `${state.notebook.filter(n=>n.type==='Evidence').length} sources`;
  }

  function renderNotebook() {
    const wrap = $('#notebook-items');
    if (!state.notebook.length) { wrap.innerHTML = '<p class="empty-state">Your saved evidence and decision notes will appear here.</p>'; return; }
    wrap.innerHTML = state.notebook.map(n => `<article class="note-item"><div><small>${n.type} · ${escapeHTML(n.title)}</small><p>${escapeHTML(n.text)}</p></div><button data-remove-note="${n.id}" aria-label="Remove note">×</button></article>`).join('');
  }

  /* ============ Simulation ============ */

  function initGrid(mode) {
    state.grid = Array.from({length:state.gridSize},(_,y)=>Array.from({length:state.gridSize},(_,x)=>({x,y,type:null})));
    state.history=[]; state.turn=0; state.year=1; state.budget=MODE_DATA[mode].budget;
    state.cursor={x:4,y:4}; state.selectedTile={x:4,y:4}; state.hover=null; state.eventIndex=0; state.ended=false;
    if (mode === 'chaos') {
      const pattern = ['student','student','student','mixed','workforce','student','transit'];
      state.grid.flat().forEach((tile,i)=> { if ((i*7)%10 < 3) tile.type = pattern[i%pattern.length]; });
    } else if (mode === 'shock') {
      state.grid.flat().forEach((tile,i)=> { if ((i*11)%17 < 4) tile.type = i%3===0?'student':i%5===0?'transit':'mixed'; });
    } else if (mode === 'council') {
      state.grid.flat().forEach((tile,i)=> { if ((i*5)%19 < 4) tile.type = i%3===0?'workforce':i%7===0?'park':'student'; });
    }
    calculateMetrics();
    state.startMetrics = { ...state.metrics };
    updateUI(); drawCity();
  }

  function startMode(mode) {
    state.mode=mode; $('#mode-label').textContent=MODE_DATA[mode].label; $('#objective-text').textContent=MODE_DATA[mode].objective;
    initGrid(mode); showScreen('game');
    $('#event-message').innerHTML=`<strong>Planning desk:</strong> ${MODE_DATA[mode].objective}`;
  }

  function calculateMetrics() {
    const counts = Object.fromEntries(Object.keys(TOOL_DATA).map(k=>[k,0]));
    state.grid.flat().forEach(t=>{if(t.type)counts[t.type]=(counts[t.type]||0)+1;});
    const units = counts.mixed*12 + counts.student*18 + counts.workforce*10 + counts.energy*8;
    let affordability = 30 + counts.mixed*4.2 + counts.workforce*5.4 + counts.energy*2.7 + counts.tenant*5 - counts.student*1.4;
    let supply = 18 + units*.58;
    let displacement = 70 - counts.mixed*3 - counts.workforce*4.4 - counts.tenant*6 - counts.transit*.5 + counts.student*1.8 + state.history.filter(h=>h.tool==='clear').length*6;
    let commute = 63 - counts.transit*7 - counts.mixed*.8 - counts.workforce*1.8 - counts.park*.3;
    if (state.mode==='chaos') displacement += 6;
    if (state.mode==='shock') { supply -= Math.floor(state.turn/3)*7; affordability -= Math.floor(state.turn/3)*4; }
    if (state.mode==='council') affordability += state.notebook.filter(n=>n.type==='Evidence').length*1.5;
    state.metrics={affordability:clamp(Math.round(affordability)),supply:clamp(Math.round(supply)),displacement:clamp(Math.round(displacement)),commute:clamp(Math.round(commute))};
  }

  function objectiveMet() {
    return MODE_DATA[state.mode].check(state.metrics, state);
  }

  function updateUI() {
    Object.entries(state.metrics).forEach(([key,val])=> { $(`#metric-${key}`).textContent=val; const meter=$(`#meter-${key}`); if(meter)meter.value=val; });
    $('#metric-budget').textContent=state.budget; $('#turn-value').textContent=`Turn ${state.turn}`; $('#year-value').textContent=state.year;
    $('#undo-button').disabled=!state.history.length;
    // Dim tools the budget can no longer afford
    $$('.tool').forEach(b => b.classList.toggle('unaffordable', TOOL_DATA[b.dataset.tool].cost > state.budget));
    let status='Keep testing tradeoffs';
    if(objectiveMet())status='✓ Objective reached — end the scenario when ready';
    else if(state.budget<12)status='Budget nearly exhausted';
    $('#goal-status').textContent=status;
  }

  function setTool(tool) {
    state.selectedTool=tool;
    $$('.tool').forEach(b=> { const active=b.dataset.tool===tool; b.classList.toggle('is-selected',active); b.setAttribute('aria-pressed',String(active)); });
    drawCity();
  }

  function fireCityEvent() {
    const ev = CITY_EVENTS[(state.eventIndex++ + (state.mode.length)) % CITY_EVENTS.length];
    ev.apply(state);
    state.budget = Math.max(0, state.budget);
    Object.keys(state.metrics).forEach(k => state.metrics[k] = clamp(state.metrics[k]));
    $('#event-message').innerHTML = `<strong>City event — ${ev.title}:</strong> ${ev.text}`;
    showToast(ev.tone === 'good' ? `City event: ${ev.title}` : `⚠ City event: ${ev.title}`);
  }

  function buildAt(x,y) {
    if (state.ended) { showToast('Scenario ended — start a new one to keep building'); return; }
    const tile=state.grid[y]?.[x]; if(!tile)return;
    const tool=state.selectedTool, data=TOOL_DATA[tool];
    if (state.budget < data.cost) { showToast('Not enough public budget for that move'); return; }
    if (tool!=='clear' && tile.type) { showToast('That parcel is occupied. Clear it first or choose another parcel.'); return; }
    if (tool==='clear' && !tile.type) { showToast('That parcel is already vacant'); return; }
    state.history.push({x,y,previous:tile.type,tool,budget:state.budget,turn:state.turn,year:state.year});
    tile.type = tool==='clear'?null:tool; state.budget-=data.cost; state.turn++; state.year=1+Math.floor(state.turn/4);
    calculateMetrics(); updateUI(); drawCity();
    $('#selected-tile').textContent=`Parcel ${x+1}, ${y+1} · ${tile.type?TOOL_DATA[tile.type].label:'vacant'}`;
    let msg=`Placed <strong>${data.label}</strong> on parcel ${x+1}, ${y+1}.`;
    if(state.mode==='shock' && state.turn%3===0)msg+=` Enrollment demand rose again; supply pressure increased.`;
    $('#event-message').innerHTML=`<strong>Planning desk:</strong> ${msg}`;
    if(state.turn>0 && state.turn%5===0) fireCityEvent();
    if(state.turn>0 && state.turn%3===0) openCheckpoint();
    if(state.mode==='council' && state.turn>=10) endScenario();
    else if(state.budget < Math.min(...Object.values(TOOL_DATA).map(t=>t.cost))) endScenario();
  }

  function undoMove() {
    const move=state.history.pop(); if(!move)return;
    state.grid[move.y][move.x].type=move.previous; state.budget=move.budget; state.turn=move.turn; state.year=move.year;
    state.ended=false;
    calculateMetrics(); updateUI(); drawCity(); showToast('Last move undone');
  }

  function endScenario() {
    if (state.ended) return;
    state.ended = true;
    const met = objectiveMet();
    const m = state.metrics, s0 = state.startMetrics;
    const delta = k => { const d = m[k]-s0[k]; return `${d>=0?'+':''}${d}`; };
    $('#summary-eyebrow').textContent = met ? 'Objective reached' : 'Scenario complete';
    $('#summary-title').textContent = met ? 'Your plan held together.' : 'The city has more work to do.';
    $('#summary-content').innerHTML = `
      <p class="summary-verdict ${met?'':'missed'}">${met
        ? `<strong>You met the scenario objective</strong> in ${state.turn} turns with $${state.budget}m left. But a score is not an argument — your reflection should explain <em>who</em> your plan served and who it left out.`
        : `<strong>The objective wasn't fully met.</strong> That's a legitimate result — real cities miss targets too. Your reflection should explain what constraint bound you: budget, land, politics, or time.`}</p>
      <div class="summary-metrics">
        <div><span>Affordability</span><b>${m.affordability}</b>${delta('affordability')} from start</div>
        <div><span>Housing supply</span><b>${m.supply}</b>${delta('supply')} from start</div>
        <div><span>Displacement risk</span><b>${m.displacement}</b>${delta('displacement')} from start</div>
        <div><span>Commute burden</span><b>${m.commute}</b>${delta('commute')} from start</div>
      </div>
      <p class="summary-verdict">${state.notebook.filter(n=>n.type==='Evidence').length} sources saved · ${state.notebook.filter(n=>n.type==='Decision').length} decisions logged · ${state.turn} planning moves</p>`;
    const modal = $('#summary-modal');
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false');
  }

  /* ============ Canvas rendering ============ */

  const canvas=$('#city-canvas'), ctx=canvas.getContext('2d');
  let geom={tileW:66,tileH:33,originX:500,originY:85};

  function resizeCanvas() {
    const wrap=canvas.parentElement; if(!wrap)return;
    const ratio=Math.min(window.devicePixelRatio||1,2); const rect=wrap.getBoundingClientRect();
    canvas.width=Math.max(620,Math.floor(rect.width*ratio)); canvas.height=Math.max(470,Math.floor(rect.height*ratio));
    canvas.style.width=`${rect.width}px`; canvas.style.height=`${rect.height}px`; ctx.setTransform(ratio,0,0,ratio,0,0);
    const cssW=rect.width, cssH=rect.height; geom.tileW=Math.min(72,cssW/(state.gridSize+2)); geom.tileH=geom.tileW/2; geom.originX=cssW/2; geom.originY=Math.max(76,cssH*.12);
    drawCity();
  }

  function isoPoint(x,y) { return { x:geom.originX+(x-y)*geom.tileW/2, y:geom.originY+(x+y)*geom.tileH/2 }; }

  function diamondPath(x,y) {
    const p=isoPoint(x,y), w=geom.tileW/2,h=geom.tileH/2;
    ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+w,p.y+h);ctx.lineTo(p.x,p.y+geom.tileH);ctx.lineTo(p.x-w,p.y+h);ctx.closePath();
  }

  function shade(hex, amt) { let c=hex.replace('#','');let n=parseInt(c,16),r=(n>>16)+amt,g=(n>>8&255)+amt,b=(n&255)+amt;return '#'+(0x1000000+(clamp(r,0,255)<<16)+(clamp(g,0,255)<<8)+clamp(b,0,255)).toString(16).slice(1); }

  function drawBuilding(tile,type,ghost=false) {
    const p=isoPoint(tile.x,tile.y), w=geom.tileW/2,h=geom.tileH/2; const data=TOOL_DATA[type];
    if (ghost) ctx.globalAlpha = .45;
    if(type==='transit') { ctx.strokeStyle=data.color;ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(p.x-w*.75,p.y+h*1.45);ctx.lineTo(p.x+w*.75,p.y+h*.55);ctx.stroke();ctx.lineWidth=2;ctx.strokeStyle='#dff3ee';ctx.stroke();ctx.globalAlpha=1;return; }
    if(type==='park') { ctx.fillStyle=data.color;ctx.beginPath();ctx.arc(p.x,p.y+h*.85,10,0,Math.PI*2);ctx.fill();ctx.fillStyle='#7a5c40';ctx.fillRect(p.x-2,p.y+h*.9,4,14);ctx.globalAlpha=1;return; }
    if(type==='tenant') { ctx.fillStyle=data.color;ctx.beginPath();ctx.arc(p.x,p.y+h*.75,14,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#0c1417';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#0c1417';ctx.font='bold 15px system-ui';ctx.textAlign='center';ctx.fillText('⚖',p.x,p.y+h*.95);ctx.globalAlpha=1;return; }
    if(type==='clear') { ctx.strokeStyle='#e06a4d';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(p.x-w*.4,p.y+h*.6);ctx.lineTo(p.x+w*.4,p.y+h*1.4);ctx.moveTo(p.x+w*.4,p.y+h*.6);ctx.lineTo(p.x-w*.4,p.y+h*1.4);ctx.stroke();ctx.globalAlpha=1;return; }
    const height= type==='student'?58:type==='workforce'?38:type==='mixed'?45:34;
    const bw= type==='student'?w*.75:w*.63; const bh=h*.75; const baseY=p.y+h*1.22;
    ctx.fillStyle=shade(data.color,-45);ctx.beginPath();ctx.moveTo(p.x-bw,baseY-height);ctx.lineTo(p.x,baseY-height+bh);ctx.lineTo(p.x,baseY+bh);ctx.lineTo(p.x-bw,baseY);ctx.closePath();ctx.fill();
    ctx.fillStyle=shade(data.color,-18);ctx.beginPath();ctx.moveTo(p.x,baseY-height+bh);ctx.lineTo(p.x+bw,baseY-height);ctx.lineTo(p.x+bw,baseY);ctx.lineTo(p.x,baseY+bh);ctx.closePath();ctx.fill();
    ctx.fillStyle=data.color;ctx.beginPath();ctx.moveTo(p.x-bw,baseY-height);ctx.lineTo(p.x,baseY-height-bh);ctx.lineTo(p.x+bw,baseY-height);ctx.lineTo(p.x,baseY-height+bh);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(8,14,16,.7)';ctx.lineWidth=1.2;ctx.stroke();
    ctx.fillStyle='rgba(255,240,190,.85)'; const floors=type==='student'?3:2;
    for(let f=0;f<floors;f++){for(let i=0;i<2;i++)ctx.fillRect(p.x-bw+8+i*13,baseY-height+11+f*12,7,7);}
    if(type==='energy'){ctx.strokeStyle='#e8f0ee';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x-11,p.y-8);ctx.lineTo(p.x+10,p.y-17);ctx.stroke();}
    ctx.globalAlpha = 1;
  }

  function drawCity() {
    if(!ctx)return; const rect=canvas.getBoundingClientRect();ctx.clearRect(0,0,rect.width,rect.height);
    ctx.save();
    const hc = document.body.classList.contains('high-contrast');
    const water=isoPoint(5,10);ctx.fillStyle='rgba(87,168,180,.28)';ctx.beginPath();ctx.ellipse(water.x,water.y+90,rect.width*.38,74,0,0,Math.PI*2);ctx.fill();
    for(let sum=0;sum<state.gridSize*2-1;sum++){
      for(let y=0;y<state.gridSize;y++){const x=sum-y;if(x<0||x>=state.gridSize)continue;const tile=state.grid[y][x];
        diamondPath(x,y);
        const selected=state.cursor.x===x&&state.cursor.y===y;
        const hovered=state.hover&&state.hover.x===x&&state.hover.y===y;
        ctx.fillStyle=selected?'#f0e3a0':hovered?'#3d565f':((x+y)%2?(hc?'#1c1c1c':'#22343b'):(hc?'#242424':'#283c44'));
        ctx.fill();
        ctx.strokeStyle=selected?'#55c26e':'rgba(140,175,180,.22)';ctx.lineWidth=selected?2.5:1;ctx.stroke();
        if(tile.type)drawBuilding(tile,tile.type);
        else if(hovered&&!selected&&state.selectedTool!=='clear')drawBuilding(tile,state.selectedTool,true);
        if(hovered&&tile.type&&state.selectedTool==='clear')drawBuilding(tile,'clear',true);
      }
    }
    ctx.restore();
  }

  function pointInDiamond(px,py,x,y) {
    const p=isoPoint(x,y), dx=Math.abs(px-p.x)/(geom.tileW/2), dy=Math.abs(py-(p.y+geom.tileH/2))/(geom.tileH/2); return dx+dy<=1;
  }

  function canvasCoords(e) { const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}; }

  function tileFromEvent(e) {
    const {x:px,y:py}=canvasCoords(e);
    for(let y=state.gridSize-1;y>=0;y--)for(let x=state.gridSize-1;x>=0;x--)if(pointInDiamond(px,py,x,y))return{x,y};
    return null;
  }

  /* ============ Checkpoints ============ */

  function openCheckpoint() {
    const source=SOURCES[state.turn%SOURCES.length]; $('#checkpoint-content').innerHTML=`<div class="checkpoint-fact">${source.fact}</div><p><strong>${source.title}</strong> · ${source.outlet}</p>`;
    $('#checkpoint-modal').dataset.sourceId=source.id; $('#checkpoint-modal').classList.add('is-open'); $('#checkpoint-modal').setAttribute('aria-hidden','false');
    setTimeout(()=>$('#checkpoint-response').focus(),50);
  }

  /* ============ Survey ============ */

  function renderSurvey() {
    const empty=$('#survey-empty'),chart=$('#survey-chart');
    if(!state.survey.length){empty.hidden=false;chart.innerHTML='';return;} empty.hidden=true;
    const counts={};state.survey.forEach(r=>counts[r.burden]=(counts[r.burden]||0)+1);const max=Math.max(...Object.values(counts));
    chart.innerHTML=Object.entries(counts).map(([label,count])=>`<div class="bar-row"><span>${escapeHTML(label)}</span><div class="bar-track"><div class="bar-fill" style="width:${count/max*100}%"></div></div><b>${count}</b></div>`).join('');
  }

  /* ============ Export ============ */

  function citySnapshotSVG() {
    const size=state.gridSize, cell=22, width=size*cell, height=size*cell;
    const rects=state.grid.flat().map(t=>`<rect x="${t.x*cell}" y="${t.y*cell}" width="${cell-2}" height="${cell-2}" rx="3" fill="${t.type?TOOL_DATA[t.type].color:'#e7e2d5'}"><title>Parcel ${t.x+1},${t.y+1}: ${t.type?TOOL_DATA[t.type].label:'Vacant'}</title></rect>`).join('');
    return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="City plan snapshot">${rects}</svg>`;
  }

  function reportHTML() {
    const reflections=[['Forces shaping affordability',$('#reflection-problem').value],['Unavoidable tradeoff',$('#reflection-tradeoff').value],['Evidence that changed my plan',$('#reflection-evidence').value],['Recommended next steps',$('#reflection-next').value]];
    const evidence=state.notebook.map(n=>`<li><strong>${escapeHTML(n.type)} — ${escapeHTML(n.title)}</strong><br>${escapeHTML(n.text)}</li>`).join('')||'<li>No saved evidence.</li>';
    const decisions=state.history.length;
    const surveySummary=state.survey.length?`${state.survey.length} anonymous peer response(s) collected during this session.`:'No peer survey responses collected.';
    return `<!doctype html><html><head><meta charset="utf-8"><title>Studentification Report</title><style>body{font-family:Arial,sans-serif;color:#152b2c;max-width:950px;margin:40px auto;padding:0 24px;line-height:1.5}h1{font-size:58px;line-height:.9;text-transform:uppercase;border-bottom:8px solid #55c26e;padding-bottom:16px}.meta{display:flex;gap:12px;flex-wrap:wrap}.meta span{border:2px solid #152b2c;padding:8px 12px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:22px}.map svg{max-width:420px;width:100%;background:#f4efe2;padding:15px}.metrics{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.metric{border:2px solid #152b2c;padding:12px}.metric b{font-size:36px;display:block}.reflection{border-left:8px solid #55c26e;padding:8px 15px;margin:15px 0}li{margin-bottom:13px}@media print{body{margin:0}.page{break-before:page}}</style></head><body><h1>Studentification</h1><p><strong>Oxford Housing Simulation · Student Report</strong></p><div class="meta"><span>Mode: ${MODE_DATA[state.mode].label}</span><span>Year ${state.year}</span><span>${decisions} planning moves</span><span>Budget remaining: $${state.budget}m</span><span>Objective ${objectiveMet()?'met':'not met'}</span></div><div class="grid"><section><h2>Final city indicators</h2><div class="metrics"><div class="metric"><b>${state.metrics.affordability}</b>Affordability</div><div class="metric"><b>${state.metrics.supply}</b>Housing supply</div><div class="metric"><b>${state.metrics.displacement}</b>Displacement risk</div><div class="metric"><b>${state.metrics.commute}</b>Commute burden</div></div></section><section class="map"><h2>City plan</h2>${citySnapshotSVG()}</section></div><section><h2>Reflection</h2>${reflections.map(([t,v])=>`<div class="reflection"><h3>${t}</h3><p>${escapeHTML(v)||'<em>No response entered.</em>'}</p></div>`).join('')}</section><section class="page"><h2>Evidence & decisions</h2><ol>${evidence}</ol><h2>Peer survey</h2><p>${surveySummary}</p></section><footer><p>Generated from the Studentification educational prototype. Source links are available in the in-game evidence library.</p></footer></body></html>`;
  }

  function downloadHTML() { const blob=new Blob([reportHTML()],{type:'text/html'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='studentification-report.html';a.click();URL.revokeObjectURL(a.href);showToast('HTML report downloaded'); }
  function printReport() { const w=window.open('','_blank');w.document.open();w.document.write(reportHTML());w.document.close();w.onload=()=>{w.focus();w.print();}; }

  /* ============ Events ============ */

  function initEvents() {
    $$('[data-screen-target]').forEach(b=>b.addEventListener('click',()=>{closeModals();showScreen(b.dataset.screenTarget);}));
    $$('[data-start-mode]').forEach(b=>b.addEventListener('click',()=>startMode(b.dataset.startMode)));
    $$('[data-panel-open]').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.panelOpen)));
    $$('.drawer-close').forEach(b=>b.addEventListener('click',closePanels));
    $$('.modal-close').forEach(b=>b.addEventListener('click',closeModals));

    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'){closePanels();closeModals();}
      if(state.screen==='game'&&document.activeElement===canvas){
        let moved=true;
        if(e.key==='ArrowLeft')state.cursor.x=Math.max(0,state.cursor.x-1);
        else if(e.key==='ArrowRight')state.cursor.x=Math.min(state.gridSize-1,state.cursor.x+1);
        else if(e.key==='ArrowUp')state.cursor.y=Math.max(0,state.cursor.y-1);
        else if(e.key==='ArrowDown')state.cursor.y=Math.min(state.gridSize-1,state.cursor.y+1);
        else moved=false;
        if(moved){e.preventDefault();drawCity();}
        if(e.key==='Enter'||e.key===' '){e.preventDefault();buildAt(state.cursor.x,state.cursor.y);}
      }
    });

    $$('.tool').forEach(b=>b.addEventListener('click',()=>setTool(b.dataset.tool)));
    $('#undo-button').addEventListener('click',undoMove);
    $('#end-scenario').addEventListener('click',endScenario);

    canvas.addEventListener('mousemove',e=>{
      const t=tileFromEvent(e);
      const changed = (t?.x!==state.hover?.x || t?.y!==state.hover?.y);
      state.hover=t;
      if(changed)drawCity();
    });
    canvas.addEventListener('mouseleave',()=>{state.hover=null;drawCity();});
    canvas.addEventListener('click',e=>{
      const t=tileFromEvent(e); if(!t)return;
      state.cursor=t; state.selectedTile=t;
      const tile=state.grid[t.y][t.x];
      $('#selected-tile').textContent=`Parcel ${t.x+1}, ${t.y+1} · ${tile.type?TOOL_DATA[tile.type].label:'vacant'}`;
      buildAt(t.x,t.y);
    });

    $('#save-decision').addEventListener('click',()=>{const val=$('#decision-note').value.trim();if(!val){showToast('Write a brief reason first');return;}addNotebook('Decision',`Turn ${state.turn}`,val);$('#decision-note').value='';});
    $('#open-checkpoint').addEventListener('click',openCheckpoint);
    $('#save-checkpoint').addEventListener('click',()=>{const val=$('#checkpoint-response').value.trim();const source=SOURCES.find(s=>s.id===$('#checkpoint-modal').dataset.sourceId);if(val)addNotebook('Checkpoint',source?.title||'Evidence checkpoint',val,source?.id);$('#checkpoint-response').value='';closeModals();});
    $('#source-list').addEventListener('click',e=>{const b=e.target.closest('[data-save-source]');if(!b)return;const s=SOURCES.find(x=>x.id===b.dataset.saveSource);addNotebook('Evidence',s.title,s.fact,s.id);});
    $$('.filter-chip').forEach(b=>b.addEventListener('click',()=>{$$('.filter-chip').forEach(x=>x.classList.remove('is-active'));b.classList.add('is-active');renderSources(b.dataset.sourceFilter);}));
    $('#notebook-items').addEventListener('click',e=>{const b=e.target.closest('[data-remove-note]');if(!b)return;state.notebook=state.notebook.filter(n=>n.id!==b.dataset.removeNote);updateNotebookCount();renderNotebook();saveLocal();});
    $('#survey-form').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget);state.survey.push({arrangement:fd.get('arrangement'),cost:fd.get('cost'),burden:fd.get('burden'),issues:fd.getAll('issues'),change:fd.get('change')});e.currentTarget.reset();renderSurvey();saveLocal();showToast('Anonymous response added to this session');});
    ['problem','tradeoff','evidence','next'].forEach(k=>$(`#reflection-${k}`).addEventListener('input',()=>{clearTimeout(initEvents.t);initEvents.t=setTimeout(saveLocal,600);}));
    $('#export-html').addEventListener('click',downloadHTML); $('#export-pdf').addEventListener('click',printReport); $('#export-print').addEventListener('click',printReport);

    $('#motion-toggle').addEventListener('click',e=>{
      const on=document.body.classList.toggle('reduce-motion');
      e.currentTarget.setAttribute('aria-pressed',String(on));
      const video=$('#hero-video');
      if(video){ on ? video.pause() : (state.screen==='landing' && video.play().catch(()=>{})); }
    });
    $('#contrast-toggle').addEventListener('click',e=>{document.body.classList.toggle('high-contrast');e.currentTarget.setAttribute('aria-pressed',String(document.body.classList.contains('high-contrast')));drawCity();});
    window.addEventListener('resize',()=>{if(state.screen==='game')resizeCanvas();});

    // Respect OS-level reduced motion for the hero video.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduce-motion');
      $('#motion-toggle').setAttribute('aria-pressed','true');
      $('#hero-video')?.pause();
    }
  }

  renderSources(); initGrid('ground'); initEvents(); loadLocal(); updateNotebookCount(); renderNotebook();
})();
