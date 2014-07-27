var ezpg = require('ezpg'),
	q = require('q'),
	_ = require('lodash');

function isPostgresClient(o){ return o && _.isFunction(o.func) && _.isFunction(o.query); }

function containZalgo(fn){
	var d = q.defer();

	process.nextTick(function(){
		d.resolve(fn);
	});

	return d.promise;
}

function databaseMethod(instance){
	return function(names, fn){
		names = _.flatten([names]);
		fn = fn.bind(instance);

		var run = function(){
			var args = _.toArray(arguments);

			if (isPostgresClient(_.first(args)))
				return containZalgo(fn.bind.apply(fn, [instance].concat(args)));

			return runWithClient(_.partialRight.apply(_, [fn].concat(args)));
		};

		names.forEach(function(name){
			instance[name] = run;
		});

		return run;
	};
}

function runWithClient(func){
	var d = q.defer();

	ezpg.connection(function(err, client, done){
		if (err) return d.reject(err);

		var result = func(client);

		if (result && _.isFunction(result.then)){
			result
				.then(d.resolve.bind(d))
				.catch(d.reject.bind(d))
				.finally(done.bind(null, undefined))
				.done();
		} else {
			d.resolve();
			setImmediate(done.bind(null, undefined));
		}
	});

	return d.promise;
}


module.exports = databaseMethod;
