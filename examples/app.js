const Daldalso = require('../dist/index.js');

async function get(){
	let result = await Daldalso.getKKuTuServers();
	
	console.log(result);
}

get();