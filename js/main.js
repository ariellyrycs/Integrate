var inputpreview= function() {
	var tex = AMTparseExpr(document.getElementById("eq").value.replace(/^\s+/g,""),false)[0];
	var previewElement = document.getElementById('preview');
	var output=document.getElementById("trybubble");
	if(tex){
		output.style.display="inline-block";
    	previewElement.setAttribute('src', 'http://www.imathas.com/cgi-bin/mimetex.cgi?'+tex);
    }else{
    	output.style.display="none";
    	previewElement.removeAttribute("src");
    } 
}

function checksubmit(){

	var tryeq = document.getElementById("eq").value;
	var variable = document.getElementById("variable").value;
	var from = document.getElementById("from").value;
	var to = document.getElementById("to").value;
	var result = integrate(tryeq, variable, from, to);
	document.getElementById('set').innerHTML=result;	
}

function onlynumbers(id){
	if (! /[\+\-0-9\.]/g.test(id.value)){
		id.value = id.value.match(/[\+\-0-9\.]/g,'');
	}
}

function onlyletters(id){
	if (! /[a-zA-Z]/g.test(id.value)){
		id.value = id.value.match('[a-zA-Z]','');
	}
}
