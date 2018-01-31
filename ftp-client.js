const chokidar = require('chokidar');
const FTPClient = require('./lib/FTPClient.js');

var dirToWatch = './files/watch';
var servers = [];

for(i = 0; i < 3; i++){
	servers.push({
		id: i,
		// ip: '216.85.20.156',
		ip: '127.0.0.1',
		port: '678' + i,
		username: 'tyler',
		password: 'green0'
	});
}
// console.log(servers);

class VideoFTPer {
	constructor(options = {}) {
		console.log('VideoFTPer.constructor', options);
		this.options = Object.assign({
			dirToWatch: null,
			servers: [],
		}, options);
		this.currentServerID = -1;
		this.watcher = chokidar.watch(this.options.dirToWatch, {})
			.on('error', this.watcherError)
			.on('add', path => this.ftpFile(path));
	}
	
	watcherError(err){
		console.log('VideoFTPer.watcherError');
		throw err;
	}
	
	ftpFile(path){
		console.log('VideoFTPer.ftpFile', path);
		var client = this.getFTPClient();
	}
	
	i = 0;
	getRandomServerConfig(){
		if(i >= 100)
			throw new Error('oops');
		console.log('VideoFTPer.getRandomServerConfig', path);
		// if(this.currentServerID === 
		return getRandomServerConfig();
		i++;
	}
	
	getFTPClient(){
		console.log('VideoFTPer.getFTPClient', path);
		var config = this.getRandomServerConfig();
	}
	
}
// module.exports = VideoFTPer;

new VideoFTPer({
	dirToWatch: dirToWatch,
	servers: servers,
});