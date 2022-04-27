// Author: Matthew Dulchinos
// CSC 385 Computer Graphics
// Version: Winter 2020
// Project 2: Teacups.
// Controlls Teacups.

import * as THREE from '../../../extern/build/three.module.js';
import { VRButton } from '../../../extern/VRButton.js';
import {DebugConsole, debugWrite} from '../../DebugConsole.js';
import * as DEBUG from '../../DebugHelper.js';
import * as GUIVR from '../../GuiVR.js';
import * as ANIMATOR from '../../Animator.js';
import * as USER from '../../User.js';
import {FBXLoader}  from '../../../extern/examples/jsm/loaders/FBXLoader.js'; 


// Global variables for high-level program state.
var debug_mesh;


export class Balloon extends THREE.Group {
    
    constructor(userRig,numOfBalloons,gravityMod,balloonRadius){
		super();
    	//var exhibit = new THREE.Group();
	// Add landing platform for the exhibit.
    //exhibit.add(new USER.UserPlatform(userRig));
    
    const vertices = [
    	// front
    	
    	{ pos: [0, 0,  2], norm: [ -0.5,  0.5,  1], uv: [0, 0], },
    	{ pos: [ -1, -1,  1], norm: [ -0.5,  0.5,  1], uv: [1, 1], },
    	{ pos: [1,  -1,  1], norm: [ -0.5,  0.5,  1], uv: [1, 0], },
		
    	{ pos: [0,  0,  2], norm: [ 0.5,  -0.5,  1], uv: [0, 0], },
    	{ pos: [ 1, -1,  1], norm: [ 0.5,  -0.5,  1], uv: [1, 1], },
    	{ pos: [ 1,  1,  1], norm: [ 0.5,  -0.5,  1], uv: [1, 0], },
    	
    	{ pos: [0,  0,  2], norm: [ 0.5,  1,  1], uv: [0, 0], },
    	{ pos: [ 1, 1,  1], norm: [ 0.5,  1,  1], uv: [1, 1], },
    	{ pos: [ -1,  1,  1], norm: [ 0.5, 1,  1], uv: [1, 0], },
    	
    	{ pos: [0,  0,  2], norm: [ -1,  0.5,  1], uv: [0, 0], },
    	{ pos: [ -1, 1,  1], norm: [ -1,  0.5,  1], uv: [1, 1], },
    	{ pos: [ -1,  -1,  1], norm: [ -1, 0.5,  1], uv: [1, 0], },

    	// right
    	{ pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0, 1], },
    	{ pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 1], },
    	{ pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 0], },
	
    	{ pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 0], },
    	{ pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 1], },
    	{ pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [1, 0], },
    	// back
    	{ pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0, 1], },
    	{ pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 1], },
    	{ pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 0], },
	
    	{ pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 0], },
    	{ pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 1], },
    	{ pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [1, 0], },
    	// left
    	{ pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0, 1], },
    	{ pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 1], },
    	{ pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 0], },
	
    	{ pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 0], },
    	{ pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 1], },
    	{ pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [1, 0], },
    	// top
    	{ pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0, 1], },
    	{ pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 1], },
    	{ pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 0], },
	
    	{ pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 0], },
    	{ pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 1], },
    	{ pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [1, 0], },
    	// bottom
    	{ pos: [ 1, -1,  1], norm: [ 0, -1,  0], uv: [0, 1], },
    	{ pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 1], },
    	{ pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 0], },

    	{ pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 0], },
    	{ pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 1], },
    	{ pos: [-1, -1, -1], norm: [ 0, -1,  0], uv: [1, 0], },
  	];
	const positions = [];
	const normals = [];
	const uvs = [];
	for (const vertex of vertices) {
    	positions.push(...vertex.pos);
    	normals.push(...vertex.norm);
    	uvs.push(...vertex.uv);
  	}

  	const geometry = new THREE.BufferGeometry();
  	const positionNumComponents = 3;
  	const normalNumComponents = 3;
  	const uvNumComponents = 2;
  	geometry.setAttribute(
  	    'position',
  	    new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
  	geometry.setAttribute(
  	    'normal',
  	    new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
  	geometry.setAttribute(
  	    'uv',
  	    new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));
	
	var material = new THREE.MeshPhongMaterial({color: 0xf500d3});
	var mesh = new THREE.Mesh( geometry.scale(0.01,0.01,0.05), material );
	mesh.position.y = 1.5;
	mesh.position.x = -3;
    
    let controllerModel = new THREE.Mesh(
	geometry, //TODO replace with a cool primitive thingy
	new THREE.MeshPhongMaterial({color: 0xf500d3})); //Controller color
    controllerModel.rotation.x = THREE.Math.degToRad(180);
    var balloons = [];
    var balloonCords = [];

    //var balloonRadius = 0.2
    var score = 0;
    
    var exhibit = new THREE.Group();
    exhibit.add(new USER.UserPlatform(
	userRig,
	function (){
	    //console.log("Landing at Balloon Darts");
	    // Get controller's position
	    let controller = userRig.getController(0);
	    // Add new model for controller (should be removed on leaving).
	    controller.add(controllerModel);
	    // Set animation to check whether trigger button is
	    // pressed and then fire a projectile in the frame of the
	    // controller if is and enough time has elapsed since last
	    // firing.
	    
	    for (var i = 0; i< numOfBalloons; i++) {
    		balloonCords.push(balloons[i].getWorldPosition());
    	}
	    
	    controller.setAnimation(
		function (dt){
		    if (this.t == undefined){
			this.t = 0;
		    }
		    this.t += dt;
		    // Decide to fire.
		    if (controller.triggered
			&& (this.t - this.lastFire >= 10
			    || this.lastFire == undefined)){
			this.lastFire = this.t;
			// Create new projectile and set up motion.
			let proj = controllerModel.clone();
			//proj.position.x = controller.position.x;
			//proj.position.y = controller.position.y;
			//proj.position.z = controller.position.z;
			//proj.rotation.x = controller.rotation.x;
			//proj.rotation.y = controller.rotation.y;
			//proj.rotation.z = controller.rotation.z;
			
			//console.log("Firing");
			//controller.parent.add(proj);
			controller.add(proj);
			//THREE.SceneUtils.detach(proj, proj.parent, exhibit );
			var worldCordsDart = this.getWorldPosition();
			proj.setAnimation(
			    function (dt){
				if (this.t == undefined){
				    this.t = 0;
				}
				if (this.velocity == undefined){
				    this.velocity = 0;
				}
				this.t += dt;
				this.velocity += dt*0.01*gravityMod;
				this.position.z -= dt;
				this.position.y -= this.velocity;
				
				//Check if it is in position
				//var arrayLength = balloons.length;
				for (var i = 0; i < numOfBalloons; i++) { //TODO: Move the getWorldPosition for the block to out of the animation
					//var balloonPos = balloons[i].getWorldPosition();
					//console.log("start");
					//console.log(balloonCords[i].x);
					//console.log(balloonPos.x);
					//console.log("end");
					if(this.getWorldPosition().x >= balloonCords[i].x -balloonRadius && this.getWorldPosition().x <= balloonCords[i].x + balloonRadius && 
						this.getWorldPosition().y >= balloonCords[i].y -balloonRadius && this.getWorldPosition().y <= balloonCords[i].y + balloonRadius && 
						this.getWorldPosition().z >= balloonCords[i].z -balloonRadius && this.getWorldPosition().z <= balloonCords[i].z + balloonRadius 	
						&& balloons[i].visible == true) {
					    //console.log("hit!");
						score += 1;
						balloons[i].visible = false;
						exhibit.remove(debug_mesh);
						loader.load('extern/fonts/helvetiker_bold.typeface.json', function (font){
	    					var textGeo = new THREE.TextBufferGeometry("Score: " + score, {
							font: font,
							size: 0.15,
							height: 0.02,
							curveSegments: 3,
	    					});
	    					var textMaterial = new THREE.MeshPhongMaterial({color: 0xFF00FF, specular: 0x000000});
	    					debug_mesh = new THREE.Mesh(textGeo, textMaterial);
	    					debug_mesh.position.x = -0.2;
	    					debug_mesh.position.y = 0.8;
	    					debug_mesh.position.z = -3;
	    					exhibit.add(debug_mesh);
						});
					}
				}
				
				// Cause the projectile to disappear after t is 20.
				if (this.t > 20 || this.getWorldPosition().y < 0 || this.getWorldPosition.y > 10){
				    this.parent.remove(this);
				}
			    }
			);
		    }
		}
	    );

	},
	function (){
	    //console.log("Leaving Exhibit 2");
	    let controller = userRig.getController(0);
	    // Clear the model added to controller.
	    controller.remove(controllerModel);
	    // Remove special animation attached to controller.
	    controller.setAnimation(undefined);
	}
    ));  
    

    // Add Balloon Wall
    var height = 4.0
  	var width = 5.0
  	
  	var textureNick = new THREE.TextureLoader().load( "js/rides/dulchinm/15.jpg" );
    var nickMaterial = new THREE.MeshBasicMaterial( { map: textureNick } );
    var balloonWall = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.1),
			       nickMaterial);
	balloonWall.position.z = -4.5;
	balloonWall.position.y = height/2.0;
	exhibit.add(balloonWall);
    
    var loader = new THREE.FontLoader();
    loader.load('extern/fonts/helvetiker_bold.typeface.json', function (font){
	    var textGeo = new THREE.TextBufferGeometry("Matthew's Balloon Darts", {
		font: font,
		size: 0.15,
		height: 0.02,
		curveSegments: 3,
	    });
	    var textMaterial = new THREE.MeshPhongMaterial({color: 0xFF00FF, specular: 0x000000});
	    var title = new THREE.Mesh(textGeo, textMaterial);
	    title.position.x = -1.2;
	    title.position.y = height+0.1;
	    title.position.z = -4.5;
	    exhibit.add(title);
	});
	
    loader.load('extern/fonts/helvetiker_bold.typeface.json', function (font){
	    var textGeo = new THREE.TextBufferGeometry("Aim at the balloons and pull trigger to throw dart", {
		font: font,
		size: 0.1,
		height: 0.02,
		curveSegments: 3,
	    });
	    var textMaterial = new THREE.MeshPhongMaterial({color: 0xFF00FF, specular: 0x000000});
	    var intro = new THREE.Mesh(textGeo, textMaterial);
	    intro.position.x = -2;
	    intro.position.y = 0.35;
	    intro.position.z = -3;
	    exhibit.add(intro);
	});
	
	loader.load('extern/fonts/helvetiker_bold.typeface.json', function (font){
	    var textGeo = new THREE.TextBufferGeometry("Score: "+score, {
		font: font,
		size: 0.1,
		height: 0.02,
		curveSegments: 3,
	    });
	    var textMaterial = new THREE.MeshPhongMaterial({color: 0xFF00FF, specular: 0x000000});
	    var debug_mesh = new THREE.Mesh(textGeo, textMaterial);
	    debug_mesh.position.x = -2;
	    debug_mesh.position.y = 0.3;
	    debug_mesh.position.z = -3;
	    exhibit.add(debug_mesh);
	});
	
	var textBackdrop = new THREE.Mesh(new THREE.BoxGeometry(width, 0.5, 0.1),
			       new THREE.MeshPhongMaterial({color: 0x00f0ff}));
	textBackdrop.position.z = -3.1;
	textBackdrop.position.y = 0.25;
	exhibit.add(textBackdrop);
    
    //var numOfBalloons = 5;
    for (var i = 0; i < numOfBalloons; i++) {
    	var balloon = new THREE.Mesh(new THREE.SphereGeometry(balloonRadius, 8, 6),
			       new THREE.MeshPhongMaterial({color: 0xff0000}));
    	balloonWall.add(balloon);
    	balloon.position.z = 0.2;
    	balloon.position.y = Math.random() * (height*0.8) - height*0.5 + balloonRadius;
    	balloon.position.x = Math.random() * (width*0.8) - width*0.5 + balloonRadius;
    	balloons.push(balloon);
    	//balloonCords.push(balloon.getWorldPosition())
	}
	
    this.add(exhibit);
	}
}	

