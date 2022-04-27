import * as THREE from '../../../extern/build/three.module.js';
import { VRButton } from '../../../extern/VRButton.js';
import * as GUIVR from '../../GuiVR.js';
import * as ANIMATOR from '../../Animator.js';
import * as USER from '../../User.js';
import {STLLoader}  from '../../../extern/examples/jsm/loaders/STLLoader.js';


export class Range extends THREE.Group {
    constructor(xr,animatedObjects,userRig,target_speed0,target_duration0,projectile_speed0,reload_speed0){
	    super();
        this.position.set(0,0,-7);

        this.reload_speed = 40;
        this.score = 0;
        this.target_speed = 6;
        this.projectile_speed = 1;
        this.target_delay = 50;
        this.target_duration = 200;
        this.target_duration_counter = 200;
        this.reload_counter = 1000;
        this.target_z=-4;

        // Set up a platform with the menu
        var UPlatform = new USER.UserPlatform(userRig);
        this.add(UPlatform);
        UPlatform.position.set(0,0,5);
        var buttons = [new GUIVR.GuiVRButton("v(Target)", target_speed0, 0, 10, true, x=>{this.target_speed = x;}),
                       new GUIVR.GuiVRButton("t(Target)", target_duration0, 1, 10, true, x=>{this.target_duration = x*50;this.target_duration_counter = x*40}),
                       new GUIVR.GuiVRButton("v(Bullet)", projectile_speed0, 1, 10, true, x=>{this.projectile_speed = x}),
                       new GUIVR.GuiVRButton("v(Reload)", reload_speed0, 1, 10, true, x=>{this.reload_speed=150/x})];
        var sign = new GUIVR.GuiVRMenu(buttons);
        sign.position.set(-1.4,1,-2);
        sign.rotation.y = Math.PI/16;
        UPlatform.add(sign);
       
        // Set up a platform which starts the game
        var platform = new GamePlatform(userRig,xr.getController(0),animatedObjects,this);
        this.add(platform);
	    this.xr = xr;
        var loader = new STLLoader();
        //var light = new THREE.DirectionalLight(0xeeeeff, 0.1);
        //this.add(light);

        // Load the individual parts of model and colour them
        loader.load( 'js/rides/jancickl/models/stand_a.stl', function ( geometry ) {
            var material = new THREE.MeshPhongMaterial({color: 0x77ff77});
            var stand_a = new THREE.Mesh( geometry, material );
            stand_a.position.set(-2.5,-2,-7);
            stand_a.rotation.set(-Math.PI/2,0,-Math.PI/2);
            platform.add(stand_a);
            platform.add(new THREE.DirectionalLight(0xffffff, 0.3));
        } ); 
        loader.load( 'js/rides/jancickl/models/stand_b.stl', function ( geometry ) {
            var material = new THREE.MeshPhongMaterial({color: 0x7777ff});
            var stand_b = new THREE.Mesh( geometry, material );
            stand_b.position.set(-2.5,-2,-7);
            stand_b.rotation.set(-Math.PI/2,0,-Math.PI/2);
            platform.add(stand_b);
        } ); 
        loader.load( 'js/rides/jancickl/models/stand_c.stl', function ( geometry ) {
            var material = new THREE.MeshPhongMaterial({color: 0xff7777});
            var stand_c = new THREE.Mesh( geometry, material );
            stand_c.position.set(-2.5,-2,-7);
            stand_c.rotation.set(-Math.PI/2,0,-Math.PI/2);
            platform.add(stand_c);
        } ); 
        
       
        // Write score and prepare a score bar
        var score_group = new THREE.Group();
        score_group.position.set(-2.1,4.5,-6.5);
        var font_loader = new THREE.FontLoader();
        font_loader.load( 'js/rides/jancickl/fonts/helvetiker_regular.typeface.json', function ( font ) {
	        var geometry = new THREE.TextGeometry( 'Score:', {
		        font: font,
		        size: 0.3,
		        height: 0.3,
		        curveSegments: 12
            });
            var material = new THREE.MeshPhongMaterial({color: 0x111111});
            var score_mesh = new THREE.Mesh(geometry,material);
	        score_group.add(score_mesh);
            score_mesh.scale.set(1,1,0.3);
        });
        this.add(score_group);
       
        // Write the instructions
        font_loader.load( 'js/rides/jancickl/fonts/helvetiker_regular.typeface.json', function ( font ) {
	        var geometry = new THREE.TextGeometry( 'Shoot the targets.\nTargets move randomly and dissapear.\nYour score depends on the difficulty.\nTeleport to the next platform to start!\nGood luck!', {
		        font: font,
		        size: 0.1,
		        height: 0.1,
		        curveSegments: 12
            });
            var material = new THREE.MeshPhongMaterial({color: 0xcccccc});
            var instructions = new THREE.Mesh(geometry,material);
            instructions.position.set(1,1.2,-2);
            instructions.rotation.y = - Math.PI/8;
            instructions.scale.set(1,1,0.1);
	        UPlatform.add(instructions);
        });
        
        var geometry =  new THREE.BoxGeometry(0.01,0.4,0.5);
        var material = new THREE.MeshPhongMaterial({color: 0x2233aa});
        var score_bar = new THREE.Mesh( geometry, material );
        score_group.add(score_bar);
       
        score_bar.position.set(1.3,0.14,0);
        score_bar.setAnimation(
	        function (dt){
                this.scale.x = 0.01 + this.parent.parent.score;
                this.position.x= 1.3 + 0.005*this.parent.parent.score;
	        });
        //animatedObjects.push(score_bar);
    }

}

// Class representing the targets user shoots at. It handles the hits.
class Target extends THREE.Group {
    constructor(animatedObjects,range){
	    super();

        this.range = range;
        range.target_delay = 50; 
        // Generate random position
        this.position.set((1.2-2.4*Math.random()),(3.6-1,4*Math.random()),-5); 
        this.scale.set(0.03,0.03,0.03);

        // Load all the parts of the model
        var loader = new STLLoader();
        var target = new THREE.Group();
        loader.load( 'js/rides/jancickl/models/targetA.stl', function ( geometry ) {
            var material = new THREE.MeshPhongMaterial({color: 0xff2211});
            var a = new THREE.Mesh( geometry, material );

            a.castShadow = true;
            a.receiveShadow = true;

            target.add(a); 
        } ); 
        loader.load( 'js/rides/jancikl/models/targetB.stl', function ( geometry ) {
            var material = new THREE.MeshPhongMaterial({color: 0xffffff});
            var b = new THREE.Mesh( geometry, material );

            b.castShadow = true;
            b.receiveShadow = true;

            target.add(b); 
        } ); 
        
        target.visible = false;
        this.add(target); 
        this.target = target;
       
        var randCounter = 0;
        var delta_x = 0;
        var delta_y = 0;
        target.setAnimation(
	        function (dt){
                // Target was hit or timed out - new target position
                if(range.target_delay==50){
                    target.visible = false; 
                    this.parent.position.set((1.2-2.4*Math.random()),(3.6-1.4*Math.random()),-5);
                    this.position.set(0,0,0);
                    //console.log(this.parent);
                }
                if(range.target_delay>0) {
                    range.target_delay--;
                }
                else if (range.target_delay==0) { // After some time - reveal the target
                    target.visible = true;
                    range.target_delay--;
                }
                // Generate a new direction of the target and move that way
                if(!randCounter) {
                    delta_x = range.target_speed*(0.2*Math.random()-0.1);
                    delta_y = range.target_speed*(0.2*Math.random()-0.1);
                    randCounter=50
                    
                    var coord_x = this.position.x*0.03+this.parent.position.x;
                    var coord_y = this.position.y*0.03+this.parent.position.y;
                    //console.log(coord_x,coord_y);

                    //Prevent the target form leaving the range
                    if(coord_x < -1.2) {delta_x += 0.1*range.target_speed;
					//console.log("Too close on the left")
				       };
                    if(coord_x > 1)  {delta_x -= 0.1*range.target_speed; //console.log("Too close on the right")
				     };
                    if(coord_y < 2.2)  {delta_y += 0.1*range.target_speed; //console.log("Too close on the bottom")
				       };
                    if(coord_y > 3.6)    {delta_y -= 0.1*range.target_speed; //console.log("Too close on the upper side")
					 };
                }; 
	            this.position.x += delta_x;
	            this.position.y += delta_y;
                randCounter--;
                range.target_duration_counter--;
                if(!range.target_duration_counter) {range.target_duration_counter = range.target_duration + 50; range.target_delay = 50};

	        });
        //animatedObjects.push(target);
    }
    // Check() is called when projectile reaches the target zone and detects if the target was hit 
    check(x,y){
        this.updateMatrixWorld();
        var c = new THREE.Vector3();
        c.setFromMatrixPosition(this.target.matrixWorld);
        var distance = Math.sqrt(((x-c.x)**2)+((y-c.y)**2));
        //console.log(x,y,c.x,c.y,c.z,distance);
        if(distance < 0.42){ // Target was hit - new target and change score
            this.range.target_delay = 50;
            this.range.target_duration_counter = this.range.target_duration + 50;
            this.range.score+=5*(this.range.target_speed*(1/this.range.target_duration) + 50*(1/this.range.reload_speed)*(1/this.range.projectile_speed));
        }

    }
}

// Handles the bullets leaving from the gun - handles the movement and calls targets to find out if it was hit
class Projectile extends THREE.Group {
    constructor(x,y,z,rx,ry,rz,animatedObjects,target,range){
	    super();
        // Prepare the mesh and set the position and rotation from the one of the controller (to keep the correct trajectory )
        var geometry = new THREE.SphereBufferGeometry(0.04);
        var material = new THREE.MeshPhongMaterial({color: 0xff3333});
        var projectile = new THREE.Mesh( geometry, material );
        projectile.position.set(0,0,-0.4);
        this.position.set(x,y,z);
        this.rotation.set(rx,ry,rz);
        var group = new THREE.Group();
      
        group.add(projectile);
        this.add(group);

        group.setAnimation(
	        function (dt){
                // Move forward and calculate the position in relation to the other objects
	            this.position.z -= 0.1*range.projectile_speed;
                var coord_z = Math.cos(rz)*this.position.z;
                // When projectile reaches the target area, it deletes itself and tells the target its location to check for a hit.
                if( coord_z < range.target_z){ 
                    this.updateMatrixWorld();
                    var coords = new THREE.Vector3();
                    coords.setFromMatrixPosition(this.matrixWorld);
                    group.remove(projectile);
                    //animatedObjects.splice(animatedObjects.indexOf(group),1);
                    
                    target.check(coords.x,coords.y);
                }
            });
        //animatedObjects.push(group);
    }

}


// Platform which sets up the begining of the game
class GamePlatform extends GUIVR.GuiVR {

    constructor(userRig,controller,animatedObjects,range){
	    super();
        this.controller = controller;
        this.range = range;
        this.userRig = userRig;
        this.animatedObjects = animatedObjects;
	    var platform = new THREE.Mesh(
	        new THREE.CylinderGeometry(1, 1, 1, 32),
	        new THREE.MeshPhongMaterial({color: 0x0000FF}));
	    
        var front = new THREE.Mesh(
	        new THREE.CylinderGeometry(0.1, 0.1, 0.1, 32),
	        new THREE.MeshPhongMaterial({color: 0x00FF00}));
	    
        front.position.y = 0.55;	
	    front.position.z = -1;
	    this.add(front);

        this.position.y = 2;
	    this.add(platform);
	    this.collider = platform;

	    this.userRig = userRig;
    }

    // Creates the target, adds gun to the hand and specifies the listener to the firing of the gun 
    collide(uv, pt){
        this.target = new Target(this.animatedObjects,this.range);
        this.parent.add(this.target);
        var controller = this.controller;
	    this.add(this.userRig);
        var loader = new STLLoader();
	    if (controller != undefined){
		    controller.addEventListener('selectstart', (ev) => 
                (this.onSelectStartVR(ev,this.controller.position.x,this.controller.position.y,this.controller.position.z,
                 this.controller.rotation.x,this.controller.rotation.y,this.controller.rotation.z,this.animatedObjects)));
		    this.add(controller); 
	    }
        loader.load( 'js/rides/jancickl/models/gun.stl', function ( geometry ) {
            var material = new THREE.MeshPhongMaterial({color: 0x2233aa});
            var gun = new THREE.Mesh( geometry, material );
            gun.scale.set(0.015,0.015,0.015);
            gun.rotation.y=Math.PI;
            controller.add(gun); 
        } ); 
        controller.setAnimation(
	        function (dt){
	            this.parent.range.reload_counter++;
            });
        //this.animatedObjects.push(controller);
        //console.log(this.parent.reload_speed());
    }
    // Firing handler - creates the projectile(checks for reload time) and it handles the rest
    onSelectStartVR(event,x,y,z,rx,ry,rz,animatedObjects){
        if(this.range.reload_counter>this.range.reload_speed){
            this.add(new Projectile(x,y,z,rx,ry,rz,animatedObjects,this.target,this.range));
            //console.log(this.range.reload_counter);
            this.range.reload_counter = 0;
        }
    }

}
