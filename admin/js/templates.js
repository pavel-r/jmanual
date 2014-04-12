this["JST"] = this["JST"] || {};

this["JST"]["admin/templates/admin-panel-template.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="adminPanel" title="Administration panel" style="font-size: 12px;">\r\n\t\t\t\t<p>\r\n\t\t\t\t\t<div id="listPanel" style=""></div>\r\n\t\t\t\t\t<a id="newTipBtn" href=#>New</a>\r\n\t\t\t\t\t<a id="saveModelBtn" href=#>Save model</a>\r\n\t\t\t\t\t<a id="loadModelBtn" href=#>Load model</a>\r\n\t\t\t\t\t<div id="detailsPanel" style="" title=""></div>\r\n\t\t\t\t</p>\r\n</div>\r\n<div id="tipContainer"></div>\r\n';

}
return __p
};

this["JST"]["admin/templates/client-panel-template.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="clientPanel" style="position: absolute; top: -1px; right: 50px; border: 1px solid #aaaaaa; padding: 5px; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;">\r\n\t<img src="//localhost:5000/client/bulb.png" style="float: left; width: 45px;"/>\r\n\t<a id="startBtn" href=# onclick="Jmanual.beginTraining();" style="display:block; margin-left: 64px;">Start training</a>\r\n\t<a id="startBtn" href=# onclick="Jmanual.nextTip();" style="display:block; margin-left: 64px;">Next tip</a>\r\n</div>\r\n<div id="tipContainer"></div>\r\n';

}
return __p
};

this["JST"]["admin/templates/tip-bubble-template.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {


var position = tip.position;
var message = tip.msg;
var btnTxt = tip.doAfter === "nextTip" ? "NEXT" : "OK";
var cssStyle = "";
var pCssClass = "";

if(position !== "nextTo"){
	pCssClass = "notriangle-msg";
} else {
	var selector = tip.selector;
	var firstFound = Jmanual.Utils.getElem(selector)[0];
	if(firstFound){
		pCssClass = "triangle-isosceles top";
		
		var cssPos = (firstFound.elem === null ? null : $(firstFound.elem).offset());
		cssPos.top += firstFound.offs.top;
		cssPos.left += firstFound.offs.left;
		cssPos.top += 15;
		cssStyle += ("left:" + cssPos.left + "px;");
		cssStyle += ("top:" + cssPos.top + "px;");
	} else {
		position = "center";
		pCssClass = "alert-msg";
		btnTxt = "OK"
		message = "Cannot show next tip. Make sure you did all previous steps correctly";
	}
}

;
__p += '\r\n<div id="msgWindow" class="' +
((__t = (position)) == null ? '' : __t) +
'" style="' +
((__t = (cssStyle)) == null ? '' : __t) +
'">\r\n\t\t<p class="' +
((__t = (pCssClass)) == null ? '' : __t) +
'">\r\n\t\t\t' +
((__t = (message)) == null ? '' : __t) +
'\r\n\t\t\t<a href=# onclick="Jmanual.closeTip();return false;">' +
((__t = (btnTxt)) == null ? '' : __t) +
'</a>\r\n\t\t</p>\r\n</div>\r\n';

}
return __p
};

this["JST"]["admin/templates/tip-details-template.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div style="border: 1px solid #AAAAAA; margin: 15px 3px 3px; padding: 0.4em;">\r\n\t\t\t\t\t<label class="title-lbl"><b>' +
((__t = (tip ? "Edit tip" : "New tip")) == null ? '' : __t) +
'</b></label>\r\n\t\t\t\t\t<label>Position:</label>\r\n\t\t\t\t\t<select id="position">\r\n\t\t\t\t\t\t<option value="nextTo">Next to</option>\r\n\t\t\t\t\t\t<option value="center" ' +
((__t = ((tip && tip.get("position") === "center") ? "selected=" : "")) == null ? '' : __t) +
'>Center</option>\r\n\t\t\t\t\t\t<option value="topLeft" ' +
((__t = ((tip && tip.get("position") === "topLeft") ? "selected=" : "")) == null ? '' : __t) +
'>Top left</option>\r\n\t\t\t\t\t\t<option value="topRight" ' +
((__t = ((tip && tip.get("position") === "topRight") ? "selected=" : "")) == null ? '' : __t) +
'>Top right</option>\r\n\t\t\t\t\t\t<option value="bottomLeft" ' +
((__t = ((tip && tip.get("position") === "bottomLeft") ? "selected=" : "")) == null ? '' : __t) +
'>Bottom left</option>\r\n\t\t\t\t\t\t<option value="bottomRight" ' +
((__t = ((tip && tip.get("position") === "bottomRight") ? "selected=" : "")) == null ? '' : __t) +
'>Bottom right</option>\r\n\t\t\t\t\t</select>\r\n\t\t\t\t\t<label>Element:</label>\r\n\t\t\t\t\t<input type="text" id="selector" value="' +
((__t = (tip ? tip.get("selector") : "")) == null ? '' : __t) +
'"/>\r\n\t\t\t\t\t<label>Message:</label>\r\n\t\t\t\t\t<textarea id="msg">' +
((__t = (tip ? tip.get("msg") : "")) == null ? '' : __t) +
'</textarea>\r\n\t\t\t\t\t<label>Do after:</label>\r\n\t\t\t\t\t<select id="doAfter">\r\n\t\t\t\t\t\t<option value="close" ' +
((__t = ((tip && tip.get("doAfter") === "close") ? "selected=" : "")) == null ? '' : __t) +
'>Close</option>\r\n\t\t\t\t\t\t<option value="nextTip" ' +
((__t = ((tip && tip.get("doAfter") === "nextTip") ? "selected=" : "")) == null ? '' : __t) +
'>Show next tip</option>\r\n\t\t\t\t\t</select>\r\n\t\t\t\t\t<label></label>\r\n\t\t\t\t\t<a class="hrefButton" id="saveBtn" href=# data-tip-id="' +
((__t = (tip.id)) == null ? '' : __t) +
'">Save</a>\r\n\t\t\t\t\t';
 if(tip) { ;
__p += '\r\n\t\t\t\t\t<a class="hrefButton" id="deleteBtn" href=# data-tip-id="' +
((__t = (tip.id)) == null ? '' : __t) +
'">Delete</a>\r\n\t\t\t\t\t';
 };;
__p += '\r\n\t\t\t\t\t<a class="hrefButton" id="cancelBtn" href=#">Cancel</a>\r\n</div>\r\n\r\n';

}
return __p
};

this["JST"]["admin/templates/tips-list-template.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<ol id="allTips">\r\n\t\t\t';
 _.each(tips, function(tip, idx) { ;
__p += ' \r\n\t\t\t\t<li class="ui-widget-content" data-tip-id="' +
((__t = (tip.id)) == null ? '' : __t) +
'">' +
((__t = (idx)) == null ? '' : __t) +
'. ' +
((__t = (tip.get("msg").slice(0, 10))) == null ? '' : __t) +
'</li>\r\n\t\t\t';
 }); ;
__p += '\r\n</ol>';

}
return __p
};