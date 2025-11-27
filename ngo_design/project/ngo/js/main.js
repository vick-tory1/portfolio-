// Basic JS for smooth scrolling and simple contact form handling
document.querySelectorAll('a.nav-link, a[href^="#"]').forEach(function(el){
  el.addEventListener('click', function(e){
    var href = el.getAttribute('href');
    if(href && href.startsWith('#')){
      e.preventDefault();
      var target = document.querySelector(href);
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
      // collapse navbar on mobile if open
      var nav = document.querySelector('.navbar-collapse');
      if(nav && nav.classList.contains('show')){
        var bsCollapse = bootstrap.Collapse.getInstance(nav);
        if(!bsCollapse) bsCollapse = new bootstrap.Collapse(nav);
        bsCollapse.hide();
      }
    }
  });
});

// Tiny form submit handler (no server) - shows thank you message
var form = document.getElementById('contactForm');
if(form){
  form.addEventListener('submit', function(e){
    e.preventDefault();
    alert('Thanks — your message has been received.');
    form.reset();
  });
}
