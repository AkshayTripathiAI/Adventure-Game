var balleye;
var stage;
var suunta;
var level;
var floors;
var floorsurface = {y: 0};
var background;
var diamonds;
var finish;
var starsprites;
var txtcheckpoint;
const delta = 20;
var paused = false;
var interval;
var spawn = {x: 0};
var groundedup = false;
var groundeddown = false;
var movewalls;
var groundedsound = false;
var timer = 0;
var started = false;
var deaths = 0;
var ASSETS = "assets/";
var BEST_KEY = "gravityBall.bestTime";
var MUTE_KEY = "gravityBall.muted";
var muted = readStore(MUTE_KEY, "0") === "1";
var bestTime = parseFloat(readStore(BEST_KEY, "0")) || 0;

function readStore(key, fallback) {
	try { var v = localStorage.getItem(key); return v === null ? fallback : v; } catch (e) { return fallback; }
}
function writeStore(key, value) {
	try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
}

// Background music: created lazily and only started after the first click / key press
// (browsers block autoplay before a user gesture).
var finntopvoid = null;
function music() {
	if (muted) return;
	if (!finntopvoid) {
		finntopvoid = new Audio(ASSETS + 'Finntopmusic_Void.mp3');
		finntopvoid.loop = true;
		finntopvoid.volume = 0.5;
	}
	var p = finntopvoid.play();
	if (p && p.catch) p.catch(function () {});
}

function sfx(file) {
	if (muted) return;
	var audio = new Audio(ASSETS + file);
	var p = audio.play();
	if (p && p.catch) p.catch(function () {});
}

function setMuted(value) {
	muted = value;
	writeStore(MUTE_KEY, muted ? "1" : "0");
	var btn = document.getElementById("muteBtn");
	if (btn) btn.innerHTML = muted ? "&#128263;" : "&#128266;";
	if (muted) { if (finntopvoid) finntopvoid.pause(); }
	else if (started) music();
}

function formatTime(t) {
	var m = Math.floor(t / 60);
	var sec = Math.floor(t % 60);
	return m + ":" + (sec < 10 ? "0" : "") + sec;
}

function startGame() {
	if (started) return;
	started = true;
	document.getElementById("startOverlay").hidden = true;
	music();
}

function init() {
    // code here.
	stage = new createjs.Stage("demoCanvas");
	if (createjs.Touch.isSupported()) createjs.Touch.enable(stage);
	background();
	starsprites = stars();
	diamonds = points();
	floors = floor();
	finish = reddiamond();
	movewalls = movingwalls();
	loadAudio();
	

	txtcheckpoint = new createjs.Text("checkpoint!", "50px Arial", "White");
	txtcheckpoint.x = -500;
	TS135 = new createjs.Bitmap(ASSETS + "B.TS135.png");
	TS135.regX = 50;
	TS135.regY = 50;
	TS135.x = 100;
	TS135.y = 100;
	suunta = {x: 0, y: 0, momentum: 0};

	//Let`s make her alive
	stage.addChild(TS135);

	balleye = new createjs.Bitmap(ASSETS + "B.TS135E.png");
	balleye.regX = 50;
	balleye.regY = 50;
	balleye.x = 100;
	balleye.y = 100;
	animate();

	stage.addChild(balleye);
	stage.update();

	level = level01();
	
	interval = setInterval(update,delta);
}

function loadAudio() {
  var preload = new createjs.LoadQueue();
  preload.loadFile(ASSETS + '406562__anthousai__hit-metallic-01.wav');
  preload.loadFile(ASSETS + '274183__littlerobotsoundfactory__jingle-win-synth-04.wav');
  preload.loadFile(ASSETS + '270404__littlerobotsoundfactory__jingle-achievement-00.wav');
  preload.loadFile(ASSETS + '160068_jorickhoofd_tube-hit-with-metal-object-soft.wav');
}

function update() {

	if (paused || !started) {
		return;
	}

	timer+=delta/1000;
	updateHud();	

	suunta.y+=gravity*gravitydirection*delta/1000;

	//var suunta = {x: 5, y: 4}
	level.x-=suunta.x;
	floors.x-=suunta.x;

	for(i=0; i < movewalls.length; i++){
		//movewalls[i] = {shape: movingwall(100,300), max:500, min:0, direction:1}
		movewalls[i].shape.x -= suunta.x;
		
		if (movewalls[i].shape.y > movewalls[i].max || movewalls[i].shape.y < 0) {
			movewalls[i].direction*=-1;
		}
		movewalls[i].shape.y += movewalls[i].direction;
	}

	for (i=0;i< diamonds.length;i++){
    	diamonds[i].x -=suunta.x;
    //Diamonds move as fast as level
	}

	finish.x -=suunta.x;
	//finishing line moves as fast as level

	starsprites.x -=0.3*suunta.x;	

	for(var i = 0; i < 8; i++){
		if (paused) { stage.update(); return; }
		var x = Math.cos(i*Math.PI/4) * 50 + TS135.x - level.x;
		var y = Math.sin(i*Math.PI/4) * 50 + TS135.y;

		for (var j=0;j< diamonds.length;j++){
    		if(diamonds[j].hitTest(x,y)){
    			
				sfx('274183__littlerobotsoundfactory__jingle-win-synth-04.wav');						

				spawn.x = diamonds[j].x;
    			createjs.Tween.get(txtcheckpoint)
     			.to({x: -300, y: 250},0)
    			.wait(400)
     			.to({x:400},500)
     			.wait(600)
     			.to({x:1200},500);
     			stage.addChild(txtcheckpoint);

    			stage.removeChild(diamonds[j]);
    			diamonds.splice(j,1);
    		}
		}

		if(finish.hitTest(x,y)){

			sfx('270404__littlerobotsoundfactory__jingle-achievement-00.wav'); 

			console.log("You are Vinner!");
			paused = true;

			var menu = new createjs.Shape();
			menu.graphics.beginFill("white");
			menu.graphics.beginStroke("black").
			mt(250,100).lt(750,100).lt(750,450).lt(250,450).lt(250,100);
			stage.addChild(menu);

			var againbutton = new createjs.Shape();
			againbutton.graphics.beginFill("#941bd1");
			againbutton.graphics.beginStroke("black").
			mt(305,230).lt(695,230).lt(695,330).lt(305,330).lt(305,230);
			stage.addChild(againbutton);

			againbutton.cursor = "pointer";
			againbutton.on("click", function(evt) { newGame(); });

			var text = new createjs.Text("Congratulations!", "60px Arial", "black");
 			text.x = 285;
 			text.y = 200;
 			text.textBaseline = "alphabetic";
 			stage.addChild(text);

 			var againtxt = new createjs.Text("Again!", "60px Arial", "black");
 			againtxt.x = 400;
 			againtxt.y = 300;
 			againtxt.textBaseline = "alphabetic";
 			stage.addChild(againtxt);
 			console.log(timer);
 			function pad(num) {
 				var numstring = ""+num;
 				if(numstring.length==1){
 					return ("0"+numstring); 
 				}
 				else {
 					return (numstring);
 				}
			}

 			var isBest = bestTime === 0 || timer < bestTime;
			if (isBest) { bestTime = timer; writeStore(BEST_KEY, String(timer)); }
			updateHud();
 			var txt = new createjs.Text("Time " + formatTime(timer) + (isBest ? "  New best!" : "  Best " + formatTime(bestTime)), "34px Arial", "black");
 			txt.x = 270;
 			txt.y = 420;
 			txt.textBaseline = "alphabetic";
 			stage.addChild(txt);

			stage.removeChild(finish);
			letClicksThroughText();
		}

		floorsurface.y = TS135.y;
		
		if(floors.hitTest(x,y)){
			suunta.y = 0;
			//2 ylhäällä, 6 alhaalla
			if(groundedsound == false){
				sfx('160068_jorickhoofd_tube-hit-with-metal-object-soft.wav');
				groundedsound = true;
			}

			if(i===6){
				groundedup = true;
				var i = 0;
				while(floors.hitTest(x,TS135.y-50)){
					TS135.y++;
				}
				suunta.y = 0;
				gravitydirection = -1;
			}
			if(i===2){
				groundeddown = true;
				var i = 0;
				while(floors.hitTest(x,TS135.y+50)){
					TS135.y--;
				}
				suunta.y = 0;
				gravitydirection = 1;
			}
			//TS135.y = floorsurface.y - suunta.y;

			/*	for(var i = 0; i < 8; i++){
		var x = Math.cos(i*Math.PI/4) * 50 + TS135.x - level.x;
		var y = Math.sin(i*Math.PI/4) * 50 + TS135.y; */
		}
	

		/*
			if (TS135.y>=450) {
		suunta.y = 0;
		TS135.y = 450;
		groundeddown = true;
	}	*/

		if(level.hitTest(x,y)) {
			
			if(groundedsound == false) {
				sfx('406562__anthousai__hit-metallic-01.wav');
				groundedsound = true;
			}
			
			gameOver();
		}

		//lets optimate movingwalls
		for(var j=0;j<movewalls.length;j++) {
			var distance = movewalls[j].start + movewalls[j].shape.x;
			if(distance > 0 && distance <400){
				if(movewalls[j].shape.hitTest(x,y-movewalls[j].shape.y)) {
					
					if(groundedsound == false) {
						sfx('406562__anthousai__hit-metallic-01.wav');
						groundedsound = true;
					}
					
					gameOver();
				}
			}
		}
	}
	
	if(groundeddown||groundedup) {
		suunta.y = 0;

		if(groundedsound == false){
				sfx('160068_jorickhoofd_tube-hit-with-metal-object-soft.wav');
				groundedsound = true;
			}
		/*
		if(groundedsound == false) {
			sfx('406562__anthousai__hit-metallic-01.wav');
			groundedsound = true;
		}
		*/
	}

	TS135.y+=suunta.y;

	if (TS135.y>=450) {
		suunta.y = 0;
		TS135.y = 450;
		groundeddown = true;
		gravitydirection = 1;
	}

	if (TS135.y<=50) {
		suunta.y = 0;
		TS135.y = 50;
		groundedup = true;
		gravitydirection = -1;
	}

	if (groundeddown === true) {
		if (suunta.x > 0 ) {
			suunta.momentum=2.15;
		}else if (suunta.x < 0 ) {
			suunta.momentum=-2.15;
		}else{
			suunta.momentum=0;
		}
	} else if (groundedup === true) {
		if (suunta.x < 0) {
			suunta.momentum=2.15;
		}else if (suunta.x > 0) {
			suunta.momentum=-2.15;
		}else{
			suunta.momentum=0;
		}
	}

	TS135.rotation+=suunta.momentum;

	balleye.y = TS135.y;
	balleye.rotation = TS135.rotation;
	stage.update();
}

function gameOver() {
	if (paused) return; // several hit points can collide in one frame: show one menu only
	deaths++;
	updateHud();
	var menu = new createjs.Shape();
	menu.graphics.beginFill("white");
	menu.graphics.beginStroke("black").
	mt(300,100).lt(700,100).lt(700,450).lt(300,450).lt(300,100);
	stage.addChild(menu);

	var again = new createjs.Shape();
	again.graphics.beginFill("#941bd1");
	again.graphics.beginStroke("black").
	mt(375,350).lt(625,350).lt(625,425).lt(375,425).lt(375,350);

	var checkpoint = new createjs.Shape();
	checkpoint.graphics.beginFill("blue");
	checkpoint.graphics.beginStroke("black").
	mt(375,250).lt(625,250).lt(625,325).lt(375,325).lt(375,250);
	stage.addChild(checkpoint);

	again.cursor = "pointer";
	checkpoint.cursor = "pointer";
	again.on("click", function(evt) { newGame(); });
	checkpoint.on("click", function(evt) { restartFromCheckpoint(); });

	stage.addChild(again);

	var text = new createjs.Text("Game over!", "60px Arial", "black");
	text.x = 350;
	text.y = 200;
	text.textBaseline = "alphabetic";
	stage.addChild(text);

	var againtxt = new createjs.Text("New game", "30px Arial", "white");
	againtxt.x = 430;
	againtxt.y = 375;
	stage.addChild(againtxt);

	var checkpointtxt = new createjs.Text("Last checkpoint", "30px Arial", "white");
	checkpointtxt.x = 395;
	checkpointtxt.y = 250;
	stage.addChild(checkpointtxt);

	var spacetxt = new createjs.Text("(Space)", "30px Arial", "white");
	spacetxt.x = 450;
	spacetxt.y = 275;
	stage.addChild(spacetxt);
	
	paused = true;
	letClicksThroughText();
	stage.update();

}

function animate() {
	var random = 3000*Math.random()+1000;

	createjs.Tween.get(balleye)
	.to({visible:false}, random)
	.to({visible:true}, 300)
	.call(animate);
}

const r = 82;
const leftkey = 37;
const rightkey = 39;
const upkey = 38;
const downkey = 40;
const space = 32;
const gravity = 9.80665;
const speed = 5;
var gravitydirection = 1;

// Labels are drawn on top of the menu buttons; let clicks pass through them to the buttons.
function letClicksThroughText() {
	for (var i = 0; i < stage.children.length; i++) {
		if (stage.children[i] instanceof createjs.Text) stage.children[i].mouseEnabled = false;
	}
}

function resetRun() {
	clearInterval(interval);
	createjs.Tween.removeAllTweens();
	stage.removeAllChildren();
	paused = false;
	gravitydirection = 1;
	groundedup = false;
	groundeddown = false;
	groundedsound = false;
	init();
}

function newGame() {
	timer = 0;
	deaths = 0;
	spawn.x = 0;
	resetRun();
	updateHud();
}

function restartFromCheckpoint() {
	resetRun();
	level.x = spawn.x;
	finish.x = spawn.x;
	floors.x = spawn.x;
	for (var j = 0; j < diamonds.length; j++) {
		diamonds[j].x = spawn.x;
	}
	for (var k = 0; k < movewalls.length; k++) {
		movewalls[k].shape.x = spawn.x;
	}
	stage.update();
}

function flipGravity() {
	if (paused || !started) return;
	gravitydirection *= -1;
	groundeddown = false;
	groundedup = false;
	groundedsound = false;
}

function updateHud() {
	var t = document.getElementById("hudTime");
	if (!t) return;
	t.textContent = formatTime(timer);
	document.getElementById("hudDeaths").textContent = deaths;
	document.getElementById("hudBest").textContent = bestTime ? formatTime(bestTime) : "--";
}

document.onkeydown = function (event) {
	var key_press = event.keyCode;

	if (key_press == space || key_press == leftkey || key_press == rightkey || key_press == upkey || key_press == downkey) {
		event.preventDefault(); // don't scroll the page / parent frame
	}

	if (!started) {
		startGame();
		return;
	}

	if (key_press == 77) { // M
		setMuted(!muted);
		return;
	}

	if (key_press == r) { // R = new game
		newGame();
		return;
	}

	if (paused) {
		if (key_press == space) {
			restartFromCheckpoint(); // don't also flip gravity on the same key press
		}
		return;
	}

	if (key_press == leftkey) {
		suunta.x = -1*speed;
	}

	if (key_press == rightkey) {
		suunta.x = 1*speed;
	}

	if (key_press == space || key_press == upkey) {
		if (!event.repeat) flipGravity();
	}
}

// ---- On-screen / touch controls ----
function bindHold(id, dir) {
	var el = document.getElementById(id);
	if (!el) return;
	el.addEventListener("pointerdown", function (e) {
		e.preventDefault();
		if (!started) startGame();
		if (!paused) suunta.x = dir * speed;
	});
	["pointerup", "pointercancel", "pointerleave"].forEach(function (t) {
		el.addEventListener(t, function () { if (suunta && suunta.x === dir * speed) suunta.x = 0; });
	});
}

function setupControls() {
	bindHold("btnLeft", -1);
	bindHold("btnRight", 1);
	document.getElementById("btnFlip").addEventListener("pointerdown", function (e) {
		e.preventDefault();
		if (!started) { startGame(); return; }
		if (paused) restartFromCheckpoint();
		else flipGravity();
	});
	document.getElementById("startOverlay").addEventListener("click", startGame);
	window.addEventListener("blur", function () { if (suunta) suunta.x = 0; });
	document.getElementById("muteBtn").addEventListener("click", function () { this.blur(); setMuted(!muted); });
	document.getElementById("newGameBtn").addEventListener("click", function () { this.blur(); if (!started) startGame(); newGame(); });
	document.getElementById("muteBtn").innerHTML = muted ? "&#128263;" : "&#128266;";
	updateHud();
}
document.onkeyup = function (event) {
	var key_up = event.keyCode;

	if (key_up == leftkey) {
		suunta.x = 0;
	}

	if (key_up == rightkey) {
		suunta.x = 0;
	}

}