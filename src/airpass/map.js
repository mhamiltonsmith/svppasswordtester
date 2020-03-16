function initMap(){

window.resizeTo(950, 750);

function Point(x,y){
   this.x=x;
   this.y=y;
}
function Feature(ele){
   this.city = ele[0];
   this.country = ele[1];
   this.id = ele[2];
   this.x = ele[3];
   this.y = ele[4];
}

var airport_points = [];
for (let ele of listElements){
  airport_points.push(new Feature(ele));
}
console.log(airport_points)
/*                      [new Point(295, 255), //BCN
                      new Point(340, 270), //CAI
                      new Point(320, 400), //CPT
                      new Point(380, 285), //DXB
                      new Point(170, 285), //HAV
                      new Point(30, 280), //HNL
                      new Point(300, 325), //LOS
                      new Point(295, 205), //LHR
                      new Point(95, 265), //LAX
                      new Point(490, 265), //SHA
                      new Point(530, 263), //TYO
                      new Point(420, 305), //BOM
                      new Point(495, 310), //MNL
                      new Point(460, 340), //SIN
                      new Point(155, 325), //PTY
                      new Point(260, 175), //RKV
                      new Point(365, 205), //MOW
                      new Point(545, 405), //SYD
                      new Point(170, 425), //SCL
                      new Point(225, 375), //GIG
                      new Point(165, 230), //YVR
                      new Point(90, 220), //YVR
                      ];
*/
var line_color='#CDFFCC';
var point_color = '#FC6C85';
var point_stroke = '#FC94A1';
var point_color_selected =  '#90EF90'; 
var point_stroke_selected = '#B0F5AB';
// Pastel blue - '#83C6DD'

// Light green - '#90C978'

var curr_x = -1;
var curr_y = -1;
var plane_on = false;
var plane = new Konva.Image();
var map = new Konva.Image();
var plane_path = "../images/airplane_xs_white_flipped.png";
var map_path = "../images/world_maps/wm_allgrey.png";

var click_history = []

var width = 640;
var height = 480;

var stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height
      });
var top_layer = new Konva.Layer();
var point_layer = new Konva.Layer();
var bottom_layer = new Konva.Layer();
var bg_layer = new Konva.Layer();

function drawMap(){
  var imageObj = new Image();
  imageObj.onload = function() {
    map = new Konva.Image({
      x: 0,
      y: 0,
      width: width,
      height: height,
      image: imageObj,
    });
    bg_layer.add(map);
    bg_layer.draw();
  };
  imageObj.src = map_path;
}
function drawPlane(x_pos, y_pos){
  if(!plane_on){
    var imageObj = new Image();
    imageObj.onload = function() {
      plane = new Konva.Image({
          x: x_pos,
	  y: y_pos,
          image: imageObj,
          width: 25,
	  height: 25
      });
      top_layer.add(plane);
      top_layer.batchDraw();
    };
    imageObj.src = plane_path;
    plane_on=true;
  }else{
       plane.setAttrs({
	x: x_pos,
	y: y_pos
       });
       top_layer.draw();
    }
}

function circleClickedEvent(circle){
    circle.fill(point_color_selected);
    circle.stroke(point_stroke_selected);
    point_layer.draw();
    cx = circle.x();
    cy = circle.y();
    if((curr_x > 0 && curr_y > 0) && !(curr_x == cx && curr_y == cy)){
	  var line = new Konva.Line({
		points: [curr_x, curr_y, cx, cy],
		stroke: line_color,
		strokeWidth: 3,
		lineCap: 'round',
		dash: [33, 10]
	   });
           top_layer.add(line);
           top_layer.draw();
	}
    curr_x=cx;
    curr_y=cy;
    drawPlane(cx-12, cy-30);
}

function drawCircle(x_pos, y_pos){
  var outer_circle = new Konva.Circle({
        x: x_pos,
        y: y_pos,
        radius: 20,
        stroke: point_color,
        opacity: 0.5,
        strokeWidth: 1
      });
   var inner_circle = new Konva.Circle({
  	x: x_pos,
        y: y_pos,
        radius: 8,
        fill: point_color,
        stroke: point_stroke,
        strokeWidth: 1
   });

   point_layer.add(inner_circle);
   outer_circle.on('click', function(){
       circleClickedEvent(inner_circle);
   });

   bottom_layer.add(outer_circle);
}

function drawPoints(){
   var n=airport_points.length;
   for(var i=0; i<n; i++){
      drawCircle(airport_points[i].x, airport_points[i].y);
   }
}

/*
function drawPoints(features){
   var n=features.length;
   for(var i=0; i<n; i++){
      var feature = features[i];
      var x = feature[3];
      var y = feature[4];
      drawCircle(Number(x), Number(y));
   }
}
*/
function resetMap(){
  top_layer.destroyChildren();
  var circles = point_layer.find("Circle");
  for(var i=0; i<circles.length; i++){
     circles[i].setAttrs({
     	fill: '#DC453D',
        stroke: '#FF6961'
     });
  }
  plane_on = false;
  curr_x = -1;
  curr_y = -1;
  bottom_layer.draw();
  point_layer.draw();
  top_layer.draw();
}

drawMap();
drawPoints();
stage.add(bg_layer);
stage.add(point_layer);
stage.add(bottom_layer);
stage.add(top_layer);

}
