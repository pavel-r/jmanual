var nextTip;
var beginTraining;

(function(){

var tips = [{"selector":"#menu","msg":"Menu","id":"2fa52c89-efe9-1ce2-219e-cbf804f3ee2a"},{"selector":"#footer","msg":"Footer 2","id":"fcc9e32c-4fa2-d176-3c01-6ea22eb3ee04"}];

beginTraining = function(){
	$.cookie("jTipId", 0, { expires: 365 });
	nextTip();
}

nextTip = function () {
        var nextTipId = 1 * $.cookie("jTipId");
        if (nextTipId == null) {
            nextTipId = 0;
        }
        if (showTip(nextTipId)){
            $.cookie("jTipId", 1 + nextTipId, { expires: 365 });
        } else {
            alert('End of training');
            $("#tipContainer").html("");
            $.cookie("jTipId", 0, { expires: 365 });
        }
}

function showTip(idx) {
    if (tips[idx] == null)
		return false;
	
    var tip = tips[idx];
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
	clientPanelTemplate = _.template($('#client-panel-template').html());
	theTipTemplate = _.template($('#tip-bubble-template').html());

	//Create DOM elements
	$('body').append(clientPanelTemplate());
}

$(window).load(function () {
    showClientPanel();
});

var clientPanelTemplate;
var theTipTemplate;

})();