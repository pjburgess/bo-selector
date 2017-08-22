(function(win, doc) {
	'use strict';

	var _arraySlice = Array.prototype.slice,
		_prefixes = {
			'#': 'getElementById',
			'.': 'getElementsByClassName',
			'>': 'getElementsByTagName',
			'*': 'querySelectorAll'
		};

	function bo(selector, context) {
		var method = _prefixes[selector[0]],
			match = (context || doc)[method](selector.slice(1)),
			res = Object.create(bo.fn),
			i;
		[].push.apply(res, (match.length ? _arraySlice.call(match) : [match]));
		return res;
	}

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
