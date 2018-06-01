var execFile	= require('child_process').execFile;
var fs			= require('fs');

var Projector = {
	params: {
		binDir:		null,
		videosDirs:	null,
		initWait:	5000,	// time to wait for files to arrive in videos.dirs.old during init
		newWait:	10000,	// time to wait to check for new files in videos.dirs.new
		// initWait:	1000,	// time to wait for files to arrive in videos.dirs.old during init
		// newWait:	1000,	// time to wait to check for new files in videos.dirs.new
	},
	init: function(params){
		console.log('Projector.init', params);
		this.params = Object.assign(this.params, params);
		this.files.init(Projector.projectRandom);
		this.files.checkNewTimerInit();
		// this.testRandomization();
	},
	testRandomization: function(){
		console.log('Projector.testRandomization');
		this.files.init(function(){
			console.log('Projector.testRandomization init callback');
			var its	= 25;
			for(var i = 0; i <= its; i++){
				console.log(i, Projector.files.random());
			}
		});
	},
	projectRandom: function(){
		console.log('Projector.project');
		if(true === Projector.files.hasNew()){
			var file = Projector.files.getNew();
			console.log('Projector.project | Projecting new file: ' + file);
		}else{
			var file = Projector.files.random();
			console.log('Projector.project | Projecting random file: ' + file);
		}
		console.log('Projector.project | executing file: ' + Projector.params.binDir + 'projector-project');
		child		= execFile(
			Projector.params.binDir + 'projector-project',
			[file],
			function(error, stdout, stderr){
				if(error){
					console.log('Projector.project | Projector.project.error.stderr: ' + stderr);
					throw new Error(error);
				}else{
					console.log('Projector.project | Projector.project.success.stdout: ' + stdout);
					Projector.projectRandom();
				}
			}
		);
	},
	files: {
		file:	null,
		files:	{
			all:		[],
			new:		[],
			available:	[],
		},
		init:	function(callback){
			console.log('Projector.files.init');
			// search for existing files in old dir
			fs.readdir(Projector.params.videosDirs.old, (err, files) => {
				console.log('Projector.files.init | Read files: ', files);
				if(err){
					throw new Error('Projector.files.init | ' + err);
				}else if(files.length <= 0){
					console.log('Projector.files.init | No video files in old dir, wait for files in new dir and re-init');
					setTimeout(function(){
						Projector.files.init(callback);
					}, Projector.params.initWait);
				}else{
					console.log('Projector.files.init | generate list of files from old dir: ', files);
					var its = 1;
					console.log('Projector.files.init | files.length: ' + files.length);
					files.forEach(function(file, err){
						console.log('Projector.files.init | its: ' + its);
						// the first file could be in files.new, then added here, so check for existing files
						var existingIndex = Projector.files.files.all.indexOf(file);
						if(existingIndex >= 0){
							console.log('Projector.files.init | ' + file + ' already exists in files.all at index: ' + existingIndex);
						}else{
							console.log('Projector.files.init | adding file ' + file + ' to end of files.all');
							Projector.files.files.all.push(file);
						}
						if(its >= files.length){
							console.log('Projector.files.init | starting projection', Projector.files.files.all);
							callback();
						}else{
							its++;
						}
					});
				}
			});
		},
		checkNewTimerInit: function(){
			console.log('Projector.files.checkNewTimerInit');
			Projector.files.addNew();
			setInterval(Projector.files.addNew, Projector.params.newWait);
		},
		addNew: function(){
			console.log('Projector.files.addNew');
			fs.readdir(Projector.params.videosDirs.new, (err, files) => {
				if(err){
					throw new Error('Projector.files.addNew | ' + err);
				}else if(files.length <= 0){
					console.log('Projector.files.addNew | No new files to add');
				}else{
					files.forEach(function(file){
						console.log('Projector.files.addNew | moving file ' + file + ' to videosDirs.old');
						fs.rename(Projector.params.videosDirs.new + file, Projector.params.videosDirs.old + file, function(){
							console.log('Projector.files.addNew | adding file ' + file + ' to end of files.all');
							Projector.files.files.all.push(file);
							console.log('Projector.files.addNew | adding file ' + file + ' to end of files.new');
							Projector.files.files.new.push(file);
						});
					});
				}
			});
		},
		hasNew: function(){
			// console.log('Projector.files.hasNew');
			return Projector.files.files.new.length > 0 ? true : false;
		},
		getNew: function(){
			// console.log('Projector.files.getNew');
			if(false === Projector.files.hasNew())
				throw new Error('Projector.files.getNew | No new files available');
			var file = Projector.files.files.new[0];
			Projector.files.file	= file;
			console.log('Projector.files.getNew | Removing file ' + file + ' from files.new');
			Projector.files.files.new.splice(0, 1);
			return Projector.params.videosDirs.old + file;
		},
// randI: 0,
		random: function(){
			console.log('Projector.files.random');
// console.log('Projector.files.random', Projector.files.randI);
// if(Projector.files.randI >= 10)
	// throw new Error('Too many its');
// Projector.files.randI++;
// console.log('Projector.files.random | files.all: ', Projector.files.files.all);
// console.log('Projector.files.random | files.available: ', Projector.files.files.available);
			if(Projector.files.files.available.length <= 0){
				console.log('Projector.files.random | all available files have been played, copy all into available');
				Projector.files.files.available = Projector.files.files.all.slice(0);
			}
			var file		= Projector.files.files.available[Math.floor(Math.random() * Projector.files.files.available.length)];
			if(typeof file === 'undefined')
				throw new Error('Projector.files.random | No files available in all arr, app was not properly initialized');
			if(
					file === Projector.files.file
				&&	Projector.files.files.available.length > 1
			){
				// console.log('Projector.files.random | files.available.length: ' + Projector.files.files.available.length);
				console.log('Projector.files.random | file ' + file + ' was the previously played file, find another random file');
				return Projector.files.random();
			}
			console.log('Projector.files.random | removing file ' + file + ' from available arr');
			var fileIndex	= Projector.files.files.available.indexOf(file);
			Projector.files.files.available.splice(fileIndex, 1);
			Projector.files.file	= file;
			return Projector.params.videosDirs.old + file;
		}
	}
};
module.exports = Projector;