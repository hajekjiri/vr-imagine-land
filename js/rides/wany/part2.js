import * as THREE from '../../../extern/build/three.module.js';
import { VRButton } from '../../../extern/VRButton.js';
import {DebugConsole, debugWrite} from './DebugConsole.js';
import * as DEBUG from './DebugHelper.js';
import * as GUIVR from './GuiVR.js';
import * as ANIMATOR from './Animator.js';
import * as USER from './User.js';
import {FBXLoader}  from '../../../extern/examples/jsm/loaders/FBXLoader.js';
import {OBJLoader}  from '../../../extern/examples/jsm/loaders/OBJLoader.js';


export class carnivalCross extends THREE.Group{

  constructor(userRig,scale){

  super();


  var camera, scene, renderer;
  var userRig; // rig to move the user
  var animatedObjects = []; // List of objects whose animation function needs to be called each frame.


  // Add landing platform for the exhibit.
  this.add(new USER.UserPlatform(userRig));


  var groundGeo = new THREE.PlaneGeometry(150, 150);
  var groundMat = new THREE.MeshPhongMaterial({color: 0xba00ba});
  var ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = 0.001;
  ground.position.z = -10;
  ground.position.x = -10;
  ground.rotation.x = THREE.Math.degToRad(-90);
  ground.receiveShadow = true;



    this.add(ground);



    //const loader1 = new THREE.TextureLoader();
    //  const texture = loader1.load('https://threejsfundamentals.org/threejs/resources/images/star.png');


     function makeCube(color, x, y, z) {
        const vertices = [
          // front
          { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0, 1], }, // 0
          { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 1], }, // 1
          { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 0], }, // 2
          { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [1, 0], }, // 3
          // right
          { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0, 1], }, // 4
          { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 1], }, // 5
          { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 0], }, // 6
          { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [1, 0], }, // 7
          // back
          { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0, 1], }, // 8
          { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 1], }, // 9
          { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 0], }, // 10
          { pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [1, 0], }, // 11
          // left
          { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0, 1], }, // 12
          { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 1], }, // 13
          { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 0], }, // 14
          { pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [1, 0], }, // 15
          // top
          { pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0, 1], }, // 16
          { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 1], }, // 17
          { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 0], }, // 18
          { pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [1, 0], }, // 19
          // bottom
          { pos: [ 1, -1,  1], norm: [ 0, -1,  0], uv: [0, 1], }, // 20
          { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 1], }, // 21
          { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 0], }, // 22
          { pos: [-1, -1, -1], norm: [ 0, -1,  0], uv: [1, 0], }, // 23
        ];
        const numVertices = vertices.length;
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const uvNumComponents = 2;
        const positions = new Float32Array(numVertices * positionNumComponents);
        const normals = new Float32Array(numVertices * normalNumComponents);
        const uvs = new Float32Array(numVertices * uvNumComponents);
        let posNdx = 0;
        let nrmNdx = 0;
        let uvNdx = 0;
        for (const vertex of vertices) {
          positions.set(vertex.pos, posNdx);
          normals.set(vertex.norm, nrmNdx);
          uvs.set(vertex.uv, uvNdx);
          posNdx += positionNumComponents;
          nrmNdx += normalNumComponents;
          uvNdx += uvNumComponents;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          'position', new THREE.BufferAttribute(positions, positionNumComponents));
        geometry.setAttribute(
          'normal', new THREE.BufferAttribute(normals, normalNumComponents));
        geometry.setAttribute(
          'uv', new THREE.BufferAttribute(uvs, uvNumComponents)
        );

        geometry.setIndex([
            0,  1,  2,   2,  1,  3,  // front
             4,  5,  6,   6,  5,  7,  // right
             8,  9, 10,  10,  9, 11,  // back
            12, 13, 14,  14, 13, 15,  // left
            16, 17, 18,  18, 17, 19,  // top
            20, 21, 22,  22, 21, 23,  // bottom
        ]);

        const material = new THREE.MeshPhongMaterial({
          color,
          opacity: 0.5,
          transparent : true,
        });




        var cube = new THREE.Mesh(geometry, material);


        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;

        //cube.scale.y = 0.05;
        //cube.scale.z = 0.05;
        cube.scale.x = 0.00001;
        return cube;
      }

      const cubes = [
        makeCube(0xFFFFFF,  0, 0, 0),
        makeCube(0xFFFFFF,  0, 0, 0),
        makeCube(0xFFFFFF,  0, 0, 0),
        makeCube(0xFFFFFF,  0, 0, 0),
        makeCube(0xFFFFFF,  0, 0, 0),
      ];





  var obstacles = [];

  for (var i = 0; i < 5; i++) {
    var obstacle = new THREE.Group;
    obstacle.rotation.x =  THREE.Math.degToRad(90);

    obstacle.speed = 1.5 + 0.5 * i; // new member variable to track speed
    obstacle.position.y = i*5-10;
    obstacle.position.y += 6;
    obstacle.position.x += 10;




if (i == 1 || i == 3) {
  obstacle.setAnimation(
  function (dt){
    if (this.t == undefined) {
  this.t = 0;
    }
    this.t = this.t + dt;
    this.position.x -= dt * this.speed;
    this.position.x = ((this.position.x + 5) % 10) + 5;
  });
  obstacle.rotation.y = THREE.Math.degToRad(180);

}
else {
  obstacle.setAnimation(
  function (dt){
    if (this.t == undefined) {
  this.t = 0;
    }
    this.t = this.t + dt;
    this.position.x += dt * this.speed;
    this.position.x = ((this.position.x + 5) % 10) + 5;
  });
}






    animatedObjects.push(obstacle);
    ground.add(obstacle);

    cubes[i].scale.z = 0.5+(0.25*i);
    obstacle.add(cubes[i]);
    obstacles.push(obstacle);

  }

/*
  var buttons = [
         new GUIVR.GuiVRButton("level", 0, 0, 10, true,
                function(y){obstacles.speed *= y;})
               ];
  var sign = new GUIVR.GuiVRMenu(buttons);
  sign.position.x = 0;
  sign.position.z = -2;
  sign.position.y = 0.5;
  this.add(sign);
*/
var boxes = [];
var loader = new FBXLoader();

loader.load(
'../../../extern/models/dragon/dragon.fbx',
function ( obj ) {
  // Scale and add to the rig once loaded.
  obj.scale.x = 0.1;
  obj.scale.y = 0.1;
  obj.scale.z = 0.1;
  obj.rotation.y =  THREE.Math.degToRad(90);

  var box = new THREE.Box3();
  boxes.push(box);
  box.expandByObject(obstacles[4]);

  obstacles[4].add(obj);

},function (xhr){
  console.log((xhr.loaded / xhr.total * 100) + '% loaded');
},
function (error){
  console.log('An error happened');
});


var loader = new OBJLoader();

loader.load(
'../../../extern/models2/wolf/WOLF.OBJ',
function ( obj ) {
  // Scale and add to the rig once loaded.
  obj.scale.x = 0.3;
  obj.scale.y = 0.3;
  obj.scale.z = 0.3;
  obj.rotation.y =  THREE.Math.degToRad(90);

  var box = new THREE.Box3();
  boxes.push(box);
  box.expandByObject(obstacles[0]);


  obstacles[0].add(obj);
},function (xhr){
  console.log((xhr.loaded / xhr.total * 100) + '% loaded');
},
function (error){
  console.log('An error happened');
});


var loader = new OBJLoader();

loader.load(
'../../../extern/models2/elephant/elephant.obj',
function ( obj ) {
  // Scale and add to the rig once loaded.
  obj.scale.x = 0.3;
  obj.scale.y = 0.3;
  obj.scale.z = 0.3;
  obj.position.y = 1.5;
  obj.rotation.y =  THREE.Math.degToRad(90);

  var box = new THREE.Box3();
  boxes.push(box);
  box.expandByObject(obstacles[2]);


  obstacles[2].add(obj);
},function (xhr){
  console.log((xhr.loaded / xhr.total * 100) + '% loaded');
},
function (error){
  console.log('An error happened');
});


var loader = new OBJLoader();

loader.load(
'../../../extern/models2/crocodile/CROCODIL.OBJ',
function ( obj ) {
  // Scale and add to the rig once loaded.
  obj.scale.x = 0.5;
  obj.scale.y = 0.5;
  obj.scale.z = 0.5;
  obj.rotation.y =  THREE.Math.degToRad(90);
  var box = new THREE.Box3();
  boxes.push(box);
  box.expandByObject(obstacles[1]);

  obstacles[1].add(obj);
},function (xhr){
  console.log((xhr.loaded / xhr.total * 100) + '% loaded');
},
function (error){
  console.log('An error happened');
});


var loader = new OBJLoader();

loader.load(
'../../../extern/models2/T-Rex/T-Rex.obj',
function ( obj ) {
  // Scale and add to the rig once loaded.
  obj.scale.x = 0.01;
  obj.scale.y = 0.01;
  obj.scale.z = 0.01;
  obj.position.y = -.8;
  obj.position.z = 1.5;
  obj.rotation.y =  THREE.Math.degToRad(180);

  var box = new THREE.Box3();
  boxes.push(box);
  box.expandByObject(obstacles[3]);

  obstacles[3].add(obj);
},function (xhr){
  console.log((xhr.loaded / xhr.total * 100) + '% loaded');
},
function (error){
  console.log('An error happened');
});



var debugConsole = new DebugConsole(20);
//debugConsole.rotateY(THREE.Math.degToRad(-90));
debugConsole.position.x = 3;
debugConsole.position.y = 1.6;
debugConsole.position.z = - 40;
this.add(debugConsole);

debugWrite("This is a road crossing "+"\n"+
"game. Don't touch the boxes" + "\n"
+"around animals or you will" + "\n" + "DIE. " + "\n" +
"This game doesn't need " + "\n"+ "controllers.")
var t;
function collisionDetection(t){
/*
  for (var vertexIndex = 0; vertexIndex < USER.geometry.vertices.length; vertexIndex++)
  {
      var localVertex = USER.geometry.vertices[vertexIndex];
      var globalVertex = USER.matrix.multiplyMatrices(localVertex);
      var directionVector = globalVertex.subSelf( USER.position );

      var ray = new THREE.raycast( USER.position, directionVector);
      var collisionResults = ray.intersectObjects( cubes[vertexIndex] );
      if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
      {
          // a collision occurred.
          debugWrite("You Die !");

      }
  }
*/
if (t != 0) {


var headset = new THREE.Box3();



var camera = userRig.children[0];
camera.add(headset);


for (var i = 0; i < boxes.length; i++) {
  if (headset.intersectsBox(boxes[i])) {
    debugWrite("You DIE");
    userRig.position.set(0,1.6,1);
  }
}
}
}
function progressTracker(t){
  if (t!=0) {


var progress = 0;
var start = camera.position.z;
for (var j = progress; j < obstacles.length; j++) {



if (start < obstacles[j].position.z) {
  progress = j+1;
  debugWrite("level" + progress);
}
if(progress == obstacles.length){
  debugWrite("You WIN!");
}
}
}
}


function userConsole(userRig){
var tracker = new THREE.Group;
var userConsole = new DebugConsole(5);
userConsole.position.x = 3;
userConsole.position.y = 3;
userConsole.position.z = -5;
userRig.children[0].add(userConsole);
tracker.setAnimation(
  function(dt){
    if (this.t == undefined) {
  this.t = 0;
    }
    this.t = this.t + dt;
    collisionDetection(this.t);
    progressTracker(this.t);
  }
)
}
this.add(userRig);
userConsole(userRig);
this.scale.x = scale;
this.scale.y = scale;
this.scale.z = scale;

}
}
