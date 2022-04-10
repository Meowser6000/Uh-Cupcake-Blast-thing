const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

const START = 0;
const PLAY = 1;
const END =2;
const DESTROYED =3;

var gameState = START;
var rect;

var cat;
var cat_animation;
var cat_animation2;
var dizzy_animation;
var colorful_bg;
var obstacle;
var cupcakes = [];
var ground,leftWall, rightWall;
var introduction_page;
var introduction_page2;
var introduction_page3;
var introduction;
var next_img;
var ok_img;
var buttons;
var clickCount = 1;
var theme_song, squee;
var score;
var UN_colorful_bg;

var maxCupcakes = 5;


function preload() {
  introduction_page= loadImage("welcome_.png");
  introduction_page2= loadImage("instructions.png");
  introduction_page3= loadImage("good_luck.png");
  obstacle= loadImage("cupcake.png")
  cat= loadImage("1.png");
  next_img = loadImage("next.png");
  ok_img = loadImage("ok.png");
  colorful_bg= loadImage("colorful_city.png");
  UN_colorful_bg= loadImage("UN_colorful_bg._..png");


  cat_animation= loadAnimation("1.png","2.png","3.png","4.png","5.png","6.png","7.png","8.png");
  cat_animation2= loadAnimation("11.png","12.png","13.png","14.png","15.png","16.png","17.png","18.png");
  dizzy_animation= loadAnimation("1e.png","2e.png","3e.png","4e.png","5e.png","6e.png","7e.png","8e.png");

  theme_song= loadSound("theme_song.wav");
  squee= loadSound("squee!!.wav")

  cat_animation.playing = true;
  dizzy_animation.playing = true;
  cat_animation.looping = true;
  dizzy_animation.looping = true;
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  engine = Engine.create();
  world = engine.world;
  frameRate(50);

  
  //cat stuff
  cat_animation.frameDelay = 15;
  cat_animation2.frameDelay = 15;
  dizzy_animation.frameDelay = 15;
  cat = createSprite(1300,1000);
  cat.addAnimation('dizzy',dizzy_animation);
  cat.addAnimation('idle',cat_animation);
  cat.addAnimation('idle2',cat_animation2);
  cat.changeAnimation('idle');


  //introduction stuff
  introduction = createSprite(1300,600);
  introduction.scale = 3.5;
  introduction.addImage('1', introduction_page);
  introduction.addImage('2', introduction_page2);
  introduction.addImage('3', introduction_page3);
  introduction.changeAnimation('1');

  //button stuff
  buttons = createSprite(1500,1000);
  buttons.addImage('next',next_img);
  buttons.addImage('ok',ok_img);
  buttons.changeAnimation('next');

  
  //audio stuff
  theme_song.play();

  //score stuff
  score = 0;

}


function draw() {
  cat.debug = false;
  cat.setCollider("rectangle",0, 0, 80, 80);
  background(colorful_bg,0,0,width,height);
  Engine.update(engine);
  console.log (gameState);
  if ( gameState ==START && mouseWentDown("leftButton") && mouseIsOver(buttons)) {
    clickCount = clickCount + 1;
    introduction.changeAnimation(clickCount);
    if(clickCount > 2) {
      buttons.changeAnimation('ok');
    }
    if(clickCount > 3) {
      buttons.destroy();
      introduction.destroy();
      console.log("PLAY");
      gameState = PLAY;

      //cupcake stuff
      for (var i = 0; i <= maxCupcakes; i++) {
          var x = random(0, windowWidth); //so that kitty doesn't get hammered off the first batch
          var y = random(-500, 0);
          console.log("x is: ", x,". y is ", y);
          var cupc = new cupcake(x, y, 100,100);
          cupcakes.push(cupc);
      }


    }
 
  } else if (gameState == PLAY) {
    for( var i = 0; i < cupcakes.length; i++){ 
        cupcakes[i].show(); 
        if (frameCount %20 == 0 && cupcakes[i].body.position.y > windowHeight -50) {
            cupcakes.splice(i,1); //remove the cupcake from array.
        }
    }
    // wrapping cupcakes from the bottom edge to the top
    if (frameCount %20 == 0) {
      var x = random(0, windowWidth);
      var y = random(-100, 100);
      if (cupcakes.length < maxCupcakes) {
        var cupc = new cupcake(x, y, 125, 125);
        cupcakes.push(cupc);
        score++;
      }
    }
    if(keyDown("right")) {
      cat.x = cat.x + 10;
      cat.changeAnimation('idle');
    }
    if(keyDown("left")) {
      cat.x = cat.x - 10;
      cat.changeAnimation('idle2');
    }
    //console.log(cat.x);
    if(cat.x < 140){
      cat.x = 140;
    }
    if(cat.x > 2460){
      cat.x = 2460;
    }
    //check if a cupcake touches the cat 
    for( var i = 0; i < cupcakes.length; i++){ 
      if (isTouching(cat,cupcakes[i])) {
     // if (collide(cupcakes[i]), cat) {
        gameState = END;
      }
    }
  }
  drawSprites()
  if (gameState == END) {
      cat.changeAnimation('dizzy');
      cat.scale = 2;
      squee.play(false);
      gameState=DESTROYED;
  } else if (gameState == DESTROYED && frameCount%120 ==0) {
    cat.destroy();
  }
  if(gameState== DESTROYED) {
    textSize(200);
    textAlign(CENTER);
    textFont("Ariel");
    fill("black");
    stroke("black");
    strokeWeight(5);
    text("You lose! Your score is: " +score, 2000, 1000);
  }
  console.log()


  //score stuff
  textSize(50);
  textAlign(CENTER, TOP);
  textFont("Ariel");
  fill("white");
  stroke("black");
  strokeWeight(5);
  text("Score: " +score, 2755, 5);
  



}


function isTouching (kitty, cupc) {

  //cupcake is a body
  //kitty is a sprite

  var B_x = cupc.body.position.x;
  var B_y = cupc.body.position.y;                                                                                                         
  
  var cupcake_bounds = cupc.bounds;
  
  rect= Bodies.rectangle(kitty.x,kitty.y, kitty.width, kitty.height);
  rect.shapeColor= "blue";
  kitty.debug = true;

  if (B_x >= kitty.x+125 && B_x <= kitty.x+kitty.width-125 && B_y >= kitty.y && B_y <= kitty.y+kitty.height ) {
    console.log("CUPCAKE: ",B_x,",",B_y," KITTY: ",kitty.x," -> ",kitty.x+kitty.width,",",kitty.y," -> ",kitty.y+kitty.height);
    return true;
  } else {
    return false;
  }
 
}

