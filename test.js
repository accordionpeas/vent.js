var Vent = require('./vent'),
	expect = require('chai').expect;

function isObjectEmpty(obj){
	for(var i in obj){
		return false;
	}
	return true;
}

describe('vent', function(){

	it('should invoke a callback function when a bound event is triggered', function(){

		var vent = new Vent,
			called = false;

		vent.on('test', function(){
			called = true;
		});

		vent.trigger('test');
		expect(called).to.equal(true);

	});

	it('should pass parameters through to the invoked callback', function(){

		var vent = new Vent,
			params = [];

		vent.on('test', function(param1, param2){
			params.push(param1, param2);
		});

		vent.trigger('test', 'param1', 'param2');

		expect(params).to.deep.equal(['param1', 'param2']);

	});

	it('should allow for multiple events to be bound at once', function(){

		var vent = new Vent;

		vent.on('test1 test2', function(){});

		expect(typeof vent.events.test1).to.equal('object');
		expect(typeof vent.events.test2).to.equal('object');

	});

	it('should invoke the callback with the given context', function(){

		var obj = {},
			vent = new Vent,
			context;

		vent.on('test', function(){
			context = this;
		}, obj);

		vent.trigger('test');
		expect(context).to.equal(obj);

	});

	it('should allow for multiple callbacks to be bound to the same event', function(){

		var vent = new Vent,
			count = 0;

		vent.on('test', function(){
			count++;
		});

		vent.on('test', function(){
			count++;
		});

		vent.trigger('test');
		expect(count).to.equal(2);

	});

	it('should allow for multiple events to be triggered at once', function(){

		var vent = new Vent,
			count = 0;

		vent.on('test1', function(){
			count++;
		});
		vent.on('test2', function(){
			count++;
		});

		vent.trigger('test1 test2');
		expect(count).to.equal(2);

	});

	it('should unbind all events if "off" is called with no parameters', function(){

		var vent = new Vent;

		vent.on('test', function(){});

		vent.off();

		expect(isObjectEmpty(vent.events)).to.equal(true);

	});

	it('should unbind all events of a given name', function(){

		var vent = new Vent;

		vent.on('test1', function(){});
		vent.on('test2', function(){});

		vent.off('test1');

		expect(typeof vent.events.test1).to.equal('undefined');
		expect(typeof vent.events.test2).to.equal('object');

	});

	it('should allow for multiple events to be unbound at once', function(){

		var vent = new Vent;

		vent.on('test1', function(){});
		vent.on('test2', function(){});

		vent.off('test1 test2');

		expect(typeof vent.events.test1).to.equal('undefined');
		expect(typeof vent.events.test2).to.equal('undefined');

	});

	it('should unbind an event if the callback is matched', function(){

		var vent = new Vent,
			fnc1 = function(){},
			fnc2 = function(){};

		vent.on('test', fnc1);
		vent.on('test', fnc2);

		vent.off('test', fnc1);

		expect(vent.events.test.length).to.equal(1);
		expect(vent.events.test[0].callback).to.equal(fnc2);

	});

	it('should unbind an event if the context is matched', function(){

		var vent = new Vent,
			context1 = {},
			context2 = {};

		vent.on('test', function(){}, context1);
		vent.on('test', function(){}, context2);

		vent.off('test', null, context1);

		expect(vent.events.test.length).to.equal(1);
		expect(vent.events.test[0].context).to.equal(context2);

	});

	it('should unbind an event if the callback and context is matched', function(){

		var vent = new Vent,
			context1 = {},
			context2 = {},
			fnc = function(){};

		vent.on('test', fnc, context1);
		vent.on('test', fnc, context2);

		vent.off('test', fnc, context1);

		expect(vent.events.test.length).to.equal(1);
		expect(vent.events.test[0].context).to.equal(context2);

	});

	it('should call the handler if a wildcard is given as the event name', function(){

		var vent = new Vent,
			params = [];

		vent.on('*', function(param1, param2){
			params.push(param1, param2);
		});

		vent.trigger('test1 test2', 'param1', 'param2');
		expect(params).to.deep.equal(['param1', 'param2']);

	});

	it('should call all handlers of a given event regardless of which namespace they belong to', function(){

		var vent = new Vent,
			count = 0;

		vent
			.on('test.namespace1', function(){
				count++;
			})
			.on('test.namespace2', function(){
				count++;
			});

		vent.trigger('test');

		expect(count).to.equal(2);

	});

	it('should only call handlers that correspond to the event name and namespace if both are provided', function(){

		var vent = new Vent,
			count = 0;

			vent
				.on('test.namespace1', function(){
					count++;
				})
				.on('test.namespace2', function(){
					count++;
				});

			vent.trigger('test.namespace1');

			expect(count).to.equal(1);

	});

	it('should call all handlers with a given namespace if a wildcard is provided as the event name', function(){

		var vent = new Vent,
			count = 0;

			vent
				.on('test1.namespace1', function(){
					count++;
				})
				.on('test2.namespace1', function(){
					count++;
				})
				.on('test1.namespace2', function(){
					count++;
				});

			vent.trigger('*.namespace1');

			expect(count).to.equal(2);

	});

	it('should unbind all handlers of a given event regardless of which namespace they belong to', function(){

		var vent = new Vent,
			count = 0;

		vent
			.on('test.namespace1', function(){
				count++;
			})
			.on('test.namespace2', function(){
				count++;
			});

		vent.off('test');

		vent.trigger('test');

		expect(count).to.equal(0);

	});

	it('should only unbind handlers that correspond to the event name and namespace if both are provided', function(){

		var vent = new Vent,
			count = 0;

			vent
				.on('test.namespace1', function(){
					count++;
				})
				.on('test.namespace2', function(){
					count++;
				});

			vent.off('test.namespace1');

			vent.trigger('test');

			expect(count).to.equal(1);

	});

	it('should unbind all handlers with a given namespace if a wildcard is provided as the event name', function(){

		var vent = new Vent,
			count = 0;

			vent
				.on('test1.namespace1', function(){
					count++;
				})
				.on('test2.namespace1', function(){
					count++;
				})
				.on('test1', function(){
					count++;
				});

			vent.off('*.namespace1');

			vent.trigger('test1 test2');

			expect(count).to.equal(1);

	});

});
