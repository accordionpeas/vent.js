# vent.js

JavaScript event dispatcher that facilitates binding, unbinding and triggering of events. Version 0.1.x supports namespaced events.

vent.js ships with support for commonJS and AMD environments.

## Usage

### Regular events
```javascript
//create a new instance of vent.
var vent = new Vent();

//bind an event listener.
vent.on('myEvent', function(data){
	console.log(data);
});

//trigger an event
vent.trigger('myEvent', {
	some: 'data'
});

//unbind an event
vent.off('myEvent');
```

### Namespaced events
```javascript
var vent = new Vent();

vent.on('myEvent.namespace1', function(data){
	console.log(data);
});

vent.on('myEvent.namespace2', function(data){
	console.log(data);
});

//will trigger both handlers
vent.trigger('myEvent');

//will trigger only the first handler
vent.trigger('myEvent.namespace1');
```

### Wildcards
```javascript
var vent = new Vent();

//will fire when any event is triggered
vent.on('*', function(){

});

//will fire when any event with this namespace is triggered
vent.on('*.myNamespace', function(){

});

//will unbind all event handlers with this namespace
vent.off('*.myNamespace');
```

# on / bind

`vent.on(event, callback, [context])`

Bind listener(s) to an event. The `callback` will be invoked when the `event` is triggered. To bind the same callback to multiple events pass the `event` parameter in as a space-separated string.

The context of the callback can be specified by passing an object in as the optional third parameter.

# off / unbind

`vent.off([event], [callback], [context])`

Unbind listener(s) from an event. There are 4 levels of specificity that can be achieved with this method;

- No parameters

	Removes all event listeners

	`vent.off();`

- 1 parameter

	Removes all event listeners for the given event name

	`vent.off('change');`

- 2 parameters

	Removes all event listeners for the given event name that match the callback function

	`vent.off('change', onChange);`

- 3 parameters

	Removes all event listeners for the given event name that match the callback function and the context

	`vent.off('change', onChange, anotherObject);`

Like the `on` method, the `event` parameter may refer to more than one event by passing it as a space-separated string.

# trigger

`vent.trigger(event, [*args])`

Trigger event listener(s). The arguments that are passed into this method after `event` are sent to the event handler.

Multiple events can be triggered by passing the `event` parameter as a space-separated string.
