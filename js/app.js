document.addEventListener('DOMContentLoaded',function(){
var menuBtn=document.querySelector('.menu-btn');
var nav=document.querySelector('#nav');

if(!menuBtn||!nav)return;

menuBtn.addEventListener('click',function(){
var isOpen=menuBtn.getAttribute('aria-expanded')==='true';
var newState=isOpen?'false':'true';
menuBtn.setAttribute('aria-expanded',newState);
nav.classList.toggle('open',newState==='true');
});

nav.querySelectorAll('a').forEach(function(link){
link.addEventListener('click',function(){
menuBtn.setAttribute('aria-expanded','false');
nav.classList.remove('open');
});
});

document.addEventListener('keydown',function(e){
if(e.key==='Escape'&&menuBtn.getAttribute('aria-expanded')==='true'){
menuBtn.setAttribute('aria-expanded','false');
nav.classList.remove('open');
}
});
});
