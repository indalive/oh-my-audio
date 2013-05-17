// ==UserScript==
// @name        oh-my-audio.charts
// @author   	Alexander Korkov
// @description last.fm charts for vk.com/audio
// @include   	http://vk.com/*
// @copyright   2013+, Alexander Korkov korkov@yandex.ru
// @namespace   http://vk.com/*
// @version     1.0
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require     https://github.com/fxb/javascript-last.fm-api/raw/master/lastfm.api.md5.js
// @require     https://raw.github.com/fxb/javascript-last.fm-api/master/lastfm.api.js
// @require     https://raw.github.com/skor-ru/oh-my-audio/master/oh-my-audio.common.js
// @run-at      document-end
// ==/UserScript==

var lfm_api = new function() {
    var lastfm = new LastFM({
        apiKey : '489c0d6832706e11fec663cbdf5bccad',
    });

    function opts() {
        return {
            autocorrect: 1,
            limit: 20
        };
    }
    function callbacks(fn) {
        return {
            success: function(data) { fn(data.tracks.track); },
            error: function(code, message) { console.log(code, message); }
        }
    }

    this.top = function(fn) {
        lastfm.chart.getTopTracks(opts(), null, callbacks(fn));
    };
    this.loved = function(fn) {
        lastfm.chart.getLovedTracks(opts(), null, callbacks(fn));
    }
    this.hyped = function(fn) {
        lastfm.chart.getHypedTracks(opts(), null, callbacks(fn));
    }
};

var vk_audio = new function() {
    var id = "#audios_list";

    function query_string(lfm_track) {
        return lfm_track.artist.name + ' - ' + lfm_track.name;
    }

    function clear(size) {
        $(id).empty();
        $(id).append($("<div>", {
            style: "height: 400px;",
            text: " ",
        }));
    }

    function create_fake(tracks) {
        $(id).empty();
        tracks.forEach(function(val) {
            $(id).append($("<div>"));
        });
    }

    function set_on_position(vk_track, position) {
        var audio_div = $($(id).children()[position]);
        audio_div.replaceWith(vk_track);
    }

    function search(lfm_track, ready_fn) {
        var query = {act: 'search', q: query_string(lfm_track), offset: 0, id: 0, gid: 0, performer: 0};

        ajax.post(Audio.address, query, {
            onDone: function(res, preload, options) {
                var tracks = $(res);
                if (tracks.length)
                    ready_fn(tracks[0]);
            },
            onFail: function() {
                console.log("vk Audio fail");
            }
        });
    }

    var interval_id = undefined;

    function stop_search() {
        if (interval_id) {
            clearInterval(interval_id);
            interval_id = undefined;
        }
    }

    function start_search(queue) {
        stop_search();

        queue.forEach(function(val, idx) {
            val.position = idx;
        });

        interval_id = setInterval(function(){
            if (queue.length == 0) {
                stop_search();
                return;
            }

            function remove_from_queue(track) {
                var idx = queue.indexOf(track);
                if (~idx)
                    queue.splice(idx, 1);
            }

            var track = queue[0];
            remove_from_queue(track);
            search(track, function(element) {
                set_on_position(element, track.position);
            });
        }, 300);
    }

    this.loader = function(fn) {
        return function() {
            clear();

            fn(function(tracks) {
                create_fake(tracks);
                start_search(tracks);
            });
        };
    };
};

var lfm_menu = new function() {
    var menu_id = "#album_filters";

    function menu_item(desc, fn) {
        var d = $('<div>', {
            mouseout:  function() { if (Audio.listOut)  Audio.listOut(this); },
            mouseover: function() { if (Audio.listOver) Audio.listOver(this); },
            class: "audio_filter",
            click: fn,
        }).append($("<div>", {
            class: "label",
            text: desc,
        }));

        return d;
    }

    this.create = function() {
        var items = [
            menu_item(_("Popular on last.fm"), vk_audio.loader(lfm_api.top)),
            menu_item(_("Loved on last.fm"), vk_audio.loader(lfm_api.loved)),
            menu_item(_("Hyped on last.fm"), vk_audio.loader(lfm_api.hyped)),
        ];
        var menu = $(menu_id);
        items.forEach(function(item){ menu.append(item) });
    }
};

dictionary["Popular on last.fm"] = {
    "ru": "Популярное на last.fm",
    "ua": "Популярное на last.fm",
};
dictionary["Loved on last.fm"] = {
    "ru": "Любимое на last.fm",
    "ua": "Любимое на last.fm",
};
dictionary["Hyped on last.fm"] = {
    "ru": "Набирает популярность на last.fm",
    "ua": "Набирает популярность на last.fm",
};
