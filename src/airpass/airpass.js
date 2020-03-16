var c, nx, ny, dx, dy, picminx, picminy, micmaxx, pixmaxy;
var picx;
var picy;
var password = "";
var picfile;
var picname;
var listFile;
var listElements;
var listLen;
var assignedPassword = "";
var cf, ef;
var rset, rsetlen;
var numClicks;
var repeatElements;

function passresult(p,m){
  if (m == "create"){
    openerform.password.value = p;
    openerform.reference.value = "none";
    window.opener.logit("CreateDone");
  }
  if (m == "enter"){
    if (openerform.password.value == p){
      alert("Login Success!");
      windower.opener.logit("EnterSuccess");
    } else {
      alert("Login Failure!");
      windower.opener.logit("EnterFailure");
    }
  }
  window.close();
}


var openerform = window.opener.lastform;

var mode                = openerform.mode.value;
var system              = openerform.system.value;
var user                = openerform.user.value;
var scheme              = openerform.scheme.value;
var condition           = openerform.condition.value;

function main(){
  initVars();
  if (imageDir) getImage();
  else gotImage();
}
function getImage(){
  url = imageDir + '/filenames.txt';
  $.get(url, function(result){
    if (result == 'ON') {
    } else if (result == 'OFF') {
    } else {
      lines = result.split('\n');
      picfile = imageDir +"/"+ lines[0];
      picname = lines[0];
      gotImage();
    }
  });
}
function gotImage(){
  startPage();
}

//====================================================================================================
//  FORMS
//====================================================================================================

function showForm(){
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

//====================================================================================================
//  START
//====================================================================================================

function startPage(){
  cf = document.getElementById("createform");
  ef = document.getElementById("enterform");
  cc = document.getElementById("createcontrol");
  ec = document.getElementById("entercontrol");
  showForm();

  if (mode == "create"){
    initVars();
    changePassword();

  } else { // mode == "enter"
    cf.style.display="none";
    ef.style.display="block";
    ec.inputPassword.value = "";
  }
}

function initVars(){
  imageDir = "../images/" + imageDir;
}

//====================================================================================================$
//  PASSWORDS
//====================================================================================================$

function changePassword(){
  assignedPassword = "";
  getRandomSetInit(listElements);
  for (var i = 0; i < numClicks; i++){
    if (repeatElements == "1"){
       assignedPassword += listElements[getRandom(0,listLen-1)][2];
    } else {
      assignedPassword += getRandomSetNext();
    }
  }
  cc.realPassword.value = assignedPassword;
  cc.pracPassword.value = "";
}

function getRandom(min, max){
  var range = max-min+1;
  var randomnum = Math.floor(Math.random()*range)
  randomnum = min+randomnum;
  return randomnum;
}
function getRandomSetInit(a){
  rset = a.slice(0);
  rsetlen = rset.length-1;
}
function getRandomSetNext(){
  if (rsetlen == 0){
    return null;
  } else {
    r = getRandom(0, rsetlen-1);
    var retval = rset[r][2];
    rset[r] = rset[--rsetlen];
    return retval
  }
}

function togPassword() {
  var p = cc.realPassword.value;
  if (p == "") {
    cc.realPassword.value = assignedPassword;
//    runScript("databasefunctions.php", windowgetParameters("pwtog","show"));
  }
  else {
    cc.realPassword.value = "";
//    runScript("databasefunctions.php", windowgetParameters("pwtog","hide"));
  }
}
function enterPassword() {
  if (mode == "create") {
    if (cc.pracPassword.value == assignedPassword) {
      alert("Yay! You entered your password correctly!");
//      runScript("databasefunctions.php", windowgetParameters("pwtest","good"));
    }
    else {
      alert("Oops! You made a mistake!");
//      runScript("databasefunctions.php", windowgetParameters("pwtest","bad"));
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
//    runScript("databasefunctions.php", windowgetParameters("passwordSubmitted",encodeURI("pw:"+v)));    
    passresult(v,m);
}

$(document).ready(function(){
  $.getJSON("conditions.json", function(data){
    console.log(condition);
    settings = data[condition];
    for (var key in settings){
      val = settings[key];
      window[key] = settings[key];
      if (val == "0") window[key]=0;
    }
    console.log(settings);
    url = "../" + listFile;
    console.log("Getting list...");
    $.get(url, function(result){
      if (result == 'ON') {
      } else if (result == 'OFF') {
      } else {
        listElements = result.split("\n");
        listElements = listElements.map((val) => { return val.split(",") });
        listLen = listElements.length-1;
        listElements = listElements.slice(0, listLen - 1);
        main();
        initMap();
      }
    });
  });
});
