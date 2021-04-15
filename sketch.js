var trex, trexRunning, trexCollided, edges, ground, groundImage, invisibleGround, clouds, obstacles, cloudImage, sun, sunImg;

var gameOver, gameOverImg, restart, restartImg;

var obstaclesGroup, cloudsGroup;

var obst1, obst2, obst3, obst4, obst5, obst6;

var jumpSound, checkPointSound, dieSound;


var score = 0;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload() {

  trexRunning = loadAnimation("assets/trex_1.png", "assets/trex_2.png", "assets/trex_3.png");
  trexCollided = loadAnimation("assets/trex_collided.png")
  cloudImage = loadImage("assets/cloud.png");
  backgroundImg = loadImage("assets/backgroundImg.png")
  sunImg = loadImage("assets/sun.png")
  groundImage = loadImage("assets/ground.png");
  obst1 = loadImage("assets/obstacle1.png");
  obst2 = loadImage("assets/obstacle2.png");
  obst3 = loadImage("assets/obstacle3.png"); 
  obst4 = loadImage("assets/obstacle4.png");
  obst5 = loadImage("obstacle5.png");
  obst6 = loadImage("obstacle6.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png")

  jumpSound = loadSound("assets/sounds/jump.wav");
  collidedSound = loadSound("assets/sounds/collided.wav")
  checkPointSound = loadSound("checkPoint.mp3");
  //dieSound = loadSound("die.mp3");


}

function setup() {

  createCanvas(windowWidth, windowHeight);

  //Creating edges
  edges = createEdgeSprites();

  //Creating Sun
  sun = createSprite(width - 50, 100, 10, 10);
  sun.addAnimation("sun", sunImg);
  sun.scale = 0.1;

  //Creating groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  //Creating ground
  ground = createSprite(width / 2, height, width, 2);
  ground.addImage("g1", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -2;

  gameOver = createSprite(width / 2, height / 2 - 50);
  gameOver.addImage(gameOverImg);

  restart = createSprite(width / 2, height / 2);
  restart.addImage(restartImg);

  gameOver.scale = 0.2;
  restart.scale = 0.09;

  //Creating invisible ground
  invisibleGround = createSprite(width / 2, height - 30, width, 125);
  invisibleGround.visible = false;

  //Creating random number
  var randNum = Math.round(random(1, 100));
  //console.log(randNum);

  //creating trex
  trex = createSprite(50, height - 90, 20, 50);
  trex.addAnimation("t1", trexRunning);
  trex.addAnimation("t2", trexCollided);
  trex.scale = 0.07;
  trex.setCollider("circle", 0, 0, 35);

}

function draw() {

  //Setting the background
  background(backgroundImg);

  //Checking the yPos of trex
  //console.log(trex.y);

  //Score
  text("Score: " + score, 500, 30);

  if (gameState == PLAY) {

    gameOver.visible = false;
    restart.visible = false;

    //ground.velocityX = -2;

    ground.velocityX = -(2 + score / 100)

    score = score + Math.round(frameCount / 240);

    if (score > 0 && score % 100 == 0) {
      checkPointSound.play();
    }

    //Creating infinite ground
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //Making the trex jump
    if (touches.length>0||keyDown("space") && trex.y >= 100) {
      //console.log("trexRunner");
      trex.velocityY = -10;
      jumpSound.play();
      touches=[];
    }
    trex.velocityY = trex.velocityY + 0.5;


    if (frameCount % 60 == 0) {
      spawnClouds();
    }

    if (frameCount % 75 == 0) {
      spawnObstacles();
    }

    if (obstaclesGroup.isTouching(trex)) {
      collidedSound.play();
      gameState = END;
      //Making the trex jump using AI
      //trex.velocityY = -10;
      //jumpSound.play();
    }

  } else if (gameState == END) {

    gameOver.visible = true;
    restart.visible = true;
    //dieSound.play();
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("t2", trexCollided);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

  }

  //Stop trex from falling down
  //Teacher code: trex.collide(edges[3]);
  //trex.collide(ground);
  trex.collide(invisibleGround);

  if (mousePressedOver(restart)) {
    console.log("Restarting the game");
    restartGame();
  }

  //console.log(frameCount);

  drawSprites();

}

function restartGame() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("t1", trexRunning);
  score = 0;

}

function spawnClouds() {

  clouds = createSprite(width + 20, height - 300, 40, 10);
  clouds.addImage("c1", cloudImage);
  clouds.velocityX = -3;
  clouds.y = Math.round(random(10, 100));
  clouds.scale = 0.6;

  //Setting the depth
  clouds.depth = trex.depth;
  trex.depth = trex.depth + 1;
  console.log("C" + clouds.depth);
  console.log("T" + trex.depth);

  //Destroying clouds
  clouds.lifetime = 200;
  cloudsGroup.add(clouds);

}

function spawnObstacles() {

  var obstNum = Math.round(random(1, 2));
  obstacles = createSprite(600, height - 95, 30, 30);
  //obstacles.velocityX = -2;
  obstacles.velocityX = -(4 + score / 100)

  switch (obstNum) {
    case 1:
      obstacles.addImage(obst1);
      break;
    case 2:
      obstacles.addImage(obst2);
      break;
    default:
      break;

  }

  obstacles.scale = 0.2;
  obstacles.lifetime = 300;
  obstaclesGroup.add(obstacles);


}