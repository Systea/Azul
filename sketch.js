let shops = [];
let center = null;
let tileSize = 30;
let width = 600	;
let height = 800;
let shopsX = [180, width - 180, 80, width-80, width/2];
let shopsY = [80, 80, 280, 280, 480];
let colors = [0,1,2,3,4];
let tiles = 20;
let score = 0;
//let colors = [#0000ff, #ff00ff, #66ff66, #ffff00, #ff0000];

//all we need is for each shop to keep track of its tiles and for the centers to keep track of its.

function setup() {
  createCanvas(width, height);
  center = new Center();
  for(let i = 0; i < 5; i++){
  	let x = shopsX[i];
  	let y = shopsY[i];
  	let s = new Shop(x, y, i);
  	shops.push(s);
  }
}

function mousePressed() {
	let x = mouseX;
	let y = mouseY;
  for (let i = 0; i < shops.length; i++) {
    shops[i].clicked(x, y);
  }
  center.clicked(x, y);
}


function draw() {
  background(0);
  for (let i = 0; i < shops.length; i++) {
    shops[i].show();
  }
  center.show();
  if(tiles == 0){
  	center = new Center();
  	center = new Center();
  	shops = [];
  for(let i = 0; i < 5; i++){
  	let x = shopsX[i];
  	let y = shopsY[i];
  	let s = new Shop(x, y, i);
  	shops.push(s);
  }
  	tiles = 20;
  }
  text(score, 580, 785);
}

class Center {
	constructor(){
		this.tiles = [];
		this.c = 5;
	}

	clicked(px, py) {
    //let d = dist(px, py, this.x, this.y);
    	// 
    	for (let i = 0; i < this.tiles.length; i++) {
    		if(this.tiles[i].clicked(px, py)){//if i clicked on THIS TILE!
    			for(let i = 0; i <shops.length; i++){
		    		if(this.shopNum != i){
		    			shops[i].deSelect();
		    		}
		    	}
    			if(this.tiles[i].getColor() != this.c){
    				this.deSelect();
    			}
    			this.c = this.tiles[i].getColor(); //get its color
    			var s = this.tiles[i].getSelect(); //get its select value

    			for(let i = 0; i < this.tiles.length; i++){//loook at all of the tiles
    				if(this.tiles[i].getColor()	 === this.c){ //if the tile has the same color
    					if(this.tiles[i].getSelect() === 0){ //if it is not selected
    						this.tiles[i].setSelect(1); //select it
    					} else {
    						this.tiles.splice(i, 1);
    						tiles --; 
    						score ++;//if it is selected, send them away.
    						i--;
    						//this.killFlag = 1;
    					}
    				}
    			}
    			break;
    		}
  		}
    }


	push(i){
		this.tiles.push(i);
	}

	getTiles(){
		return this.tiles;
	}

	rePlace(){
		for(let i = 0; i < this.tiles.length; i++){
			if(i<7){
				this.tiles[i].setX(i*40 + 200);
				this.tiles[i].setY((i%2)*40 + 200);
			} else {
				this.tiles[i].setX((i-7)*40 + 200);
				this.tiles[i].setY((i%2)*40 + 300);
			}
		}
	}

    deSelect(){
  	for (let i = 0; i < this.tiles.length; i++) {
  		this.tiles[i].setSelect(0);
  	}
  }

  show() {
  	//this.deSelect();
  	this.rePlace();
	for (let i = 0; i < this.tiles.length; i++) {
    	this.tiles[i].show();
  	}
  }

} 

class Shop {
	constructor(x, y, n) {
		this.shopNum = n;
		this.x = x; //110
		this.y = y; //110
		this.r = 60;
		this.tiles = [];
		this.adjust = tileSize - 10;
		this.c = 5;
		this.killFlag = 0;

		this.tiles.push(new Tile(this.x - this.adjust, this.y - this.adjust, random(colors)));
		this.tiles.push(new Tile(this.x - this.adjust, this.y + this.adjust, random(colors)));
		this.tiles.push(new Tile(this.x + this.adjust, this.y - this.adjust, random(colors)));
		this.tiles.push(new Tile(this.x + this.adjust, this.y + this.adjust, random(colors)));
	}

	

	clicked(px, py) {
    let d = dist(px, py, this.x, this.y);
    if (d < this.r) {
    	for(let i = 0; i<shops.length; i++){
    		if(this.shopNum != i){
    			shops[i].deSelect();
    		}
    		center.deSelect();
    	}
    	for (let i = 0; i < this.tiles.length; i++) {
    		if(this.tiles[i].clicked(px, py)){//if i clicked on THIS TILE!
    			if(this.tiles[i].getColor() != this.c){
    				this.deSelect();
    			}
    			this.c = this.tiles[i].getColor(); //get its color
    			var s = this.tiles[i].getSelect(); //get its select value
    			for(let i = 0; i < this.tiles.length; i++){//loook at all of the tiles
    				if(this.tiles[i].getColor()	 === this.c){ //if the tile has the same color
    					if(this.tiles[i].getSelect() === 0){ //if it is not selected
    						this.tiles[i].setSelect(1); //select it
    					} else {
    						this.tiles.splice(i, 1);
    						tiles--; 
    						score++;//if it is selected, send them away.
    						i--;
    						this.killFlag = 1;
    					}
    				}
    			}
    			break;
    		}

  		}
      
    }
    if(this.killFlag === 1 ){
    	for(let i = this.tiles.length - 1; i >= 0; i--){
    		let x = this.tiles[i];
    		center.push(x);
			this.tiles.splice(i, 1);

    	}
    	this.killFlag = 0;
    }
  }

  deSelect(){
  	for (let i = 0; i < this.tiles.length; i++) {
  		this.tiles[i].setSelect(0);
  	}
  }

	show() {
	for (let i = 0; i < this.tiles.length; i++) {
    	this.tiles[i].show();
  	}
    stroke(255);
    strokeWeight(3);
    noFill();
    ellipse(this.x, this.y, this.r*2);
  }
}

class Tile {
  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.r = tileSize;
    this.colorr = c;
    this.brightness = 0;
    this.selected = 0;
  }

  clicked(px, py) {
    let d = dist(px, py, this.x, this.y);
    if (d < this.r) {
    	return true;
    }else{
    	return false;
    }
  }

  getColor(){
  	return this.colorr;
  }

  getSelect(){
  	return this.selected;
  }

  setSelect(s){
  	console.log(s);
  	this.selected = s;
  	this.brightness = s*255;
  }

  setBrightness(b) {
  	this.brightness = s*255;
  }

  setX(x){
  	this.x = x;
  }

  setY(y){
  	this.y = y;
  }

  show() {
    stroke(this.brightness, 125);
    strokeWeight(3);
    fill((this.colorr)*60, (4-this.colorr)*60, ((this.colorr + 2)%5)*60);
    ellipse(this.x, this.y, this.r);
  }
}