var dog, sadDog, database,happyDog;
var foodS, foodStock;

var addFood;
var foodObj,fedTime,FeedTime;
var  readGamestate,gameState,addFood;
var feed, lastFed, currentTime,state;
var bedroom, garden, washroom;
function preload()
{
	sadDog= loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedroom= loadImage("virtual pet images/Bed Room.png");
  garden= loadImage("virtual pet images/Garden.png");
  washroom= loadImage("virtual pet images/Wash Room.png");
}

function setup() {
  database= firebase.database();
	createCanvas(1000, 400);
  
  foodObj= new Food();
  foodStock= database.ref('Food');
  foodStock.on("value",readStock);
  fedTime=database.ref('FeedTime');
fedTime.on("value",function(data){
  lastFed=data.val();
})
  dog= createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  addFood=createButton("Add Food");
  addFood.position(850,95);
  addFood.mousePressed(addFoods);

  feed=createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  readGamestate= database.ref('gameState');
  readGamestate.on("value",function(data){
    gameState=data.val();

  
  });
  
}


function draw() {  
  background(46,139,87);
currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry")
      foodObj.display();
    } 
    if(gameState!="Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
    }else{
      feed.show();
      addFood.show();
      dog.addImage(sadDog);
    }
textSize(25);
drawSprites();
  }
  function readStock(data){
    foodS=data.val();
    foodObj.updateFoodStock(foodS);
  }
function feedDog(){
  
    dog.addImage(happyDog);
  
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour(),
      gameState:"Hungry"
    })
  }
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  });
}