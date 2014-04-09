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
__p += '<div id="clientPanel" style="position: absolute; top: -1px; right: 50px; border: 1px solid #aaaaaa; padding: 5px; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px;">\r\n\t<img src="http://ancient-gorge-2130.herokuapp.com/client/bulb.png" style="float: left; width: 45px;"/>\r\n\t<a id="startBtn" href=# onclick="Jmanual.beginTraining();" style="display:block; margin-left: 64px;">Start training</a>\r\n\t<a id="startBtn" href=# onclick="Jmanual.nextTip();" style="display:block; margin-left: 64px;">Next tip</a>\r\n</div>\r\n<div id="tipContainer"></div>\r\n';

}
return __p
};

this["JST"]["admin/templates/tip-bubble-template.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div id="msgWindow" style="position:absolute; left: ' +
((__t = (left)) == null ? '' : __t) +
'; top: ' +
((__t = (top)) == null ? '' : __t) +
';">\r\n\t\t<p class="' +
((__t = (cssclass)) == null ? '' : __t) +
'" style="font-size: 12px;">' +
((__t = (msg)) == null ? '' : __t) +
'\r\n\t\t  <a href=# onclick="Jmanual.closeTip();return false;">\r\n\t\t  ';
if(doAfter === "nextTip") {;
__p += '\r\n\t\t\tNEXT\r\n\t\t  ';
} else {;
__p += '\r\n\t\t\tOK\r\n\t\t  ';
};
__p += '\r\n\t\t  </a>\r\n\t\t</p>\r\n</div>\r\n';

}
return __p
};

this["JST"]["admin/templates/tip-details-template.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<form id="tipEditForm">\r\n\t<div style="border: 1px solid #AAAAAA; margin: 15px 3px 3px; padding: 0.4em;">\r\n\t\t\t\t\t<span>' +
((__t = (tip ? "Edit tip" : "New tip")) == null ? '' : __t) +
'</span>\r\n\t\t\t\t\t<div>Selector:</div>\r\n\t\t\t\t\t<input type="text" id="selector" name="selector" style="width: 100%;" value="' +
((__t = (tip ? tip.get("selector") : "")) == null ? '' : __t) +
'"/><br/>\r\n\t\t\t\t\t<div>Message:</div>\r\n\t\t\t\t\t<textarea id="msg" name="msg" style="width: 100%;">' +
((__t = (tip ? tip.get("msg") : "")) == null ? '' : __t) +
'</textarea><br/>\r\n\t\t\t\t\t<div>Do after:</div>\r\n\t\t\t\t\t<select id="doAfter" name="doAfter">\r\n\t\t\t\t\t\t<option value="close" ' +
((__t = ((tip && tip.get("doAfter") === "close") ? "selected=" : "")) == null ? '' : __t) +
'>Close</option>\r\n\t\t\t\t\t\t<option value="nextTip" ' +
((__t = ((tip && tip.get("doAfter") === "nextTip") ? "selected=" : "")) == null ? '' : __t) +
'>Show next tip</option>\r\n\t\t\t\t\t</select>\r\n\t\t\t\t\t<a class="hrefButton" id="saveBtn" href=# data-tip-id="' +
((__t = (tip.id)) == null ? '' : __t) +
'">Save</a>\r\n\t\t\t\t\t';
 if(tip) { ;
__p += '\r\n\t\t\t\t\t<a class="hrefButton" id="deleteBtn" href=# data-tip-id="' +
((__t = (tip.id)) == null ? '' : __t) +
'">Delete</a>\r\n\t\t\t\t\t';
 };;
__p += '\r\n\t</div>\r\n</form>\r\n';

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