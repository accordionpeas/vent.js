vent.js
====

JavaScript event dispatcher that facilitates binding, unbinding and triggering of events based on Backbone's event module.

vent.js ships with support for commonJS and AMD environments.

## Usage

Below is an example of how to use vent.js:

	//create a new instance of vent.
	var dispatcher = new Vent();
	
	//bind an event listener.
	dispatcher.bind('myEvent', function(data){
		console.log(data);
	});
	
	//trigger an event
	dispatcher.trigger('myEvent', {
		some: 'data'
	});
	
	//unbind an event
	dispatcher.unbind('myEvent');
	
# bind

> object.bind(event, callback, [context])

Bind event listener(s) to an object. The 'callback' will be invoked when the 'event' is fired. To bind the same callback to multiple events pass the 'event' parameter in as a space-separated string.

The 'context' of the callback can be specified by passing an object in as the optional third parameter.

Callbacks bound to the special 'all' event will be triggered when any event fires and are passed the name of the event as the first parameter. E.g.

	object.bind('all', function(eventName){
		console.log(eventName);
	});

# unbind

> object.unbind([event], [callback], [context])

Unbind event listener(s) from an object. There are 4 levels of specificity that can be achieved with this method;

## No parameters
	Removes all event listeners
	object.unbind();

## 1 parameter
	Removes all event listeners for the event 'change'
	object.unbind('change')

## 2 parameters
	Removes just the 'onChange' callback for the 'change' event
	object.unbind('change', onChange)
	
## 3 parameters
	Removes just the 'onChange' callback for the 'change' event with 'anotherObject' as the context
	object.unbind('change', onChange, anotherObject)
	
Like the 'bind' method, the 'event' parameter refer to more than one event by passing it as a space-separated string.
	
# trigger

> object.trigger(event, [*args])

Triggers event listener(s) on an object. The arguments that are passed into this method are sent to the listener callback.

Multiple events can be triggered by passing the 'event' parameter as a space-separated string.
