/**
 * Event dispatcher that facilitates binding, unbinding and triggering of events.
 * @version: 0.0.1
 */
(function(exports){
	if(typeof module !== 'undefined' && module.exports){ //CommonJS
		module.exports = exports;
	}
	else if(typeof define === 'function'){ //AMD
		define(function(){
			return exports;
		});
	}
	else{
		window.Vent = exports;
	}
	
}(function(){
	var exports = function(){
		this.events = {};
	};
	
	exports.prototype = {
		spliter: /\s+/,
		/**
		 * Binds event listener(s).
		 * @param: {string} events - space-separated list of event names.
		 * @param: {function} callback - function to be invoked when event is triggered.
		 * @param: {context} object - context to be passed to callback.
		 * @returns: {object} this.
		 */
		bind: function(events, callback, context){
			var split = events.split(this.spliter);
			
			for(var i=0, splitLen=split.length; i<splitLen; i++){
				var event = split[i];
				
				if(!this.events[event]){
					this.events[event] = [];
				}
				this.events[event].push({
					context: context,
					callback: callback
				});
			}
			return this;
		},
		/**
		 * Unbinds event listener(s).
		 * @param: {string} events - space-separated list of event names.
		 * @param: {function} callback - function to compare with callback.
		 * @param: {context} object - object to compare with context.
		 * @returns: {object} this.
		 */
		unbind: function(events, callback, context){
			var checkCallback = typeof callback === 'function',
				checkContext = typeof context === 'object' && context !== null;
			
			//no arguments - remove all events.
			if(arguments.length === 0){
				this.events = [];
			}
			else{
				var split = events.split(this.spliter);
				
				for(var i=0, splitLen=split.length; i<splitLen; i++){
					var event = split[i],
						listeners = this.events[event];
					
					if(listeners){
						//don't need to bother with looping if we don't care about callback or context.
						if(!checkCallback){
							delete this.events[event];
						}
						else{
							for(var j=listeners.length-1; j >=0; j--){
								var listener = listeners[j];
								
								if(listener.callback === callback){
									if(checkContext){
										if(listener.context === context){
											listeners.splice(j, 1);
										}
									}
									else{
										listeners.splice(j, 1);
									}
								}
							}
							
							//cleanup events object if all listeners have been removed.
							if(listeners.length === 0){
								delete this.events[event];
							}
						}
					}
				}
			}
			
			return this;
		},
		/**
		 * Triggers event listener(s).
		 * @param: {string} events - space-separated list of event names.
		 * @returns: {object} this.
		 */
		trigger: function(events){
			var split = events.split(this.spliter),
				//convert arguments to an array.
				args = Array.prototype.slice.call(arguments);
			
			for(var i=0, splitLen=split.length; i<splitLen; i++){
				var event = split[i],
					listeners = this.events[event];
				
				if(listeners){
					for(var j=0, ListenersLen=listeners.length; j<ListenersLen; j++){
						var listener = listeners[j],
							context = listener.context || this;
							
						listener.callback.apply(context, args.slice(1));
					}
					
					//trigger every 'all' event.
					var allListeners = this.events['all'];
					if(allListeners){
						for(var j=0, ListenersLen=listeners.length; j<ListenersLen; j++){
							var listener = listeners[j],
								context = listener.context || this;
								
							listener.callback.apply(context, args);
						}
					}
				}
			}
			return this;
		}
	};
	
	return exports;
}()));