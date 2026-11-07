function level01(){
	var level = new createjs.Shape();
	level.graphics.beginFill("#999daf");
	level.graphics.beginStroke("#4e4f54").

	//Taso 1

	// maassa
	mt(400,200).lt(450,200).lt(450,500).lt(400,500).lt(400,200). //maassa
	mt(700,500).lt(1000,500).lt(1000,400).lt(700,400).lt(700,500).
	mt(1000,500).lt(1300,500).lt(1150,375).lt(1000,500).
	mt(1300,500).lt(1300,400).lt(1700,400).lt(1700,500).lt(1300,500). //maassa
	mt(2000,500).lt(2300,200).lt(2300,500).lt(2000,500). //kolmio maassa
	mt(3100,110).lt(3500,110).lt(3500,500).lt(3100,500).	//iso neliö maassa
	mt(2500,500).lt(2900,500).lt(2900,300).lt(2800,300).lt(2800,400).lt(2500,400).lt(2500,500). //L-kappale maassa

	//katossa
	mt(200,0).lt(250,0).lt(250,390).lt(200,390).lt(200,0). //katossa
	mt(1500,0).lt(1500,100).lt(1600,100).lt(1600,0).lt(1500,0). //katossa
	mt(1900,0).lt(2000,0).lt(2000,200).lt(1900,200).lt(1900,0). //katossa
	mt(2500,0).lt(2900,0).lt(2900,100).lt(2500,100).lt(2500,0). //suorakulmio katossa
	

	//Taso 2
	
	//maakappaleet
	mt(4900,500).lt(5400,500).lt(5100,120).lt(4900,500).
	mt(3800,500).lt(4000,500).lt(4000,450).lt(3900,450).lt(3900,400).lt(3800,500). //Ensimmäinen kulmikas palikka maassa
	mt(4000,500).lt(4200,300).lt(4200,400).lt(4300,500).lt(4000,500). //
	mt(4300,500).lt(4350,250).lt(4500,500).lt(4300,500). //
	mt(4600,500).lt(4700,350).lt(4800,500).lt(4600,500). //

	//katossa 
	mt(3700,0).lt(3900,0).lt(3800,100).lt(3700,100).lt(3700,0). //Ensimmäinen palikka katossa
	mt(4000,0).lt(4000,200).lt(4200,0).lt(4000,0). //
	mt(4250,0).lt(4350,0).lt(4300,100).lt(4250,0). //
	mt(4450,0).lt(4700,0).lt(4600,200).lt(4600,100).lt(4550,150).lt(4450,0). //
	mt(5300,0).lt(5550,390).lt(5650,300).lt(5900,395).lt(5960,300).lt(6000,393).lt(6100,0).lt(5300,0). //
	
	
	//taso 3
	
	//katossa
	mt(6550,0).lt(6550,130).lt(6680,130).lt(6680,0).lt(6550,0). 

	//ilmassa
	mt(6350,150).lt(6400,150).lt(6400,350).lt(6350,350).lt(6350,150).
	mt(6850,200).lt(6900,200).lt(6900,300).lt(6850,300).lt(6850,200).

	//maassa
	mt(6550,370).lt(6550,500).lt(6680,500).lt(6680,370).lt(6550,370).
	mt(7100,500).lt(7800,500).lt(7800,400).lt(7100,400).lt(7100,500).
	mt(8000,105).lt(8100,105).lt(8100,500).lt(8000,500).lt(8000,105).

	//taso 4

	//katossa
	mt(8400,0).lt(8400,300).lt(8600,100).lt(8800,200).lt(8900,100).lt(9100,0).lt(8400,0).
	mt(9100,0).lt(9400,50).lt(9500,0).lt(9100,0).

	//maassa
	mt(8500,500).lt(8600,300).lt(8700,400).lt(8725,500).lt(8500,500).
	mt(8900,500).lt(9100,400).lt(9100,250).lt(9200,300).lt(9400,250).lt(9500,500).lt(8900,500).

	//ilmassa
	mt(9600,250).lt(9700,200).lt(9700,150).lt(9800,150).lt(9800,350).lt(9700,350).lt(9700,300).lt(9600,250).

	//taso 5

	//katossa
	mt(10200,0).lt(10300,0).lt(10300,100).lt(10200,100).lt(10200,0).
	mt(10400,0).lt(10500,0).lt(10500,100).lt(10400,100).lt(10400,0).
	mt(10600,0).lt(10700,0).lt(10700,100).lt(10600,100).lt(10600,0).
	mt(10900,0).lt(10900,50).lt(11800,50).lt(11800,0).lt(10900,0).

	mt(12900,0).lt(12900,10).lt(13400,10).lt(13400,0).lt(12900,0).

	//maassa
	mt(10900,450).lt(10900,500).lt(11800,500).lt(11800,450).lt(10900,450).
	mt(10200,500).lt(10700,500).lt(10700,400).lt(10200,400).lt(10200,500).

	mt(12900,500).lt(12900,490).lt(13400,490).lt(13400,500).lt(12900,500).

	//taso6

	//katossa
	mt(14900,0).lt(14910,0).lt(14910,250).lt(14900,250).lt(14900,0).

	//ilmassa
	mt(13600,110).lt(13610,110).lt(13610,380).lt(13600,380).lt(13600,110).
	mt(13780,240).lt(13800,240).lt(13800,260).lt(13780,260).lt(13780,240).
	mt(14700,110).lt(14700,120).lt(14720,120).lt(14720,110).lt(14700,110).

	//maassa
	mt(14700,370).lt(14710,370).lt(14710,500).lt(14700,500).lt(14700,370).


//loppuvastus

	//katossa
	mt(15400,0).lt(15600,200).lt(15700,0).lt(15400,0).
	mt(15700,0).lt(15800,50).lt(15900,0).lt(15700,0).
	mt(15900,0).lt(16000,100).lt(16000,200).lt(16200,0).lt(15900,0).
	mt(16200,0).lt(16250,0).lt(16250,100).lt(16200,0).
	mt(16550,0).lt(16550,100).lt(16600,0).lt(16550,0).
	mt(16600,0).lt(17000,0).lt(16900,50).lt(16600,0).
	mt(17000,0).lt(17450,0).lt(17400,50).lt(17350,250).lt(17175,250).lt(17100,50).lt(17000,0).

	//ilmassa
	mt(16650,150).lt(16700,100).lt(16750,150).lt(16700,200).lt(16650,150).

	//maassa
	mt(15400,500).lt(15500,400).lt(15600,400).lt(15800,300).lt(15900,500).lt(15400,500).
	mt(15900,500).lt(16100,400).lt(16150,500).lt(15900,500).
	mt(16150,500).lt(16300,400).lt(16600,500).lt(16150,500).
	mt(16600,500).lt(16600,450).lt(16750,500).lt(16600,500).
	mt(16750,500).lt(16800,400).lt(16800,450).lt(16950,450).lt(17000,200).lt(17100,500).lt(16750,500).
	mt(17100,500).lt(17150,400).lt(17150,500).lt(17100,500).
	mt(17350,500).lt(17400,500).lt(17350,400).lt(17350,500);

	stage.addChild(level);
	return level;
}


function floor(x,y){
	var floor = new createjs.Shape();
	floor.graphics.beginFill("#42e8f7");
	floor.graphics.beginStroke("#4e4f54").
	
	mt(6400,240).lt(6400,260).lt(6850,260).lt(6850,240).lt(6400,240).

	mt(13610,110).lt(13610,120).lt(14700,120).lt(14700,110).lt(13610,110).
	mt(13800,240).lt(13800,250).lt(14900,250).lt(14900,240).lt(13800,240).
	mt(13610,370).lt(13610,380).lt(14700,380).lt(14700,370).lt(13610,370).

	mt(16250,0).lt(16250,100).lt(16550,100).lt(16550,0).lt(16250,0).
	mt(17150,500).lt(17150,400).lt(17350,400).lt(17350,500).lt(17150,500);

	stage.addChild(floor);

	return floor;
}

function movingwalls() {
	function movingwall(x,y){
		var movingwall = new createjs.Shape();
		var size = 7;
		movingwall.graphics.beginFill("red");
		movingwall.graphics.beginStroke("black").

		mt(x-3*size,y-5.2*size).lt(x+3*size,y-5.2*size).lt(x+6*size,y).lt(x+3*size,y+5.2*size).lt(x-3*size,y+5.2*size).lt(x-6*size,y).lt(x-3*size,y-5.2*size);

		stage.addChild(movingwall);
		return movingwall;
	}
	
	var array = [];

	array.push({shape: movingwall(850,50), max:400, direction:3, start: 850});
	array.push({shape: movingwall(1550,150), max:300, direction:4, start: 1550});
	array.push({shape: movingwall(6875,50), max:400, direction:4, start: 6875});

	array.push({shape: movingwall(7150,50), max:350, direction:7, start: 7150});
	array.push({shape: movingwall(7450,50), max:350, direction:7, start: 7450});
	array.push({shape: movingwall(7750,50), max:350, direction:7, start: 7750});

	array.push({shape: movingwall(10350,50), max:300, direction:4, start: 10350});
	array.push({shape: movingwall(10550,50), max:300, direction:4, start: 10550});

	array.push({shape: movingwall(11050,100), max:350, direction:3.5, start: 11050});
	array.push({shape: movingwall(11150,100), max:350, direction:3.5, start: 11150});
	array.push({shape: movingwall(11400,100), max:350, direction:3.5, start: 11400});
	array.push({shape: movingwall(11500,100), max:350, direction:3.5, start: 11500});
	array.push({shape: movingwall(11750,100), max:350, direction:2, start: 11750});

	array.push({shape: movingwall(12250,50), max:400, direction:3, start: 12250});
	array.push({shape: movingwall(12350,50), max:400, direction:3, start: 12350});
	array.push({shape: movingwall(12450,50), max:400, direction:3, start: 12450});

	array.push({shape: movingwall(12530,50), max:200, direction:3, start: 12530});
	array.push({shape: movingwall(12530,275), max:400, direction:3, start: 12530});

	array.push({shape: movingwall(15550,50), max: 400, direction:2, start: 15550});
	array.push({shape: movingwall(16400,50), max: 400, direction:3, start: 16400});
	array.push({shape: movingwall(17000,50), max: 400, direction:4, start: 17000});

//----------------------------------------------------------------------

	array.push({shape: movingwall(12950,50), max:400, direction:3, start: 12950});
	array.push({shape: movingwall(13050,50), max:400, direction:3, start: 13050});
	array.push({shape: movingwall(13150,50), max:400, direction:3, start: 13150});

	array.push({shape: movingwall(13430,50), max:200, direction:3, start: 13430});
	array.push({shape: movingwall(13430,275), max:400, direction:3, start: 13430});

	array.push({shape: movingwall(13850,50), max:400, direction:5, start: 13850});
	array.push({shape: movingwall(14250,50), max:400, direction:5, start: 14250});

	return array;
}


function background(){
	var background = new createjs.Shape();
	background.graphics.beginFill("#122ea9").drawRect(0,0,2000,500);
	stage.addChild(background);
	return background;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgb(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function stars(){
	var star = new createjs.Shape();

	for (i = 0;i<300;i++) {

		var r = Math.floor(Math.random() * 55) + 200;
		var g = Math.floor(Math.random() * 55) + 200;
		var b = Math.floor(Math.random() * 55) + 200;
		if(Math.random() < 0.5){
	 		r = 255;
		}else{
			b = 255;
		}

		var x = Math.floor(Math.random() * 4000) + 1;
		var y = Math.floor(Math.random() * 500) + 1;
		star.graphics.beginFill(rgb (r,g,b)).drawCircle(x,y,Math.ceil(Math.random()*5));
	}

	stage.addChild(star);
	return star;
}

function points(){

	function diamond(x,y){
		var point = new createjs.Shape();

		point.graphics.beginFill("silver");
		point.graphics.beginStroke("black").
		mt(x,y-25).lt(x+12,y).lt(x,y+25).lt(x-12,y).lt(x,y-25);
		stage.addChild(point);
		return point;
	}

	var array = [];
	array.push(diamond(3620,50));
	array.push(diamond(6200,450));
	array.push(diamond(8250,50));
	array.push(diamond(9950,250));
	array.push(diamond(10800,450));
	array.push(diamond(12000,450));
	array.push(diamond(15100,450));

	return array;
}

function reddiamond(){
	var finish = new createjs.Shape();
	finish.graphics.beginFill("gold");
	finish.graphics.beginStroke("black").
	//mt(0,500).lt(50,500).lt(50,450).lt(0,450).lt(0,500);
	mt(17200,325).lt(17212,350).lt(17200,375).lt(17188,350).lt(17200,325);
	stage.addChild(finish);
	return finish;
}