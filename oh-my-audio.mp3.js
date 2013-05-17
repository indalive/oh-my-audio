// ==UserScript==
// @name        oh-my-audio.mp3
// @author   	Alexander Korkov
// @description mp3 links for vk.com/audio
// @include   	http://vk.com/*
// @copyright   2013+, Alexander Korkov korkov@yandex.ru
// @namespace   http://vk.com/*
// @version     1.0
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require     https://raw.github.com/skor-ru/oh-my-audio/master/oh-my-audio.common.js
// @run-at      document-end
// ==/UserScript==

var img_data = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAMFBMVEWascb///9ffZ3///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXBOJ8AAAAAWJLR0QAiAUdSAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB90FEQ0VLqGKYlMAAAA4SURBVAjXYzBQAgNmBiYIQ4FBCQpADEFBKANTBMYQFASxkBmKgoJCaIoVhVDNUQQpFlJCWApzBgBDTA7y2SUcVwAAAABJRU5ErkJggg==";

function update_audio(div) {
    var mp3 = div.find("input").val().split(",")[0];
    var title = $.trim(div.find(".title_wrap").text());

    var a = $("<a>", {
        href: mp3,
        target: "_blank",
        title: title,
        class: "play_btn_wrap fl_l",
        style: "padding-left: 0px; padding-right: 0px;",
    }).append($("<img>", {src: img_data}));

    div.find(".info").before(a);
    div.find(".title_wrap b").css("padding-left", "10px");
    div.find(".info").css("width", "370px");
}

function update_all_audio() {
    $(".audio").each(function() {
        update_audio($(this));
    });
}

update_all_audio();
var page = new VKPage();
page.change(update_all_audio);
