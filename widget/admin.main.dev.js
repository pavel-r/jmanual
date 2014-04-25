this["JManual.UserId"] = "@userId@";
this["JManual.Domain"] = "@domain@";

(function() {
	var SCRIPTS = [         // the script filenames, in dependency order
        "<script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js'></script>\n",
		"<script type='text/javascript' src='//code.jquery.com/ui/1.10.4/jquery-ui.js'></script>\n",
		"<script type='text/javascript'>$jm = jQuery.noConflict(true);</script>\n",
        "<script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js'></script>\n",
        "<script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js'></script>\n",
		"<script type='text/javascript'>Backbone.$ = $jm;</script>\n",
		"<script type='text/javascript' src='"+ window["JManual.Domain"] + "/app/jmanual.common.core.js" + "'></script>\n",
        "<script type='text/javascript' src='" + window["JManual.Domain"] + "/app/jmanual.common.utils.js" + "'></script>\n",
        "<script type='text/javascript' src='" + window["JManual.Domain"] + "/app/jmanual.admin.templates.js" + "'></script>\n",
        "<script type='text/javascript' src='" + window["JManual.Domain"] + "/app/jmanual.admin.app.js" + "'></script>\n"
    ];
    var html = [];
    for (var i = 0; i < SCRIPTS.length; i++) {
        html.push(SCRIPTS[i]);
    }
    document.write(html.join(''));
})();