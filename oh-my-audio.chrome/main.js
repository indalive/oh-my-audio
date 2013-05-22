function inject(src) {
    var s = document.createElement('script');
    s.src = src;
    (document.head||document.documentElement).appendChild(s);
    s.onload = function() {
        s.parentNode.removeChild(s);
    };
}

var scripts = [ "jquery.min.js", "lastfm.api.md5.js", "lastfm.api.js", "oh-my-audio.user.js" ];
scripts.forEach(function(sc) {
    inject(chrome.extension.getURL(sc));
});
