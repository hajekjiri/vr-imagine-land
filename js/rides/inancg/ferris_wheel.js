// Author: Gamze Inanc
// CSC 385 Computer Graphics
// Version: Winter 2020
// Project 2: Main program.Ferris Wheel
// Initializes scene, VR system, and event handlers.

import * as THREE from '../../../extern/build/three.module.js';
import { VRButton } from '../../../extern/VRButton.js';
import {DebugConsole, debugWrite} from '../../DebugConsole.js';
import * as DEBUG from '../../DebugHelper.js';
import * as GUIVR from '../../GuiVR.js';
import * as ANIMATOR from '../../Animator.js';
import * as USER from '../../User.js';

export class FerrisWheel extends THREE.Group {
    constructor(userRig,custspeed,custscale){
	super();
	
	//function initExhibitWheel(userRig) {
	this.exhibit = new THREE.Group();
	this.exhibit.add(new USER.UserPlatform(userRig));

	// Rig to hold the ferris wheel.
	this.rig = new THREE.Group(); 
	this.rig.position.z = -5;
	this.exhibit.add(this.rig);
	
	this.ferris_wheel = new THREE.Object3D();
	this.wheel = new THREE.Object3D();
	this.crossing_poles = new THREE.Object3D();
	this.crossing_poles2 = new THREE.Object3D();
	this.holders = new THREE.Object3D();
	this.user_plat_cabin =  new THREE.Object3D();

	this.wheel.speed = 1;

	//the base of wheel
	this.base_geo = new THREE.BoxGeometry(420, 10, 550 );
	this.base_material = new THREE.MeshPhongMaterial( {color: 0x549434} );
	this.base_mesh = new THREE.Mesh(this.base_geo, this.base_material );
	this.base_mesh.position.set(0,5,0);
	this.base_mesh.castShadow = true;
	this.base_mesh.receiveShadow = true;

	this.red_material = new THREE.MeshPhongMaterial( {color: 0xe0000b} );
	this.purple_material = new THREE.MeshPhongMaterial( {color: 0x3b0627} );
	this.blue_material = new THREE.MeshPhongMaterial( {color: 0x91c2db} );
	this.yellow_material = new THREE.MeshPhongMaterial( {color: 0xf5b40f} );
	
	//4 red poles for support
	//back right pole
	this.poleBR_geo = new THREE.CylinderGeometry(3, 3, 310, 20, 4);
	this.poleBR_mesh = new THREE.Mesh(this.poleBR_geo, this.red_material );
	this.poleBR_mesh.position.set(93.5,95,-130);
	this.poleBR_mesh.rotation.x = THREE.Math.degToRad(55);
	this.poleBR_mesh.rotation.z = THREE.Math.degToRad(14);
	this.poleBR_mesh.castShadow = true;

	//back left pole
	this.poleBL_mesh = this.poleBR_mesh.clone();
	this.poleBL_mesh.position.set(-93.5,95,-130);
	this.poleBL_mesh.rotation.x = THREE.Math.degToRad(55);
	this.poleBL_mesh.rotation.z = THREE.Math.degToRad(-14);

	//front right pole
	this.poleFR_mesh = this.poleBR_mesh.clone();
	this.poleFR_mesh.position.set(93.5,95,130);
	this.poleFR_mesh.rotation.x = THREE.Math.degToRad(-55);
	this.poleFR_mesh.rotation.z = THREE.Math.degToRad(14);

	//front left pole
	this.poleFL_mesh = this.poleBR_mesh.clone();
	this.poleFL_mesh.position.set(-93.5,95,130);
	this.poleFL_mesh.rotation.x = THREE.Math.degToRad(-55);
	this.poleFL_mesh.rotation.z = THREE.Math.degToRad(-14);

	//purple circular frame for wheel
	//right circular frame
	this.circ_frame_right_geom = new THREE.TorusGeometry(130, 5, 16, 40);
	this.circ_frame_right_mesh = new THREE.Mesh( this.circ_frame_right_geom,this.purple_material );
	this.circ_frame_right_mesh.castShadow = true;
	this.circ_frame_right_mesh.position.set(50,0,0);
	this.circ_frame_right_mesh.rotation.y = THREE.Math.degToRad(90);
	this.wheel.add(this.circ_frame_right_mesh);

	//left circular frame
	this.circ_frame_left_mesh = this.circ_frame_right_mesh.clone();
	this.circ_frame_left_mesh.position.x = -50;
	this.circ_frame_left_mesh.castShadow = true;
	this.wheel.add(this.circ_frame_left_mesh);

	//crossing poles right - shaped like * in the circular frame
	this.crossing_pole_geom = new THREE.CylinderGeometry( 3, 3, 260, 20 );
	this.crossing_pole_mesh = new THREE.Mesh(this.crossing_pole_geom,this.yellow_material );
	this.crossing_pole_mesh.castShadow = true;
	this.crossing_pole_mesh.position.set(50,0,0);
	this.crossing_poles.add(this.crossing_pole_mesh);

	this.crossing_pole_mesh2 = this.crossing_pole_mesh.clone();
	this.crossing_pole_mesh.rotation.x = THREE.Math.degToRad(60);
	this.crossing_poles.add(this.crossing_pole_mesh2);

	this.crossing_pole_mesh3 = this.crossing_pole_mesh.clone();
	this.crossing_pole_mesh.rotation.x = THREE.Math.degToRad(120);
	this.crossing_poles.add(this.crossing_pole_mesh3);
	
	//crossing poles left - shaped like * in the circular frame
	this.crossing_pole_mesh4 = new THREE.Mesh(this.crossing_pole_geom,this.yellow_material );
	this.crossing_pole_mesh4.castShadow = true;
	this.crossing_pole_mesh4.position.set(-50,0,0);
	this.crossing_poles2.add(this.crossing_pole_mesh4);

	this.crossing_pole_mesh5 = this.crossing_pole_mesh4.clone();
	this.crossing_pole_mesh5.rotation.x = THREE.Math.degToRad(60);
	this.crossing_poles2.add(this.crossing_pole_mesh5);

	this.crossing_pole_mesh6 = this.crossing_pole_mesh4.clone();
	this.crossing_pole_mesh6.rotation.x = THREE.Math.degToRad(120);
	this.crossing_poles2.add(this.crossing_pole_mesh6);
	
	//base support and wheel connector - side hexagons - right
	this.right_lid_geom = new THREE.CylinderGeometry( 60, 60, 7, 6 );
	this.right_lid_mesh = new THREE.Mesh(this.right_lid_geom, this.purple_material );
	this.right_lid_mesh.rotation.z = THREE.Math.degToRad(90);
	this.right_lid_mesh.position.set(56.5,0,0);
	this.wheel.add(this.right_lid_mesh);

	//base support and wheel connector - side hexagons - left
	this.left_lid_mesh = this.right_lid_mesh.clone();
	this.left_lid_mesh.position.set(-56.5,0,0);
	this.wheel.add(this.left_lid_mesh);

	this.center_pole_geom = new THREE.CylinderGeometry( 10, 10, 107, 30 );
	this.center_pole_mesh = new THREE.Mesh( this.center_pole_geom, this.red_material );
	this.center_pole_mesh.rotation.z = THREE.Math.degToRad(90);
	this.center_pole_mesh.position.set(0,0,0);
	this.wheel.add(this.center_pole_mesh);

	
	var rot = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1,0,0), THREE.Math.degToRad(60));
	var pos_vector = new THREE.Vector3(0,130,0)

	let speed = 1;
	for (var i = 0; i < 6; i++){
	    //console.log(pos_vector);
	    var holder_geom = new THREE.CylinderGeometry( 3, 3, 100, 20 );
	    var holder_mesh = new THREE.Mesh( holder_geom, this.yellow_material );
	    holder_mesh.rotation.z = THREE.Math.degToRad(90);
	    holder_mesh.position.x=pos_vector.x;
	    holder_mesh.position.y=pos_vector.y;
	    holder_mesh.position.z=pos_vector.z;

	    var user_plat_cabin =  new USER.UserPlatform(userRig);
	    user_plat_cabin.position.x=pos_vector.x;
	    user_plat_cabin.position.y=pos_vector.y;
	    user_plat_cabin.position.z=pos_vector.z;
	    user_plat_cabin.castShadow = true;
	    
	   // user_plat_cabin.speed = 1;
	    user_plat_cabin.scale.x = 40;
	    user_plat_cabin.scale.y = 40;
	    user_plat_cabin.scale.z = 40;
	    user_plat_cabin.setAnimation(
		function (dt){
		    this.rotation.x += speed *(-0.01);
		});
	    this.wheel.add(user_plat_cabin);
	    this.wheel.add(holder_mesh);
	    pos_vector.applyMatrix4(rot);

	}

	this.wheel.position.y = 200;
	this.wheel.add(this.crossing_poles);
	this.wheel.add(this.crossing_poles2);
	this.wheel.add(user_plat_cabin);

	// Make the wheel slowly rotate.
	this.wheel.setAnimation(
	    function (dt){
		this.rotation.x += this.speed * 0.01;
	    });

	this.ferris_wheel.add(this.base_mesh);
	this.ferris_wheel.add(this.poleBR_mesh);
	this.ferris_wheel.add(this.poleBL_mesh);
	this.ferris_wheel.add(this.poleFR_mesh);
	this.ferris_wheel.add(this.poleFL_mesh);
	this.ferris_wheel.add(this.wheel);
	
	this.ferris_wheel.scale.x = 0.01;
	this.ferris_wheel.scale.y = 0.01;
	this.ferris_wheel.scale.z = 0.01;

	this.rig.rotation.y = THREE.Math.degToRad(-75);
	this.rig.add(this.ferris_wheel);
	this.rig.rotation.y = THREE.Math.degToRad(-65);
	this.exhibit.position.z = -5;
//	this.exhibit.rotation.y = THREE.Math.degToRad(45);


	let wheel = this.wheel;
	let ferris = this.ferris_wheel;
	// Make GUI sign.
	this.buttons = [new GUIVR.GuiVRButton("Speed", custspeed, 0, 3, true,function(x){wheel.speed = x; speed = x}),
		       new GUIVR.GuiVRButton("Scale", custscale, 1, 3, true,function(s){ferris.scale.x = s*0.01;ferris.scale.y = s*0.01; ferris.scale.z = s*0.01; })];
	this.sign = new GUIVR.GuiVRMenu(this.buttons);
	this.sign.position.x = 0;
	this.sign.position.z = -2;
	this.sign.position.y = 0.5;
	this.exhibit.add(this.sign);
	this.add(this.exhibit);

    }



}

