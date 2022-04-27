import * as THREE from '../../../extern/build/three.module.js';
import { VRButton } from '../../../extern/VRButton.js';
import * as GUIVR from '../../GuiVR.js';
import * as ANIMATOR from '../../Animator.js';
import * as USER from '../../User.js';
import {STLLoader}  from '../../../extern/examples/jsm/loaders/STLLoader.js';


export class Ferris extends THREE.Group {
    
    constructor(animatedObjects,userRig,speed0,clock,cabin_count){
	    super();
        this.animatedObjects = animatedObjects;
        this.userRig = userRig;
        // Initialise the parametres, loaders, first platform and group for the whole exhibit
        var platform = new USER.UserPlatform(userRig);
        this.add(platform);
        var loader = new STLLoader();
        var exhibit = new THREE.Group();
        exhibit.scale.set( 0.1, 0.1, 0.1 );
        exhibit.rotation.set( 0, Math.PI, 0 );
        exhibit.position.set( 0, 4 ,-10 ); 
        var cabin_speed = [];
        cabin_speed.push(1);
        cabin_speed.push(1);
        this.cabin_speed = cabin_speed;
       
        // Create group for the spinning part of the ferris wheel
        var ferris = new THREE.Group();
        this.ferris = ferris;
        ferris.setAnimation(
	        function (dt){
	            this.rotation.z += cabin_speed[0] * 0.002;
	        });
        //animatedObjects.push(ferris);
        
        // Load the ring part of ferris wheel and add it to the ferris group, which will rotate it
        loader.load( 'js/rides/jancickl/models/ring.stl', function ( geometry ) {
            var material = new THREE.MeshPhongMaterial( { color: 0xdd5533, specular: 0x222222, shininess: 200 } );
            var mesh = new THREE.Mesh( geometry, material );

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            ferris.add(mesh); 
        } ); 
         
        // Load the stationary part of the model - "feet" of the ferris wheel
        loader.load( 'js/rides/jancickl/models/feet.stl', function ( geometry ) {
            var material = new THREE.MeshPhongMaterial( { color: 0x1122dd, specular: 0x111111, shininess: 200 } );
            var mesh = new THREE.Mesh( geometry, material );

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            exhibit.add( mesh );
        } ); 
       
        // Set up the menu
        var buttons = [new GUIVR.GuiVRButton("Speed", speed0, 0, 5, true, function(x){cabin_speed[0] = x*cabin_speed[1];}),
                       new GUIVR.GuiVRButton("Direction", clock ? 1 : 0, 0, 1, true, function(x){if(x == 1) {cabin_speed[1] = -1} else {cabin_speed[1] = 1; cabin_speed[0]*=-1}}),
                       new GUIVR.GuiVRButton("Cabins", cabin_count, 1, 24, true, (x)=>{this.changeCabins(x);})];
        var sign = new GUIVR.GuiVRMenu(buttons);
        sign.position.x = -1.4;
        sign.position.z = -2;
        sign.position.y = 0.7;
        sign.rotation.y = Math.PI/16;
        platform.add(sign);
        
        exhibit.add(ferris);
        this.add(exhibit);
        
        // Create lights
	/*
        var light = new THREE.DirectionalLight(0x5555ff, 0.05);
        exhibit.add(light);
        light.position.x = 0;
        light.position.y = 30;
        light.position.z = -20;
        var light2 = new THREE.DirectionalLight(0xff5555, 0.05);
        exhibit.add(light2);
        light.position.x = 0;
        light.position.y = 30;
        light.position.z = 20;
*/
    }

    changeCabins(count){
        //console.log(this.cabins,this.ferris);
        if(this.cabins) this.ferris.remove(this.cabins);
        this.cabins = new THREE.Group();
        for(var i = 0; i < count; i++){
            var angle = 2*i*Math.PI/count;
            this.cabins.add(new Cabin(Math.cos(angle)*29.75,Math.sin(angle)*29.75,5.5,this.cabins,this.animatedObjects,this.userRig,this.cabin_speed)); 
        }
        this.ferris.rotation.set(0,0,0);
        this.ferris.add(this.cabins);
        
    }

}

// Creates a cabin with a transparent version of UserPlatform at specified coordinates
class Cabin extends THREE.Group{
    constructor(x,y,z,object,animatedObjects,userRig,cabin_speed){
        super();
        var loader = new STLLoader();
        var rotation_point = new THREE.Object3D();
        
        // Creates a pivot point around which the cabin rotates
        // Loads up a model representing it as a rod attaching the cabin to the frame of the wheel
        rotation_point.position.set( x,y,z);
        rotation_point.setAnimation(
            function (dt){
                this.rotation.z -= cabin_speed[0] * 0.002;
        });
        loader.load( 'js/rides/jancickl/models/pivot.stl', function ( geometry ) {
            var material = new THREE.MeshPhongMaterial( { color: 0x229922, specular: 0x111111, shininess: 200 } );
            var mesh = new THREE.Mesh( geometry, material );

            mesh.position.set(0,0,-6); 
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            rotation_point.add( mesh );
        } ); 
        
        // Add a platform and a model of the cabin
        var view = new THREE.Object3D();
        view.position.set(0,-3.5,-1);
        view.add(new CabinPlatform(userRig,cabin_speed));
        rotation_point.add(view);
        //animatedObjects.push(rotation_point);
        loader.load( 'js/rides/jancickl/models/cabin.stl', function ( geometry ) {
            var material = new THREE.MeshPhongMaterial( { color: 0xffff22, specular: 0x111111, shininess: 200 } );
            var cab = new THREE.Mesh( geometry, material );

            cab.position.set( -2, -6.3 ,3 );
            cab.rotation.set( -Math.PI/2, 0,0);

            cab.castShadow = true;
            cab.receiveShadow = true;

            rotation_point.add( cab );
        } ); 
        object.add(rotation_point);
    }
}

// Similar to the UserPlatform. This version is invisible and has a menu, so it can be used in the ride
class CabinPlatform extends GUIVR.GuiVR {

    constructor(userRig,cabin_speed){
	    super();
        this.cabin_speed = cabin_speed;

	    // Make the shape of a platform.
	    var platform = new THREE.Mesh(
	        new THREE.CylinderGeometry(3.5, 3.5, 7, 32),
	        new THREE.MeshPhongMaterial({opacity: 0,transparent:true}));

	    this.add(platform);
	    this.collider = platform;

	    this.userRig = userRig;
    }

    
    collide(uv, pt){
        //console.log(this.cabin_speed);
            var buttons = [new GUIVR.GuiVRButton("Speed", Math.abs(this.cabin_speed[0]), 0, 5, true, x=>{this.cabin_speed[0] = x*this.cabin_speed[1];}),
                           new GUIVR.GuiVRButton("Clockwise", 1, 0, 1, true, x=>{if(x == 1) {this.cabin_speed[1] = -1} else this.cabin_speed[1] = 1; this.cabin_speed[0]*=-1})];
            var sign = new GUIVR.GuiVRMenu(buttons);
            sign.position.x = -1.4;
            sign.position.z = -2;
            sign.position.y = 0.7;
            sign.rotation.y = Math.PI/16;
            this.add(sign);
	        this.add(this.userRig);
    }
}
