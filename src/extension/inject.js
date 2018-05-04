// this is the code which will be injected into a given page...

(function() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "http://localhost:3000/build/bundle.js";
  document.head.appendChild(script);
})();
