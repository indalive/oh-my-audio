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

function lang() {
    switch ($("#myprofile").text()) {
    case "Моя Страница":
    case "Мой Паспортъ":
    case "Мое Досье":  return "ru";
    case "Моя Cторінка": return "ua";
    default: return "en";
    }
}

dictionary = {};

function _(what) {
    return (dictionary[what] && dictionary[what][lang()]) ?
        dictionary[what][lang()] : what;
}
