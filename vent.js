/**
 * Event dispatcher that facilitates binding, unbinding and triggering of events.
 * @version: 0.0.2
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
	var Vent = function(){
		this.events = {};
	};
	
	Vent.prototype = {
	
		spliter: /\s+/,
		
		/**
		* Alias for "bind" method.
		* @method on
		*/
		on: function(){
			return this.bind.apply(this, arguments);
		},
		
		/**
		* Alias for "unbind" method.
		* @method off
		*/
		off: function(){
			return this.unbind.apply(this, arguments);
		},
		
		/**
		* Binds event listener(s).
		* @method bind
		* @param events {string} space-separated list of event names.
		* @param callback {function} function to be invoked when event is triggered.
		* @param [context] {object} context to be passed to callback.
		* @return {object} this.
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
		* @method unbind
		* @param [events] {string} space-separated list of event names.
		* @param [callback] {function} function to compare with callback.
		* @param [context] {object} object to compare with context.
		* @return {object} this.
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
		* @method trigger
		* @param events {string} space-separated list of event names.
		* @return {object} this.
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
	
	return Vent;
}()));