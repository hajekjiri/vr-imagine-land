import * as THREE from '../../../extern/build/three.module.js';
import * as GUIVR from '../../GuiVR.js';
import * as ANIMATOR from '../../Animator.js';
import * as USER from './User.js';

// Global variables for high-level program state.
var camera, scene, renderer;
var userRig; // rig to move the user


export class Scambler extends THREE.Group {

    constructor(userRig, animatedObjects){
	super();
    // Add landing platform for the exhibit.
    this.add(new USER.UserPlatform(userRig));
    var signRig = new THREE.Group();
    // Add platform.
    var coaster = new USER.UserPlatform(userRig);
    coaster.rotation.y =  THREE.Math.degToRad(-90);
    coaster.position.z = -10;
    coaster.position.x = -0;
    
    //create base pole that will rotate around the y axis
	  var basePole = new THREE.Mesh(new THREE.BoxGeometry(0.25, 5, 0.25),
		new THREE.MeshPhongMaterial({color: 0xffffff}));
	  basePole.castShadow = true;
	  basePole.receiveShadow = true;
	  basePole.rotation.y = THREE.Math.degToRad(-90);
    basePole.speed = 1;
    basePole.position.x = 0;
    basePole.position.y = .5;
    basePole.position.z = 0;
    basePole.setAnimation(
	function (dt){
	    this.rotation.y += this.speed * 0.01;
	})
	
	  //create piece that wil hold 4 connecting bars together
	  var topBase = new THREE.Mesh(new THREE.BoxGeometry(.5, 0.5, 0.5),
		new THREE.MeshPhongMaterial({color: 0xFFF000}));
	  topBase.castShadow = true;
	  topBase.receiveShadow = true;
    topBase.position.x = 0;
    topBase.position.y = 2.5;
    topBase.position.z = 0;
    
    //create and animate connecting bar that spins
    var connector1 = new THREE.Mesh(new THREE.BoxGeometry(3, .2, 0.2),
		new THREE.MeshPhongMaterial({color: 0xffffff}));
	  connector1.castShadow = true;
	  connector1.receiveShadow = true;
	  connector1.rotation.x = THREE.Math.degToRad(-90);
    connector1.speed = 1;
    connector1.position.x = 1.25;
    connector1.position.y = 0;
    connector1.position.z = 0;
    connector1.setAnimation(
	function (dt){
	    this.rotation.x += this.speed * 0.01;
	})
    //create and animate connecting bar that spins
    var connector2 = new THREE.Mesh(new THREE.BoxGeometry(3, .2, 0.2),
		new THREE.MeshPhongMaterial({color: 0xffffff}));
	  connector2.castShadow = true;
	  connector2.receiveShadow = true;
	  connector2.rotation.x = THREE.Math.degToRad(90);
    connector2.speed = 1;
    connector2.position.x = -1.25;
    connector2.position.y = 0;
    connector2.position.z = 0;
    connector2.setAnimation(
	function (dt){
	    this.rotation.x += this.speed * -0.01;
	})
	   //create and animate connecting bar that spins
    var connector3 = new THREE.Mesh(new THREE.BoxGeometry(.2, .2, 3),
		new THREE.MeshPhongMaterial({color: 0xffffff}));
	  connector3.castShadow = true;
	  connector3.receiveShadow = true;
	  connector3.rotation.z = THREE.Math.degToRad(90);
    connector3.speed = 1;
    connector3.position.x = 0;
    connector3.position.y = 0;
    connector3.position.z = 1.25;
    connector3.setAnimation(
	function (dt){
	    this.rotation.z += this.speed * -0.01;
	})
	  //create and animate connecting bar that spins
    var connector4 = new THREE.Mesh(new THREE.BoxGeometry(.2, .2, 3),
		new THREE.MeshPhongMaterial({color: 0xffffff}));
	  connector4.castShadow = true;
	  connector4.receiveShadow = true;
	  connector4.rotation.z = THREE.Math.degToRad(90);
    connector4.speed = 1;
    connector4.position.x = 0;
    connector4.position.y = 0;
    connector4.position.z = -1.25;
    connector4.setAnimation(
	function (dt){
	    this.rotation.z += this.speed * 0.01;
	})
	  
	  //create connecting piece from connector to pod
    var roller1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, .5, 0.15),
		new THREE.MeshPhongMaterial({color: 0xffffff}));
	  roller1.castShadow = true;
	  roller1.receiveShadow = true;
    roller1.speed = 1;
    roller1.position.x = 1.25;
    roller1.position.y = .15;
    roller1.position.z = 0;
    
    //create connecting piece from bar to pod
    var roller2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, .5, 0.15),
		new THREE.MeshPhongMaterial({color: 0xffffff}));
	  roller2.castShadow = true;
	  roller2.receiveShadow = true;
    roller2.speed = 1;
    roller2.position.x = -1.25;
    roller2.position.y = .15;
    roller2.position.z = 0;
    //create connecting piece from bar to pod
    var roller3 = new THREE.Mesh(new THREE.BoxGeometry(0.15, .5, 0.15),
		new THREE.MeshPhongMaterial({color: 0xffffff}));
	  roller3.castShadow = true;
	  roller3.receiveShadow = true;
    roller3.speed = 1;
    roller3.position.x = 0;
    roller3.position.y = .15;
    roller3.position.z = 1.25;
    
    //create connecting piece from bar to pod
    var roller4 = new THREE.Mesh(new THREE.BoxGeometry(0.15, .5, 0.15),
		new THREE.MeshPhongMaterial({color: 0xffffff}));
	  roller4.castShadow = true;
	  roller4.receiveShadow = true;
    roller4.speed = 1;
    roller4.position.x = 0;
    roller4.position.y = .15;
    roller4.position.z = -1.25;
    
    //create 1st user pod for people to ride in
    var pod1 = new USER.Pod(userRig);
    this.children[0].add(signRig);
    pod1.rotation.y =  THREE.Math.degToRad(-90);
    pod1.speed = 1; // new member variable to track speed
    pod1.position.z = 0;
    pod1.position.x = 0;
    pod1.position.y = .5;
    pod1.setAnimation(
	function (dt){
	    this.rotation.y += this.speed * -0.01;
	})
	  //create 2nd user pod for people to ride in
    var pod2 = new USER.Pod(userRig);
    //userRig.add(signRig);
    pod2.rotation.y =  THREE.Math.degToRad(-90);
    pod2.speed = 1; // new member variable to track speed
    pod2.position.z = 0;
    pod2.position.x = 0;
    pod2.position.y = .5;
    pod2.setAnimation(
	function (dt){
	    this.rotation.y += this.speed * 0.01;
	})
    //create 3rd user pod for people to ride in
    var pod3 = new USER.Pod(userRig);
	//userRig.add(signRig);
    pod3.rotation.y =  THREE.Math.degToRad(-90);
    pod3.speed = 1; // new member variable to track speed
    pod3.position.z = 0;
    pod3.position.x = 0;
    pod3.position.y = .5;
    pod3.setAnimation(
	function (dt){
	    this.rotation.y += this.speed * 0.01;
	})
    //create 4th user pod for people to ride in
    var pod4 = new USER.Pod(userRig);
	//userRig.add(signRig);
    pod4.rotation.y =  THREE.Math.degToRad(-90);
    pod4.speed = 1; // new member variable to track speed
    pod4.position.z = 0;
    pod4.position.x = 0;
    pod4.position.y = .5;
    pod4.setAnimation(
	function (dt){
	    this.rotation.y += this.speed * -0.01;
	})
    
    //build higharchy of scrambler pieces    
    roller1.add(pod1);
    roller2.add(pod2);
    roller3.add(pod3);
    roller4.add(pod4);
    connector1.add(roller1);
    connector2.add(roller2);
    connector3.add(roller3);
    connector4.add(roller4);
    topBase.add(connector1);
    topBase.add(connector2);
    topBase.add(connector3);
    topBase.add(connector4);
    basePole.add(topBase);
	coaster.add(basePole);
	/*
	  animatedObjects.push(pod1);
	  animatedObjects.push(pod2);
	  animatedObjects.push(pod3);
	  animatedObjects.push(pod4);
	  animatedObjects.push(connector1);
	  animatedObjects.push(connector2);
	  animatedObjects.push(connector3);
	  animatedObjects.push(connector4);
    animatedObjects.push(basePole)*/
    this.add(coaster);


	  
    // Make a GUI sign.
    var buttons = [new GUIVR.GuiVRButton("baseSpeed", 1, 0, 10, true,
					 function(x){basePole.speed = x;}), new GUIVR.GuiVRButton("ConnectorSpeed", 1, 0, 10, true,
					 function(y){connector1.speed = y; connector2.speed = y; connector3.speed = y; connector4.speed = y;}), new GUIVR.GuiVRButton("PodSpeed", 1, 0, 10, true,
					 function(z){pod1.speed = z; pod2.speed = z; pod3.speed = z; pod4.speed = z;})];
    var sign = new GUIVR.GuiVRMenu(buttons);
    sign.position.x = 0;
    sign.position.z = -2;
    sign.position.y = 0.5;
    signRig.add(sign);
    

    // Pose the exhibit.
}
}
