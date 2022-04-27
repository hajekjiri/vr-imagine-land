
import * as THREE from '../../../extern/build/three.module.js';
import { VRButton } from '../../../extern/VRButton.js';
import {DebugConsole, debugWrite} from '../../DebugConsole.js';
import * as DEBUG from '../../DebugHelper.js';
import * as GUIVR from '../../GuiVR.js';
import * as ANIMATOR from '../../Animator.js';
import * as USER from '../../User.js';
import {FBXLoader}  from '../../../extern/examples/jsm/loaders/FBXLoader.js';


export class carnivalCup extends THREE.Group{

  constructor(userRig, scale){

  super();

  var scale;
  var camera, scene, renderer;
  var scale;
  var userRig; // rig to move the user
  var animatedObjects = []; // List of objects whose animation function needs to be called each frame.



  //var exhibit = new THREE.Group();
  this.add(new USER.UserPlatform(userRig));

  var cups = [];



  var groundGeo = new THREE.PlaneGeometry(10, 10);
  var groundMat = new THREE.MeshPhongMaterial({color: 0xba00ba});
  var ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = 0.001;
  ground.position.z = -12;
  ground.rotation.x = THREE.Math.degToRad(-90);
  ground.receiveShadow = true;

  ground.setAnimation(
    function(dt){
      this.rotation.z += this.speed * 0.01;
    });
    animatedObjects.push(ground);

    this.add(ground);

    for (var i = 0; i < 4; i++) {
      var d = 3;
      var cup = new THREE.Group();
      cup.rotation.y = THREE.Math.degToRad(-90);
      cup.speed = 1;
      if (i == 0 || i == 1){
        cup.position.x = d;

      }
      else{
        cup.position.x = -d;
      }

      if (i == 0 || i == 2){
        cup.position.y = d;

      }
      else{
        cup.position.y = -d;
      }
      cup.position.z = -0.01;

      cup.rotation.x = THREE.Math.degToRad(90);


      var rig = new USER.UserPlatform(userRig);
      rig.position.x = 1;
      rig.scale.x = 0.1;
      rig.scale.y = 0.1;
      rig.scale.z = 0.1;
      cup.add(rig);


      cup.setAnimation(
        function(dt){
          this.rotation.y += this.speed * 0.01;
        });

      cups.push(cup);
      animatedObjects.push(cup);
      ground.add(cup);

      var buttons = [new GUIVR.GuiVRButton("CupSpeed", 1, 0, 10, true,
             function(x){cup.speed = x;}),
                   ];
      var sign = new GUIVR.GuiVRMenu(buttons);
      sign.position.x = 0;
      sign.position.z = -2;
      sign.position.y = 0.5;
      cup.add(sign);
    }

    //adjust cup1
    cups[1].position.z = -0.5;
    cups[1].children[0].position.y = 0.5;
    cups[1].children[1].position.y = 0.5;

    //cups[3].position.z = -0.01;

    var buttons = [
           new GUIVR.GuiVRButton("GroundSpeed", 0, 0, 10, true,
                  function(y){ground.speed = y;})
                 ];
    var sign = new GUIVR.GuiVRMenu(buttons);
    sign.position.x = 0;
    sign.position.z = -2;
    sign.position.y = 0.5;
    this.add(sign);


  var loader = new FBXLoader();

  loader.load(
'../../../extern/models/lambo/Lamborghini_Aventador.fbx',
function ( obj ) {
    // Scale and add to the rig once loaded.
    obj.scale.x = 0.002;
    obj.scale.y = 0.002;
    obj.scale.z = 0.002;
    cups[0].add(obj);
},function (xhr){
  console.log((xhr.loaded / xhr.total * 100) + '% loaded');
},
function (error){
  console.log('An error happened');
})
  ;

var loader = new FBXLoader();

loader.load(
'../../../extern/models/BIke_Low.fbx',
function ( obj ) {
  // Scale and add to the rig once loaded.
  obj.scale.x = 0.04;
  obj.scale.y = 0.04;
  obj.scale.z = 0.04;
  cups[1].add(obj);
},function (xhr){
  console.log((xhr.loaded / xhr.total * 100) + '% loaded');
},
function (error){
  console.log('An error happened');
})
  ;



var loader = new FBXLoader();

loader.load(
'../../../extern/models/Shark/Shark.FBX',
function ( obj ) {
  // Scale and add to the rig once loaded.
  obj.scale.x = 0.03;
  obj.scale.y = 0.03;
  obj.scale.z = 0.03;
  cups[2].add(obj);
},function (xhr){
  console.log((xhr.loaded / xhr.total * 100) + '% loaded');
},
function (error){
  console.log('An error happened');
})
  ;

var loader = new FBXLoader();

loader.load(
'../../../extern/models/R8/3D Models/Audi_R8_2017.fbx',
function ( obj ) {
  // Scale and add to the rig once loaded.
  obj.scale.x = 0.0035;
  obj.scale.y = 0.0035;
  obj.scale.z = 0.0035;
  cups[3].add(obj);
},function (xhr){
  console.log((xhr.loaded / xhr.total * 100) + '% loaded');
},
function (error){
  console.log('An error happened');
})
  ;


/*
var loader = new FBXLoader();

loader.load(
'../../../extern/models/dragon/dragon.fbx',
function ( obj ) {
  // Scale and add to the rig once loaded.
  obj.scale.x = 0.02;
  obj.scale.y = 0.02;
  obj.scale.z = 0.02;
  cup5.add(obj);
},function (xhr){
  console.log((xhr.loaded / xhr.total * 100) + '% loaded');
},
function (error){
  console.log('An error happened');
})

  ;

*/

  //this.rotation.y = THREE.Math.degToRad(90);
  //this.position.z = -5;
  //this.position.x = -3;

  //scene.add(exhibit);

this.scale.x = scale;
this.scale.y = scale;
this.scale.z = scale;

}}
