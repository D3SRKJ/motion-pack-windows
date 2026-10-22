(function(){var M=window.MP||{};
  document.querySelectorAll('[data-buy]').forEach(function(a){
    if(M.buyUrl){a.href=M.buyUrl;a.removeAttribute('target');}
    else if(a.dataset.buy==='checkout'){a.setAttribute('aria-disabled','true');a.textContent='Checkout opens soon';}
  });
  document.querySelectorAll('[data-price]').forEach(function(e){if(M.price)e.textContent=M.price;else e.closest('[data-price-wrap]')&&(e.closest('[data-price-wrap]').hidden=true)});
  document.querySelectorAll('[data-mail]').forEach(function(e){if(M.contact)e.textContent=M.contact;else e.closest('[data-mail-wrap]')&&(e.closest('[data-mail-wrap]').hidden=true)});
  var y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();
  var lb=document.getElementById('lb');
  if(lb){var li=lb.querySelector('img');document.querySelectorAll('[data-full]').forEach(function(b){b.addEventListener('click',function(){li.src=b.dataset.full;li.alt=b.querySelector('img').alt;lb.hidden=false})});
    lb.addEventListener('click',function(){lb.hidden=true});document.addEventListener('keydown',function(e){if(e.key==='Escape')lb.hidden=true})}
  // play reel videos only while on screen (saves battery on phones)
  var vs=[].slice.call(document.querySelectorAll('video[data-auto]'));
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var p=e.target.play();p&&p.catch&&p.catch(function(){})}else e.target.pause()})},{threshold:.2});vs.forEach(function(v){io.observe(v)})}
})();
