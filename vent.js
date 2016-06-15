/**
 * Event dispatcher that facilitates binding, unbinding and triggering of events.
 * @version: 0.1.0
 */
(function(Vent){
	if(typeof module !== 'undefined' && module.exports){ //CommonJS
		module.exports = Vent;
	}
	else if(typeof define === 'function'){ //AMD
		define(function(){
			return Vent;
		});
	}
	else{
		window.Vent = Vent;
	}

}(function(){

	'use strict';

	var whitespaceRegex = /\s+/,
		eventNamespaceRegex = /([^\.]+)(?:\.(.+))?/;

	function getListenersByNamespace(event){
		var allListeners = [],
			listeners;

		for(var eventName in this.events){
			listeners = this.events[eventName];
			if(listeners){
				for(var i=0; i<listeners.length; i++){
					if(listeners[i].namespace === event.namespace){
						allListeners.push(listeners[i]);
					}
				}
			}
		}

		return allListeners;
	}

	function getListeners(event){
		if(event.name === '*' && event.namespace){
			return getListenersByNamespace.call(this, event);
		}
		else{
			return this.events[event.name] || [];
		}
	}

	function trigger(event, args){
		var listeners = getListeners.call(this, event);

		for(var i=0; i<listeners.length; i++){
			var listener = listeners[i],
				context = listener.context || this;

			if(!event.namespace || event.namespace === listener.namespace){
				listener.callback.apply(context, args);
			}
		}
	}

	function parseEventString(str){
		var events = [],
			split = str.split(whitespaceRegex),
			match;

		for(var i=0; i<split.length; i++){
			match = split[i].match(eventNamespaceRegex);

			if(!match){
				throw new Error('Incorrect event name syntax "' + split[i] + '"');
			}

			events.push({
				name: match[1],
				namespace: match[2] || null
			});
		}

		return events;
	}

	function getUnbindChecks(callback, context){
		return {
			callback: typeof callback === 'function',
			context: typeof context === 'object' && context !== null
		};
	}

	function unbind(event, listeners, callback, context){
		if(!listeners){
			return;
		}

		var checks = getUnbindChecks(callback, context),
		 	listener, doesCallbackMatch, doesContextMatch;

		for(var i=listeners.length-1; i >=0; i--){
			listener = listeners[i];

			doesCallbackMatch = true;
			doesContextMatch = true;

			if(!event.namespace || listener.namespace === event.namespace){
				if(checks.callback){
					doesCallbackMatch = listener.callback === callback;
				}
				if(checks.context){
					doesContextMatch = listener.context === context;
				}

				if(doesCallbackMatch && doesContextMatch){
					listeners.splice(i, 1);
				}
			}
		}

		//cleanup events object if all listeners have been removed.
		if(listeners.length === 0){
			delete this.events[event.name];
		}
	}

	var Vent = function(){
		this.events = {};
	};

	Vent.prototype = {

		/**
		Alias for "bind" method.
		@method on
		*/
		on: function(){
			return this.bind.apply(this, arguments);
		},

		/**
		Alias for "unbind" method.
		@method off
		*/
		off: function(){
			return this.unbind.apply(this, arguments);
		},

		/**
		Binds event listener(s).

		@method bind
		@param events {string} space-separated list of event names.
		@param callback {function} function to be invoked when event is triggered.
		@param [context] {object} context to be passed to callback.
		@return {object} this.
		*/
		bind: function(events, callback, context){
			events = parseEventString(events);

			var event;

			for(var i=0; i<events.length; i++){
				event = events[i];

				if(!this.events[event.name]){
					this.events[event.name] = [];
				}

				this.events[event.name].push({
					context: context,
					callback: callback,
					namespace: event.namespace
				});
			}

			return this;
		},

		/**
		Unbinds event listener(s).

		@method unbind
		@param [events] {string} space-separated list of event names.
		@param [callback] {function} function to compare with callback.
		@param [context] {object} object to compare with context.
		@return {object} this.
		*/
		unbind: function(events, callback, context){
			var checks = getUnbindChecks(callback, context),
				event, listeners;

			//no arguments - remove all events.
			if(arguments.length === 0){
				this.events = {};
			}
			else{
				events = parseEventString(events);

				for(var i=0; i<events.length; i++){
					event = events[i];

					//don't need to bother with looping if we don't care about namespace, callback or context.
					if(!checks.callback && !checks.context && !event.namespace){
						delete this.events[event.name];
					}
					else{
						if(event.name === '*' && event.namespace){
							for(var eventName in this.events){
								unbind.call(this, event, this.events[eventName], callback, context);
							}
						}
						else{
							unbind.call(this, event, this.events[event.name], callback, context);
						}
					}
				}
			}

			return this;
		},

		/**
		Triggers event listener(s).

		@method trigger
		@param events {string} space-separated list of event names.
		@return {object} this.
		*/
		trigger: function(events){
			events = parseEventString(events);

			var args = Array.prototype.slice.call(arguments).slice(1);

			for(var i=0; i<events.length; i++){
				trigger.call(this, events[i], args);
			}

			trigger.call(this, {name: '*'}, args);

			return this;
		}
	};

	return Vent;
}()));
