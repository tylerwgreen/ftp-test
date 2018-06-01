const FtpSrv = require('ftp-srv');

class FTPServer {
	constructor(options = {}) {
		console.log('FTPServer.constructor', options);
		// merge options
		this.options = Object.assign({
			ip: null,
			port: null,
			rootDir: null,
			greeting: null,
			username: null,
			password: null
		}, options);
		// config ftp
		this.configFtpServer();
	}
	
	configFtpServer(){
		// create the FtpSrv
		this.svr = new FtpSrv('ftp://' + this.options.ip + ':' + this.options.port, {
			// pasv_range:		9877,
			// pasv_range:		22,
			greeting:		this.options.greeting,
// greeting:		false,
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
		
		// init svr listeners
		this.svr.on('login', ({username, password}, resolve, reject) => {
			console.log('login | username', this.options.username);
			console.log('login | password', this.options.password);
			if(username === this.options.username && password === this.options.password){
				// resolve({root: require('os').homedir()});
				resolve({root: this.options.rootDir});
			}else{
				reject(new Error('Bad username or password'));
			}
		});
		
		this.svr.on('client-error', ({connection, context, error}) => {
			console.log('client-error | connection', connection);
			console.log('client-error | context', context);
			console.log('client-error | error', error);
		});
		
		// start svr
		this.svr.listen()
			.then(function(){
				console.log('ftpServer.listen.then');
			});
	}
}
module.exports = FTPServer;