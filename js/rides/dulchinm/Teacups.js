// Author: Matthew Dulchinos
// CSC 385 Computer Graphics
// Version: Winter 2020
// Project 2: Teacups - IN SPACE!.
// Controls Teacups.
// Buffer Geometry help from: https://threejsfundamentals.org/threejs/lessons/threejs-custom-buffergeometry.html

import * as THREE from '../../../extern/build/three.module.js';
import { VRButton } from '../../../extern/VRButton.js';
import {DebugConsole, debugWrite} from '../../DebugConsole.js';
import * as DEBUG from '../../DebugHelper.js';
import * as GUIVR from '../../GuiVR.js';
import * as ANIMATOR from '../../Animator.js';
import * as USER from '../../User.js';
// Imports for model loading.  The import depends on the model file type.
// There are other model types that can be loaded.
import {FBXLoader}  from '../../../extern/examples/jsm/loaders/FBXLoader.js'; 
//import {GLTFLoader}  from '../../../extern/examples/jsm/loaders/GLTFLoader.js';
//import {OBJLoader}  from '../../../extern/examples/jsm/loaders/OBJLoader.js';


// Global variables for high-level program state.
//var userRig; // rig to move the user
//var animatedObjects = []; // List of objects whose animation function needs to be called each frame.

const SPACEDISK_RADIUS = 5;
const TOP_OF_RIDE = 5;

export class Teacups extends THREE.Group {
    
    constructor(userRig,numOfRocks,orbitSpeed){
		super();
    	
    	var exhibit = new THREE.Group();
    	
    	// Add landing platform for the exhibit.
    	exhibit.add(new USER.UserPlatform(userRig));
	
    	// Add moving platform.
    	var texture = new THREE.TextureLoader().load( "js/rides/dulchinm/space.jpg" );
    	var material2 = new THREE.MeshBasicMaterial( { map: texture } );
    	var m = new THREE.Mesh(new THREE.CylinderGeometry(SPACEDISK_RADIUS, SPACEDISK_RADIUS, 0.1,8,1,false),
				       material2//new THREE.MeshPhongMaterial({color: 0xffffff})
				       );
		m.material.side = THREE.DoubleSide;
		m.rotation.y =  THREE.Math.degToRad(-90);
		m.position.z = -10;
    	m.position.x = -2;
    	m.setAnimation(
		function (dt){
		    if (this.t == undefined) {
			this.t = 0;
		    }
		    this.t = this.t + dt;
		    //this.position.x += dt * this.speed;
		    //this.position.x = ((this.position.x + 5) % 10) - 5;
		    this.rotation.y = this.rotation.y +THREE.Math.degToRad(5*dt*orbitSpeed);
		});
    	//animatedObjects.push(m);
    	exhibit.add(m);
    	
    	//Add the astroids
    	var texture = new THREE.TextureLoader().load( "js/rides/dulchinm/rock.jpg" );
    	var material2 = new THREE.MeshBasicMaterial( { map: texture } );
    	for (var i = 0; i < numOfRocks; i++) {
	    	var astroid = new THREE.Mesh(new THREE.SphereGeometry(Math.random()*0.3+0.1, 8, 6), material2);
	    	m.add(astroid);
	    	astroid.position.y = 2*Math.random()+0.5;
	    	astroid.position.x = 2*Math.random()*SPACEDISK_RADIUS-SPACEDISK_RADIUS;
	    	astroid.position.z = 2*Math.random()*SPACEDISK_RADIUS-SPACEDISK_RADIUS;
	    	var string = new THREE.Mesh(new THREE.CylinderGeometry(0.001, 0.001, (TOP_OF_RIDE-astroid.position.y), 32),new THREE.MeshPhongMaterial({color: 0x0000FF}));
	    	m.add(string);
	    	string.position.y = (TOP_OF_RIDE+astroid.position.y)/2;
	    	string.position.x = astroid.position.x;
	    	string.position.z = astroid.position.z;
 	   	}
    	
    	//Add the ceiling
    	var texture = new THREE.TextureLoader().load( "js/rides/dulchinm/roof.jpg" );
    	var material2 = new THREE.MeshBasicMaterial( { map: texture } );
    	var ceiling = new THREE.Mesh(new THREE.CylinderGeometry(SPACEDISK_RADIUS*1.5, SPACEDISK_RADIUS*1.5, 0.01, 32),material2);
	    	m.add(ceiling);
	    	ceiling.position.y = TOP_OF_RIDE;
    	
    	//Add the poll holding the ceiling
    	var poll = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, TOP_OF_RIDE, 32),material2);
	    	m.add(poll);
	    	poll.position.y = TOP_OF_RIDE/2;
    	
    	var coaster = new EarthSeat(userRig);
    	coaster.rotation.y =  THREE.Math.degToRad(-90);
    	coaster.speed = 1; // new member variable to track speed
    	coaster.position.z = -3;
    	coaster.position.x = 0;
    	coaster.position.y = 0.01;
    	coaster.speed = 1;
    	// Set animation function to repeatedly move from x=-5 to 5.
    	coaster.setAnimation(
		function (dt){
		    if (this.t == undefined) {
			this.t = 0;
		    }
		    this.t = this.t + dt;
		    //this.position.x += dt * this.speed;
		    //this.position.x = ((this.position.x + 5) % 10) - 5;
		    this.rotation.y = this.rotation.y +THREE.Math.degToRad(5*dt*this.speed);
		});
		
		var buttons = [new GUIVR.GuiVRButton("Planet mph", 1, -10, 10, true, function(x){coaster.speed = x;}), 
						new GUIVR.GuiVRButton("Galaxy mph", orbitSpeed, -10, 10, true, function(x){orbitSpeed = x;})];
    	var sign = new GUIVR.GuiVRMenu(buttons);
    	sign.position.x = 0;
    	sign.position.z = -2;
    	sign.position.y = 0.5;
    	coaster.add(sign);
		
		m.add(coaster);
		
		
		
		
		var coaster3 = new MarsSeat(userRig);
    	coaster3.rotation.y =  THREE.Math.degToRad(-90);
    	coaster3.speed = 1; // new member variable to track speed
    	coaster3.position.z = 0;
    	coaster3.position.x = 3;
    	coaster3.position.y = 0.01;
    	coaster3.speed = 1;
    	// Set animation function to repeatedly move from x=-5 to 5.
    	coaster3.setAnimation(
		function (dt){
		    if (this.t == undefined) {
			this.t = 0;
		    }
		    this.t = this.t + dt;
		    //this.position.x += dt * this.speed;
		    //this.position.x = ((this.position.x + 5) % 10) - 5;
		    this.rotation.y = this.rotation.y +THREE.Math.degToRad(5*dt*this.speed);
		});
		
		var buttons = [new GUIVR.GuiVRButton("Planet mph", 1, -10, 10, true, function(x){coaster3.speed = x;}), 
						new GUIVR.GuiVRButton("Galaxy mph", orbitSpeed, -10, 10, true, function(x){orbitSpeed = x;})];
    	var sign3 = new GUIVR.GuiVRMenu(buttons);
    	sign3.position.x = 0;
    	sign3.position.z = -2;
    	sign3.position.y = 0.5;
    	coaster3.add(sign3);
		
		m.add(coaster3);


		
		
		var coaster2 = new SunSeat(userRig);
    	coaster2.rotation.y =  THREE.Math.degToRad(-90);
    	coaster2.speed = 1; // new member variable to track speed
    	coaster2.position.z = 3;
    	coaster2.position.x = 0;
    	coaster2.position.y = 0.01;
    	coaster2.speed = 1;
    	// Set animation function to repeatedly move from x=-5 to 5.
    	coaster2.setAnimation(
		function (dt){
		    if (this.t == undefined) {
			this.t = 0;
		    }
		    this.t = this.t + dt;
		    //this.position.x += dt * this.speed;
		    //this.position.x = ((this.position.x + 5) % 10) - 5;
		    this.rotation.y = this.rotation.y +THREE.Math.degToRad(5*dt*this.speed);
		});
		
		var buttons = [new GUIVR.GuiVRButton("Planet mph", 1, -10, 10, true, function(x){coaster2.speed = x;}), 
						new GUIVR.GuiVRButton("Galaxy mph", orbitSpeed, -10, 10, true, function(x){orbitSpeed = x;})];
    	var sign2 = new GUIVR.GuiVRMenu(buttons);
    	sign2.position.x = 0;
    	sign2.position.z = -2;
    	sign2.position.y = 0.5;
    	coaster2.add(sign2);
		
		m.add(coaster2);
		
		
		
		
		var coaster4 = new BillSeat(userRig);
    	coaster4.rotation.y =  THREE.Math.degToRad(-90);
    	coaster4.speed = 1; // new member variable to track speed
    	coaster4.position.z = 0;
    	coaster4.position.x = -3;
    	coaster4.position.y = 0.01;
    	coaster4.speed = 1;
    	// Set animation function to repeatedly move from x=-5 to 5.
    	coaster4.setAnimation(
		function (dt){
		    if (this.t == undefined) {
			this.t = 0;
		    }
		    this.t = this.t + dt;
		    //this.position.x += dt * this.speed;
		    //this.position.x = ((this.position.x + 5) % 10) - 5;
		    this.rotation.y = this.rotation.y +THREE.Math.degToRad(5*dt*this.speed);
		});
		
		var buttons = [new GUIVR.GuiVRButton("Planet mph", 1, -10, 10, true, function(x){coaster4.speed = x;}), 
						new GUIVR.GuiVRButton("Galaxy mph", orbitSpeed, -10, 10, true, function(x){orbitSpeed = x;})];
    	var sign4 = new GUIVR.GuiVRMenu(buttons);
    	sign4.position.x = 0;
    	sign4.position.z = -2;
    	sign4.position.y = 0.5;
    	coaster4.add(sign4);
		
		m.add(coaster4);
		
    	//animatedObjects.push(coaster);
    	//exhibit.add(coaster);
	
    	// Make a GUI sign.
    	/*
    	var buttons = [new GUIVR.GuiVRButton("Speed", 1, 0, 10, true,
						 function(x){coaster.speed = x;})];
    	var sign = new GUIVR.GuiVRMenu(buttons);
    	sign.position.x = 0;
    	sign.position.z = -2;
    	sign.position.y = 0.5;
    	exhibit.add(sign);
		*/
    	// Pose the exhibit.
    	//exhibit.rotation.y = THREE.Math.degToRad(90);
    	//exhibit.position.z = -5;
    	//exhibit.position.x = -3;
	
    	this.add(exhibit);
	}
}	

/*
export class Seat extends USER.UserPlatform {

	constructor(userRig, number, onLand, onLeave){
	super();
	
	this.children.pop();
	this.children.pop();
	var textures = [];
	textures.push(new THREE.TextureLoader().load( "sun.jpg" ));
	textures.push(new THREE.TextureLoader().load( "earth.jpg" ));
	textures.push(new THREE.TextureLoader().load( "mars.jpg" ));
	//var texture = new THREE.TextureLoader().load( "sun.jpg" );
	var platform = new THREE.Mesh(
	    new THREE.CylinderGeometry(1, 1, 0.05, 32),
	    new THREE.MeshBasicMaterial( { map: textures[number] }));

	// The front direction of the platform is -z.
	platform.position.y = 0.025;	
	this.add(platform);
	
	this.collider = platform;

	this.userRig = userRig;
	this.onLand = onLand;
	this.onLeave = onLeave;
	}
}
*/

export class SunSeat extends USER.UserPlatform {

	constructor(userRig, number, onLand, onLeave){
	super();
	
	this.children.pop();
	this.children.pop();
	var platform = new THREE.Mesh(
	    new THREE.CylinderGeometry(0.7, 0.7, 0.05, 32),
	    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( "js/rides/dulchinm/sun.jpg" ) }));

	// The front direction of the platform is -z.
	platform.position.y = 0.025;	
	this.add(platform);
	
	this.collider = platform;

	this.userRig = userRig;
	this.onLand = onLand;
	this.onLeave = onLeave;
	}
}

export class MarsSeat extends USER.UserPlatform {

	constructor(userRig, number, onLand, onLeave){
	super();
	
	this.children.pop();
	this.children.pop();
	var platform = new THREE.Mesh(
	    new THREE.CylinderGeometry(0.7, 0.7, 0.05, 32),
	    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( "js/rides/dulchinm/mars.jpg" ) }));

	// The front direction of the platform is -z.
	platform.position.y = 0.025;	
	this.add(platform);
	
	this.collider = platform;

	this.userRig = userRig;
	this.onLand = onLand;
	this.onLeave = onLeave;
	}
}

export class EarthSeat extends USER.UserPlatform {

	constructor(userRig, number, onLand, onLeave){
	super();
	
	this.children.pop();
	this.children.pop();
	var platform = new THREE.Mesh(
	    new THREE.CylinderGeometry(0.7, 0.7, 0.05, 32),
	    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( "js/rides/dulchinm/earth.jpg" ) }));

	// The front direction of the platform is -z.
	platform.position.y = 0.025;	
	this.add(platform);
	
	this.collider = platform;

	this.userRig = userRig;
	this.onLand = onLand;
	this.onLeave = onLeave;
	}
}

export class BillSeat extends USER.UserPlatform {

	constructor(userRig, number, onLand, onLeave){
	super();
	
	this.children.pop();
	this.children.pop();
	var platform = new THREE.Mesh(
	    new THREE.CylinderGeometry(0.7, 0.7, 0.05, 32),
	    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( "js/rides/dulchinm/bill.jpg" ) }));

	// The front direction of the platform is -z.
	platform.position.y = 0.025;	
	this.add(platform);
	
	this.collider = platform;

	this.userRig = userRig;
	this.onLand = onLand;
	this.onLeave = onLeave;
	}
}
