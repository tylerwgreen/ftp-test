/**
 * Include dependencies
 */
console.log('Include dependencies');
var FtpSrv = require('ftp-srv');
var ftpServer = new FtpSrv('ftp://0.0.0.0:9876', {
// var ftpServer = new FtpSrv('ftp://216.85.20.156:9876', {
	pasv_range:		9877,
// var ftpServer = new FtpSrv('ftp://0.0.0.0:21', {
	// pasv_range:		22,
	greeting:		'Hello from the ftp!',
	tls:			false,
	anonymous:		false,
	blacklist:		[],
	// blacklist:		['RMD', 'RNFR', 'RNTO'],
	// whitelist:		['STOR', 'APPE'],
	// whitelist:		['STOR'],
	whitelist:		[],
	file_format:	'ls'
	// file_format:	'ep'
});
ftpServer.on('login', ({username, password}, resolve, reject) => {
	console.log('login | username', username);
	console.log('login | password', password);
	if(username === 'tyler' && password === 'green0'){
		// resolve({root: require('os').homedir()});
		resolve({root: 'ftp'});
	}else if(username === 'anonymous'){
		resolve({root: 'ftp-anonymous'});
	}else{
		reject(new Error('Bad username or password'));
	}
});
ftpServer.on('client-error', ({connection, context, error}) => {
	console.log('client-error | connection', connection);
	console.log('client-error | context', context);
	console.log('client-error | error', error);
});
ftpServer.listen()
	.then(function(){
		console.log('ftpServer.listen.then');
	});