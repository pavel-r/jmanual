Jmanual.Utils = function() {
	
	//Helpers
	
	/**
	 * Calculate the offset of the given iframe relative to the top window.
	 * - Walks up the iframe chain, checking the offset of each one till it reaches top
	 * - Only works with friendly iframes. 
	 * - Takes into account scrolling, but comes up with a result relative to 
	 *   top iframe, regardless of being visibile withing intervening frames.
	 * 
	 * @param window win    the iframe we're interested in (e.g. window)
	 * @param object dims   an object containing the offset so far:
	 *                          { left: [x], top: [y] }
	 *                          (optional - initializes with 0,0 if undefined) 
	 * @return dims object above
	 */
	function computeFrameOffset(win, dims) {
		// initialize our result variable
		if (typeof dims === 'undefined') {
			dims = { top: 0, left: 0 };
		}

		// find our <iframe> tag within our parent window
		var frames = win.parent.document.getElementsByTagName('iframe');
		var frame;
		var found = false;

		for (var i=0, len=frames.length; i<len; i++) {
			frame = frames[i];
			if (frame.contentWindow == win) {
				found = true;
				break;
			}
		}

		// add the offset & recur up the frame chain
		if (found) {
			var rect = frame.getBoundingClientRect();
			dims.left += rect.left;
			dims.top += rect.top;
			if (win !== top) {
				computeFrameOffset(win.parent, dims);
			}
		}
		return dims;
	}

    function getGuardFunction(offset){
	return function(event){
	    event.pageX += offset.left;
	    event.pageY += offset.top;
	    if(isGuarding){
		if(element && Jmanual.Utils.eventInsideElement(event, element)){
		    $jm("#actionGuard").offset({ top: 0, left: 0});
		} else {
		    $jm("#actionGuard").offset({ top: event.pageY - 20, left: event.pageX - 20});
		}
	    }
	};
    }
    
	//Methods
	var that = this;
	this.getElem = function(selector, $root, elArray, offset) {
		if (!$root) $root = $jm(document);
		if (!offset) offset = {left : 0, top : 0};
		if (!elArray) elArray = [];
		// Select all elements matching the selector under the root
		var firstFound = $root.find(selector)[0];
		if(firstFound){
			elArray.push({elem : firstFound, offs : offset});
		}
		// Loop through all frames
		$root.find('iframe,frame').each(function() {
			// Recursively call the function, setting "$root" to the frame's document
			var frameOffset = computeFrameOffset(this.contentWindow);
			that.getElem(selector, $jm(this).contents(), elArray, frameOffset);
		});
		return elArray;
	};
	
	var isGuarding = false;
	var element = null;
	
	this.stopGuarding = function(){
		isGuarding = false;
		element = null;
	    $jm("#actionGuard").offset({ top: 0, left: 0});
	};
	
	this.startGuarding = function(options){
		if(options.selector){
			element = options.selector;
		}
		isGuarding = true;
	};
	
	this.assignMousemoveEvent = function($root, offset){
		if (!$root) $root = $jm(document);
		if (!offset) offset = {left : 0, top : 0};
		$root.mousemove(getGuardFunction(offset));
		// Loop through all frames
		$root.find('iframe,frame').each(function() {
			// Recursively call the function, setting "$root" to the frame's document
			var frameOffset = computeFrameOffset(this.contentWindow);
			that.assignMousemoveEvent($jm(this).contents(), frameOffset);
		});
	};
	
	this.setCookie = function(cname,cvalue,exdays)
    {
		var d = new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
    };

    this.getCookie = function(cname)
    {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++)
		{
			var c = ca[i].trim();
			if (c.indexOf(name)==0) return c.substring(name.length,c.length);
		}
		return "";
    };

	this.eventInsideElement = function(event, element){
		if(!element) return false;
		var firstFound = this.getElem(element)[0];
		if(!firstFound) return false;
		var left = $jm(firstFound.elem).offset().left + firstFound.offs.left;
		var top = $jm(firstFound.elem).offset().top + firstFound.offs.top;
		var right = left + $jm(firstFound.elem).outerWidth();
		var bottom = top + $jm(firstFound.elem).outerHeight();
		if(event.pageX < left ||
		   event.pageX > right ||
		   event.pageY < top ||
		   event.pageY > bottom){
			return false;
		}
		return true;
	};
	
};

//Utils should be singleton. Make singleton instance
Jmanual.Utils = new Jmanual.Utils();
