this["JST"] = this["JST"] || {};

this["JST"]["admin/templates/admin-panel-template.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="adminPanel" title="Administration panel" style="">\n\t\t\t\t<p>\n\t\t\t\t\t<div id="listPanel" style=""></div>\n\t\t\t\t\t<a id="newTipBtn" href=#>New</a>\n\t\t\t\t\t<a id="showModelBtn" href=#>Show model</a>\n\t\t\t\t\t<div id="detailsPanel" style="" title=""></div>\n\t\t\t\t</p>\n</div>\n<div id="tipContainer"></div>';

}
return __p
};

this["JST"]["admin/templates/client-panel-template.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="clientPanel" style="position: absolute; background-color: red; top: 0px; right: 0px;">\n\t<a id="startBtn" href=# onclick="beginTraining();">Start training</a><br/>\n\t<a id="startBtn" href=# onclick="nextTip();">Next tip</a>\n</div>\n<div id="tipContainer"></div>\n';

}
return __p
};

this["JST"]["admin/templates/tip-bubble-template.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="msgWindow" style="position:absolute; left: ' +
((__t = (left)) == null ? '' : __t) +
'px; top: ' +
((__t = (top)) == null ? '' : __t) +
'px;">\n\t\t<p class="triangle-isosceles top" style="font-size: 12px;">' +
((__t = (msg)) == null ? '' : __t) +
'\n\t\t  <a href=# onclick="closeTip();return false;">OK</a>\n\t\t</p>\n</div>\n';

}
return __p
};

this["JST"]["admin/templates/tip-details-template.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div style="border: 1px solid #AAAAAA; margin: 15px 3px 3px; padding: 0.4em;">\n\t\t\t\t<span>' +
((__t = (tip ? "Edit tip" : "New tip")) == null ? '' : __t) +
'</span>\n\t\t\t\t<div>Selector:</div>\n\t\t\t\t<input type="text" id="selector" style="width: 100%;" value="' +
((__t = (tip ? tip.get("selector") : "")) == null ? '' : __t) +
'"/><br/>\n\t\t\t\t<div>Message:</div>\n\t\t\t\t<textarea id="message" style="width: 100%;">' +
((__t = (tip ? tip.get("msg") : "")) == null ? '' : __t) +
'</textarea><br/>\n\t\t\t\t<a class="hrefButton" id="saveBtn" href=# data-tip-id="' +
((__t = (tip.id)) == null ? '' : __t) +
'">Save</a>\n\t\t\t\t';
 if(tip) { ;
__p += '\n\t\t\t\t<a class="hrefButton" id="deleteBtn" href=# data-tip-id="' +
((__t = (tip.id)) == null ? '' : __t) +
'">Delete</a>\n\t\t\t\t';
 };;
__p += '\n</div>';

}
return __p
};

this["JST"]["admin/templates/tips-list-template.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<ol id="allTips">\n\t\t\t';
 _.each(tips, function(tip, idx) { ;
__p += ' \n\t\t\t\t<li class="ui-widget-content" data-tip-id="' +
((__t = (tip.id)) == null ? '' : __t) +
'">' +
((__t = (idx)) == null ? '' : __t) +
'. ' +
((__t = (tip.get("msg").slice(0, 10))) == null ? '' : __t) +
'</li>\n\t\t\t';
 }); ;
__p += '\n</ol>';

}
return __p
};