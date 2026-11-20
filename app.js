const one = s => document.querySelector(s);
const all = s => Array.from(document.querySelectorAll(s));
const dialog = one('dialog');
all('[data-img]').forEach(button => button.onclick = () => {
  one('#expanded').src = button.dataset.img;
  one('#caption').textContent = one('#expanded').alt = button.querySelector('strong').textContent;
  one('.imagebox').classList.remove('zoom');
  one('#zoom').textContent = 'Actual size';
  dialog.showModal();
});
one('#close').onclick = () => dialog.close();
one('#zoom').onclick = () => {
  one('#zoom').textContent = one('.imagebox').classList.toggle('zoom') ? 'Fit to screen' : 'Actual size';
};
dialog.onclick = e => { if(e.target === dialog) dialog.close() };
const metrics = {Clicks:[7770,26573], Impressions:[36425,557162]};
function plot(key) {
  const values = metrics[key];
  const dates = ['Apr 17 to Jul 15, 2026','Aug 20 to Nov 17, 2026'];
  one('#plot').innerHTML = values.map((v,i) => '<div class="barline"><div class="row"><span>'+dates[i]+'</span><b>'+v.toLocaleString('en-US')+' '+key.toLowerCase()+'</b></div><i aria-hidden="true" style="width:'+100*v/values[1]+'%"></i></div>').join('');
  all('[data-metric]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.metric===key)));
}
if(one('#plot')) {
  plot('Clicks');
  all('[data-metric]').forEach(b=>b.onclick=()=>plot(b.dataset.metric));
}
all('[data-view]').forEach(button=>button.onclick=()=>all('[data-view]').forEach(b=>{
  b.setAttribute('aria-pressed',String(b===button));
  one('#'+b.dataset.view).hidden = b!==button;
}));
if(one('#edit')){
  const cols=all('.road');
  const key='ana-rajic-private-roadmap-v3';
  function show(col,items){
    col.querySelector('ul').replaceChildren(...items.map(item=>{
      const li=document.createElement('li'); li.textContent=item; return li;
    }));
  }
  try {
    const data=JSON.parse(localStorage.getItem(key));
    if(Array.isArray(data)&&data.length===3&&data.every(c=>Array.isArray(c)&&c.every(x=>typeof x==='string')))cols.forEach((c,i)=>show(c,data[i]));
  } catch {}
  function end(){
    cols.forEach(c=>{c.querySelector('textarea')?.remove();c.querySelector('ul').hidden=false});
    one('#edit').textContent='Edit roadmap';one('#cancel').hidden=true;
  }
  one('#cancel').onclick=end;
  one('#edit').onclick=()=>{
    if(one('#cancel').hidden){
      cols.forEach(c=>{
        const area=document.createElement('textarea');
        area.setAttribute('aria-label',c.querySelector('h3').textContent+' priorities, one per line');
        area.value=[...c.querySelectorAll('li')].map(li=>li.textContent).join('\n');
        c.append(area);c.querySelector('ul').hidden=true;
      });
      one('#status').textContent='One priority per line.';
      one('#edit').textContent='Save edits';one('#cancel').hidden=false;cols[0].querySelector('textarea').focus();
    } else {
      const data=cols.map(c=>c.querySelector('textarea').value.split('\n').map(s=>s.trim()).filter(Boolean));
      cols.forEach((c,i)=>show(c,data[i]));
      try{localStorage.setItem(key,JSON.stringify(data));one('#status').textContent='Saved in this browser.'}catch{one('#status').textContent='Updated for this visit.'}
      end();
    }
  };
}
