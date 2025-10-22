const events = [
  { id:1, title:"ID Tetris", date:"2023-11-03", time:"All day", location:"Auditorium", desc:"All new students meet the staff and receive schedules."},
  { id:2, title:"Hour of Code", date:"2024-02-05", time:"All day", location:"Gym", desc:"Explore clubs and extracurriculars."},
  { id:3, title:"ID Scavenger Hunt", date:"2024-03-15", time:"All day", location:"Library", desc:"Meet teachers and discuss semester goals."},
  { id:4, title:"Annual Kennedy Transition Programme", date:"2024-04-29", time:"All day", location:"Various", desc:"Midterm exam period — check course schedules."},
  { id:5, title:"ID Minecraft", date:"2024-12-16", time:"All day", location:"Campus", desc:"Spirit days, parade, and the big game."},
  { id:6, title:"ID Dress to Impress", date:"2025-02-03", time:"Lunchtime (01:20-02:05pm)", location:"D700", desc:"Dress your best according to theme. https://docs.google.com/forms/d/e/1FAIpQLScFmWrGs6GOvxYfMSU17DY7inttPP9tHhiABIbM517dZK2WKQ/viewform?usp=dialog" },
  { id:7, title:"Annual Kennedy Transition Programme", date:"2025-05-06", time:"Lunchtime (01:20-02:05pm)", location:"D700", desc:"Yay we are going to KS" },
  { id:8, title:"Trial for upcoming", date:"2025-12-27", time:"5pm", location:"place", desc:"test"}
];

const timeline = document.getElementById('timeline');
const tpl = document.getElementById('event-template').content;
const search = document.getElementById('search');
const emptyEl = document.getElementById('empty');
const filters = document.querySelectorAll('.filters button');

const todayStr = () => new Date().toISOString().slice(0,10);
const fmt = d => new Date(d).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
const isFuture = d => new Date(d) > new Date(new Date().toDateString());

function render(list){
  timeline.innerHTML = '';
  emptyEl.hidden = !!list.length;
  list.sort((a,b)=>{
    const aFuture = isFuture(a.date), bFuture = isFuture(b.date);
    if(aFuture !== bFuture) return aFuture ? -1 : 1;
    return new Date(a.date) - new Date(b.date);
  });

  let lastMonth = '';
  for(const ev of list){
    const month = new Date(ev.date).toLocaleDateString(undefined,{month:'long',year:'numeric'});
    if(month !== lastMonth){
      const h = document.createElement('div');
      h.className = 'month'; h.textContent = month;
      timeline.appendChild(h);
      lastMonth = month;
    }
    const node = tpl.cloneNode(true);
    node.querySelector('.item-date').textContent = fmt(ev.date) + (ev.time ? ' · ' + ev.time : '');
    node.querySelector('.item-title').textContent = ev.title;
    node.querySelector('.item-meta').textContent = ev.location || '';

    const descEl = node.querySelector('.item-desc');
    descEl.textContent = '';
    if(ev.desc){
      const urlMatch = ev.desc.match(/https?:\/\/[^\s]+/);
      if(urlMatch){
        const url = urlMatch[0];
        const parts = ev.desc.split(url);
        if(parts[0]) descEl.appendChild(document.createTextNode(parts[0].trim() + ' '));
        const a = document.createElement('a');
        a.className = 'signup-btn';
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = 'Sign up';
        descEl.appendChild(a);
        if(parts[1]) descEl.appendChild(document.createTextNode(' ' + parts[1].trim()));
      } else {
        descEl.textContent = ev.desc;
      }
    }

    const art = node.querySelector('.timeline-item');
    art.classList.add(isFuture(ev.date) ? 'upcoming' : 'past');
    if(ev.date === todayStr()) art.classList.add('today');
    node.querySelector('.card').addEventListener('click', ()=> art.classList.toggle('expanded'));
    timeline.appendChild(node);
  }
}

function applyFilters(){
  const q = (search.value||'').trim().toLowerCase();
  const activeBtn = document.querySelector('.filters button.active');
  const active = activeBtn ? activeBtn.dataset.filter : 'upcoming';
  const out = events.filter(ev=>{
    if(active === 'upcoming' && !isFuture(ev.date)) return false;
    if(active === 'past' && isFuture(ev.date)) return false;
    if(!q) return true;
    return (ev.title + ' ' + (ev.desc||'') + ' ' + (ev.location||'')).toLowerCase().includes(q);
  });
  render(out);
}

search.addEventListener('input', ()=> requestAnimationFrame(applyFilters));
filters.forEach(b=> b.addEventListener('click', ()=>{
  filters.forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  applyFilters();
}));

// show "upcoming" by default
applyFilters();
