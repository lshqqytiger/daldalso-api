const Daldalso = require('../dist/index.js');

async function get(){
	let result = await Daldalso.Sorrydl.getList();
	
	console.log(result);
}

get();