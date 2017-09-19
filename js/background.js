// samuel clarke 2017/09/17
/* global width height background createCanvas colorMode HSB setup draw mouseX mouseY pmouseX pmouseY */
/* global stroke noStroke fill triangle noLoop noise map key redraw windowHeight windowWidth */
/* global $ */
/* global json */

console.log("Background animation by Samuel Clarke. 17/09/2017. ");
console.log("Delaunay Triangulation: https://en.wikipedia.org/wiki/Delaunay_triangulation .");

var grid = [];
var xoff = Math.random() * 21632;

var isPerlin = true;
var isAlive = false;
var isMonochrome = false;

var SAM = false;

var choosesShortest = true; // i recommend keeping this to the opposite of isAlive
var colorGoodizer = true;
var mouseControl = false; 
var shouldStroke = false;
var isTorch = false; // experimental
var torchSize = 1000; // only works with isTorch

var isMullum = true;

var settings, colorThemes, rIndex, mBlue, mOrange = "";
var JSONHasLoaded = false;


colorThemes = json["themes"];

rIndex = Math.floor(Math.random() * colorThemes.length);
mBlue = colorThemes[rIndex]["triLim"][0];//280;//216; // only if isMullum
mOrange = colorThemes[rIndex]["triLim"][1];//104;//184; // only if isMullum

var briADJ = colorThemes[rIndex]["bri"];
var satADJ = colorThemes[rIndex]["sat"];

console.log(colorThemes[rIndex]);


var POINTSx = 24;
var POINTSy = 40;
var EXTS = 4; // generated off the edges so that it doesn't go weird
var RAND = .82; // only works with 
var COLORSEV = 0.45; // only works with perlin
var MOVESEV = 0.03; // only works with isAlive
var MOVESPEED = 50.4; // only works with isAlive

var PULLSIZE = 95;
var PULLSTRENGTH = 1;

var hpadding = 20;
var hasDrawnOnce = false;
var shouldDrawOnce = true;

// SETUP 
function setup(callSize=0) {
	POINTSx *= windowWidth / windowHeight;
	console.log(windowWidth / windowHeight);
	
	if(windowWidth > 1300 && windowHeight > 900) {
		POINTSx *= .9;
		POINTSy *= .9;
	}
	
	if(isMullum) {
		   colorMode(HSB, 360);
	}
	
	var brect = document.getElementById("body").getBoundingClientRect();
	var canvas = createCanvas(brect.width, brect.height * 4 + hpadding);
	background(66);
	canvas.parent("sketch-holder");
  
   var noff = 0;
   for(var i = -EXTS; i < POINTSy + EXTS; i++) {
      //var ei = (i + (Math.random() - .5) * RAND) * (height / POINTSy);
      var tgrid = [];
      var nxoff = 0;

      for(var j = -EXTS; j < POINTSx + EXTS; j++) {
         var ei = (i + (Math.random() - .5) * RAND) * (height / POINTSy);
         var ej = (j + (Math.random() - .5) * RAND) * (width / POINTSx);
         
         var p = new Point(ej, ei, nxoff, noff);
         tgrid.push(p);
         nxoff += COLORSEV;
      }
      noff += COLORSEV;
      grid.push(tgrid);
   }
}

// DRAW 
function draw() {
   if(!hasDrawnOnce || !shouldDrawOnce) {
	   background(66);

	   //console.log("frame");
	   if(isAlive) {
		  var toff = xoff;
		  for(var i = 1; i < grid.length - 1; i++) {
			 for(var j = 1; j < grid[i].length - 1; j++) {
				var tMOVESPEED = MOVESPEED;
				if(i == 1 || j == 1 || i == grid.length - 2 || grid[i].length - 2) {
				   tMOVESPEED *= .1;
				}
				if(i == 2 || j == 2 || i == grid.length - 3 || grid[i].length - 3) {
				   tMOVESPEED *= .25;
				}
				if(i == 3 || j == 3 || i == grid.length - 4 || grid[i].length - 4) {
				   tMOVESPEED *= .5;
				}

				if(isTorch && isMullum) {
				   grid[i][j].aggG = Math.sqrt(grid[i][j].aggG + 46 * 46);//
				   grid[i][j].aggB = Math.sqrt(grid[i][j].aggB + 60 * 60);//
				}
				else {
				   //grid[i][j].aggR += (noise(toff) - .5) * tMOVESPEED * 1.2; // hue // r
				   //grid[i][j].aggG += (noise(toff + 109) - .5) * tMOVESPEED * 1.2; // sat // g
				   //grid[i][j].aggB += (noise(toff + 209) - .5) * tMOVESPEED * 1.2; // bri // b
				}
				if(isTorch) {
				   var dadj = torchSize - distance(grid[i][j], stp4(pmouseX, mouseX), stp4(pmouseY, mouseY));
				   if(dadj < 0) {
					  dadj = 0;
				   }
				   grid[i][j].aggG += dadj / 2;
				   grid[i][j].aggB += dadj;               
				}

				//grid[i][j].x += (noise(toff + 309) - .5) * tMOVESPEED * 4;
				//grid[i][j].y += (noise(toff + 409) - .5) * tMOVESPEED * 4;
				//console.log((noise(toff) - .5) * MOVESPEED * 1.5);

				toff += MOVESEV * .8;

				if(mouseControl && (   distance(grid[i][j], stp1(pmouseX, mouseX), stp1(pmouseY, mouseY)) < PULLSIZE 
									|| distance(grid[i][j], stp4(pmouseX, mouseX), stp4(pmouseY, mouseY)) < PULLSIZE
									|| distance(grid[i][j], stp7(pmouseX, mouseX), stp7(pmouseY, mouseY)) < PULLSIZE )) {
				  grid[i][j].x -= (pmouseX - mouseX) / PULLSTRENGTH / distance(grid[i][j], stp4(pmouseX, mouseX), stp4(mouseY, mouseY));
				  grid[i][j].y -= (pmouseY - mouseY) / PULLSTRENGTH / distance(grid[i][j], stp4(pmouseX, mouseX), stp4(mouseY, mouseY));
				}
			 }
		  }
		  xoff += MOVESEV * 4;
	   }   

	   for(var i = 0; i < grid.length; i++) {
		  for(var j = 0; j < grid[i].length; j++) {
			 try {
				noStroke();
				//ellipse(grid[i][j].x, grid[i][j].y, 3, 3);

				if(distance(grid[i][j], grid[i + 1][j + 1]) < distance(grid[i][j + 1], grid[i + 1][j]) || !choosesShortest){
				   var tp = grid[i][j];
				   var ep = grid[i + 1][j + 1];
				   var sp1 = grid[i][j + 1];
				   var sp2 = grid[i + 1][j];
				}
				else {
				   var tp = grid[i][j + 1];
				   var ep = grid[i + 1][j];
				   var sp1 = grid[i][j];
				   var sp2 = grid[i + 1][j + 1];
				}
				//console.log(i + "  " + j);

				 if(shouldStroke)
				   stroke(126);
				else
				   noStroke();
				var tRGB = getRGBAgg(tp, sp1, sp1);
				fill(tRGB[0], tRGB[1], tRGB[2]);

				triangle(tp.x, tp.y, sp1.x, sp1.y, sp2.x, sp2.y);

				var tRGB = getRGBAgg(ep, sp1, sp2);
				fill(tRGB[0], tRGB[1], tRGB[2]);

				triangle(ep.x, ep.y, sp1.x, sp1.y, sp2.x, sp2.y);
			 }
			 catch(err) {

			 }
		  }
	   }
	   hasDrawnOnce = true;
	   
   }
   else {
   }
}


function Point(x, y, xoff, yoff) {
   this.x = x;
   this.y = y;
   
   if(isPerlin) {
      this.aggR = noise(xoff +  999, yoff +  999) * 255;
      this.aggG = noise(xoff + 1999, yoff + 1999) * 255;
      this.aggB = noise(xoff + 2999, yoff + 2999) * 255;
   }
   else {
      this.aggR = Math.random() * 255;
      this.aggG = Math.random() * 255;
      this.aggB = Math.random() * 255;
   }
   if(isMonochrome) {
      this.aggG = this.aggR;
      this.aggB = this.aggR;
   }
   if(isMullum) {
      // keep in mind this is now HSB
      this.aggR = map(noise(xoff + 500, yoff + 500), 0, 1, mBlue, mOrange) % 255; // HUE 175 = lblue 185 = blue 65 = orange
      this.aggG = map(noise(xoff + 1500, yoff + 1500), 0, 1, 180 * satADJ, 260 * satADJ); // SAT
      this.aggB = map(noise(xoff + 2500, yoff + 2500), 0, 1, 185 * briADJ, 310 * briADJ); // BRI
   }
   if(colorGoodizer) {
      this.aggR = goodize(this.aggR);
      if(!isMullum) {
      	this.aggG = goodize(this.aggG);
      	this.aggB = goodize(this.aggB);
      }
   }
}

function getRGBAgg(a, b, c) {
   var TR = a.aggR + b.aggR + c.aggR;
   var TG = a.aggG + b.aggG + c.aggG;
   var TB = a.aggB + b.aggB + c.aggB;
   
   return [TR / 3, TG / 3, TB / 3];
}

function distance(p1, p2){
	var dx = p2.x-p1.x;
	var dy = p2.y-p1.y;
	return Math.sqrt(dx*dx + dy*dy);
}

function distance(x1, y1, x2, y2){
	var dx = x1-x2;
	var dy = y1-y2;
	return Math.sqrt(dx*dx + dy*dy);
}
         
function distance(p1, x2, y2){
	var dx = p1.x-x2;
	var dy = p1.y-y2;
	return Math.sqrt(dx*dx + dy*dy);
}

function goodize(x) {
   x = map(x * x, 0, 255 * 255, 0, 255);
   if(isMullum) {
      x = map(x * x, mOrange * mOrange, mBlue * mBlue, mOrange, mBlue);
   }
   return x;
}

function stp1(x1, x2) {return (x1 + x1 + x1 + x1 + x1 + x1 + x2) / 7;}
function stp2(x1, x2) {return (x1 + x1 + x1 + x1 + x1 + x2 + x2) / 7;}
function stp3(x1, x2) {return (x1 + x1 + x1 + x1 + x2 + x2 + x2) / 7;}
function stp4(x1, x2) {return (x1 + x1 + x1 + x2 + x2 + x2 + x2) / 7;}
function stp5(x1, x2) {return (x1 + x1 + x2 + x2 + x2 + x2 + x2) / 7;}
function stp6(x1, x2) {return (x1 + x2 + x2 + x2 + x2 + x2 + x2) / 7;}
function stp7(x1, x2) {return (x2 + x2 + x2 + x2 + x2 + x2 + x2) / 7;}


var sIsPressed = false;
var aIsPressed = false;
var mIsPressed = false;
function keyTyped() {
	if(key != "S" && key != "A" && key != "M") {
		sIsPressed = false;
		aIsPressed = false;
		mIsPressed = false;
	}
	if(key == "S") {
		sIsPressed = true;
	}
	if(key == "A" && sIsPressed) {
		aIsPressed = true;
	}
	if(key == "M" && sIsPressed && aIsPressed) {
		mIsPressed = true;
	}
	
	if(sIsPressed && aIsPressed && mIsPressed) {
		SAM = true;
		MOVESPEED = 10;
		PULLSTRENGTH = 6;
		PULLSIZE = 180;
		
		console.log("PHWOOSH");
	}
}

