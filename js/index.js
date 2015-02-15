var editor = ace.edit("editor");
var client = new ZeroClipboard($("#copy"));

//init editor
editor.setTheme("ace/theme/chrome");
editor.getSession().setMode("ace/mode/properties");

//read gitIgnore snippet data and set list;
(function () {
    $.get("data/snippetData.json").success(function (snippetList) {
        for (var idx = 0; idx < snippetList.length; idx++) {
            var snippet = snippetList[idx];
            var element = "<a  href=\"#\" class=\"list-group-item\"" +
                " data-filepath=\"" + snippet.path + "\">" + snippet.name + "</a>";
            $(".list-group").append(element);
        }
    });
})();


$(".list-group").on("click", "a", function () {
    var $this = $(this);

    if ($this.hasClass("active"))
        $this.removeClass("active");
    else
        $this.addClass("active");

    generateGitignore();
});

var generateGitignore = function () {
    var snippetList = $(".list-group > a.active");

    var result = [];
    for (var i = 0; i < snippetList.length; i++) {
        var $snippet = $(snippetList.get(i));
        //TODO 비동기 처리...ㅠㅜ
        var text = $.ajax({
            url: $snippet.attr("data-filepath"),
            async: false
        });
        result.push(text.responseText);
    }

    editor.setValue(result.join("\n\n"));
    editor.moveCursorTo(0, 0);
};


$("#searchSnippet").on("keyup", function () {
    var searchText = $(this).val();

    if (searchText != "") {
        var reg = new RegExp(searchText, "i");
        $(".list-group > a").each(function (idx, snippet) {
            var $snippet = $(snippet);
            var text = $snippet.text();

            if (text.search(reg) !== -1)
                $snippet.removeClass("hide");
            else
                $snippet.addClass("hide");
        });
    } else {
        $(".list-group > a").removeClass("hide");
    }
});

$("#deleteAll").on("click", function () {
    $("#searchSnippet").text("");
    $(".list-group > a").removeClass("active");
    $(".list-group > a").removeClass("hide");
});

//action for copy button
client.on("ready", function (readyEvent) {
    client.on('copy', function (event) {
        event.clipboardData.setData('text/plain', editor.getValue());
    });
    client.on("aftercopy", function (event) {
        console.log(editor.getValue());
        alert("Text copied to clipboard\nHappy programming! :)");
    });
});