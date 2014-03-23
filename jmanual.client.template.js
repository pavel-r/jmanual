var nextTip;
var beginTraining;
var closeTip;

(function(){

    var tips = @data@;
    function setCookie(cname,cvalue,exdays)
    {
	var d = new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	var expires = "expires="+d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    function getCookie(cname)
    {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++)
	{
	    var c = ca[i].trim();
	    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
	}
	return "";
    }

    beginTraining = function(){
	setCookie("jTipId", 0, 365);
	nextTip();
    }

    closeTip = function(){
        $("#tipContainer").html("");
	var idx = 1 * getCookie("jTipId");
	if(idx >= tips.length){
	    alert('End of training');
            setCookie("jTipId", 0, 365);  
	    return;
	}
	var tip = tips[idx];
	if(tip.trigger === 0){
	    nextTip();
	}
    }

    nextTip = function () {
	$("#tipContainer").html("");
        var nextTipId = 1 * getCookie("jTipId");
        if (nextTipId == null) {
            nextTipId = 0;
        }
        if(nextTipId >= tips.length){
            alert('End of training');
            setCookie("jTipId", 0, 365);  
	    return;
	}
        if (showTip(tips[nextTipId])){
            setCookie("jTipId", 1 + nextTipId, 365);
        }
    }


    function showTip(tip) {
	if (tip == null){
	    return false;
	}
	var selector = tip.selector;
	if(selector == ""){
	    $("#tipContainer").html(theTipTemplate({ left: "50%", top: "50%", msg: tip.msg, cssclass: "notriangle-msg"}));
	    return true;
	} else {
	    var firstFound = getElem(selector)[0];
	    
	    if(!firstFound){
		$("#tipContainer").html(theTipTemplate({ left: "50%", top: "50%", msg: "Cannot show next tip. Make sure you did all previous steps correctly", cssclass: "alert-msg"}));
		return false;
	    }

	    var el = firstFound.elem;
	    var position = (el == null ? null : $(el).offset());
	    position.top += firstFound.offs.top;
	    position.left += firstFound.offs.left;
	    position.top += 15;
	    var tipBox = theTipTemplate({ left: (position.left + "px"), top: (position.top + "px"), msg: tip.msg, cssclass: "triangle-isosceles top"});
	    $("#tipContainer").html(tipBox);
	    return true;
	}
    }

    function showClientPanel() {
		//Initialize templates
		clientPanelTemplate = window['JST']['admin/templates/client-panel-template.html'];
		theTipTemplate = window['JST']['admin/templates/tip-bubble-template.html'];

		//Create DOM elements
		$('body').append(clientPanelTemplate());
    }

    $(window).load(function () {
		//load css files
		var STYLES = [         // the css filenames
			"//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css",
			"//ancient-gorge-2130.herokuapp.com/admin/css/jmanual.admin.css"
		];
		var html = [];
		for (var i = 0; i < STYLES.length; i++) {
			html.push('<link href="');
			html.push(STYLES[i]);
			html.push('" type="text/css" rel="stylesheet"></link>\n');
		}
		$('head').append(html.join(''));
		
		//launch client app
		showClientPanel();
    });

    var clientPanelTemplate;
    var theTipTemplate;

})();
