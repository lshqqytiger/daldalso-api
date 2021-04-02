const Daldalso = require('../dist/index.js');

async function get(){
	let result = await Daldalso.search('검은');
	
	console.log(result);
}

get();