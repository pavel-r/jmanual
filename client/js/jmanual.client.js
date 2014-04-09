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
		var selector = tip.selector;
		if(selector == ""){
			$("#tipContainer").html(theTipTemplate({ left: "50%", 
													top: "50%", 
													msg: tip.msg, 
													doAfter: tip.doAfter, 
													cssclass: "notriangle-msg"}));
			return true;
		} else {
			var firstFound = Jmanual.Utils.getElem(selector)[0];
			
			if(!firstFound){
				$("#tipContainer").html(theTipTemplate({ left: "50%", 
														top: "50%", 
														msg: "Cannot show next tip. Make sure you did all previous steps correctly", 
														doAfter: tip.doAfter, 
														cssclass: "alert-msg"}));
				return false;
			}

			var el = firstFound.elem;
			var position = (el == null ? null : $(el).offset());
			position.top += firstFound.offs.top;
			position.left += firstFound.offs.left;
			position.top += 15;
			var tipBox = theTipTemplate({ left: (position.left + "px"), 
										top: (position.top + "px"), 
										msg: tip.msg, 
										doAfter: tip.doAfter, 
										cssclass: "triangle-isosceles top"});
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
			domain + "/admin/css/jmanual.admin.css"
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
