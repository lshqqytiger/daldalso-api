const Daldalso = require('../dist/index.js');

async function get(){
	let result = await Daldalso.getJavaUsers();
	
	console.log(result);
}

get();