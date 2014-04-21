(function(){

	var domain = window["JManual.Domain"]; //"//54.186.137.81:5000";
	var userID = window['JManual.UserId'];//"5331b155e4b03d6e48712e7f";

	Jmanual.beginTraining = function(){};
	Jmanual.closeTip = function(){};
	Jmanual.nextTip = function(){};
	
	$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
		options.crossDomain ={
			crossDomain: true
		};
		/*
		options.xhrFields = {
			withCredentials: true
		};
		*/
		options.url = domain + '/' + userID + options.url;
	});

	//////////// MODELS /////////////
	
	var Tip = Backbone.Model.extend({
		urlRoot : "/tips"
	});
	
	var Lesson = Backbone.Model.extend({
		urlRoot : "/lessons"
	});
	
	var Tips = Backbone.Collection.extend({
		model: Tip,
		url: function() {
			var url = "/tips";
			if(this.lesson_id !== null){
				url += ("?lesson_id=" + this.lesson_id);
			}
			return url;
		}
	});
	
	var Lessons = Backbone.Collection.extend({
		model: Lesson,
		url: "/lessons"
	});
	
	//////////// VIEWS /////////////
	
	var LessonListView = Backbone.View.extend({
		el : "#lessonListContainer",
		template: window['JST']['templates/lessons-list-template.html'],
		events: {
			"click li" : "selectLesson",
			"click li a" : "editLesson",
			"click #newLessonBtn" : "newLesson"
		},
		render: function(){
			var that = this;
			var lessons = new Lessons();
			lessons.fetch({
				success: function (lessons) {
					that.$el.html(that.template({lessons: lessons.models}));
					that.$("#newLessonBtn").button();
				}
			});
		},
		selectLesson: function(e){
			var id = $(e.currentTarget).attr("data-lesson-id");
			this.hide();
			tipListView.render({lesson_id : id});
			return false;
		},
		newLesson : function(){
			this.hide();
			lessonEditView.render({});
		},
		editLesson : function(e){
			var id = $(e.currentTarget).attr("data-lesson-id");
			this.hide();
			lessonEditView.render({id : id});
			return false;
		},
		hide: function(){
			this.$el.html("");
		}
	});
	
	var LessonEditView = Backbone.View.extend({
		el : "#lessonDetailsContainer",
		template: window['JST']['templates/lesson-details-template.html'],
		events : {
			"click #saveBtn" : "saveLesson",
			"click #deleteBtn" : "deleteLesson",
			"click #cancelBtn" : "cancel"
		},
		render: function(options){
			if(options.id){
				var that = this;
				that.lesson = new Lesson({id : options.id});
				that.lesson.fetch({
					success: function (lesson) {
					  that.$el.html(that.template({lesson : lesson}));
					}
				});
			} else {
				this.lesson = null;
				this.$el.html(this.template({lesson : ""}));
			}
			this.$(".hrefButton").button();
		},
		cancel : function(){
			lessonEditView.hide();
			lessonListView.render();
		},
		saveLesson : function(e){
			var lessonDetails = this.serialize();
			if(this.lesson){
				lessonDetails.id = this.lesson.id;
			}
			var lesson = new Lesson();
			//TODO: do validation e.g. elementid is not empty and element exists
			lesson.save(lessonDetails, {
				success: function(user){
					lessonEditView.hide();
					lessonListView.render();
				}
			});
		},
		deleteLesson : function(e){
			this.lesson.destroy({
				success : function(){
					lessonEditView.hide();
					lessonListView.render();
				}
			});
		},
		serialize: function(){
			return {
				name : this.$("#name").val()
			};
		},
		hide: function(){
			this.$el.html("");
		}
	});
	
	var TipListView = Backbone.View.extend({
		el : "#tipListContainer",
		template: window['JST']['templates/tips-list-template.html'],
		events: {
			"click li" : "selectTip",
			"click #newTipBtn": "newTip",
			"click #backBtn": "back"
		},
		initialize: function(){
			//this.listenTo(lesson, "change", this.render);
			//this.listenTo(lesson, "add", this.render);
			//this.listenTo(lesson, "remove", this.render);
		},
		render: function(options){
			this.lesson_id = options.lesson_id;
			var that = this;
			var tips = new Tips();
			tips.lesson_id = this.lesson_id;
			tips.fetch({
				success: function (tips) {
					that.$el.html(that.template({tips : tips.models}));
					that.$("#allTips").selectable({
						selected: function(event, ui){
							that.selectTip(ui.selected);
						}
					});
				}
			});
		},
		selectTip: function(e) {
			var id = $(e).attr("data-tip-id");
			tipBubbleView.render({id : id});
			return false;
		},
		newTip: function() {
			tipEditView.render({lesson_id : this.lesson_id});
		},
		editTip: function(e) {
			var id = $(e).attr("data-tip-id");
			tipEditView.render({id : id});
		},
		back: function(){
			this.hide();
			lessonListView.render();
		},
		hide: function(){
			this.$el.html("");
		}
	});
	
	var TipEditView = Backbone.View.extend({
		el : "#tipDetailsContainer",
		template: window['JST']['templates/tip-details-template.html'],
		events : {
			"click #saveBtn" : "saveTip",
			"click #deleteBtn" : "deleteTip",
			"click #cancelBtn" : "hide",
			"change #position" : "toggleSelector"
		},
		render: function(options){
			this.tip = new Tip(options);
			if(options.id){
				var that = this;
				that.tip.fetch({
					success: function (tip) {
					  that.$el.html(that.template({tip : tip}));
					}
				});
			} else {
				this.$el.html(this.template({tip : ""}));
			}
			this.toggleSelector();
			this.$(".hrefButton").button();
		},
		hide: function(){
			this.$el.html("");
		},
		toggleSelector: function() {
			var position = this.$("#position").val();
			if(position === "nextTo"){
				this.$("#selector").removeAttr("disabled");
			} else {
				this.$("#selector").attr("disabled", "true");
			}
		},
		saveTip : function(e){
			var tipDetails = this.serialize();
			tipDetails.lesson_id = this.tip.get('lesson_id');
			if(this.tip.id){
				tipDetails.id = this.tip.id;
			}
			var tip = new Tip();
			//TODO: do validation e.g. elementid is not empty and element exists
			tip.save(tipDetails, {
				success: function(tip){
					tipEditView.hide();
					tipListView.render({lesson_id : tipDetails.lesson_id});
				}
			});
		},
		deleteTip : function(e){
			var lesson_id = this.tip.lesson_id;
			this.tip.destroy({
				success : function(){
					tipEditView.hide();
					tipListView.render({lesson_id : lesson_id});
				}
			});
		},
		serialize: function(){
			return {
				selector : this.$("#selector").val(),
				msg : this.$("#msg").val(),
				doAfter: this.$("#doAfter").val(),
				position: this.$("#position").val()
			};
		}
	});
	
    var TipBubbleView = Backbone.View.extend({
		el: "#tipContainer",
		template: window['JST']['templates/tip-bubble-template.html'],
		render: function(options){
			this.hide();
			var tip = lesson.get(options.id);
			this.$el.html(this.template({tip: tip.toJSON()}));
		},
		hide: function(){
			this.$el.html("");
		}
    });
	
	var AppView = Backbone.View.extend({
		template: window['JST']['templates/admin-panel-template.html'],
		initialize: function() {
			this.render();
			lessonListView = new LessonListView();
			lessonEditView = new LessonEditView();
			tipListView = new TipListView();
			tipEditView = new TipEditView();
			tipBubbleView = new TipBubbleView();
			lessonListView.render();
		},
		render: function(){
			this.$el.append(this.template());
			$('#adminPanel').dialog();
		}
	});
    
	var lessonListView;
	var lessonEditView;
	var tipBubbleView;
	var tipEditView;
	var tipListView;
	var App;
	
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

		//launch the app
		App = new AppView({el: 'body'});
	});
})();

