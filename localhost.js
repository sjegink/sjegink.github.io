'use strict';

const http = require('http');
const fs = require('fs');

http.createServer((req,res)=>{

	let path = req.url.replace(/[#?].*/,"");
	if(path === "/") path = "/index.html";

	// 403 Forbidden if access to upperDirectory
	if(/(^|\/)\.{2,}(\/|$)/.test(path)){
		res.writeHead(403);
		res.end();
	}

	const stream = fs.createReadStream(process.cwd() + path);
	stream.pipe(res);
	stream.on('error', e=>{
		if(/ENOENT/.test(e)){
			return res.writeHead(404),res.end();
		}else{
			console.warn(e);
			return res.writeHead(500),res.end();
		}
	});

}).listen(80);
console.log(`localhost is open.`);