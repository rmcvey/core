(function(window){
	var core = window.core = (function(){
		var current = window,
			rwebkit = /(webkit)[ \/]([\w.]+)/,
			ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
			rmsie = /(msie) ([\w.]+)/,
			rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;
		var _loadBrowser = (function(){
			var match = null;
			match = navigator.userAgent.match(/(mozilla)(?:.*? rv:([\w.]+))?/i)
			if(!match)
				match = navigator.userAgent.match(/(webkit)[ \/]([\w.]+)/i);
			if(!match)
				match = navigator.userAgent.match(/(opera)(?:.*version)?[ \/]([\w.]+)/i);
			if(!match)
				match = navigator.userAgent.match(/(msie) ([\w.]+)/i);
			window.browser = {};
			window.browser.vendor = match[1];
			window.browser.toString = function(){
				return window.browser.vendor;
			}
			window.browser.version = match[2];
		})();
		var core = Object;
		core.extend = Object.prototype;
			
		'getElementsByClasssName' in document || (
			document.getElementsByClasssName = Object.prototype.getElementsByClasssName = function(searchClass, tag) {
				var classElements = new Array();
				node = this;
				if(tag.empty()){
   					tag = '*';
				}
				var els = node.getElementsByTagName(tag);
				var elsLen = els.length;
				var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
				for (i = 0, j = 0; i < elsLen; i++) {
				  if ( pattern.test(els[i].className) ) {
				    classElements[j] = els[i];
				    j++;
				  }
				}
				return classElements;
			}
		);
	
		'rquerySelectorAll' in document || (
			document.rquerySelectorAll = Object.prototype.rquerySelectorAll = function(selector){
				if (typeof selector.setAttribute === "function" || typeof selector === "object" || selector === null) {
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
	                element = last.getElementById(id);
					if(element !== null){
						if(apart.length > 1 && i < apart.length){
							i++;
							element = element.rquerySelectorAll(apart[i]);
						}
					}else{
						element = [];
						return element;
					}
	            } else if (item.indexOf('.') !== -1) {
	                var cn = item.split('.');
					var that = this;
					if(cn[0].empty()){
						cn = cn[1];
						element.push(that.getElementsByClasssName(cn));
					}else{
						var ret = that.getElementsByClasssName(cn[1], cn[0]);
						element.push(ret);
					}
					element = element[0];
	            } else if(selector.match(/<(\S+).*>(.*)<\/\1>/)){
					var f_el = selector.match(/<(\S+).*>(.*)<\/\1>/)[1];
					var l = document.createElement(f_el);
					l.innerHTML = selector;
					element = l.firstChild;
				} else {
					element = last.getElementsByTagName(selector);
				}
	            last = current = element;
				return current;
			}
		);
		core.extend.empty = function(){
			var temp = (this instanceof String) ? this.toString() : this;
			return (temp === "" || temp === null);
		};
		core.extend.is_string = function(){
			return (this instanceof String);
		};
		core.extend.is_object = function(){
			return (typeof this === "object") && !('splice' in this);
		};
		core.extend.is_array = function(){
			return (typeof this === "object") && ('splice' in this);
		};
		core.extend.is_callable = function(){
			return (this !== undefined && typeof this === 'function');
		};
		core.extend.trim = function(pattern){
			
		};
		
		core.extend.require = function(library){
			
		};
		
		//merges arguments into type of 'this'
		core.extend.merge = function(){
			if(this.is_array()){
				
			}
		};
		
		core.extend.ajax = function(o){
			
		};

		core.extend.each = function(collection, callback){
			if(collection.is_callable()){
				if(this.is_array()){
					for(var i = 0; i < this.length; i++){
						collection.call(this[i]);
					}
				}else if(this.is_object() && this !== document && this !== window){
					for(var i in this){
						if(this.hasOwnProperty(i)){
							collection.call(this[i]);
						}
					}
				}
				return this.data;
			}
			var iterate = this.rquerySelectorAll(collection);
			for(var i = 0; i < iterate.length; i++){
				if(callback.is_callable()){
					callback.call(iterate[i]);
				}
			}
			return this.data;
		};
		core.browser = null;
		core.extend.size = function(){
			return this.length;
		};
		core.extend.find = function(selector){
			return this.rquerySelectorAll(selector);
		};
		core.extend.serialize = function(){
			
		};
		core.extend.text = function(value){
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
		core.extend.html = function(value){
			
		};
		core.extend.attr = function(at, va){
			if(va !== undefined){
				if('splice' in this.element){
					
				}
				else{
					this.el.setAttribute(at, va);
				}
			}
			else{
				return this.getAttribute(at);
			}
			return null;
		};
	})();
})(window);