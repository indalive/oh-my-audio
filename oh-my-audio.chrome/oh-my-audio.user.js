// ==UserScript==
// @name        Oh My Audio!
// @author   	Alexander Korkov
// @description Cosmic extensions for vk.com/audio
// @include   	http://vk.com/*
// @copyright   2013+, Alexander Korkov korkov@yandex.ru
// @namespace   http://vk.com/*
// @version     1.0
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require     https://raw.github.com/fxb/javascript-last.fm-api/master/lastfm.api.md5.js
// @require     https://raw.github.com/fxb/javascript-last.fm-api/master/lastfm.api.js
// @run-at      document-end
// ==/UserScript==

(function () {

    var app = "oh-my-audio:";

    function require_object(name) {
        if (!eval(name))
            throw name + " undefined";
    }

    require_object("window.nav");
    require_object("window.Audio");

    console.debug(app, "loading Oh My Audio!");

    function VKPage() {

        this.change = function(fn) {
            var go = window.nav.go;
            window.nav.go = function() {
                var opts = arguments[2];
                var prev = opts.onDone;
                opts.onDone = function() {
                    fn();
                    if (prev)
                        return prev.apply(this, arguments);
                    return false;
                };
                return go.apply(this, arguments);
            };
        }

        this.audio_menu_item = function(desc, fn) {
            var d = $('<div>', {
                mouseout:  function() { if (Audio.listOut)  Audio.listOut(this); },
                mouseover: function() { if (Audio.listOver) Audio.listOver(this); },
                class: "audio_filter",
            }).append($("<div>", {
                class: "label",
                text: desc,
            }));

            function onclick() {
                fn();
                $("#album_filters").children().removeClass("selected");
                d.addClass("selected");
            }
            d.click(onclick);

            return d;
        }

        this.append_to_main_menu = function(item) {
            $("#album_filters").append(item);
        }

        this.append_to_search = function(item) {
            $("#audio_search").append(item);
        }

        this.button = function(desc, fn) {
            var d = $("<div>", { class: "button_blue fl_l" });
            d.append($("<button>", { text: desc, click: fn }));
            return d;
        }
    }

    dictionary = {};

    function _(what) {
        function lang() {
            switch ($("#myprofile").text()) {
            case "\u041C\u043E\u044F\u0020\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430": // Моя Страница
            case "\u041C\u043E\u0439\u0020\u041F\u0430\u0441\u043F\u043E\u0440\u0442\u044A": // Мой Паспортъ
            case "\u041C\u043E\u0435\u0020\u0414\u043E\u0441\u044C\u0435": // Мое Досье
                return "ru";
            case "\u041C\u043E\u044F\u0020\u0043\u0442\u043E\u0440\u0456\u043D\u043A\u0430": // Моя Cторінка
                return "ua";
            default: return "en";
            }
        }

        return (dictionary[what] && dictionary[what][lang()]) ?
            dictionary[what][lang()] : what;
    }

    var lfm_api = new function() {
        var lastfm = undefined;
        lastfm = new LastFM({apiKey : '489c0d6832706e11fec663cbdf5bccad', });

        function opts() {
            return {
                autocorrect: 1,
                limit: 20,
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
        function query_string(lfm_track) {
            return lfm_track.artist.name + ' - ' + lfm_track.name;
        }

        var list = "#initial_list";

        function clear(size) {
            var to_hide = [
                "#audio_friends",
                "#audio_search_filters",
                "#audio_search_info",
                "#audio_popular_filters",
                "#more_link",
                "#s_more_link"
            ];
            to_hide.forEach(function(elem) { $(elem).hide(); });

            $("#s_search").val("");
            $("#search_list").empty();
            $(list).empty();
            $("#audios_list").append($("<div>", {
                style: "height: 400px;",
                text: " ",
            }));
        }

        function create_fake(tracks) {
            $(list).empty();
            tracks.forEach(function(val) {
                $(list).append($("<div>"));
            });
        }

        function set_on_position(vk_track, position) {
            var audio_div = $($(list).children()[position]);
            audio_div.replaceWith(vk_track);
        }

        function search(lfm_track, ready_fn) {
            var query = {
                act: 'search', q: query_string(lfm_track),
                offset: 0, id: 0, gid: 0, performer: 0
            };

            ajax.post(Audio.address, query, {
                onDone: function(res, preload, options) {
                    var tracks = $(res);
                    if (tracks.length)
                        ready_fn(tracks[0]);
                },
                onFail: function() {
                    console.warn("oh-my-audio:", "Audio request failed");
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

    function ChartsMenu(vk_page) {

        this.create_menu = function() {
            var items = [
                vk_page.audio_menu_item(_("Popular on last.fm"), vk_audio.loader(lfm_api.top)),
                vk_page.audio_menu_item(_("Loved on last.fm"), vk_audio.loader(lfm_api.loved)),
                vk_page.audio_menu_item(_("Hyped on last.fm"), vk_audio.loader(lfm_api.hyped)),
            ];
            items.forEach(function(item) { vk_page.append_to_main_menu(item); });
        }
    };

    dictionary["Popular on last.fm"] = {
        "ru": "\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u043E\u0435\u0020\u043D\u0430\u0020\u006C\u0061\u0073\u0074\u002E\u0066\u006D", // Популярное на last.fm
        "ua": "\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u043E\u0435\u0020\u043D\u0430\u0020\u006C\u0061\u0073\u0074\u002E\u0066\u006D", // Популярное на last.fm
    };
    dictionary["Loved on last.fm"] = {
        "ru": "\u041B\u044E\u0431\u0438\u043C\u043E\u0435\u0020\u043D\u0430\u0020\u006C\u0061\u0073\u0074\u002E\u0066\u006D", // Любимое на last.fm
        "ua": "\u041B\u044E\u0431\u0438\u043C\u043E\u0435\u0020\u043D\u0430\u0020\u006C\u0061\u0073\u0074\u002E\u0066\u006D", // Любимое на last.fm
    };
    dictionary["Hyped on last.fm"] = {
        "ru": "\u041D\u0430\u0431\u0438\u0440\u0430\u0435\u0442\u0020\u043F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u043E\u0441\u0442\u044C\u0020\u043D\u0430\u0020\u006C\u0061\u0073\u0074\u002E\u0066\u006D", // Набирает популярность на last.fm
        "ua": "\u041D\u0430\u0431\u0438\u0440\u0430\u0435\u0442\u0020\u043F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u043E\u0441\u0442\u044C\u0020\u043D\u0430\u0020\u006C\u0061\u0073\u0074\u002E\u0066\u006D", // Набирает популярность на last.fm
    };

    function audio_info(div) {
        var mp3 = div.find("input").val().split(",")[0];
        var artist = $.trim(div.find(".title_wrap b").text());
        var title = $.trim(div.find(".title").text());
        return { artist: artist, title: title, mp3: mp3 };
    }

    function Mp3Filter() {

        function update_audio(div) {

            if (div.find(".oh-my-audio-mp3").length && div.find("input").length)
                return;

            var info = audio_info(div);

            var img_data = "data:image/gif;base64,\
R0lGODdhEAAQAOMBAJqxxv///199nf///wAAAAAAAAAAAA\
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwAAAAAEAAQ\
AAAEJzAAQaulQN5dJ/9bIAZgCY6kiZboyrXj2aqxKYh2fs\
O14NmZHygTAQA7";

            if (window.location.pathname == "/audio")
                div.find(".info").css("width", "375px");

            div.find(".title_wrap b").css("padding-left", "10px");

            var a = $("<a>", {
                href: info.mp3,
                target: "_blank",
                title: info.artist + " - " + info.title,
                class: "play_btn_wrap fl_l oh-my-audio-mp3",
                style: "padding-left: 0px; padding-right: 0px;",
            });

            a.append($("<img>", {src: img_data}));
            div.find(".info").before(a);
        }

        this.apply = function() {
            $(".audio").each(function() {
                try {
                    update_audio($(this));
                }
                catch (e) {
                }
            });
        }
    };

    function ExactSearchFilter() {

        function active() {
            return $(".oh-my-audio-exact-search").attr("checked") && $("#s_search").val();
        }

        this.apply = function() {
            if (!active())
                return;

            var s = $.trim($("#s_search").val()).toLowerCase();

            $(".audio").each(function() {
                var info = audio_info($(this));
                var a = info.artist.toLowerCase();
                var t =  info.title.toLowerCase();
                if ((s != a) && (s != t))
                    $(this).remove();
            });
        }

        dictionary["exact search"] = {
            "ru": "\u0442\u043E\u0447\u043D\u044B\u0439\u0020\u043F\u043E\u0438\u0441\u043A", // точный поиск
            "ua": "\u0442\u043E\u0447\u043D\u044B\u0439\u0020\u043F\u043E\u0438\u0441\u043A", // точный поиск
        };
    };

    function VKCheckBox(div, opts) {
        this.div = div;

        this.checkbox = $("<input>", {
            class: "oh-my-audio-exact-search",
            type: "checkbox",
            style: "margin-right: 6px;",
            click: opts.click,
        });

        this.text = $("<span>", { text: opts.text });

        this.div.append(this.checkbox);
        this.div.append(this.text);
    }

    var filters = [new ExactSearchFilter(), new Mp3Filter()];
    function apply_filters() {
        filters.forEach(function(f) { f.apply(); });
    }

    var vk_page = new VKPage();
    var charts_menu = new ChartsMenu(vk_page);

    function create_elements() {
        var div = $("<div>");
        new VKCheckBox(div, {
            text: _("exact search"),
            click: function() {
                if (!this.checked)
                    Audio.searchAudios($("#s_search").val(), "all");
                else
                    apply_filters();
            },
        });
        $("#audio_search_filters").append(div);

        charts_menu.create_menu();
    }

    create_elements();
    vk_page.change(create_elements);
    setInterval(apply_filters, 1000);
})();
