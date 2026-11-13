/* Progressive guide interactions; the complete instructions work without JavaScript. */
(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const zh=document.documentElement.lang.startsWith('zh');
  document.querySelectorAll('[data-copy-target]').forEach(button=>button.addEventListener('click',async()=>{
    const target=document.getElementById(button.dataset.copyTarget);if(!target)return;
    let ok=false;
    try{await navigator.clipboard.writeText(target.textContent);ok=true;}catch{
      const field=document.createElement('textarea');field.value=target.textContent;field.style.cssText='position:fixed;left:-9999px';document.body.append(field);field.select();
      try{ok=document.execCommand('copy');}catch{}field.remove();button.focus({preventScroll:true});
    }
    const original=button.dataset.label||button.textContent;button.dataset.label=original;
    button.textContent=ok?(zh?'已复制':'Copied'):(zh?'请手动复制':'Select and copy');
    const status=button.closest('section')?.querySelector('.guide-copy-status')||document.querySelector('.guide-copy-status');
    if(status)status.textContent=ok?(zh?'内容已复制。':'Content copied.'):(zh?'复制未成功，请选中内容手动复制。':'Select the content and copy it manually.');
    clearTimeout(button._reset);button._reset=setTimeout(()=>{button.textContent=original;},2200);
  }));
  const links=[...document.querySelectorAll('.guide-toc a[href^="#"]')];
  const sections=links.map(a=>document.getElementById(a.hash.slice(1))).filter(Boolean);
  let queued=false;
  function update(){queued=false;const offset=document.querySelector(".guide-nav").offsetHeight+24;document.documentElement.style.setProperty("--guide-offset",`${offset}px`);const bar=document.querySelector(".guide-progress span");if(bar)bar.style.transform=`scaleX(${scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)})`;let active=sections[0];for(const section of sections){if(section.getBoundingClientRect().top<=offset+8)active=section;}links.forEach(link=>{if(active&&link.hash==='#'+active.id)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});}
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update);}}, {passive:true});addEventListener('resize',update);update();
  document.querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>{
    if(!detail.open||reduced.matches)return;(detail.querySelector(':scope>div')||detail.querySelector(':scope>p'))?.animate([{opacity:.35,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:280,easing:'cubic-bezier(.16,1,.3,1)'});
  }));
  const hero=document.querySelector('.guide-hero');if(hero&&!reduced.matches)hero.animate([{opacity:.4,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:650,easing:'cubic-bezier(.16,1,.3,1)'});
})();

// Screens remain ordinary image links without JavaScript.
(() => {
  const links = [...document.querySelectorAll('[data-guide-image]')];
  if (!links.length || typeof HTMLDialogElement === 'undefined') return;
  const dialog = document.createElement('dialog');
  dialog.className = 'guide-zoom';
  const close = document.createElement('button'); close.type = 'button';
  close.textContent = document.documentElement.lang.startsWith('zh') ? '关闭 ×' : 'Close ×';
  const img = document.createElement('img'); img.alt = ''; dialog.append(close,img); document.body.append(dialog);
  let opener;
  const restore = () => { document.body.style.overflow=''; opener?.focus({preventScroll:true}); };
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  dialog.addEventListener('close',restore);
  links.forEach(link=>link.addEventListener('click',e=>{
    if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    e.preventDefault();opener=link;img.src=link.href;img.alt=link.querySelector('img').alt;
    dialog.setAttribute('aria-label',img.alt);dialog.showModal();document.body.style.overflow='hidden';close.focus();
  }));
  function revealHash(){const target=document.getElementById(location.hash.slice(1));if(!target)return;let p=target.parentElement;while(p){if(p.tagName==='DETAILS')p.open=true;p=p.parentElement;}requestAnimationFrame(()=>target.scrollIntoView());}
  addEventListener('hashchange',revealHash);if(location.hash)revealHash();
})();
