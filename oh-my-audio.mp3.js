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

dictionary["Show mp3 links"] = {
    "ru": "Показать ссылки mp3",
    "ua": "Показать ссылки mp3",
};
