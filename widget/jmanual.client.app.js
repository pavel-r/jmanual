(function(){

	var domain = window["JManual.Domain"]; //"//54.186.137.81:5000";
	var userID = window["JManual.ClientUserId"];//"5331b155e4b03d6e48712e7f";
	var cookieExp = 1; //days
	
	var clientPanelTemplate = window['JST']['templates/client-panel-template.html'];
	var lessonsListTemplate = window['JST']['templates/client-lessons-list-template.html'];
	var lessonTemplate = window['JST']['templates/client-lesson-template.html'];
	var theTipTemplate = window['JST']['templates/client-tip-bubble-template.html'];

    var tips = null;

	//guarding functionality. should be isolated
	var isGuarding = false;
	var element = null;
	
	function stopGuarding(){
		isGuarding = false;
		element = null;
		$("#actionGuard").offset({ top: 0, left: 0});
	}
	
	function startGuarding(options){
		if(options.selector){
			element = options.selector;
		}
		isGuarding = true;
	}
	
	function guardMouseMove(event){
		if(isGuarding){
			if(element && Jmanual.Utils.eventInsideElement(event, element)){
				$("#actionGuard").offset({ top: 0, left: 0});
			} else {
				$("#actionGuard").offset({ top: event.pageY - 20, left: event.pageX - 20});
			}
		}
	}
	
	//end guarding functionality
	
	//data access
	function getLessons(callbackSuccess, callbackError){
		var url = domain + "/" + userID + "/lessons";
		$jm.ajax({
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
		$jm.ajax({
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
		Jmanual.Utils.setCookie("jTip", "", cookieExp);
		Jmanual.Utils.setCookie("jLesson", "", cookieExp);
		Jmanual.Utils.setCookie("jLessonName", "", cookieExp);
		tips = null;
		$jm("#tipContainer").html("");
		
		//show lessons
		var errCallback = function (xhr, status) {
			alert("error");
		};
		var successCallback = function(data) {
			//lessons = data;
			$jm("#clientContainer").html(lessonsListTemplate({lessons: data}));
		};
		getLessons(successCallback, errCallback);
	};
	
	Jmanual.gotoLesson = function(lesson_id, lesson_name){
		//set lesson and reset tip
		Jmanual.Utils.setCookie("jLesson", lesson_id, cookieExp);
		Jmanual.Utils.setCookie("jLessonName", lesson_name, cookieExp);
		//Jmanual.Utils.setCookie("jTip", "", cookieExp);

		//show tips
		var errCallback = function (xhr, status) {
			alert("error");
		};
		var successCallback = function(data) {
			tips = data;
			$jm("#clientContainer").html(lessonTemplate({lesson_name : lesson_name}));
		};
		getTips(successCallback, errCallback, lesson_id);
	};

	Jmanual.beginTraining = function(){
		Jmanual.Utils.setCookie("jTip", "", cookieExp);
		Jmanual.nextTip();
	};

	Jmanual.closeTip = function(){
			$jm("#tipContainer").html("");
			stopGuarding();
			var tipId = 1 * (Jmanual.Utils.getCookie("jTip") || -1 );
			var tip = tips[tipId];
			if(tipId + 1 >= tips.length){
				alert('End of training');
				Jmanual.Utils.setCookie("jTip", "", cookieExp);  
				return;
			}
			if(tip.doAfter === 'nextTip'){
				Jmanual.nextTip();
			} else {
				$jm("#nextBtn").css("color", "red");
				if(tip.allowedArea){
					startGuarding({selector : tip.allowedArea});
				}
			}
	};

	Jmanual.nextTip = function () {
			stopGuarding();
			$jm("#tipContainer").html("");
			$jm("#nextBtn").css("color", "");
			var tipId = 1 * (Jmanual.Utils.getCookie("jTip") || -1 );
			tipId++;
			if(tipId >= tips.length){
				alert('End of training');
				Jmanual.Utils.setCookie("jTip", "", cookieExp);  
				return;
			}
			if (showTip(tips[tipId])){
				Jmanual.Utils.setCookie("jTip", tipId, cookieExp);
				startGuarding({});
			}
	};
	
    function showTip(tip) {
		if (tip == null){
			return false;
		}
		$jm("#tipContainer").html(theTipTemplate({tip: tip}));
		return true;
    }

    $jm(window).load(function () {
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
		$jm('head').append(html.join(''));

		//launch client app
		$jm('body').append(clientPanelTemplate({domain : domain}));
		var lesson_id = Jmanual.Utils.getCookie("jLesson");
		var lesson_name = Jmanual.Utils.getCookie("jLessonName");
		if(!lesson_id){
			Jmanual.showLessons();
		} else {
			Jmanual.gotoLesson(lesson_id, lesson_name);
		}
		$(document).mousemove(guardMouseMove);
    });

})();
