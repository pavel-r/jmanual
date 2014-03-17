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
	var firstFound = getElem(tip.selector)[0];
	
	if(firstFound == null){
	    alert("Element not found");
	    return false;
	}

	var el = firstFound.elem;
	var position = (el == null ? null : $(el).offset());
	position.top += firstFound.offs.top;
	position.left += firstFound.offs.left;
	position.top += 15;
	var tipBox = theTipTemplate({ left: position.left, top: position.top, msg: tip.msg });
	$("#tipContainer").html(tipBox);
	return true;
    }

    function showClientPanel() {
	//Initialize templates
	clientPanelTemplate = window['JST']['admin/templates/client-panel-template.html'];
	theTipTemplate = window['JST']['admin/templates/tip-bubble-template.html'];

	//Create DOM elements
	$('body').append(clientPanelTemplate());
    }

    $(window).load(function () {
	showClientPanel();
    });

    var clientPanelTemplate;
    var theTipTemplate;

})();
