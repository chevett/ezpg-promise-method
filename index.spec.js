var ezpg = require('ezpg'),
	method = require('./index.js'),
	expect = require('chai').expect;

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

	it('should resolve the right value without a client', function(done){
		var instance = {},
		addMethod = method(instance);

		addMethod('mmm', function(client, a, b){
			return a + b;
		});

		instance.mmm(1, 2)
			.then(function(three){
				expect(three).to.be.equal(3);
				done();
			})
			.done();
	});

	it('should resolve the right value with a client', function(done){
		var instance = {},
		addMethod = method(instance);

		addMethod('mmm', function(client, a, b){
			return a + b;
		});

		ezpg.connection(function(err, client, closeConnection){
			instance.mmm(client, 1, 2)
				.then(function(three){
					expect(three).to.be.equal(3);
					closeConnection();
					done();
				})
				.done();
		});
	});

	it('should work with an array parameter', function(done){
		var instance = {},
		addMethod = method(instance);

		addMethod(['mmm', 'meth2'], function(client, arr){
			expect(client).to.be.ok;
			console.dir(arr);
			expect(arr).to.be.eql([1,2,'a']);
		});

		instance.meth2([1, 2, 'a'])
			.finally(function(){
				done();
			})
			.done();
	});

	it('should work with an array parameter and a client', function(done){
		var instance = {},
		addMethod = method(instance);

		addMethod(['mmm', 'meth2'], function(client, arr){
			expect(client).to.be.ok;
			console.dir(arr);
			expect(arr).to.be.eql([1,2,'a']);
		});

		ezpg.connection(function(err, client, closeConnection){

			instance.meth2([1, 2, 'a'])
				.finally(function(){
					closeConnection();
					done();
				})
				.done();
		});
	});
});
