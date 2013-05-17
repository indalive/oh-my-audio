function VKPage() {
    this.change = function(fn) {
        function call() {
            setTimeout(fn, 1000);
        }
        var title = document.getElementById("title");
        if (title)
            title.addEventListener('DOMSubtreeModified', call);
    }
}
