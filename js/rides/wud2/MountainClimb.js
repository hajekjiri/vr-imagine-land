/*
Author: Di Wu
CSC 385 Computer Graphics
Version: Winter 2020
Part2: Carnival Game: Mountain Climbing


User can only climb on the stones
difficulty (range from 1-4, smaller means easier) depends on the number
of stones,

easy mode has more stones
hard mode has less stones

front side: level 1
left side: level 2
right side; level 3
back side: level 4
*/


import * as THREE from '../../../extern/build/three.module.js';
import { VRButton } from '../../../extern/VRButton.js';
import * as GUIVR from '../../GuiVR.js';
import * as USER from '../../User.js';
import * as ANIMATOR from '../../Animator.js';

const COLOR_LIST = [0xD5D907, 0x0457CC, 0x20C90A, 0xBD0698, 0x06BD6E];
const numOfColor = COLOR_LIST.length;
var currentHeight = 1;
var rotate = 0;
var start = 0;
var initInstruction = 0;
var stones = [];
var worldPosDict = {};
var progress;

export class MountainClimb extends THREE.Group {

  constructor(userRig, difficulty = 1){

    super();

    var mountainClimb = new THREE.Group();

    // init the mountain
    var mountain = this.initMountain(0x2618A8);
    mountainClimb.add(mountain);

    var instruction = this.initInstructions(0x459615);
    instruction.position.z = -15;
    instruction.setAnimation(
      function(dt){
        if(initInstruction){
          this.position.y = 0;
        }
        else{
          this.position.y = -10;
        }
      }
    )
    this.add(instruction);

    // init stones on four sides
    var stonesOnFront, stonesOnBack, stonesOnLeft, stonesOnRight;
    stonesOnFront = this.initStoneOnFront();
    mountainClimb.add(stonesOnFront);
    stonesOnBack = this.initStoneOnBack();
    mountainClimb.add(stonesOnBack);
    stonesOnLeft = this.initStoneOnLeft();
    mountainClimb.add(stonesOnLeft);
    stonesOnRight = this.initStoneOnRight();
    mountainClimb.add(stonesOnRight);

    mountainClimb.position.z = 0;
    if (difficulty == 2){
      mountainClimb.rotation.y = THREE.Math.degToRad(90);
    }
    else if (difficulty == 3) {
      mountainClimb.rotation.y = THREE.Math.degToRad(-90);
    }
    else if (difficulty == 4) {
      mountainClimb.rotation.y = THREE.Math.degToRad(180);
    }
    mountainClimb.setAnimation(
      function(dt){
        if(rotate){
          this.rotation.y += 0.01;
        }
      }
    )

    // initialize mountain pick
    this.initController(userRig, 0x54543E, console);

    // initialize progress console
    this.initScore(userRig, 0XF782B2);

    // add an UserPlatform to transfrom the user to top of the mountain
    var closerLook = new USER.UserPlatform(userRig);
    closerLook.position.z = -8;
    closerLook.setAnimation(
      function(dt){
        if(start){
          if(this.position.z > mountainClimb.position.z + 5){
            this.position.z -= 0.1;
            rotate = 0;
          }
        }
      }
    )
    this.add(closerLook);

    // add a control panel to change difficulty
    var buttons = [
      new GUIVR.GuiVRButton("Rotate", 0, 0, 1, true,
      function(x){
        rotate = x;
      }),
      new GUIVR.GuiVRButton("StartGame", 0, 0, 1, true,
      function(x){
        start = x;
      }),
      new GUIVR.GuiVRButton("Instruction", 0, 0, 1, true,
      function(x){
        initInstruction = x;
      }),
    ];
    var sign = new GUIVR.GuiVRMenu(buttons);
    sign.position.x = 0;
    sign.position.z = -12;
    sign.position.y = 0.5;
    this.add(sign);

    this.add(mountainClimb);
  }

  // construct mountain (tetrahedron BufferGeometry)
  initMountain(color){

    const mountainGeometry = new THREE.BufferGeometry();
    const mountainVertices = [
      // base
      { pos: [4,0,4], norm: [0,-1,0], uv: [4,4], },
      { pos: [4,0,-4], norm: [0,-1,0], uv: [4,0], },
      { pos: [-4,0,4], norm: [0,-1,0], uv: [0,4], },

      { pos: [-4,0,4], norm: [0,-1,0], uv: [0,4], },
      { pos: [4,0,-4], norm: [0,-1,0], uv: [4,0], },
      { pos: [-4,0,-4], norm: [0,-1,0], uv: [0,0], },

      // four sides
      { pos: [0,15,0], norm: [-15,4,0], uv: [0,15], },
      { pos: [-4,0,-4], norm: [-15,4,0], uv: [-2,0], },
      { pos: [-4,0,4], norm: [-15,4,0], uv: [2,0], },

      { pos: [0,15,0], norm: [0,4,15], uv: [0,15], },
      { pos: [-4,0,4], norm: [0,4,15], uv: [-2,0], },
      { pos: [4,0,4], norm: [0,4,15], uv: [2,0], },

      { pos: [0,15,0], norm:[15,4,0], uv: [0,15], },
      { pos: [4,0,4], norm: [15,4,0], uv: [-2,0], },
      { pos: [4,0,-4], norm: [15,4,0], uv: [2,0], },

      { pos: [0,15,0], norm: [0,4,-15], uv: [0,15], },
      { pos: [4,0,-4], norm: [0,4,-15], uv: [-2,0], },
      { pos: [-4,0,-4], norm: [0,4,-15], uv: [2,0], },];

    const mountain_positions = [];
    const mountain_normals = [];
    const mountain_uvs = [];
    for (const vertex of mountainVertices) {
      mountain_positions.push(...vertex.pos);
      mountain_normals.push(...vertex.norm);
      mountain_uvs.push(...vertex.uv);
    }
    const positionNumComponents = 3;
    const normalNumComponents = 3;
    const uvNumComponents = 2;
    mountainGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(mountain_positions), positionNumComponents));
    mountainGeometry.setAttribute(
      'normal',
      new THREE.BufferAttribute(new Float32Array(mountain_normals), normalNumComponents));
    mountainGeometry.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(mountain_uvs), uvNumComponents));
    var mountainMaterial = new THREE.MeshPhongMaterial({color: color});
    return new THREE.Mesh(mountainGeometry, mountainMaterial);
  }

  initInstructions(color){
    var msg = "Mountain Climbing: Instructions\n" +
    "Difficulty: \n" +
    "1(default), 2(left side), 3(right side), 4(back side)\n" +
    "You can choose difficulty by rotating the mountain\n" +
    "You can start the game by hitting the start button."
    var instruction = new THREE.Group();
    var loader = new THREE.FontLoader();
    loader.load('extern/fonts/helvetiker_bold.typeface.json', function (font){
      var textGeometry = new THREE.TextBufferGeometry(msg,
      {
        font: font,
        size: 0.3,
        height: 0.3,
        curveSegments: 3,
      });
      var textMaterial = new THREE.MeshPhongMaterial({color: color, specular: 0x000000});
      var text = new THREE.Mesh(textGeometry, textMaterial);
      text.position.y = 2;
      text.scale.x = 0.8;
      text.geometry.center();
      instruction.add(text);
    });
    return instruction;
  }

  initStone(color, x, y, z){
    const stoneGeometry = new THREE.DodecahedronBufferGeometry(0.25);
    const stoneMaterial = new THREE.MeshPhongMaterial({color: color});
    const stone = new THREE.Mesh(stoneGeometry, stoneMaterial);
    stone.position.x = x;
    stone.position.y = y;
    stone.position.z = z;
    stones.push(stone);
    return stone;
  }

  // difficulty ranges from 1-4
  initStoneOnFront(){

    var stones = new THREE.Group();

    stones.add(this.initStone(0xF7C200, 0,15,0));

    var xBound;

    var i = 0;
    var x,y,z,currentColor;

    // initilize easy mode at front, which has 25 stones
    // the plane equation is: 4y + 15z - 60 = 0
    // the boundary of x is: x = (4/15)*z -4
    for (y = 10; y < 15; y++){
      xBound = 4 * y / 15 - 4;
      x = rand(xBound, -xBound);
      z = -( 4.0 / 15.0 * y) + 4.0;
      currentColor = COLOR_LIST[Math.floor(Math.random() * numOfColor)];
      stones.add(this.initStone(currentColor,x,y,z));
    }
    for (var time = 1; time <= 2; time ++){
      for (y = 1; y < 10; y++){
        xBound = 4 * y / 15 - 4;
        x = rand(xBound, -xBound);
        z = -( 4.0 / 15.0 * y) + 4.0;
        currentColor = COLOR_LIST[Math.floor(Math.random() * numOfColor)];
        stones.add(this.initStone(currentColor,x,y,z));
      }
    }
    for (var time = 1; time <= 4; time ++){
      for (y = 1; y < 5; y++){
        xBound = 4 * y / 15 - 4;
        x = rand(xBound, -xBound);
        z = -( 4.0 / 15.0 * y) + 4.0;
        currentColor = COLOR_LIST[Math.floor(Math.random() * numOfColor)];
        stones.add(this.initStone(currentColor,x,y,z));
      }
    }
    return stones;
  }

  // plane function: -4y + 15z + 60 = 0
  // the boundary of x is: x = (4/15)*z -4
  initStoneOnBack(){
    var stones = new THREE.Group();

    var xBound;

    var i = 0;
    var x,y,z,currentColor;

    for (y = 10; y < 15; y++){
      xBound = 4 * y / 15 - 4;
      x = rand(xBound, -xBound);
      z = ( 4.0 / 15.0 * y) - 4.0;
      currentColor = COLOR_LIST[Math.floor(Math.random() * numOfColor)];
      stones.add(this.initStone(currentColor,x,y,z));
    }
    for (y = 1; y < 10; y++){
      xBound = 4 * y / 15 - 4;
      x = rand(xBound, -xBound);
      z = 4.0 * y / 15.0 - 4.0;
      currentColor = COLOR_LIST[Math.floor(Math.random() * numOfColor)];
      stones.add(this.initStone(currentColor,x,y,z));
    }
    for (y = 1; y < 5; y++){
      xBound = 4 * y / 15 - 4;
      x = rand(xBound, -xBound);
      z = 4.0 * y / 15.0 - 4.0;
      currentColor = COLOR_LIST[Math.floor(Math.random() * numOfColor)];
      stones.add(this.initStone(currentColor,x,y,z));
    }

    return stones;
  }

  // plane function: 15x + 4y - 60 = 0
  // the boundary of z is (4 * y / 15) - 4
  initStoneOnRight(){
    var stones = new THREE.Group();

    var zBound;

    var i = 0;
    var x,y,z,currentColor;

    for (y = 10; y < 15; y++){
      zBound = (4 * y / 15) - 4;
      z = rand(zBound, -zBound);
      x = -( 4.0 / 15.0 * y) + 4.0;
      currentColor = COLOR_LIST[Math.floor(Math.random() * numOfColor)];
      stones.add(this.initStone(currentColor,x,y,z));
    }
    for (y = 1; y < 10; y++){
      zBound = (4 * y / 15) - 4;
      z = rand(zBound, -zBound);
      x = 4.0 - 4.0 * y / 15.0;
      currentColor = COLOR_LIST[Math.floor(Math.random() * numOfColor)];
      stones.add(this.initStone(currentColor,x,y,z));
    }
    for (var t = 1; t <= 3; t++){
      for (y = 1; y < 5; y++){
        zBound = (4 * y / 15) - 4;
        z = rand(zBound, -zBound);
        x = 4.0 - 4.0 * y / 15.0;
        currentColor = COLOR_LIST[Math.floor(Math.random() * numOfColor)];
        stones.add(this.initStone(currentColor,x,y,z));
      }
    }

    return stones;
  }

  // plane function: -15x + 4y - 60 = 0
  // the boundary of z is (4 * y / 15) - 4
  initStoneOnLeft(){
    var stones = new THREE.Group();

    var zBound;

    var i = 0;
    var x,y,z,currentColor;

    for (y = 10; y < 15; y ++){
      zBound = 4 * y / 15 - 4;
      z = rand(zBound, -zBound);
      x = 4.0 * y / 15.0 - 4.0;
      currentColor = COLOR_LIST[Math.floor(Math.random() * numOfColor)];
      stones.add(this.initStone(currentColor,x,y,z));
    }
    for (var t = 1; t <= 2; t++){
      for (y = 1; y < 10; y++){
        zBound = 4 * y / 15 - 4;
        z = rand(zBound, -zBound);
        x = 4.0 * y / 15.0 - 4.0;
        currentColor = COLOR_LIST[Math.floor(Math.random() * numOfColor)];
        stones.add(this.initStone(currentColor,x,y,z));
      }
    }
    for (var t = 1; t <= 3; t++){
      for (y = 1; y < 5; y++){
        zBound = 4 * y / 15 - 4;
        z = rand(zBound, -zBound);
        x = 4.0 * y / 15.0 - 4.0;
        currentColor = COLOR_LIST[Math.floor(Math.random() * numOfColor)];
        stones.add(this.initStone(currentColor,x,y,z));
      }
    }

    return stones;
  }

  initScore(userRig, color){
    var camera = userRig.children[0];
    var loader = new THREE.FontLoader();
    loader.load('extern/fonts/helvetiker_bold.typeface.json', function (font){
      var textGeometry = new THREE.TextBufferGeometry("0%",
      {
        font: font,
        size: 0.2,
        height: 0.2,
        curveSegments: 3,
      });
      var textMaterial = new THREE.MeshPhongMaterial({color: color, specular: 0x000000});
      progress = new THREE.Mesh(textGeometry, textMaterial);
      progress.scale.z = 0.1;
      progress.scale.x = 0.5;
      progress.scale.y = 0.5;
      progress.position.x = 2.2;
      progress.position.z = -1.5;
      progress.position.y = -1.2;
      progress.geometry.center();
	//camera.add(progress);
    });
  }

  initController(userRig, color){
      /*
    // generate mountain pick model
    var mountainPick = new THREE.Group();
    var headGeometry = new THREE.ConeBufferGeometry(0.05, 0.5, 32);
    var headMaterial = new THREE.MeshPhongMaterial({color: 0xDBD825});
    var head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.z = -0.25;
    head.rotation.x = THREE.Math.degToRad(-90);
    head.position.y = 1.2;
    mountainPick.add(head);
      
    var barGeometry = new THREE.CylinderBufferGeometry(0.05, 0.07, 2.5, 32);
    var barMaterial = new THREE.MeshPhongMaterial( {color: color} );
    var bar = new THREE.Mesh(barGeometry, barMaterial);
    mountainPick.add(bar);

    // let controller model be mountain pick
    //let controllerModel = mountainPick;
    let controller = userRig.getController(0);
    //controller.add(controllerModel);
    controller.setAnimation(
      function(dt){
        if(this.t == undefined){
          this.t = 0;
        }
        this.t += dt;
        checkCollision(userRig);
      }
    )
*/
  }

}

function updateCurrentHeight(userRig){
  currentHeight = userRig.children[0].position.y;
}

function updateScore(userRig, color){
  var camera = userRig.children[0];
  camera.remove(progress); // don't know why the current progress 3D Object is not in camera.
  var loader = new THREE.FontLoader();
  var currentProgress = (Math.round(currentHeight/15*100)).toString()+"%";
  loader.load('extern/fonts/helvetiker_bold.typeface.json', function (font){
    var textGeometry = new THREE.TextBufferGeometry(currentProgress,
    {
      font: font,
      size: 0.2,
      height: 0.2,
      curveSegments: 3,
    });
    var textMaterial = new THREE.MeshPhongMaterial({color: color, specular: 0x000000});
    progress = new THREE.Mesh(textGeometry, textMaterial);
    progress.scale.z = 0.1;
    progress.scale.x = 0.5;
    progress.scale.y = 0.5;
    progress.position.x = 2.2;
    progress.position.z = -1.5;
    progress.position.y = -1.2;
    progress.geometry.center();
    camera.add(progress);
  });
}

export function checkCollision(userRig){

  getWorldPosForStones();
  let controller = userRig.getController(0);

  // compute the boundingBox for head of the mountain pick
  controller.children[1].children[0].geometry.computeBoundingBox();

  for (var key in worldPosDict){
    var currentStone = worldPosDict[key];
    var controllerBoundingBox = controller.children[1].children[0].geometry.boundingBox;
    var currentBoundingSphere = new THREE.Sphere(key, 0.25);
    if (controllerBoundingBox.intersectsSphere(currentBoundingSphere)){
      userRig.position.x = currentStone.position.x;
      userRig.position.y = currentStone.position.y;
      userRig.position.z = currentStone.position.z;
      updateCurrentHeight(userRig);
      updateScore(userRig, 0XF782B2);
    }
  }
}

export function getWorldPosForStones(){
  var currentStone;
  var position = new THREE.Vector3();
  for (var i = 0; i < stones.length; i++){
    currentStone = stones[i];
    currentStone.geometry.computeBoundingSphere();
    currentStone.getWorldPosition(position);
      worldPosDict[position.clone()] = currentStone;
  }
}

function rand(num1, num2){
  var list = [];
  var toReturn;
  if(num1<num2){
    for(var i = Math.round(num1) + 1; i < num2; i++){
      list.push(i);
    }
  }
  else{
    for(var i = Math.round(num2) + 1; i < num1; i++){
      list.push(i);
    }
  }
  toReturn = list[Math.floor(Math.random() * list.length)];
  if(toReturn<num1 || toReturn>num2){
    return (num1+num2)/2.0;
  }
  return list[Math.floor(Math.random() * list.length)];
}
