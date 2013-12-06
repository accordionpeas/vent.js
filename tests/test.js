var expect = chai.expect;

describe('vent', function(){

	it('should invoke a callback function when a bound event is triggered', function(){

		var vent = new Vent;

		vent.on('test', function(){
			//simple assertion statement as we only want
			//to test that this function gets invoked.
			expect(true).to.equal(true);
		});

		vent.trigger('test');

	});

	it('should pass parameters through to the invoked callback', function(){

		var vent = new Vent;

		vent.on('test', function(param1, param2){
			expect(param1).to.equal('param1');
			expect(param2).to.equal('param2');
		});

		vent.trigger('test', 'param1', 'param2');

	});

	it('should allow for multiple events to be bound at once', function(){

		var vent = new Vent;

		vent.on('test1 test2', function(){});

		expect(typeof vent.events.test1).to.equal('object');
		expect(typeof vent.events.test2).to.equal('object');

	});

	it('should invoke the callback with the given context', function(){

		var obj = {},
			vent = new Vent;

		vent.on('test', function(){
			expect(this).to.equal(obj);
		}, obj);

		vent.trigger('test');

	});

	it('should allow for multiple callbacks to be bound to the same event', function(){

		var vent = new Vent,
			count = 0;

		vent.on('test', function(){
			count++;
		});

		vent.on('test', function(){
			count++;
			expect(count).to.equal(2);
		});

		vent.trigger('test');

	});

	it('should allow for multiple events to be triggered at once', function(){

		var vent = new Vent,
			count = 0;

		vent.on('test1', function(){
			count++;
		});
		vent.on('test2', function(){
			count++;
			expect(count).to.equal(2);
		});

		vent.trigger('test1 test2');

	});

	it('should trigger the "all" event when any other event is triggered', function(){

		var vent = new Vent;

		vent.on('test', function(){});

		vent.on('all', function(){
			//simple assertion statement as we only want
			//to test that this function gets invoked.
			expect(true).to.equal(true);
		});

		vent.trigger('test');

	});

	it('should unbind all events if "off" is called with no parameters', function(){

		var vent = new Vent;

		vent.on('test', function(){});

		vent.off();

		expect(vent.events.length).to.equal(0);

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

});