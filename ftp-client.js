/**
 * Include dependencies
 */
console.log('Include dependencies');
var Client = require('ftp');

file = dir + file;
console.log('Projector.files.ftp', file);
var c = new Client();
c.on('greeting', function(msg){
	console.log('Projector.files.ftp | greeting: ', msg);
});
c.on('ready', function(){
	console.log('Projector.files.ftp | ready: ');
	c.list(function(err, list) {
		if(err)
			console.error('Projector.files.ftp | ready err: ', err);
			// throw err;
		console.dir(list);
		// c.list();
		c.put(file, 'ftp-anonymous', true, function(){
			console.log('Projector.files.ftp | ready c.put callback');
		});
		c.end();
	});
});
c.on('close', function(hadErr){
	console.log('Projector.files.ftp | close hadErr: ', hadErr);
	if(hadErr)
		console.error('Projector.files.ftp | close error');
		// throw new Error('Projector.files.ftp | close error');
});
c.on('end', function(){
	console.log('Projector.files.ftp | end');
	throw new Error('test done');
});
c.on('error', function(err){
	console.log('Projector.files.ftp | error');
	if(err)
		console.error('Projector.files.ftp | error err: ', err);
		// throw new Error(err);
});
// connect to localhost:21 as anonymous 
c.connect({
	host:			'216.85.20.156',
	port:			9876,
	secure:			false,
	secureOptions:	{},
	// user:			'tyler',
	// password:		'green0',
	// user:			'test',
	// password:		'test',
	// user:			'anonymous',
	// password:		'anonymous@',
	connTimeout:	10000,
	pasvTimeout:	10000,
	keepalive:		10000,
});