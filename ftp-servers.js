const FTPServer = require('./lib/FTPServer.js');
const dirToWatch = './files/
for(i = 0; i < 3; i++){
	new FTPServer({
		id: i,
		// ip: '216.85.20.156',
		ip: '127.0.0.1',
		port: '678' + i,
		rootDir: './files/ftp/' + i,
		greeting: 'Greetings from ' + i + '!',
		username: 'tyler',
		password: 'green0'
	});
}