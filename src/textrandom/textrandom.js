var sepLines;
var numElements;
var listFile;
var repeatElements;
var fileString = "a:b:c:d:e:f:g:h:i:j:k:l:m:n:o:p:q:r:s:t:u:v:w:x:y:z";

function runScript() {}

function windowgetParameters(a,b) {window.opener.logit(a,b);}


function passresult(p,m) {
    if (m == "create") {
        openerform.password.value = p;
        openerform.reference.value = "none";
        window.opener.logit("CreateDone");
    }
    if (m == "enter") {
        if (openerform.password.value == p) {
            alert("Login Success!");
            window.opener.logit("EnterSuccess");
        }
        else {
            alert("Login Failure!");
            window.opener.logit("EnterFailure");
        }
        openerform.password.value == p;
    }
    window.close();
}

var openerform = window.opener.lastform;

var mode                = openerform.mode.value;
var system              = openerform.system.value;
var user                = openerform.user.value;
var scheme              = openerform.scheme.value;
var condition           = openerform.condition.value;

//==============================================================================================================
//GLOBAL VARIABLES
//==============================================================================================================

//Variables

var listElements;
var listLen;

var assignedPassword = "";
var cf, ef;

//==============================================================================================================
//  FORMS
//==============================================================================================================

function showForm() {


    if (mode == "create") {
	cf.style.display="block";
	ef.style.display="none";
    }
    if (mode == "enter") {
	cf.style.display="none";
	ef.style.display="block";
	ec.inputPassword.value = "";

    }
}

function keyPressHandler(e){
    e = e || window.event;
    keyID = e.which;

    if (keyID == 13) {
        enterPassword();
	return false;
    }
    else {
        return true;
    }

}


//==============================================================================================================
//  PASSWORDS
//==============================================================================================================


function changePassword() {

    assignedPassword = "";
    getRandomSetInit(listElements);

    for (var i = 0; i < numElements; i++) {
	if (repeatElements == "1")
	    assignedPassword += listElements[getRandom(0,listLen-1)];
	else
	    assignedPassword += getRandomSetNext();
    }

    cc.realPassword.value = assignedPassword;
    cc.pracPassword.value = "";
}

function togPassword() {

    var p = cc.realPassword.value;
    if (p == "") {
	cc.realPassword.value = assignedPassword;
	runScript("databasefunctions.php", windowgetParameters("pwtog","show"));	
    }
    else {
	cc.realPassword.value = "";
        runScript("databasefunctions.php", windowgetParameters("pwtog","hide"));	
    }
}

function enterPassword() {

    if (mode == "create") {
	if (cc.pracPassword.value == assignedPassword) {
	    alert("Yay! You entered your password correctly!");
            runScript("databasefunctions.php", windowgetParameters("pwtest","good"));	
	}	    
	else {
	    alert("Oops! You made a mistake!");
            runScript("databasefunctions.php", windowgetParameters("pwtest","bad"));	
	}	    
        cc.pracPassword.value = "";
	return;
    }
    else {

	v = ec.inputPassword.value;
	m = mode;
	passresult(v,m);
    }

}

function acceptPassword() {
    v = assignedPassword;
    m = mode;
    runScript("databasefunctions.php", windowgetParameters("passwordSubmitted",encodeURI("pw:"+v)));	
    passresult(v,m);	
}

function getRandom(min, max) {
    var range = max-min+1
    var randomnum = Math.floor(Math.random()*range)
    randomNum = min + randomnum;
    return(randomnum);
}

var rset;
var rsetlen;

function getRandomSetInit(a) {
    rset = a.slice(0);
    rsetlen = rset.length - 1;
}

function getRandomSetNext() {
    if (rsetlen == 0) return null;	
    r = getRandom(0, rsetlen-1);	
    var retval = rset[r];
    rset[r] = rset[--rsetlen];
    return retval;
}


//==============================================================================================================
//  START
//==============================================================================================================

function startPage() {
    
    console.log(mode);
    window.resizeTo( 480,300 )

    cf = document.getElementById("createform");
    ef = document.getElementById("enterform");
    cc = document.getElementById("createcontrol");
    ec = document.getElementById("entercontrol");
    showForm();	
    
    if (mode == "create") {
	changePassword();

    }
    
}

$( document ).ready(function() {
    console.log(mode);
    $.getJSON( "conditions.json", function( data ) {
	console.log(condition);
	settings = data[condition];
        for (var key in settings) {
	    console.log(key);
	    console.log(settings[key]);
	    console.log("---");
	    val = settings[key];
	    window[key] = settings[key];
	    if (val == "0") window[key]=0;
	}
	console.log(settings);
	console.log("getting list");
	url = "../" + listFile;
	console.log(url);
	$.get(url, function(result) {
	    if (result == 'ON') {
	    } else if (result == 'OFF') {
	    } else {
		listElements = result.split("\n");
		listLen = listElements.length-1;
	    	console.log("list reads");
		startPage();
	    }
	});
    });  
})
