var express = require('express');
var bodyparser = require('body-parser');
var cors = require('cors');
var needle = require('needle');
const spawn = require('child_process').spawn;

port = 9000;

serverCount = 0.0;

app = express();

app.use(express.static('.'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(cors());

var ipAddressPool = [];
var ipIndex = 0;
var requestCount = 0;
var serverCount = 0;

//loadMonitor = setInterval(requestRateMonitor , 5000);

// app.post('/server/ip/register' , function(req , res){
// 	serverIP = req.body.serverIP;
// 	if(!ipAddressPool.includes(serverIP)){
// 		ipAddressPool.push(serverIP);
// 		console.log('registered ' + serverIP);
// 	}	
// 	res.send({
// 		'ip' : serverIP
// 	}) 
// });

if(serverCount == 0){
	spawnNewServer()
}


// app.get('/' , function(req , res){
// 	spawnNewServer(res);
// })

app.post('/server/request/redirect' , function(req , res){
	console.log("request : " + req.body.requestString + "\n");
	requestCount++;
	var recvData = req.body.requestString;
	var url = recvData.split('/');
	var httpMethod = url[url.length-1];
	var apiToBeCalled = recvData.substring(0,recvData.lastIndexOf('/'));
	//console.log(apiToBeCalled + ' : ' + httpMethod + "\n");
	console.log(url + "\n");
	var data;
	if(req.body.data != undefined)
	{
		data = req.body.data;
	}
	selectedServer = allocateServer(function(selectedServer){
		
		finalApi = 'http://localhost:' + selectedServer + apiToBeCalled;

		//selectedServer += apiToBeCalled;
		//selectedServer = 'http://localhost:49160/hello'
		
		//console.log("SELECT : " + selectedServer);

		//finalApi = 'http://localhost:'+selectedServer;

		console.log(finalApi);

		if(httpMethod == "GET")
		{	
			console.log("INSIDE GET")
			needle.get(finalApi, function(error, response) {
			  //if (!error ){
				res.send({
					'status' : response.body.status,
					'msg' : response.body.msg
				})			  	
			  //}

			});
		}
		else{
			if(httpMethod == "POST")
			{
				//data = {req.body.requestString.data};
				options = {};
				console.log('final : ' + finalApi);
				//needle.post(finalApi,data,{multipart:false}).on('readable', function() { /* eat your chunks */ }).on('done',function(error, response) {
				console.log(data);
				needle.post(finalApi,data,options ,function(error, response){

				//if (!error && response.statusCode == 200)
					res.send({
						'status' : 'Success',
						'msg' : response.body.data
					})
				});
			}
		}
	});
});

function allocateServer(callBack){
	max = ipAddressPool.length;
	index = ipIndex%max;
	ipIndex++;
	console.log(ipAddressPool[index]);
	callBack(ipAddressPool[index]);
}

function requestRateMonitor(){
	console.log('Request count : ' + requestCount + "\n");
	reqPerSec = requestCount/5.0;
	requestCount = 0;
	reqRatePerServ = reqPerSec/serverCount;
	if(reqRatePerServ > 1){
		spawnNewServer();
	}
}

function spawnNewServer(){
	needle.get('http://localhost:3000/', function(error, response) {
		if (!error && response.statusCode == 200){
			serverCount++;
		  	serverIP = response.body.port;
			if(!ipAddressPool.includes(serverIP)){
				ipAddressPool.push(serverIP);
				console.log('registered ' + serverIP);
			}
			// res.send({
			// 	'status' : 'Success',
			// 	'msg' : response.body
			// })
		}
	});
}

setInterval(requestRateMonitor , 5000);

app.listen(port , function(){
	console.log('LoadBalancer running on port : ' + port);
});