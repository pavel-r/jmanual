(function(){

	var domain = window["JManual.Domain"]; //"//54.186.137.81:5000";
	var userID = window['JManual.UserId'];//"5331b155e4b03d6e48712e7f";
    var tips = null;

	var clientPanelTemplate;
    var theTipTemplate;
	
	Jmanual.beginTraining = function(){
			Jmanual.Utils.setCookie("jTipId", -1, 365);
			Jmanual.nextTip();
	};

	Jmanual.closeTip = function(){
			$("#tipContainer").html("");
			var tipId = 1 * (Jmanual.Utils.getCookie("jTipId") || -1 );
			var tip = tips[tipId];
			if(tipId + 1 >= tips.length){
				alert('End of training');
				Jmanual.Utils.setCookie("jTipId", -1, 365);  
				return;
			}
			if(tip.doAfter === 'nextTip'){
				Jmanual.nextTip();
			}
	};

	Jmanual.nextTip = function () {
			$("#tipContainer").html("");
			var tipId = 1 * (Jmanual.Utils.getCookie("jTipId") || -1 );
			//if (tipId == null) {
			//	tipId = 0;
			//}
			tipId++;
			if(tipId >= tips.length){
				alert('End of training');
				Jmanual.Utils.setCookie("jTipId", -1, 365);  
				return;
			}
			if (showTip(tips[tipId])){
				Jmanual.Utils.setCookie("jTipId", tipId, 365);
			}
	};

    function showTip(tip) {
		if (tip == null){
			return false;
		}
		$("#tipContainer").html(theTipTemplate({tip: tip}));
		return true;
    }

    function showClientPanel() {
		//Initialize templates
		clientPanelTemplate = window['JST']['templates/client-panel-template.html'];
		theTipTemplate = window['JST']['templates/tip-bubble-template.html'];

		//Create DOM elements
		$('body').append(clientPanelTemplate({domain : domain}));
    }

    $(window).load(function () {
		//load css files
		var STYLES = [         // the css filenames
			"//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css",
			domain + "/app/css/jmanual.main.css"
		];
		var html = [];
		for (var i = 0; i < STYLES.length; i++) {
			html.push('<link href="');
			html.push(STYLES[i]);
			html.push('" type="text/css" rel="stylesheet"></link>\n');
		}
		$('head').append(html.join(''));
		
		//launch client app
		var url = domain + "/cors/" + userID;
		$.ajax({
				url: url,
				type: "GET",
				crossDomain: true,
				dataType: "json",
				success: function (data) {
					tips = data;
					showClientPanel();
				},
				error: function (xhr, status) {
					alert("error");
				}
		});
    });

})();
