ezpg-promise-method
===================

Ensure that the first parameter is always the pgClient.

The method should return a promise.

If the pgClient is not explicitly passed, then obtaining(and releasing) a new client is handled automatically.  If the pgClient is explicitly passed in, then the caller is responsible for everything related to that connection.

```js
var Method = require('ezpg-promise-method'),
	ezpg = require('ezpg'),
	q = require('q');

var obj = {},
	method = Method(obj);

method('add', function(client, a, b){
	var d = q.defer();

	client.query('select $1 + $2', [a, b], function(err, result){
		d.resolve(result);
	});

	return d.promise;
});

// call it without a client
obj.add(1, 2)
	.then(function(result){
		console.dir(result);
	});

// or call it with a client
ezpg.transaction(function(err, client, commit, rollback){
	obj.add(client, 3, 4)
		.then(function(result){
			rollback();
		});
});
```



