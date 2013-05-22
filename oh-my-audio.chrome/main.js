function inject(src) {
    var s = document.createElement('script');
    s.src = src;
    (document.head||document.documentElement).appendChild(s);
    s.onload = function() {
        s.parentNode.removeChild(s);
    };
}

var scripts = [ "lib/jquery.min.js", "lib/lastfm.api.md5.js", "lib/lastfm.api.js", "oh-my-audio.user.js" ];
scripts.forEach(function(sc) {
    inject(chrome.extension.getURL(sc));
});
