// ==UserScript==
// @name        oh-my-audio.mp3
// @author   	Alexander Korkov
// @description Mp3 links for vk.com/audio
// @include   	http://vk.com/*
// @copyright   2013+, Alexander Korkov korkov@yandex.ru
// @namespace   http://vk.com/*
// @version     1.0
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @run-at      document-end
// ==/UserScript==

var image='<img src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Njk0ODU1QUI0MEFGMTFFMjk5QzdCMTFCNDZFMEE1RTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Njk0ODU1QUM0MEFGMTFFMjk5QzdCMTFCNDZFMEE1RTAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2OTQ4NTVBOTQwQUYxMUUyOTlDN0IxMUI0NkUwQTVFMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2OTQ4NTVBQTQwQUYxMUUyOTlDN0IxMUI0NkUwQTVFMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Psmg/HQAAACVSURBVHjaYmQAglkbj7EePXP9FwPx4Je1iaYIkP7MBNTMTKJmEGAD6vkEpLmYhVSt/jGQCR4/e1PNgktyQVMSCj+hbh5WdUwMFIKBN4CFkN/RxdHDAsMFuAILlxwTsQpJjgVkDfhcxYIvgPBpxGoArgDEZzALqTZihAEwV5GdFoB62ZiAueo/kMFOhmaxVD/L3wABBgCr9TPyrhjYyQAAAABJRU5ErkJggg=="/>';

function update_audio(div) {
    console.log("update_audio");

    var mp3 = div.find("input").val().split(",")[0];
    var artist = div.find(".info a").text();
    var title = div.find(".title").text();
    artist = $.trim(artist);
    title = $.trim(title);

    var a = $("<a>", {
        href: mp3,
        target: "_blank",
        title: artist + " - " + title,
        class: "play_btn_wrap fl_l",
        style: "padding-left: 0px; padding-right: 0px;",
    });
    a.append($(image));

    a.insertBefore(div.find(".info"));

    div.find(".title_wrap b").each(function() {
        this.style.paddingLeft="10px";
    });
    div.find(".info").each(function() {
        this.style.width="370px";
    });
}

function update_all_audio() {
    $(".audio").each(function() {
        update_audio($(this));
    });
}

function VKPage() {
    this.change = function(fn) {
        var title = document.getElementById("title");
        if (title)
            title.addEventListener('DOMSubtreeModified', fn);
    }
}

update_all_audio();
var page = new VKPage();
page.change(update_all_audio);
