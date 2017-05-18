const spawn = require('child_process').spawn;
const express = require('express');
const ls = spawn('ls', ['-lh', '/usr']);
const exec = require('child_process').exec;
var fs = require('fs');
// Constants
const PORT = 3000;

writePortNum = 5000;

var extPort = 49160;

var imageNum = 1;

// App
const app = express();

app.get('/', function (req, res) {
	resData = launchContainer();


function writePorts(portNum){
	fs.truncate("port.txt", 0, function() {
    fs.writeFile("port.txt", portNum , function (err) {
        if (err) {
            return console.log("Error writing file: " + err);
	        }
	        writeDockerFile(portNum);
	    });
	});
}

function writeDockerFile(portNum){
	fs.truncate("Dockerfile", 0, function() {
	content = 	"FROM node:boron \n" + 

				"# Create app directory\n"+
				"RUN mkdir -p /usr/src/app\n"+
				"WORKDIR /usr/src/app\n"+

				"# Install app dependencies\n"+
				"COPY package.json /usr/src/app/\n"+
				"COPY port.txt /usr/src/app/\n"+
				"RUN npm install\n"+

				"# Bundle app source\n"+
				"COPY . /usr/src/app\n"+

				"EXPOSE " + portNum+ "\n"+
				"CMD [ \"npm\", \"start\" ]\n"

    fs.writeFile("Dockerfile", content , function (err) {
        if (err) {
            return console.log("Error writing file: " + err);
	        }
	        buildAndRunImage();
	    });
	});
}

function buildAndRunImage(){

	exec('docker build -t ' +  'helloworld'+imageNum + ' .', (error, stdout, stderr) => {
	  if (error) {
	    console.error(`exec error: ${error}`);
	    return;
	  }
		exec('docker run -p '+extPort+':' + writePortNum + ' -d ' + 'helloworld'+imageNum , (error, stdout, stderr) => {
			if (error) {
				console.error(`exec error: ${error}`);
				console.log("ERROR");
				return;
			}
			else{
				console.log("NO ERROR \n")
				//extPort++;
				console.log(`stdout: ${stdout}`);
				console.log(`stderr: ${stderr}`);

				res.send({
					'status' : 'Success',
					'msg' : 'New Container launched',
					'port' : extPort
				});

				writePortNum+=100
				extPort++;
				imageNum++;
				return (stdout);
			}

		});
	});
}

function launchContainer(){
	writePorts(writePortNum);
	//console.log('\n\n\nlaunching on port '+extPort+'\n');
	//console.log("INSODE REQUEST\n");
	//console.log("incremented port :" + extPort+"\n");
}


});


app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
