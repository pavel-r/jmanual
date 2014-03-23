(function() {
    var SCRIPTS = [         // the script filenames, in dependency order
        "//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js",
        "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js",
        "//code.jquery.com/ui/1.10.4/jquery-ui.js",
        "//ancient-gorge-2130.herokuapp.com/admin/templates/templates.js",
        "//ancient-gorge-2130.herokuapp.com/admin/js/jmanual.utils.js",
        "//ancient-gorge-2130.herokuapp.com/client/js/jmanual.client.js"
    ];
    
    var html = [];
    
    for (var i = 0; i < SCRIPTS.length; i++) {
        html.push('<script type="text/javascript" src="');
        html.push(SCRIPTS[i]);
        html.push('"></script>\n');
    }
    document.write(html.join(''));
})();