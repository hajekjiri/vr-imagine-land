// Author: Gamze Inanc
// CSC 385 Computer Graphics
// Version: Winter 2020
// Project 2: whack a mole game
// Initializes scene, VR system, and event handlers.

import * as THREE from '../../../extern/build/three.module.js';
import { VRButton } from '../../../extern/VRButton.js';
import {DebugConsole, debugWrite} from './DebugConsole.js';
import * as DEBUG from './DebugHelper.js';
import * as GUIVR from './GuiVR.js';
import * as ANIMATOR from './Animator.js';
import * as USER from './User.js';

export class WhackAMole extends THREE.Group {
    constructor(userRig,custspeed){
	super();
	this.gamer_score = 0;
	this.exhibit = new THREE.Group();
	this.exhibit.add(new USER.UserPlatform(userRig));
	this.touched = false;
	// Rig to hold the game.
	this.rig = new THREE.Group(); 
	this.rig.position.z = -3;

	this.whack_a_mole = new THREE.Object3D();
	this.mole_platform = new THREE.Object3D();
	this.hammer = new THREE.Object3D();
	this.mole_platform.position.set(0,16,0);
	
	this.orange_material = new THREE.MeshPhongMaterial( {color: 0xff8000} );
	this.green_material = new THREE.MeshPhongMaterial( {color: 0x486901} );
	this.black_material = new THREE.MeshPhongMaterial( {color: 0x000000} );
	this.brown_material = new THREE.MeshPhongMaterial( {color: 0x4f2b00} );
//	this.blue_trans_material = new THREE.MeshPhongMaterial( { color: 0xffffff,opacity:0.4,transparent:true } );
	this.yellow_material = new THREE.MeshPhongMaterial( {color: 0xffff00} );


	var rot = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0,1,0),
						       THREE.Math.degToRad(45));
	var pos_vector = new THREE.Vector3(0,0,-100);
//	let speed = 5;
	for (var i = 0; i < 3; i++){
	    console.log(pos_vector);
	    var mole_home_geo = new THREE.CylinderGeometry(30, 30, 60, 20);
	    var mole_home_mesh= new THREE.Mesh(mole_home_geo,this.green_material);
	    mole_home_mesh.position.x = pos_vector.x;
	    mole_home_mesh.position.y = pos_vector.y;
	    mole_home_mesh.position.z = pos_vector.z;

	    var mole_hole_geo = new THREE.CylinderGeometry(23, 23, 5, 30);
	    var mole_hole_mesh= new THREE.Mesh(mole_hole_geo,this.black_material);
	    mole_hole_mesh.position.x = pos_vector.x;
	    mole_hole_mesh.position.y = 28;
	    mole_hole_mesh.position.z = pos_vector.z;
	    
//Putting an animated mole to the loop won't work.
/*	    var mole_geo = new THREE.SphereGeometry(20, 16, 16);
	    var mole_mesh = new THREE.Mesh(mole_geo,this.orange_material);
	    mole_mesh.position.x = pos_vector.x;
	    mole_mesh.position.z = pos_vector.z;
	    mole_mesh.setAnimation(
		function (dt){
		    if (this.t == undefined) {
			this.t = 0;
		    }
		    this.t = this.t + dt;
		    this.position.y += dt * this.speed;
		    this.position.y = ((this.position.y + 5) % 10) - 5;
		    console.log(this.position);
		});
*/	    
	    this.whack_a_mole.add(mole_home_mesh);
	    this.whack_a_mole.add(mole_hole_mesh);
//	    this.whack_a_mole.add(mole_mesh);
	    pos_vector.applyMatrix4(rot);
	    console.log(pos_vector);
	}

	// Set animation function to move reped.
	this.mole_geo = new THREE.SphereGeometry(20, 16, 16);
	this.mole_mesh = new THREE.Mesh(this.mole_geo,this.orange_material);
	this.mole_mesh.position.z=-100;
	this.mole_mesh.speed = 5; // new member variable to track speed
	// Set animation function to repeatedly move from x=-5 to 5.
	this.mole_mesh.setAnimation(
	    function (dt){
		if (this.t == undefined) {
		    this.t = 0;
		}
		this.t = this.t + dt;
		this.position.y += dt * this.speed;
		this.position.y = ((this.position.y + 15) % 35) - 15;
	    });


	//creating a hammer- has front end, back end (made of spheres), cylinder body and a cylinder handle to hold.
	this.hammer_body_geo = new THREE.CylinderGeometry(20, 20, 30, 30);
	this.hammer_body_mesh= new THREE.Mesh(this.hammer_body_geo, this.yellow_material);
	
	this.hammer_head_geo = new THREE.SphereGeometry(20, 16, 16);
	this.hammer_head_mesh= new THREE.Mesh(this.hammer_head_geo, this.yellow_material);
	this.hammer_head_mesh.position.y = -15;
	
	this.hammer_head_geo2 = new THREE.SphereGeometry(20, 16, 16);
	this.hammer_head_mesh2= new THREE.Mesh(this.hammer_head_geo2, this.yellow_material);
	this.hammer_head_mesh2.position.y = 15;
	
	this.hammer_handle_geo= new THREE.CylinderGeometry(4, 4, 50, 30);
	this.hammer_handle_mesh= new THREE.Mesh(this.hammer_handle_geo, this.yellow_material);
	this.hammer_handle_mesh.rotation.x = THREE.Math.degToRad(90);
	this.hammer_handle_mesh.position.z = 40;

	
//Wanted to attach the hammer to the controller..
	//	this.controller = USER.xr.getController(0);
	//	console.log(this.controller.position.x);
	this.hammer.position.y = 95; //added the height after not being able to attach it to hand
	
	this.whack_a_mole.scale.x = 0.01;
	this.whack_a_mole.scale.y = 0.01;
	this.whack_a_mole.scale.z = 0.01;

//Wanted to create a pink square which would act as a background color of score board
	var geometry = new THREE.BufferGeometry();
	// create a simple square shape. We duplicate the top left and bottom right
	// vertices because each vertex needs to appear once per triangle.
	var vertices = new Float32Array( [
		-1.0, -1.0,  1.0,
	         1.0, -1.0,  1.0,
	         1.0,  1.0,  1.0,
	    
	         1.0,  1.0,  1.0,
		-1.0,  1.0,  1.0,
		-1.0, -1.0,  1.0
	] );
	
	// itemSize = 3 because there are 3 values (components) per vertex
	geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	var material = new THREE.MeshBasicMaterial( { color: 0xff99a0 } );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.scale.x = 30;
	mesh.scale.y = 30;
	mesh.position.y = 300;
	mesh.rotation.y = THREE.Math.degToRad(45);
	this.whack_a_mole.add(mesh);

	//this was an attempt to create a text geometry that show the score.
	this.loader = new THREE.FontLoader();
	let rig = this.rig;
	this.loader.load('extern/fonts/helvetiker_bold.typeface.json', function (font){
	    this.textGeo = new THREE.TextBufferGeometry("Score: " + this.gamer_score, {
		font: font,
		size: 0.15,
		height: 0.02,
		curveSegments: 3,
	    });
	    this.textMaterial = new THREE.MeshPhongMaterial({color: 0x729FCF, specular: 0x000000});
	    this.debug_mesh = new THREE.Mesh(this.textGeo,this.textMaterial);
	    rig.add(this.debug_mesh);
	    console.log(this.debug_mesh.position);
	});
	
/*  This is an attempt to check whether the lower part of hammer and the mole geometries intersect. If so, adds to game score.
        if(this.mole_mesh.position.distanceTo(this.hammer_head_mesh.position)<40) {
            this.touched = true;
	    this.gamer_score += 1;
	}
	else {
	    this.touched = false;
	}

*/	

	let mole = this.mole_mesh;
	// Make a GUI sign.
	var buttons = [new GUIVR.GuiVRButton("Speed", custspeed, 0, 10, true,
					     function(x){mole.speed = x;})];
	var sign = new GUIVR.GuiVRMenu(buttons);
	sign.position.x = 0;
	sign.position.z = -2;
	sign.position.y = 0.5;
	this.exhibit.add(sign);
	
	
	this.add(this.exhibit);
	this.exhibit.add(this.rig);
	this.rig.add(this.whack_a_mole);
	this.whack_a_mole.add(this.mole_platform);
	this.whack_a_mole.rotation.y = THREE.Math.degToRad(-45);
	this.mole_platform.add(this.mole_mesh);
//	this.mole_platform.add(this.mole_home_mesh);
//	this.mole_platform.add(this.mole_hole_mesh);
	this.mole_platform.add(this.hammer);
	this.hammer.add(this.hammer_head_mesh);
	this.hammer.add(this.hammer_head_mesh2);
	this.hammer.add(this.hammer_body_mesh);
	this.hammer.add(this.hammer_handle_mesh);
	//this.controller.add(this.hammer);
	
    }


    
  

    
}
