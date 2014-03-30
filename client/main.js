this["JManual.UserId"] = @userId@;
this["JManual.Domain"] = @domain@;

(function() {
    var SCRIPTS = [         // the script filenames, in dependency order
        "//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js",
        "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js",
        "//code.jquery.com/ui/1.10.4/jquery-ui.js",
        @domain@ + "/admin/templates/templates.js",
        @domain@ + "/admin/js/jmanual.utils.js",
        @domain@ + "/client/js/jmanual.client.js"
    ];
    
    var html = [];
    
    for (var i = 0; i < SCRIPTS.length; i++) {
        html.push('<script type="text/javascript" src="');
        html.push(SCRIPTS[i]);
        html.push('"></script>\n');
    }
    document.write(html.join(''));
})();