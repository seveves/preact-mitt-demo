let scripts = [ '/dist/bundle.js' ];

scripts.forEach((src) => {
  const scriptEl = document.createElement('script');
  scriptEl.src = src;
  scriptEl.async = false;
  document.head.appendChild(scriptEl);
});
