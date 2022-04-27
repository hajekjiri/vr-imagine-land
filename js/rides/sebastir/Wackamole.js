import * as THREE from '../../../extern/build/three.module.js';
import { VRButton } from '../../../extern/VRButton.js';
import {DebugConsole, debugWrite} from './DebugConsole.js';
import * as DEBUG from './DebugHelper.js';
import * as GUIVR from './GuiVR.js';
import * as ANIMATOR from './Animator.js';
import * as USER from './User.js';

export function initWack(userRig, scene, animatedObjects){

    // Exhibit 2 - OBJ Loading Example
    let controllerModel = new THREE.Mesh(
	new THREE.BoxGeometry(0.25, 0.25, 0.25),
	new THREE.MeshPhongMaterial({color: 0x000000}));
	
    var exhibit = new THREE.Group();
    exhibit.add(new USER.UserPlatform(
	userRig,
	function (){
	    console.log("Landing at Exhibit 2");
	    // Get controller's position
	    let controller = userRig.getController(0);
	    // Add new model for controller (should be removed on leaving).
	    controller.add(controllerModel);
	    // Set animation to check whether trigger button is
	    // pressed and then fire a projectile in the frame of the
	    // controller if is and enough time has elapsed since last
	    // firing.
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
			console.log("Firing");
			controller.add(proj);
			proj.setAnimation(
			    function (dt){
				if (this.t == undefined){
				    this.t = 0;
				}
				this.t += dt;
				this.position.z -= dt;
				// Cause the projectile to disappear after t is 20.
				if (this.t > 20){
				    this.parent.remove(this);
				}
			    }
			);
		    }
		}
	    );

	},
	function (){
	    console.log("Leaving Exhibit 2");
	    let controller = userRig.getController(0);
	    // Clear the model added to controller.
	    controller.remove(controllerModel);
	    // Remove special animation attached to controller.
	    controller.setAnimation(undefined);
	}
    ));  

    
    //Build Gopher
    var geometry = new THREE.BufferGeometry();
    var vertices = new Float32Array( [
	    //Front
	    -.25, 1,  .125,
	    .25, 1,  .125,
	    .25, 1.25,  .125,

  	  -.25, 1,  .125,
  	  .25, 1.25,  .125,
  	  -.25, 1.25,  .125,
  	  
  	  -.25, 1.25,  .125,
  	  .25, 1.25,  .125,
  	  .125, 1.375,  .125,
  	  
  	  -.25, 1.25,  .125,
  	  .125, 1.375,  .125,
  	  -.125, 1.375,  .125,
  	  
  	  //side1
  	  .25, 1,  .125,
  	  .25, 1,  -.125,
  	  .25, 1.25,  -.125,
  	  
  	  .25, 1,  .125,
  	  .25, 1.25,  -.125,
  	  .25, 1.25,  .125,
  	  
  	  .25, 1.25,  .125,
  	  .25, 1.25,  -.125,
  	  .125, 1.375,  -.125,
  	  
  	  .25, 1.25,  .125,
  	  .125, 1.375,  -.125,
  	  .125, 1.375,  .125,
  	  
  	  //back
	    -.25, 1,  -.125,
	    .25, 1.25,  -.125,
      .25, 1,  -.125,
      
  	  -.25, 1,  -.125,
  	  -.25, 1.25,  -.125,
  	  .25, 1.25,  -.125,
  	  
  	  -.25, 1.25,  -.125,
  	  .125, 1.375,  -.125,
  	  .25, 1.25,  -.125,
  	  
  	  -.25, 1.25,  -.125,
  	  -.125, 1.375,  -.125,
  	  .125, 1.375,  -.125,
  	  
  	  //Top
  	  -.125, 1.375, .125,
  	  .125, 1.375,  .125,
  	  .125, 1.375,  -.125,
  	  
  	  -.125, 1.375,  .125,
  	  .125, 1.375,  -.125,
  	  -.125, 1.375,  -.125,
  	  
  	   //side2
  	  -.25, 1,  .125,
  	  -.25, 1.25,  -.125,
  	  -.25, 1,  -.125,
  	  
  	  -.25, 1,  .125,
  	  -.25, 1.25,  .125,
  	  -.25, 1.25,  -.125,
  	  
  	  -.25, 1.25,  .125,
  	  -.125, 1.375,  -.125,
  	  -.25, 1.25,  -.125,
  	  
  	  -.25, 1.25,  .125,
  	  -.125, 1.375,  .125,
  	  -.125, 1.375,  -.125,
    ] );


    

    // Rig to hold the loaded model.
    var rig = new THREE.Group();
    rig.rotation.y = THREE.Math.degToRad(-90);
    rig.speed = 1;
    rig.position.y = 0;
    rig.position.z = -5;
    // Make the rig slowly rotate.
    rig.setAnimation(
	function (dt){
	    this.rotation.y += this.speed * 0.01;
	});
	    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    var material = new THREE.MeshBasicMaterial( { color: 0x654321 } );
    var mole = new THREE.Mesh( geometry, material ); 
    mole.rotation.y = THREE.Math.degToRad(-90);
    mole.speed = 1;
    mole.position.y = .5;
    mole.position.z = Math.random();
    mole.position.x = Math.random();
    mole.setAnimation(
	function (dt){
	    this.rotation.y += this.speed * 0.05;
	    /*if (this.t == undefined){
				    this.t = 0;
				}
				this.t += dt;
				// Cause the mole to disappear
				if (this.t > 10/(this.speed/2) && this.t % 5 >= 2){
				    this.parent.remove(this);
				}*/
	});
	  
	  exhibit.add(mole)
	  animatedObjects.push(mole)
    animatedObjects.push(rig);

    

    
    // Make GUI sign.
    var buttons = [new GUIVR.GuiVRButton("Speed", 1, 0, 10, true,
					 function(x){rig.speed = x;})];
    var sign = new GUIVR.GuiVRMenu(buttons);
    sign.position.x = 0;
    sign.position.z = -2;
    sign.position.y = 0.5;
    exhibit.add(sign);
        
        // Pose exhibit.
    exhibit.rotation.y = THREE.Math.degToRad(-90);
    exhibit.position.z = -5;
    exhibit.position.x = 3;
    
    scene.add(exhibit);
}