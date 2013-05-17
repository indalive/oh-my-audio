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
// @require     https://github.com/fxb/javascript-last.fm-api/raw/master/lastfm.api.md5.js
// @require     https://raw.github.com/fxb/javascript-last.fm-api/master/lastfm.api.js
// @require     https://raw.github.com/skor-ru/oh-my-audio/master/oh-my-audio.common.js
// @require     https://raw.github.com/skor-ru/oh-my-audio/master/oh-my-audio.charts.js
// @require     https://raw.github.com/skor-ru/oh-my-audio/master/oh-my-audio.mp3.js
// @run-at      document-end
// ==/UserScript==

var page = new VKPage();

function init() {
    lfm_menu.create();
    update_all_audio();
    page.audio_menu_item(_("Show mp3 links"), update_all_audio);
}

page.change(init);
