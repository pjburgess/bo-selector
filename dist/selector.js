(function(win, doc) {
	'use strict';

	var _slice = Array.prototype.slice,
		_prefixes = {
			'#': 'getElementById',
			'.': 'getElementsByClassName',
			'>': 'getElementsByTagName',
			'*': 'querySelectorAll'
		};

	function bo(selector, context) {
		var ret,
			method,
			match;

		if (typeof selector == 'function') {
			if (doc.readyState == 'loading') {
				doc.addEventListener('DOMContentLoaded', selector);
			} else {
				selector();
			}
		} else {
			ret = Object.create(bo.fn);
			if (selector.constructor === Object && selector.tag) {
				ret[0] = bo.create(selector);
				ret.length = 1;
			} else if (selector && selector.nodeType === 1) {
				ret[0] = selector;
				ret.length = 1;
			} else {
				method = _prefixes[selector[0]];
				match = (context || doc)[method](selector.slice(1));
				[].push.apply(ret, (match.length ? _slice.call(match) : [match]));
			}
			return ret;
		}
	}

	bo.each = function(obj, callback) {
		var i,
			keys,
			length;
		if (Array.isArray(obj)) {
			for (i = 0, length = obj.length; i < length; i++) {
				if (callback(obj[i], i, obj) === false) {
					break;
				}
			}
		} else {
			keys = Object.keys(obj);
			for (i = 0, length = keys.length; i < length; i++) {
				if (callback(obj[keys[i]], keys[i], obj) === false) {
					break;
				}
			}
		}
		return obj;
	};

	bo.create = function(def) {
		var elm;
		def = Object(def);
		elm = doc.createElement(def.tag || 'div');
		bo.each(def, function(value, prop) {
			prop = ({cls:'class', forElm: 'for'}[prop] || prop);
			if (!/^tag|html|children$/i.test(prop)) {
				elm.setAttribute(prop, value);
			}
		});
		if (def.children) {
			if (Array.isArray(def.children)) {
				bx.each(def.children, function(kid) {
					elm.appendChild(bo.create(kid));
				});
			} else {
				elm.appendChild(bo.create(def.children));
			}
		}
		if (def.html) {
			elm.innerHTML = def.html;
		}
		return elm;
	};

	bo.fn = Object.create(Array.prototype, {
		first: {
			get: function() {
				return this[0];
			}
		},

	//	events...

		on: {
			value: function(event, callback) {
				this.forEach(function(elm) {
					var handler;
					if (!callback.handler) {
						handler = callback.handler = function(e) {
							var ret = callback.call(elm, e);
							if (ret !== undefined && ret === false) {
								e.preventDefault();
								e.stopPropagation();
							}
						};
					}
					elm.addEventListener(event, handler);
				});
				return this;
			}
		},
		off: {
			value: function(event, callback) {
				this.forEach(function(elm) {
					var handler = callback.handler || callback;
					elm.removeEventListener(event, handler);
				});
				return this;
			}
		},

		css: {
			value: function(prop, value) {
				if (typeof prop == 'object') {
					for (var name in prop) {
						if (prop.hasOwnProperty(name)) this.css(name, prop[name]);
					}
				} else if (typeof value === 'undefined') {
					return this.first.style[prop];
				} else {
					this.forEach(function(elm) {
						elm.style[prop] = value;
					});
				}
			}
		},

	//	classes...

		addClass: {
			value: function(cls) {
				this.forEach(function(elm) {
					elm.classList.add(cls);
				});
				return this;
			}
		},
		hasClass: {
			value: function(cls) {
				var i = 0,
					elm;
				while ((elm = this[i++])) {
					if (elm.classList.contains(cls)) {
						return true;
					}
				}
				return false;
			}
		},
		removeClass: {
			value: function(cls) {
				this.forEach(function(elm) {
					elm.classList.remove(cls);
				});
				return this;
			}
		},

	//	properties & attributes...

		prop: {
			value: function(prop, value) {
				if (typeof value === 'undefined') {
					return this.first[prop];
				} else {
					this.forEach(function(elm) {
						elm[prop] = value;
					});
					return this;
				}
			}
		},
		attr: {
			value: function(attr, value) {
				if (typeof value === 'undefined') {
					return this.first.getAttribute(attr);
				} else {
					this.forEach(function(elm) {
						elm.setAttribute(attr, value);
					});
					return this;
				}
			}
		},
		removeAttr: {
			value: function(attr) {
				this.forEach(function(elm) {
					elm.removeAttribute(attr);
				});
				return this;
			}
		},
		html: {
			value: function(value) {
				return this.prop('innerHTML', value);
			}
		},
		text: {
			value: function(value) {
				return this.prop('textContext', value);
			}
		},
		val: {
			value: function(value) {
				var elm = this.first,
					prop = 'value';
				switch (elm.tagName) {
					case 'SELECT':
						prop = 'selectedIndex';
						break;
					case 'OPTION':
						prop = 'selected';
						break;
					case 'INPUT':
						if (elm.type == 'checkbox' || elm.type == 'radio') {
							prop = 'checked';
						}
						break;
				}
				return this.prop(prop, value);
			}
		}
	});

	win.$ = win.bo = bo;

})(window, document);
