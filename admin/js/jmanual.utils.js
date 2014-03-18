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
var computeFrameOffset = function(win, dims) {
    // initialize our result variable
    if (typeof dims === 'undefined') {
        var dims = { top: 0, left: 0 };
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
};

function getElem(selector, $root, elArray, offset) {
    if (!$root) $root = $(document);
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
        getElem(selector, $(this).contents(), elArray, frameOffset);
    });
    return elArray;
}

// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Helper method to parse the title tag from the response.
function getTitle(text) {
  return text.match('<title>(.*)?</title>')[1];
}
