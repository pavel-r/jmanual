function closeTip(){
	//just a stub
}

(function(){

	var domain = "//54.186.137.81:5000";
	var userID = "5331b155e4b03d6e48712e7f";

	var Tip = Backbone.Model.extend({
		defaults: function(){
			return {
				selector: "",
				msg: ""
			}
		}
	});

	var Lesson = Backbone.Collection.extend({
		model: Tip,
		localStorage: new Backbone.LocalStorage("jLesson")
	});
	
	var lesson = new Lesson;
	lesson.fetch();
	
	var LessonView = Backbone.View.extend({
		el : "#listPanel",
		template: window['JST']['admin/templates/tips-list-template.html'],
		events: {
			"click li" : "selectTip"
		},
		initialize: function(){
			this.listenTo(lesson, "change", this.render);
			this.listenTo(lesson, "add", this.render);
			this.listenTo(lesson, "remove", this.render);
		},
		render: function(){
			this.$el.html(this.template({tips : lesson.models}));
			that = this;
			$("#allTips").selectable({
				selected: function(event, ui){
					that.selectTip(ui.selected);
				}
			});
		},
		selectTip: function(el) {
			var id = $(el).attr("data-tip-id");
			tipEditView.render({id : id});
			tipBubbleView.render({id : id});
		}
	});
	
	var TipEditView = Backbone.View.extend({
		el : "#detailsPanel",
		template: window['JST']['admin/templates/tip-details-template.html'],
		events : {
			"click #saveBtn" : "saveTip",
			"click #deleteBtn" : "deleteTip"
		},
		render: function(options){
			if(options.id){
				var tip = lesson.get(options.id);
				this.$el.html(this.template({tip : tip}));
			} else {
				this.$el.html(this.template({tip : ""}));
			}
			$(".hrefButton").button();
		},
		hide: function(){
			this.$el.html("");
		},
		saveTip : function(e){
			var id = $(e.currentTarget).attr("data-tip-id");
			if(id){
				lesson.get(id).save(this.serialize());
			} else {
				lesson.create(this.serialize());
			}
			this.hide();
		},
		deleteTip : function(e){
			var id = $(e.currentTarget).attr("data-tip-id");
			lesson.get(id).destroy();
			this.hide();
			tipBubbleView.hide();
		},
		serialize: function(){
			return {
				selector : this.$("#selector").val(),
				msg : this.$("#message").val()
			};
		}
	});
	
    var TipBubbleView = Backbone.View.extend({
	el: "#tipContainer",
	template: window['JST']['admin/templates/tip-bubble-template.html'],
	render: function(options){
	    this.hide();
	    var tip = lesson.get(options.id);
	    var selector = tip.get("selector");
	    if(selector == ""){
		this.$el.html(this.template({ left: "50%", top: "50%", msg: tip.get("msg"), cssclass: "notriangle-msg"}));
	    } else {
		var firstFound = getElem(selector)[0];
		if(!firstFound){
		    this.$el.html(this.template({ left: "50%", top: "50%", msg: "Cannot show next tip. Make sure you did all previous steps correctly", cssclass: "alert-msg"}));
		    return false;
		}
		var el = firstFound.elem;
		var position = (el == null ? null : $(el).offset());
		position.top += firstFound.offs.top;
		position.left += firstFound.offs.left;
		position.top += 15;
		this.$el.html(this.template({ left: (position.left + "px"), top: (position.top + "px"), msg: tip.get("msg"), cssclass: "triangle-isosceles top"}));
	    }
	},
	hide: function(){
	    this.$el.html("");
	}
    });
	
	var AppView = Backbone.View.extend({
		template: window['JST']['admin/templates/admin-panel-template.html'],
		events: {
			"click #newTipBtn" : "openTipDetails",
			"click #saveModelBtn" : "saveModel",	
			"click #loadModelBtn" : "loadModel"
		},
		initialize: function() {
			this.render();
			tipEditView = new TipEditView;
			tipBubbleView = new TipBubbleView;
			lessonView = new LessonView;
			lessonView.render();	
		},
		render: function(){
			this.$el.append(this.template());
			$('#adminPanel').dialog();
			$('#newTipBtn').button();
			$('#saveModelBtn').button();
			$('#loadModelBtn').button();
		},
		openTipDetails : function(){
			tipEditView.render({});
			tipBubbleView.hide();
		},
		saveModel: function() {
		    var url = domain + "/cors/" + userID;
		    $.ajax({
			url: url,
			type: "POST",
			crossDomain: true,
			data: {"tipdata" : JSON.stringify(lesson)},
			dataType: "json",
			success: function (response) {
			    alert(response.status);
			},
			error: function (xhr, status) {
			    alert("error");
			}
		    }); 
		},
		loadModel: function() {
			var url = domain + "/cors/" + userID;
			var that = this;
			$.ajax({
				url: url,
				type: "GET",
				crossDomain: true,
				dataType: "json",
				success: function (data) {
					//lesson.reset();
					lesson.sync();
					lessonView.render();
				},
				error: function (xhr, status) {
					alert("error");
				}
		    });
		}
	});
    
	var tipBubbleView;
	var tipEditView;
	var lessonView;
	var App;
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

		//launch the app
		App = new AppView({el: 'body'});
	});
})();

