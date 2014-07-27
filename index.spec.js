var ezpg = require('ezpg'),
	method = require('./index.js'),
	expect = require('chai').expect,
	testOrders = require('./orders.json');

describe('ezpg-promise-method', function(){
	it('should provide a client argument if the method is called with no args', function(done){
		var instance = {},
		addMethod = method(instance);

		addMethod('mmm', function(client){
			expect(client).to.be.ok;
		});

		instance.mmm()
			.finally(function(){
				done();
			})
			.done();
	});

	it('should prepend a client to existing args', function(done){
		var instance = {},
		addMethod = method(instance);

		addMethod('mmm', function(client, a, b, c){
			expect(client).to.be.ok;
			expect(a).to.be.equal(1);
			expect(b).to.be.equal(2);
			expect(c).to.be.equal('a');
		});

		instance.mmm(1, 2, 'a')
			.finally(function(){
				done();
			})
			.done();
	});

	it('should not prepend a client to existing args if client is already included', function(done){
		var instance = {},
		addMethod = method(instance);

		addMethod('mmm', function(client, a, b, c){
			expect(client).to.be.ok;
			expect(a).to.be.equal(1);
			expect(b).to.be.equal(2);
			expect(c).to.be.equal('a');
		});

		ezpg.connection(function(err, client, closeConnection){
			instance.mmm(client, 1, 2, 'a')
				.finally(function(){
					closeConnection();
					done();
				})
				.done();
		});
	});
});
