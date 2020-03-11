function windowrunScript() {}  //DUMMY
function windowgetParameters(a,b) {
    window.opener.logit(a,b);
}

function passresult(p,m) {
    if (m == "create") {
	openerform.password.value = p;
	openerform.reference.value = datastring;
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
var system		= openerform.system.value;
var user		= openerform.user.value;
var scheme		= openerform.scheme.value;
var condition		= openerform.condition.value;

var storyString = "";
var canvasready = false;

//==============================================================================================================
//GLOBAL VARIABLES
//==============================================================================================================

var datastring;
var storyList = 0;
var practice = 1;

//Variables

var c, nx, ny, dx, dy, picminx, picminy, micmaxx, pixmaxy;
var picx;
var picy;


var az = "ABCDEFGHIJKLMNOPQRSTUVWXY";
var za = "123456789abcdefghijklmnopqrstuvwxy";


var paper;
var names;
var data = new Array();
var i = 0;

var password = "";
var passwordSet = Array();
var passwordSetCount = 0;

var inputPassword = "";
var inputPasswordSet = Array();
var inputPasswordSetCount = 0;

var picfile;
var picname;
var filename;
//var fileString = fileString.substr(0,fileString.length-1);
var lines; // = fileString.split(":");

//var storyString = storyString.substr(0,storyString.length-1);
var stories; // = storyString.split(":");

//This creates the array of unique password elements
var passwordElements;
var e;

var recogSet = Array();
var passwordRecogSet = Array();

var allsq = "black";
var allb1 = "black";
var allb2 = "white";

var pwdsq = "yellow";
var pwdb1 = "yellow";
var pwdb2 = "red";

var allopacity = 0.0;

var showp = false;
var choosingPic = false;

var circles;
var clearButton;
var button;
var clear;
var below;

var filePos;
var tileFiles;
var tileImages;
var tileImageSet;

var div0;
var div1;
var div2;
var div3;
var div4;
var div5;
var div6;
var div7;

var mlCanvas;
var imgPlace;
var pwdPic = Array();
var doShuffle = 0;
var shuffleButton = 0;
var madlib = 0;
var storyNum;
var storyRows = Array();
var box = Array();
var grey = true;
var inp = false;

var logpass = 0;

//for Debugging

var tracing = false;

function mask(x) { if (logpass) return (x); else return ("XXXX"); }

function traceit(string) {
    if (tracing) $.prompt(string);
}

//==============================================================================================================
//  FORMS
//==============================================================================================================

function showForm() {
    
    div4 = document.getElementById("digitLogin");
    div0 = document.getElementById("pwdChoose");
    div1 = document.getElementById("picChoose");
    div2 = document.getElementById("pwdCheck");
    div3 = document.getElementById("pwdShuffle");		
    
    //help divs
    div5 = document.getElementById("imagePT_help");
    div6 = document.getElementById("blankPT_help");
    div7 = document.getElementById("objectPT_help");
    div8 = document.getElementById("gridsure_help");
    div9 = document.getElementById("NS_ORPT_help");
    div10 = document.getElementById("SB_ORPT_help");
    
}

function keyPressHandler(e){
    e = e || window.event;
    keyID = e.which;
    if (keyID == 13) enterGridPwd();
}


//When someone clicks on the page, do something

function doClick(coords) {
    this.ij = coords;
    var current = this;
    this.invoke = function () {
	
	if (choosingPic) return;
	if (mode=="enter" && digitLogin) return;
	if (inputPasswordSetCount >= numClicks) return;

	i = current.ij[0];
	j = current.ij[1];

	//traceit(tileFiles[[i,j]]);
	
	if(choosingPwd && inInputPassword([i,j]) && noRepeat) {
	    traceit([i,j]+inInputPassword([i,j]));
	    $.prompt("You already chose that square.");
	    return;
	}

	if (madlib) {
	    clickPic = tileFiles[[i,j]];
	    assignImage(inputPasswordSetCount,imageDir+"/"+clickPic);
	}


	inputPasswordSet[inputPasswordSetCount] = [i,j];		
	inputPasswordSetCount ++;	
	
	updateCanvas();
	updateCanvas2();		
    }
    
} //This is the end of doClick	

//This accepts the password when creating a password, and sends it to the log
function acceptPassword() {
    document.getElementById("action").value="setPasswordData"; //State that we will want to call setPasswordData()
    if(objRecog) {
	allImages = "";		

	n = 0;      

	for (f=0; f < recogSet.length; f++) {
	    n = n+1;
	    i=lines.indexOf(recogSet[f]);
	    allImages = allImages+","+i;
	    traceit("f:"+f+" lines3:"+lines[3]+" allImages:"+allImages);
	}

	document.getElementById("action").value="log";
	windowrunScript("databasefunctions.php", windowgetParameters("PwdDisplay","Begin"));
	
	for (var i=0; i<numClicks; i++) {
	    document.getElementById("action").value="log"; 

	    windowrunScript("databasefunctions.php", windowgetParameters("PwdDisplay",'<img src="'+baseImageDir+"/"+lines[PasswordArray[i]] + '">'));
	}
	
	if (madlib) {
	    allImages = allImages + "#" +storyNum;
	}
	
	//Call setPasswordData() in databasefunctions.php, and pass the picture name and password as the data to store
 	document.getElementById("action").value="setPasswordData"; 
	windowrunScript("databasefunctions.php", windowgetParameters("setPasswordData",allImages + ":" + mask(password)));
	datastring=allImages;
	//translate the password to hexadecimal for when its passed to the website
	hexPasswordArray = Array();
	
	for (var i=0; i<numClicks; i++) {
	    hexPasswordArray[i] = PasswordArray[i].toString(16);
	}
	
	password = hexPasswordArray.toString();
	
    }
    
    else {
	
	windowrunScript("databasefunctions.php", windowgetParameters("setPasswordData",picname + ":" + mask(password))); //Call setPasswordData() in databasefunctions.php, and pass the picture name and password as the data to store
	datastring = picname;
	
	document.getElementById("action").value="log";
	windowrunScript("databasefunctions.php", windowgetParameters("PwdDisplay","Begin"));
	windowrunScript("databasefunctions.php", windowgetParameters("PwdDisplay",mask(password)));
	
	
    }	
    
    document.getElementById("action").value="log"; //State that we will want to call log()
    windowrunScript("databasefunctions.php", windowgetParameters("Password",mask(password)));
    
    $.prompt("password is "+password);
    
    //This exits the code; v is a variable containing the password, m is the mode
    passresult(password,mode);
}

//This resets the password when logging in
function clearPassword() {
    
    //	I only do this here so that the log can spit out the inputPassword
    for (var i = 0; i < inputPasswordSetCount; i++)   inputPassword += az.substr(inputPasswordSet[i][0],1) + za.substr(inputPasswordSet[i][1],1);
    
    //	traceit("inputPasswordSet is "+inputPasswordSet+" inputPasswordSetCount is "+inputPasswordSetCount);
    windowrunScript("databasefunctions.php", windowgetParameters(mode+"Clear",mask(inputPassword)));
    inputPassword = "";
    inputPasswordSet = Array();
    inputPasswordSetCount = 0;
    //	traceit("inputPasswordSet is "+inputPasswordSet+" inputPasswordSetCount is "+inputPasswordSetCount);
    
    if (madlib) {
	mlCanvas.clear();
	newBlankStory(story);
	if (showp) storyReset(start=0,end=numClicks,grey=true);
    }

}

//This enters the password when logging in (both when practicing, and when logging in for real)
function enterPassword() {
    inputPassword = "";	
    
    if (objRecog) {

	for (var i = 0; i < inputPasswordSetCount; i++)   inputPassword += az.substr(inputPasswordSet[i][0],1) + za.substr(inputPasswordSet[i][1],1);
	
	document.getElementById("action").value="log"; //State that we will want to call log()
	windowrunScript("databasefunctions.php", windowgetParameters("order inputPwd",mask(inputPassword)));

	
	var inputPasswordArray = Array();
	
	for (var i=0; i<numClicks; i++) {
	    
	    inputPasswordArray[i] = lines.indexOf(tileFiles[inputPasswordSet[i]]);
	}
	
	//only do this so that the log can record the original ordering
	inputPassword = inputPasswordArray.toString();
	
	hexInputPasswordArray = Array();

	for (var i=0; i<numClicks; i++) {
	    hexInputPasswordArray[i] = inputPasswordArray[i].toString(16);
	}

	inputPassword = hexInputPasswordArray.toString();
	
	document.getElementById("action").value="log"; //State that we will want to call log()
	windowrunScript("databasefunctions.php", windowgetParameters("order inputPwdObj",mask(inputPassword)));
	
	if(!ordered) {
	    inputPasswordArray.sort();	
	}
	
	inputPassword = inputPasswordArray.toString();
	
	hexInputPasswordArray = Array();
	
	for (var i=0; i<numClicks; i++) {
	    hexInputPasswordArray[i] = inputPasswordArray[i].toString(16);
	}
	
	inputPassword = hexInputPasswordArray.toString();
	
    }
    
    else { //not object recognition
	//I only do this so I can send the original ordering to the log
	for (var i = 0; i < inputPasswordSetCount; i++)   inputPassword += az.substr(inputPasswordSet[i][0],1) + za.substr(inputPasswordSet[i][1],1);
	
	document.getElementById("action").value="log"; //State that we will want to call log()
	windowrunScript("databasefunctions.php", windowgetParameters("order inputPwd",mask(inputPassword)));
	
	inputPassword = "";	
	
	if (!ordered) {
	    inputPasswordSet.sort();
	}
	
	for (var i = 0; i < inputPasswordSetCount; i++)   inputPassword += az.substr(inputPasswordSet[i][0],1) + za.substr(inputPasswordSet[i][1],1);
	
    }
    
    if (mode=="create") {
	if (inputPassword == password) {
	    windowrunScript("databasefunctions.php", windowgetParameters("goodPractice",inputPassword+":"+mask(password)));
	    
	    if(objRecog & doShuffle) {
		$.prompt("Yay! You correctly entered your password! Your password will now be shuffled.");
		
		recogShuffle(false);

		passwordSet = Array();
		
		for (var i=0; i<numClicks; i++) {
		    passwordSet[i] = filePos[inputPasswordArray[i]];
		}
		
		
		if (madlib) {
		    if (!showp) {
			mlCanvas.clear();
			newBlankStory(story);
		    }
		    else storyReset(start=0,end=numClicks,grey=true);
		}
	    }
	    else { //not objRecog
		$.prompt("Yay! You correctly entered your password!");	
	    }
	    
	}
	else { // inputPassword != password
	    windowrunScript("databasefunctions.php", windowgetParameters("badPractice",mask(inputPassword)+":"+mask(password)));
	    $.prompt("Oops, try again! ");
	    
	    if (madlib) {
		if (!showp) {
		    mlCanvas.clear();
		    newBlankStory(story);
		}
		else storyReset(start=0,end=numClicks,grey=true);
		
	    }
	}
	inputPasswordSet = Array();
	inputPasswordSetCount = 0;
	updateCanvas();
	
    }
    
    else { //mode is enter
	if (inputPassword == password) {
	    windowrunScript("databasefunctions.php", windowgetParameters("goodLogin",mask(inputPassword)+":"+mask(password)));
	}
	else {
	    windowrunScript("databasefunctions.php", windowgetParameters("badLogin",mask(inputPassword)+":"+mask(password)));
	}
	//This exits the code; v is a variable containing the password, m is the mode
	passresult(inputPassword,mode);	
    }	
}



function changePassword() {
    inputPasswordSet = generatePasswordSet(numClicks);
    inputPasswordSetCount = numClicks;
    //	password = "";
    //	for (var i = 0; i < 5; i++)   password += az.substr(passwordSet[i][0],1) + za.substr(passwordSet[i][1],1);
}

function changePicture() {

    console.log(lines);
    console.log(lines[2]);
    
    console.log(objRecog);

    if (objRecog) {
	generateRecogSet(nx*ny);
	traceit(recogSet);
	traceit(passwordSet);
	
    }
    
    else {
	var f = getRandom(0,lines.length-1);
	picfile = imageDir +"/"+ lines[f];

	picname = lines[f];
	console.log(f);
	console.log(lines[f]);
	windowrunScript("databasefunctions.php", windowgetParameters("picChange",picname));
    }
}

function acceptPicture() {
    showp=true;
    choosingPic=false;
    selectImage = false;
    windowrunScript("databasefunctions.php", windowgetParameters("picAccept",picname));
    if (choosingPwd) {
	$.prompt("Please click on the gridsquares to choose your password");
    }
    
    else {
	changePassword();
	acceptPwdChoice();
    }
    updateCanvas();
    
}

function inPassword(coords) {
    for (var k=0; k<numClicks; k++) {
	if (passwordSet[k][0]==coords[0] && passwordSet[k][1]==coords[1]) return true;
    }	
    return false;
}

function inInputPassword(coords) {
    for (var k=0; k<inputPasswordSetCount; k++) {
	if (inputPasswordSet[k][0]==coords[0] && inputPasswordSet[k][1]==coords[1]) return true;
    }	
    return false;
}

function appearPassword() {
    showp = true;
    updateCanvas(); 
    document.getElementById("action").value="log";
    windowrunScript("databasefunctions.php", windowgetParameters("showPassword",""));
    
    if (madlib) {
	//	mlCanvas.clear();
	//	newBlankStory(story);
	storyReset(start=inputPasswordSetCount,end=numClicks,grey=true);
    }
}

function hidePassword() {
    showp = false;
    //UGLY - can't I tie this somehow to showp?
    numberSet.hide();
    updateCanvas(); 
    document.getElementById("action").value="log";
    windowrunScript("databasefunctions.php", windowgetParameters("hidePassword",""));
    
    if(madlib) {
	mlCanvas.clear();
	newBlankStory(story);
	storyReset(start=0,end=inputPasswordSetCount,grey=false,inp=true)
    }
}

function enterGridPwd() {
    
    var inputGridPassword = control.enterGridPwdBox.value;
    //	traceit(inputGridPassword);
    //	traceit(password);
    
    var gridPassword = "";
    
    for (var k=0; k<2*numClicks; k+=2) {
	letterA = password.substr(k,1);
	i = az.indexOf(letterA);
	letterB = password.substr(k+1,1);
	j = za.indexOf(letterB);
	
	gridPassword += tileDigits[[i,j]];
    }
    
    //traceit(gridPassword);
    
    if (inputGridPassword == gridPassword) {
	windowrunScript("databasefunctions.php", windowgetParameters("goodGridLogin",mask(inputGridPassword)+":"+mask(gridPassword)));
	traceit("Good!");
	//This works, but ... 
	passresult(password,mode);
    }
    
    else {
	windowrunScript("databasefunctions.php", windowgetParameters("badGridLogin",mask(inputGridPassword)+":"+mask(gridPassword)));
	traceit("Sad.")
	passresult(inputGridPassword,mode);
    }
    
}

function acceptPwdChoice() {

    if (inputPasswordSetCount<numClicks) {
	$.prompt("Your password must be "+ numClicks +" squares long. Please select "+(numClicks-inputPasswordSetCount)+" more squares.");
	windowrunScript("databasefunctions.php", windowgetParameters("tooShortPassword",mask(password)));
    }
    else {

	passwordSet = inputPasswordSet;
	passwordSetCount = inputPasswordSetCount;
	
	traceit("passwordSet is "+passwordSet);
	
	inputPasswordSet = Array();
	inputPasswordSetCount = 0;
	
	if (!ordered) {
	    passwordSet.sort();
	}
	
	
	password = "";
	
	if (objRecog) {
	    traceit("passwordSet: "+passwordSet);
	    
	    PasswordArray = Array();

	    for (var i=0; i<numClicks; i++) {

		PasswordArray[i] = lines.indexOf(tileFiles[passwordSet[i]]);
	    }
	    
	    if (!ordered) {
		PasswordArray.sort();
	    }
	    
	    password = PasswordArray.toString();
	    
	    //needs to be ordered
	    
	    traceit("password: "+password);
	    
	    hexPasswordArray = Array();
	    
	    for (var i=0; i<numClicks; i++) {
		hexPasswordArray[i] = PasswordArray[i].toString(16);
	    }
	    
	    password = hexPasswordArray.toString();
	}
	
	else {
	    for (var i = 0; i < numClicks; i++)   password += az.substr(passwordSet[i][0],1) + za.substr(passwordSet[i][1],1);
	}
	
	
	traceit("password is "+password);
	
	choosingPwd = false;
	
	updateCanvas();
	windowrunScript("databasefunctions.php", windowgetParameters("Password",mask(password)));
	if (practice) {
	    if(ordered) $.prompt("Please practice your password by clicking on the highlighted squares in order.");
	    else if (shuffleButton) $.prompt("Please practice your password by clicking on the highlighted squares. Press the shuffle button if someone is watching you log in.")
	    else $.prompt("Please practice your password by clicking on the highlighted squares.")
	}
	
	else acceptPassword();
    }

}

function recogShuffle(buttonPress) {
    
    
    filePos = Array();
    tilePos =  Array();
    tileImages = Array();
    tileImageSet = paper.set();
    passwordFileNames = Array();
    
    if(tileFiles !== undefined) {
	for (var n=0; n < numClicks; n++) {
	    passwordFileNames[n] = tileFiles[passwordSet[n]];

	}
	
    }
    
    // rebuilding tileFiles
    tileFiles = Array();
    
    recogSet3 = recogSet.slice(0);
    var m = recogSet3.length;
    rn = 0;
    for (var i = 0; i < numDivisionsX; i++) {
	for (var j = 0; j < numDivisionsY; j++) {
	    if (doShuffle || buttonPress) {
		r = getRandom(0,m-1);
	    }
	    else r = rn;
	    tileFiles[[i,j]] = recogSet3[r];
	    tilePos[[i,j]] = recogSet.indexOf(recogSet3[r]);
	    filePos[lines.indexOf(recogSet3[r])] = [i,j];
	    tileImages[[i,j]] = paper.image(imageDir+ "/" +recogSet3[r], 1+(imageWidth*i), 1+(imageHeight*j), imageWidth, imageHeight);
	    recogSet3[r] = recogSet3[--m];
	    tileImageSet.push(tileImages[[i,j]]);
	    
	}
    }
    
    
    for (var k=0; k< numClicks; k++) {
	
	passwordSet[k] = filePos[lines.indexOf(passwordFileNames[k])];

    }

    
    if (buttonPress) 	windowrunScript("databasefunctions.php", windowgetParameters(mode+"shuffleButton",passwordSet));
    
}

//s is where the loop starts, generally at 0
function storyReset(start,end,grey,inp) {
    // this function makes the correct images appear in the madlibs story 
    // the lines about "box" make the grey boxes appear over top of the images
    for(var k=start; k<end; k++) {
	traceit("k is "+k);
	if (inp) pwdPic[k] = tileFiles[inputPasswordSet[k]];
	else pwdPic[k] = tileFiles[passwordSet[k]];
	assignImage(k,imageDir+"/"+pwdPic[k]);
	
	if(grey) {
	    box[k] = mlCanvas.rect(imgPlace[k][0],imgPlace[k][1],52,50);
	    box[k].attr({'fill':'gray', 'fill-opacity':0.5})
	}
	
	traceit(pwdPic[k]);
	
    }
}


//==============================================================================================================
//  PASSWORDS
//==============================================================================================================


function generatePasswordSet(n) {
    var elements = passwordElements.slice(0);
    var l = elements.length;
    var passwordSetCount = n;
    var passwordSet = Array();
    
    for (var i = 0; i < n; i++) {
	r = getRandom(0, l-1);
	passwordSet[i] = elements[r];
	elements[r] = elements[--l];
    }
    
    if (!ordered) {
	passwordSet.sort();
    }
    
    return passwordSet;

}



function getRandom(min, max) {		
    var randomNum = Math.random() * (max-min); 
    return(Math.round(randomNum) + min); 
}


function generateRecogSet(m) {
    //generates the entire set of images shown in the object recognition question
    var l = lines.length;
    
    lines2=lines.slice(0);
    
    recogSet = Array();
    
    for (var i = 0; i<m; i++) {
	r = getRandom(0,l-1);
	recogSet[i] = lines2[r];
	lines2[r] = lines2[--l];
    }


    //generates the subset of recogSet that is the passwordSet
    
    recogSet2 = recogSet.slice(0);
    
    passwordSet = Array();
    
    for (var k=0; k<numClicks; k++) {
	q = getRandom(0,m-1);
	passwordSet[k] = recogSet[q];
	recogSet2[q] = recogSet2[--m];
    }
    
    
}



//==============================================================================================================
//  PICTURES
//==============================================================================================================

//This draws the canvas, grid and picture 
function generateCanvas() {

    if (mode=="create") {
	div0.style.display = "none";
	div1.style.display = "none";
	div2.style.display = "none";
	div3.style.display = "none";
	div5.style.display = "none";
	div6.style.display = "none";
	div7.style.display = "none";	
	div8.style.display = "none";	
	div9.style.display = "none";	
	div10.style.display = "none";
    }	

    
    //creates canvas to draw on
    paper = Raphael(picminx, picminy, picmaxx+200, picmaxy+100);

    //This draws the image on the canvas - picx and picy are the coordinates
    if(!objRecog) 	picture = paper.image(picfile, 1, 1, picx, picy);

    //This draws the text click-counter	
    clickCounter = paper.text(picminx, picy+10, "Remaining Clicks: "+numClicks);
    clickCounter.attr({'text-anchor': "start",'font-size': 14});

    //This draws the clear button
    button = paper.rect(picminx+300, picy+5, 100, 20, 10);
    button.attr({fill: "lightgrey"});

    clear = paper.text(picminx+345, picy+15, "Clear");
    clear.attr({'font-size': 14});
    //	clear.toFront();
    clear.node.style.cursor = "default";


    button.node.onclick = function() {
	//		traceit("are we here?");
	clearPassword();
	updateCanvas();
    }
    
    clear.node.onclick = button.node.onclick;


    //This draws the line connecting the circles in the visual click-counter	
    var line = paper.path("M7 430L117 430");
    line.hide();
    //	line.toBack();

    //This draws the circles in the visual click-counter	
    circles = Array();
    
    for (var i=0; i<numClicks; i++) {
	circles[i] = paper.circle(picminx+25*i+2,picy+30,10);
	circles[i].attr({fill: "orange"});
    }
    
    clickCounter.hide();
    button.hide();
    clear.hide();
    for (var i=0; i<numClicks; i++) {
	circles[i].hide(); 
    }
    line.hide();

    // this draws the shuffle button if shuffleButton is true



    //This draws the grid over the password image and ties it to the clicks
    
    //tileset
    tileset = paper.set();
    tileset2 = paper.set();
    tileset3 = paper.set();
    tilesquares = Array();
    tilesquares2 = Array();
    tilesquares3 = Array();
    
    numberSet = paper.set();
    tileNumbers = Array();
    tileNumbers2 = Array();
    tileDigits = Array();
    

    for (var i = 0; i < nx; i++) {
	for (var j = 0; j < ny; j++) {
	    tilesquares[[i,j]] = paper.rect(i*dx+3,j*dy+3,dx-6,dy-6);
	    tilesquares2[[i,j]] = paper.rect(i*dx+3,j*dy+3,dx-6,dy-6);
	    tilesquares3[[i,j]] = paper.rect(i*dx,j*dy,dx,dy);
	    if (mode=="create") {
		tileDigits[[i,j]] = "";
		tileNumbers[[i,j]] = paper.text(i*dx+0.5*dx, j*dx+0.5*dx, "");	
		tileNumbers[[i,j]].attr({'font-size': 32, fill: 'yellow'});
		tileNumbers2[[i,j]] = paper.text(i*dx+0.5*dx, j*dx+0.5*dx, "");	
		tileNumbers2[[i,j]].attr({'font-size': 28, fill: 'black'});
	    }

	    else {
		r = getRandom(0,9);
		tileDigits[[i,j]] = r+"";
		tileNumbers[[i,j]] = paper.text(i*dx+0.5*dx, j*dx+0.5*dx, r);
		tileNumbers[[i,j]].attr({'font-size': 32, fill: 'yellow'});		
		tileNumbers2[[i,j]] = paper.text(i*dx+0.5*dx, j*dx+0.5*dx, r);		
		tileNumbers2[[i,j]].attr({'font-size': 28, fill: 'black'});
	    }
	    
	    tilesquares2[[i,j]].node.onclick = new doClick([i,j]).invoke;
	    tilesquares3[[i,j]].node.onclick = new doClick([i,j]).invoke;
	    tileset.push(tilesquares[[i,j]]);
	    tileset2.push(tilesquares2[[i,j]]);
	    tileset3.push(tilesquares3[[i,j]]);
	    numberSet.push(tileNumbers[[i,j]]);
	    numberSet.push(tileNumbers2[[i,j]]);
	    
	}
    }
    
    //putting the object recog items into their grid
    
    if(objRecog) {
	
	recogShuffle(false);

	tileImageSet.show();
	tileImageSet.toFront();
	
    }

    if (shuffleButton) {
	sButton = paper.rect(picminx+400, picy+5, 100, 20, 10);
	sButton.attr({fill: "lightgrey"});

	sText = paper.text(picminx+445, picy+15, "Shuffle");
	sText.attr({'font-size': 14});
	sText.node.style.cursor = "default";


	sButton.node.onclick = function() {
	    recogShuffle(true);
	    
	    tileImageSet.show();
	    tileImageSet.toFront();
	    
	    updateCanvas();
	}

	sText.node.onclick = sButton.node.onclick;
    }	
    
    tileset3.attr({fill: allsq, stroke: allb1, 'fill-opacity': 0.0, 'stroke-opacity': 1.0, 'stroke-width': 0.0001});



    if (!digitLogin) {
	numberSet.hide();	
    }
    else numberSet.show();
}


function updateCanvas2() {

    if (inputPasswordSetCount==numClicks) {
	if (mode=="create" && choosingPwd) {
	    $.prompt("Click 'Accept Password' to choose this password, or 'Clear' to select another. ");

	}
	else enterPassword();

    }		

    updateCanvas();
}


function updateCanvas() {
    

    if (mode=="create") {
	
	div0.style.display = "none";
	div1.style.display = "none";
	div2.style.display = "none";
	div3.style.display = "none";
	div5.style.display = "none";
	div6.style.display = "none";
	div7.style.display = "none";
	div8.style.display = "none";	
	div9.style.display = "none";
	div10.style.display = "none";

	div4.style.display = "none";
	
	if (selectImage) 	div1.style.display = "block";
	if (!selectImage && choosingPwd)	div0.style.display = "block";
	
	if (!selectImage && !choosingPwd )	div2.style.display = "block";
	
	//	if (!selectImage && !choosingPwd && pwdShuffle) 	div3.style.display = "block";
	
	//show the right help pages
	if(showHelp && !choosingPwd && showImage && !objRecog && !digitLogin)	div5.style.display = "block";
	if(showHelp && !choosingPwd && !showImage && !objRecog && !digitLogin)	div6.style.display = "block";
	if(showHelp && !choosingPwd && showImage && objRecog && !digitLogin && !shuffleButton && doShuffle)	div7.style.display = "block";
	if(showHelp && digitLogin)	div8.style.display = "block";
	if(showHelp && !choosingPwd && showImage && objRecog && !digitLogin && !shuffleButton && !doShuffle)	div9.style.display = "block";
	if(showHelp && !choosingPwd && showImage && objRecog && !digitLogin && shuffleButton && !doShuffle)	div10.style.display = "block";
	
	//		document.control.shufflePic.disabled=true;
	//		document.control.acceptPic.disabled=true;
    }
    else {
	div0.style.display = "none";
	div1.style.display = "none";
	div2.style.display = "none";
	div3.style.display = "none";
	div5.style.display = "none";
	div6.style.display = "none";
	div7.style.display = "none";
	div8.style.display = "none";
	div9.style.display = "none";	
	div4.style.display = "none";
	
	if(digitLogin) 		div4.style.display = "block";
    }

    console.log(picfile);
    picture = paper.image(picfile, 1, 1, picx, picy);
    
    if (showp) allopacity = 0.1;
    else allopacity = 0.0;
    
    //	traceit(showp);
    
    if (choosingPic) {
	tileset.hide();
	tileset2.hide();
	tileset3.hide();
	if (objRecog) {
	    tileImageSet.hide();
	}
    }
    else {
	tileset.show();
	tileset2.show();
	tileset3.show();
	if (objRecog) {
	    tileImageSet.show();
	}
    }

    tileset.attr({fill: allsq, stroke: allb1, 'fill-opacity': allopacity, 'stroke-opacity': 1.0, 'stroke-width': 1});
    tileset2.attr({fill: allsq, stroke: allb2, 'fill-opacity': allopacity, 'stroke-opacity': 1.0, 'stroke-width': .5});
    tileset.toFront();
    if (objRecog){
	tileImageSet.toFront();
    }
    
    tileset2.toFront();
    tileset3.toFront();
    numberSet.toFront();

    if (!selectImage && !(mode=="enter" && digitLogin)) {		
	clickCounter.show();
	button.show();
	clear.show();
	for (var i=0; i<numClicks; i++) {
	    circles[i].show();
	}
	
	clickCounter.attr({text: "Remaining Clicks: "+(numClicks-inputPasswordSetCount),'text-anchor': "start", 'font-size': 14});	
	for (i=0; i<numClicks; i++) {
	    if (i < inputPasswordSetCount) circles[i].attr({fill: "green"});
	    else circles[i].attr({fill: "orange"});
	}
    }

    if (showp) {

	numberSet.attr({text:""});
	
	for (var i=0; i<passwordSetCount; i++) {
	    tilesquares[passwordSet[i]].attr({fill: pwdsq, stroke: pwdb1, 'fill-opacity': 0.0, 'stroke-opacity': 1.0, 'stroke-width': 7});
	    tilesquares2[passwordSet[i]].attr({fill: pwdsq, stroke: pwdb2, 'fill-opacity': 0.0, 'stroke-opacity': 1.0, 'stroke-width': 3});
	    tileNumbers[passwordSet[i]].attr({text: i+1})	
	    tileNumbers2[passwordSet[i]].attr({text: i+1})
	    tilesquares[passwordSet[i]].toFront();;
	    tilesquares2[passwordSet[i]].toFront();
	    tileNumbers[passwordSet[i]].toFront();
	    tileNumbers2[passwordSet[i]].toFront();
	    tilesquares3[passwordSet[i]].toFront();
	}
	
	for (var i=0; i<inputPasswordSetCount; i++) {
	    tilesquares[inputPasswordSet[i]].attr({fill: pwdsq, stroke: "blue", 'fill-opacity': 0.0, 'stroke-opacity': 1.0, 'stroke-width': 7});
	    tilesquares2[inputPasswordSet[i]].attr({fill: pwdsq, stroke: "limegreen", 'fill-opacity': 0.0, 'stroke-opacity': 1.0, 'stroke-width': 3});
	    
	    if (choosingPwd) 	{
		tileNumbers[inputPasswordSet[i]].attr({text: i+1});
		tileNumbers2[inputPasswordSet[i]].attr({text: i+1});
	    }
	    
	    tilesquares[inputPasswordSet[i]].toFront();
	    tilesquares2[inputPasswordSet[i]].toFront();
	    tileNumbers[inputPasswordSet[i]].toFront();
	    tileNumbers2[inputPasswordSet[i]].toFront();
	    tilesquares3[inputPasswordSet[i]].toFront();
	}
	
	
	if (ordered) {
	    numberSet.show();
	}
	else numberSet.hide();
	
    }   
}

function showPassword() {

    for (var i = 0; i < numClicks; i++) {
	rx = ps[i][0];
	ry = ps[i][1];
	var r = paper.rect((rx)*dx, (ry)*dy, dx, dy);
	r.attr({fill: "#df0", stroke: "#d00", "fill-opacity": 0.2, "stroke-width":3,"stroke-opacity":0.5});
	
    }

}




//==============================================================================================================
//  START
//==============================================================================================================


function startPage() {
    showForm();
    if (mode == "create") {
	if (madlib) {
	    window.resizeTo(1400,750);
	}
	else window.resizeTo(750,750);
	if (showImage) {
	    changePicture();
	}
	else {
	    
	    picfile = imageDir + "/blankPic.jpg";
	    picname = "blankPic.jpg";
	}
	generateCanvas();
	if (!selectImage) {
	    acceptPicture();
	}
	if (madlib) {
	    
	    storyNum = getRandom(0,stories.length-1);
	    story = stories[storyNum];
	    
	    newBlankStory(story);
	    
	    storyReset(start=0,end=numClicks,grey=true);
	    
	}
    }
    
    else { //mode is "enter"
	
	if (madlib) {
	    window.resizeTo(1400,700);
	}
	else window.resizeTo(750,700);
	picminy = 75;
	old = "";
	lengthi = old.indexOf(":");	
	//		filename = old.substr(0,lengthi);
	picname = openerform.reference.value;
	filename = picname;
	if (objRecog) {
	    if (madlib) {
		cues = filename.split("#");
		storyNum = parseInt(cues[1]);
		filename = cues[0];
		
		story = stories[storyNum];
		newBlankStory(story);
	    }
	    if (shuffleButton) {
		
	    }
	    
	    recogSetNums=filename.split(",");
	    traceit("old:"+old);
	    
	    var l = recogSetNums.length;
	    
	    traceit("l: "+l);
	    
	    for (var i=0; i<(l-1); i++) {
		recogSet[i] = lines[recogSetNums[i+1]];
		traceit("i:"+i+" recogSet[i]:"+recogSet[i]+" recogSetNums[i]:"+recogSetNums[i+1]);
	    }
	    //			$.prompt(recogSet);
	    traceit("recogSet.length: "+recogSet.length+" recogSet: "+recogSet);
	    
	    password = old.substr(lengthi+1);
	    
	}
	
	else { //not object Recog

	    picfile = imageDir+"/"+filename;
	    
	    password = old.substr(lengthi+1);
	}

	
	selectImage=false;
	
	generateCanvas();

	if (digitLogin) {
	    if (ordered) {
		numberSet.show();
	    }
	    else numberSet.hide();
	}
    }
    updateCanvas();

    all = "";

}

// gets around IE hating indexOf! From http://soledadpenades.com/2007/05/17/arrayindexof-in-internet-explorer/
if(!Array.indexOf){
    //$.prompt("Using new indexof!");
    Array.prototype.indexOf = function(obj){
	for(var i=0; i<this.length; i++){
	    if(this[i]==obj){
	        return i;
	    }
	}
	return -1;
    }
}

function main() {
    window.opener.logit("PassTilesStart");

        for (var key in settings) {
	console.log(key);
	console.log(settings[key]);
	console.log("---");
	val = settings[key];
	window[key] = settings[key];
	if (val == "0") window[key]=0;
    }
    console.log("SL=" + storyList);
    initVars();
    
    if (imageDir) getImages();
    else gotImages();
}

function gotImages() {
    if(storyList) getStories();
    else gotStories();
}

function gotStories() {
    startPage();
}

function initVars() {    
    if (objRecog) {
	picx = numDivisionsX*imageWidth;
	picy = numDivisionsY*imageHeight;	
    }
    
    else {
	picx = imageWidth;
	picy = imageHeight;
    }
    if(madlib) practice = 1;
    shuffleButton = doShuffle;
    
    c = numClicks;
    
    nx = numDivisionsX;
    ny = numDivisionsY;
    
    dx = picx/nx;
    dy = picy/ny;
    
    picminx = 10;
    picminy = 125;
    picmaxx = picminx + picx;
    picmaxy = picminy + picy;
    
    e = 0;
    passwordElements = Array();
    for (var i = 0; i < nx; i++) 
	for (var j = 0; j < ny; j++) 
	    passwordElements[e++] = [i,j];
    
    baseImageDir = "images/" + imageDir;
    imageDir = "../images/" + imageDir;
    
    if (mode == "create") choosingPic = true;
    
    document.onmousedown=doClick;

}

function getImages() {
    console.log("getting lines");
    url = imageDir + '/filenames.txt';
    console.log(url);
    $.get(url, function(result) {
	if (result == 'ON') {
	} else if (result == 'OFF') {
	} else {
	    lines = result.split('\n');
	    console.log(lines[2]);
	    console.log("line reads");
	    console.log(lines);
	    gotImages();
	}
    });
}

function getStories() {
    console.log("getting stories");
    url = "../stories/" + storyList;
    console.log(url);
    $.get(url, function(result) {
	if (result == 'ON') {
	} else if (result == 'OFF') {
	} else {
	    stories = result.split('\n');
	    	    console.log("story reads");
	    gotStories();
	}
    });
    
}

    
$( document ).ready(function() {
    url = "config.ini";

//    $.get(url, function(result) {
//	if (result == 'ON') {
//	} else if (result == 'OFF') {
//	} else {

//	    inival = parseINIString(result);

//	    settings = inival[condition];
//	    for (var key in settings) {
//		val = settings[key];
//		window[key] = settings[key];
//		if (val == "0") window[key]=0;
//	    }
//
//	    main();
//	}
//  });
    
    $.getJSON( "conditions.json", function( data ) {
	console.log(condition);
	settings = data[condition];
	main();
    });

    
});


function parseINIString(data){
    var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    var value = {};
    var lines = data.split(/[\r\n]+/);
    var section = null;
    lines.forEach(function(line){
        if(regex.comment.test(line)){
            return;
        }else if(regex.param.test(line)){
            var match = line.match(regex.param);
            if(section){
                value[section][match[1]] = match[2];
            }else{
                value[match[1]] = match[2];
            }
        }else if(regex.section.test(line)){
            var match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
        }else if(line.length == 0 && section){
            section = null;
        };
    });
    return value;
}

