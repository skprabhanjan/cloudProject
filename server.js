//'use strict'; "mysql": "^2.13.0",
var fs = require('fs');

var port;

	fs.readFile('port.txt', 'utf8' , function(err, fd) {
	   if (err) {
	      return console.error(err);
	   }
	  port =  fd;     
	

var express = require('express');
var app =express();
var cors = require('cors');
var mysql = require('mysql');
var bodyParser = require('body-parser');
//var async = require('async');

// var port = 3500;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));


// var connection = mysql.createConnection(
// 	{
// 		host : 'localhost',
// 		user : 'root',
// 		password : 'java',
// 		database : 'bookcart'
// 	});

var connection = mysql.createPool({
connectionLimit : 100,
host : 'localhost',
user : 'root',
password : 'prab',
database : 'bookcart'
});

// var del = connection._protocol._delegateError; connection._protocol._delegateError = function(err, sequence){ if (err.fatal) { console.trace('fatal error: ' + err.message); } return del.call(this, err, sequence); };

// connection.connect(function(err){
// 	if(err)
// 	{
// 		console.log("Error occured : "+err.stack);
// 		return;
// 	}
// 	console.log('Connected to MySQL with thread Id : '+ connection.threadId);
// });

//var a = [{'a':'b'},{'w':'e'}]
app.get("/",function(req,res){
    res.sendFile(__dirname + '/index.html');
});

var limit = 10;
app.get('/api',function(req,res){
	res.send(a);
});

app.get('/get/books',function(req,res){
	var query = 'SELECT * FROM book ORDER BY c_no LIMIT ?'

	connection.query(query,[limit],function(err,rows){
		if(!err && rows){
			res.send({
				"data":rows
			});
		}
		else{
			res.send({
				"data":'error'
			});
		}
	});
});

app.post('/add/books',function(req,res){
	var recvData = req.body;
	var name = recvData.bookName;
	var description = recvData.desc;
	var price = parseInt(recvData.price);
	var copies = parseInt(recvData.copies);
	var category = parseInt(recvData.cat_no);
	console.log(recvData);
	var query = 'INSERT INTO book (name,description,price,copies,c_no) VALUES (?,?,?,?,?)'

	connection.query(query,[name,description,price,copies,category],function(err){
		console.log(err);
		if(!err){
			res.send({
				"data":"success"
			});
		}
		else{
			res.send({
				"data":err
			});
		}
	});
});

app.put('/get/books/copies',function(req,res){
	var recvData = req.body;
	var copies = recvData.copies;
	var name = recvData.bookName;
	console.log(name);
	var query = 'UPDATE book SET copies = ? WHERE name = ? AND copies > 0'
	connection.query(query,[copies-1,name],function(err){
		if(!err){
			res.send({
				"data":"success"
			});
		}
		else{
			res.send({
				"data":"error"
			});
		}
	});
});

app.post('/remove/books',function(req,res){
	var recvData = req.body;
	var name = recvData.bookName;
	console.log(name);
	var query = 'DELETE FROM book WHERE name = ?'
	connection.query(query,[name],function(err){
		if(!err){
			res.send({
				data:"success"
			});
		}
		else{
			res.send({
				data:"error"
			});
		}
	});
});

app.post('/get/category',function(req,res){
	var recvData = req.body;
	var cat_names = recvData.category;
	var cat_names = recvData.cat_name;
	console.log(req.body);
	var query = 'SELECT cat_no FROM category WHERE cat_names = ?'

	connection.query(query,[cat_names],function(err,rows){
		if(!err && rows){
			res.send({
				"data":rows
			});
		}
		else{
			console.log('err');
			res.send({
				"data":'error'
			});
		}
	});
});

app.post('/add/category',function(req,res){
	var recvData = (req.body);
	console.log(typeof(recvData.cat_name));
	var cat_no = 0 , count = 0; var duplicate;
	var cat_names = recvData.cat_name;
	if(count==0)
	{		var query = 'SELECT MAX(cat_no) as cat_no FROM category'
			connection.query(query,function(err,rows){
			if(!err && rows){
				cat_no = JSON.parse(JSON.stringify(rows))[0].cat_no;
				cat_no++;
				count = 1;
				//console.log(rows);
				console.log(JSON.stringify(rows)[0]);
				console.log("c : "+cat_no);
				console.log(JSON.parse(JSON.stringify(rows)).length);
			}
			else{
				
			}
		});
	}
	console.log(cat_names);
	
	var query2 = 'INSERT INTO category(cat_no,cat_names) VALUES(?,?)'
		 connection.query(query2,[cat_no,cat_names],function(err){
		if(!err){
			cat_no++;
				res.send({
					"data":"success"
				});
			}
			else{
				res.send({
					"data":"error"
				});
			}
		});

	
	/*var query1 = 'SELECT * FROM category WHERE cat_names = (?)'
	connection.query(query1,[cat_names],function(err,rows){
		if(!err && rows){
			console.log('boom');
			duplicate = true;
		}
		else{
			if(!err){
				console.log('corect');
				duplicate = false;
			}
			else{
				console.log('csgss');
				console.log(rows);
				duplicate = true;
			}
		}
		if(!duplicate)
	{*/
		
	});


	
		

app.post('/del/category',function(req,res){
	var recvData = req.body;
	var cat_names = recvData.cat_name;
	var present;
	console.log(cat_names);

		var query1 = 'DELETE FROM category WHERE cat_names = ?'
		connection.query(query1,[cat_names],function(err){
		if(!err){
			res.send({
				"data":"success"
			});
		}
		else{
			res.send({
				"data":"error"
			});
		}
	});

	});

app.post('/modify/books/price',function(req,res){
	var recvData = req.body;
	var price = parseInt(recvData.newPrice);
	var name = recvData.cat_name;
	var present;
	console.log(name);
	console.log(price);

	var query = 'SELECT * FROM book WHERE name = ?'

	connection.query(query,[name],function(err,rows){
		if(!err && rows){
			present = true;
		}
		else{
			console.log('present');
			present = false;
		}

		if(present)
	{
		var query1 = 'UPDATE book SET price = ? WHERE name = ?'
		connection.query(query1,[price,name],function(err){
		if(!err){
			res.send({
				"data":"success"
			});
		}
		else{
			res.send({
				"data":"error"
			});
		}
		});
	}
	else{
		res.send({
				"data":"error"
			});
	}
	

	});

	
});

app.post('/get/books/price',function(req,res){
	var recvData = req.body;
	var name = recvData.cat_name;
	console.log(name);
	var query = 'SELECT price FROM book WHERE name = ?'
	connection.query(query,[name],function(err,rows){
		if(!err && rows){
			res.send({
				"data":rows
			});
		}
		else{
			res.send({
				"data":"error"
			});
		}
	});
});

app.get('/get/categories',function(req,res){
	var query = 'SELECT cat_names FROM category';
	connection.query(query,function(err,rows){
		if(!err && rows){
			res.send({
				"data":rows
			});
		}
		else{
			res.send({
				"data":"error"
			});
		}
	});
});

app.post('/get/category/books',function(req,res){
	var recvData = req.body;
	var cat_no = recvData.c_no;
	console.log(recvData);
	//var cat_no = recvData.c_no;
	var query = 'SELECT * FROM book WHERE c_no = ?';
	connection.query(query,[cat_no],function(err,rows){
		if(!err && rows){
			res.send({
				"data":rows
			});
		}
		else{
			res.send({
				"data":"error"
			});
		}
	});

});

app.post('/eachCategory/books',function(req,res){
	var query = 'SELECT * FROM category';
	//console.log('rows');
	connection.query(query,function(err,rows){
		if(!err && rows){

			res.send({
				"data":rows
			});
		}
		else{
			res.send({
				"data":"error"
			});
		}
	});
});



app.listen(port,function(){
	console.log("Listening on "+port);
});

});

