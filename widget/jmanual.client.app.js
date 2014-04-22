(function(){

	var domain = window["JManual.Domain"]; //"//54.186.137.81:5000";
	var userID = window['JManual.UserId'];//"5331b155e4b03d6e48712e7f";
	
	var clientPanelTemplate = window['JST']['templates/client-panel-template.html'];
	var lessonsListTemplate = window['JST']['templates/client-lessons-list-template.html'];
	var lessonTemplate = window['JST']['templates/client-lesson-template.html'];
	var theTipTemplate = window['JST']['templates/tip-bubble-template.html'];

	//var lessons = null;
    var tips = null;
	
	//data access
	function getLessons(callbackSuccess, callbackError){
		var url = domain + "/" + userID + "/lessons";
		$.ajax({
				url: url,
				type: "GET",
				crossDomain: true,
				dataType: "json",
				success: callbackSuccess,
				error: callbackError
		});
	}
	
	function getTips(callbackSuccess, callbackError, lesson_id){
		var url = domain + "/" + userID + "/tips?lesson_id=" + lesson_id;
		$.ajax({
				url: url,
				type: "GET",
				crossDomain: true,
				dataType: "json",
				success: callbackSuccess,
				error: callbackError
		});
	}
	
	//API
	Jmanual.showLessons = function(){
		//reset current tip and lesson
		Jmanual.Utils.setCookie("jTip", null, 365);
		Jmanual.Utils.setCookie("jLesson", null, 365);
		tips = null;
		//lessons = null;
		
		//show lessons
		var errCallback = function (xhr, status) {
			alert("error");
		};
		var successCallback = function(data) {
			//lessons = data;
			$("#clientContainer").html(lessonsListTemplate({lessons: data}));
		};
		getLessons(successCallback, errCallback);
	};
	
	Jmanual.gotoLesson = function(lesson_id, lesson_name){
		//set lesson and reset tip
		Jmanual.Utils.setCookie("jLesson", lesson_id, 365);
		Jmanual.Utils.setCookie("jTip", null, 365);

		//show tips
		var errCallback = function (xhr, status) {
			alert("error");
		};
		var successCallback = function(data) {
			tips = data;
			$("#clientContainer").html(lessonTemplate({lesson_name : lesson_name}));
		};
		getTips(successCallback, errCallback, lesson_id);
	};

	Jmanual.beginTraining = function(){
		Jmanual.Utils.setCookie("jTip", null, 365);
		Jmanual.nextTip();
	};

	Jmanual.closeTip = function(){
			$("#tipContainer").html("");
			var tipId = 1 * (Jmanual.Utils.getCookie("jTip") || -1 );
			var tip = tips[tipId];
			if(tipId + 1 >= tips.length){
				alert('End of training');
				Jmanual.Utils.setCookie("jTip", -1, 365);  
				return;
			}
			if(tip.doAfter === 'nextTip'){
				Jmanual.nextTip();
			}
	};

	Jmanual.nextTip = function () {
			$("#tipContainer").html("");
			var tipId = 1 * (Jmanual.Utils.getCookie("jTip") || -1 );
			//if (tipId == null) {
			//	tipId = 0;
			//}
			tipId++;
			if(tipId >= tips.length){
				alert('End of training');
				Jmanual.Utils.setCookie("jTip", -1, 365);  
				return;
			}
			if (showTip(tips[tipId])){
				Jmanual.Utils.setCookie("jTip", tipId, 365);
			}
	};
	
    function showTip(tip) {
		if (tip == null){
			return false;
		}
		$("#tipContainer").html(theTipTemplate({tip: tip}));
		return true;
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
		$('body').append(clientPanelTemplate({domain : domain}));
		Jmanual.showLessons();
    });

})();
