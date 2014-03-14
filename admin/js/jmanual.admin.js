(function(){

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
		template: _.template(getTemplate("tips-list-template")),
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
		template: _.template(getTemplate("tip-details-template")),
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
		template: _.template(getTemplate("tip-bubble-template")),
		render: function(options){
			var tip = lesson.get(options.id);
			var firstFound = getElem(tip.get("selector"))[0];
			if(firstFound){
				var el = firstFound.elem;
				var position = (el == null ? null : $(el).offset());
				position.top += firstFound.offs.top;
				position.left += firstFound.offs.left;
				position.top += 15;
				this.$el.html(this.template({ left: position.left, top: position.top, msg: tip.get("msg")}));
			} else {
				this.hide();
			}
		},
		hide: function(){
			this.$el.html("");
		}
	});
	
	var AppView = Backbone.View.extend({
		template: _.template(getTemplate("admin-panel-template")),
		events: {
			"click #newTipBtn" : "openTipDetails",
			"click #showModelBtn" : "showModel"
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
			$('#showModelBtn').button();
		},
		openTipDetails : function(){
			tipEditView.render({});
			tipBubbleView.hide();
		},
		showModel: function() {
			alert(JSON.stringify(lesson));
		}
	});
	
	var tipBubbleView;
	var tipEditView;
	var lessonView;
	var App;
	$(window).load(function () {
		App = new AppView({el: 'body'});
	});
})();