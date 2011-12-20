//JS CORE ENHANCEMENTS
Object.prototype.method = function(name, func){
	this.prototype[name] = func;
	return this;
}
Number.method('integer', function(){
	return Math[this < 0 ? 'ceil' : 'floor'](this);
});
String.method('trim', function(){
	return this.replace(/^\s+|\s+$/g, '');
});
Function.method('inherits', function(Parent){
	this.prototype = new Parent();
	return this;
});
Object.method('empty', function(){
	var temp = (this instanceof String) ? this.toString() : this;
	return (temp === null || temp === "");
});
Object.method('is_string', function(){
	return (this instanceof String);
});
Object.method('is_object', function(){
	return (typeof this === "object") && !('splice' in this);
});
Object.method('is_array', function(){
	return (typeof this === "object") && ('splice' in this);
});
Object.method('is_callable', function(){
	return (this && typeof this === 'function');
});
Object.method('is_dom', function(){
	return 'setAttribute' in this;
});
Object.method('serialize', function(var_val_join, pair_join){
	if(var_val_join === undefined){
		var_val_join = "=";
	}
	if(pair_join === undefined){
		pair_join = '&';
	}
	var pairs = [], params = "";
	if(typeof this.charAt === "function"){
		return this;
	}
	if(this.is_object()){
		for(var i in this){
			if(this.hasOwnProperty(i)){
				pairs.push([i, this[i]].join(var_val_join));
			}
		}
		params = pairs.join(pair_join);
	}
	return params;
});
'byClass' in document || (
	document.byClass = Object.prototype.byClass = function(searchClass, tag) {
		var classElements = new Array();
		node = document;
		if(tag === undefined || tag === ""){
 					tag = '*';
		}
		var els = node.getElementsByTagName(tag);
		var elsLen = els.length;
		var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
		for (i = 0, j = 0; i < elsLen; i++) {
		  if ( pattern.test(els[i].className) ) {
		    classElements[j] = Element(els[i]);
		    j++;
		  }
		}
		return classElements;
	}
);

'bySelector' in document || (
	document.bySelector = Object.prototype.bySelector = function(selector){
		if (selector.is_dom() || selector === null) {
			element = selector;
			return element;
		} 
		// split apart on spaces so we can drill down to specific elements
        var apart = selector.split(" ");
		// first, we set the last element to be the document
        var last = document,
			next = null;
		// initialize the element array
        var element = [],
			i = 0,
			item = apart[i];
           if (item.indexOf('#') !== -1) {
			//get by id
               var id = item.replace('#', '');
               element = Element(last.getElementById(id));
			if(element !== null){
				//drilling down to element.getBlahByBlah();
				if(apart.length > 1 && i < apart.length){
					i++;
					element = element.bySelector(apart[i]);
				}
			}else{
				//nothing found by that id
				element = [];
				return element;
			}
           } else if (item.indexOf('.') !== -1) {
               var cn = item.split('.');
			var that = this;
			if(cn[0].trim() === ""){
				cn = cn[1];
				element.push(Element(that.byClass(cn)));
			}else{
				var ret = that.byClass(cn[1], cn[0]);
				element.push(Element(ret));
			}
			element = element[0];
           } else if(selector.match(/<(\S+).*>(.*)<\/\1>/)){
			var f_el = selector.match(/<(\S+).*>(.*)<\/\1>/)[1];
			var l = document.createElement(f_el);
			l.innerHTML = selector;
			element = Element(l.firstChild);
		} else {
			element = last.getElementsByTagName(selector);
		}
           last = current = element;
		return current;
	}
);
//END JS CORE ENHANCEMENTS

var Core = function(){
	var match = null;
	match = navigator.userAgent.match(/(mozilla)(?:.*? rv:([\w.]+))?/i)
	if(!match)
		match = navigator.userAgent.match(/(webkit)[ \/]([\w.]+)/i);
	if(!match)
		match = navigator.userAgent.match(/(opera)(?:.*version)?[ \/]([\w.]+)/i);
	if(!match)
		match = navigator.userAgent.match(/(msie) ([\w.]+)/i);

	this.browser = {
		vendor:match[1],
		version:match[2],
		toString:function(){
			return window.browser.vendor;
		}
	};
};

//attach our methods to the DOM object
var Element = function(el){
	for(var method in Core.prototype){
		el[method] = Core.prototype[method];
	}
	return el;
}
			
Core.prototype.trim = function(){
	var	str = str.replace(/^\s\s*/, ''),
			ws = /\s/,
			i = str.length;
	while (ws.test(str.charAt(--i)));
	return str.slice(0, i + 1);
};

//merges arguments into type of 'this'
Core.prototype.merge = function(){
	for(var i = 0; i < arguments.length; i++){
		for(var x in arguments[i]){
			if(this.is_array()){
				this.push(arguments[i][x]);
			}else if(this.is_object()){
				if(arguments[i].hasOwnProperty(x)){
					this[x] = arguments[i][x];
				}
			}
		}
	}
	return this;
};

Core.prototype.last = function(){
	if(this.is_array()){
		return this[-1];
	}
};

Core.prototype.first = function(){
	if(this.is_array()){
		return this[0];
	}
};

Core.prototype.ajax = function(options){
	if('innerHTML' in this){
		use_context = this;
	}else{
		use_context = null;
	}
	var defaults = Element({
		async:true,
		type:'GET',
		url:null,
		data:'',
		dataType:'HTML',
		cache:true,
		context:use_context,
		headers:{},
		contentType:'application/x-www-form-urlencoded',
		beforeSend:function(settings){},
		complete:function(){},
		success:function(data, textStatus){},
		error:function(textStatus, errorThrown){}
	});
	
	options = defaults.merge(options);
	
	var _request = function(options){
		options.beforeSend(options.context, options);
		if (window.XMLHttpRequest){
			xmlhttp = new XMLHttpRequest();
		}else{
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange=function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200){
				options.success.call(options.context, xmlhttp.responseText, xmlhttp.status)
			}else{
				options.error.call(options.context, xmlhttp.status, 'AJAX request failed');
			}
		}
		options.data.serialize = options.serialize;
		xmlhttp.open(options.type, options.url, options.async);
		var params = options.data.serialize();
		
		if(options.type == "GET" && options.data !== null){
			options.url = options.url+'?'+params;
			options.data = null;
		}else if(options.type == "POST"){
			//Send the proper header information along with the request
			options.data = params;
			xmlhttp.setRequestHeader("Content-type", options.contentType);
			xmlhttp.setRequestHeader("Content-length", options.data.length);
			xmlhttp.setRequestHeader("Connection", "close");
		}
		
		xmlhttp.send(options.data);
		options.complete.call(options.context);
	}
	_request(options);
	return this;
};

Core.prototype.load = function(request_url, get_data, success_cb, error_cb){
	return Core.prototype.get(request_url, get_data, function(response){
		this.html(response);
	}, error_cb, this);
}

Core.prototype.post = function(request_url, post_data, success_cb, error_cb){
	var options = {
		type:'POST',
		url:request_url,
		data:post_data || "",
		success:success_cb || function(){},
		error:error_cb || function(){}
	};
	return this.ajax(options);
};

Core.prototype.get = function(request_url, get_data, success_cb, error_cb, run_context){
	var options = {
		type:'GET',
		url:request_url,
		data:get_data || "",
		context:run_context || null,
		success:success_cb || function(){},
		error:error_cb || function(){}
	};
	return this.ajax(options);
};

Core.prototype.each = function(collection, callback){
	if(collection && collection.is_callable()){
		if(this.length === undefined){
			collection.call(this, 0, this);
			return this;
		}
		if(this.is_array()){
			for(var i = 0; i < this.length; i++){
				collection.call(this[i], i, this[i]);
			}
		}else if(this.is_object() && this !== document && this !== window){
			for(var i in this){
				if(this.hasOwnProperty(i)){
					collection.call(this[i], i, this[i]);
				}
			}
		}
		return this;
	}
	var iterate = this.bySelector(collection);
	for(var i = 0; i < iterate.length; i++){
		if(callback && callback.is_callable()){
			callback.call(iterate[i], i, iterate[i]);
		}
	}
	return this;
};

Core.prototype.find = function(selector){
	return this.bySelector(selector);
};

Core.prototype.text = function(value){
	if(value == undefined){
		if('innerText' in this){
			return this.innerText;
		}else if('textContent' in this){
			return this.textContent;
		}
	}else{
		if('innerText' in this){
			this.innerText = value;
		}else if('textContent' in this){
			this.textContent = value;
		}
	}
	return this;
};

Core.prototype.html = function(value){
	if(value === undefined){
		return this.innerHTML;
	}else{
		this.innerHTML = value;
	}
	return this;
};

Core.prototype.addClass = function(cn){
	return this.each(function(){
		var prev = this.attr('class') || "";
		if(!prev.empty()){
			prev += " ";
		}
		this.attr('class', prev+cn);
	});
};

Core.prototype.removeClass = function(cn){
	return this.each(function(i, o){
		var cur = this.attr('class');
		cur = cur.replace(cn, '');
		this.attr('class', cur);
	});
};

Core.prototype.attr = function(at, va){
	if(va !== undefined){
		if('splice' in this){
			return this.each(function(){
				if('setAttribute' in this){
					this.setAttribute(at, va);
				}
			});
		}else{
			this.setAttribute(at, va);
			return this;
		}
	}
	else{
		if('splice' in this){
			return this[0].getAttribute(at);
		}else{
			return this.getAttribute(at);
		}
	}
	return null;
};

Core.prototype.css = function(attr, value){
	var parse_css = function(str){
		var arr = str.split(';'), tmp = {};
		for(var i = 0; i < arr.length; i++){
			var temp = arr[i].split(':');
			tmp[temp[0]] = temp[1];
		}
		return tmp;
	};
	if(this.undefined(value) && !this.undefined(attr) && attr.is_string()){// key only passed
		return parse_css(this.attr('style'))[attr];
	}else if(!this.undefined(value) && !this.undefined(attr)){// key, value passed
		var css = parse_css(this.attr('style'));
		css[attr] = value;
		this.attr('style', css.serialize(':', ';'));
		return this;
	}else if(this.undefined(value) && !attr.is_string() && attr.is_object()){// {} passed
		var css = parse_css(this.attr('style'));
		for(var attribute in attr){
			if(attr.hasOwnProperty(attribute)){
				css[attribute] = attr[attribute];
			}
		}
		this.attr('style', css.serialize(':', ';'));
		return this;
	}
}

Core.prototype.undefined = function(value){
	return value === undefined;
}

var core = new Core();