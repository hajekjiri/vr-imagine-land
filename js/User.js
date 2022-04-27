// Author: Matthew Anderson
// CSC 385 Computer Graphics
// Version: Winter 2020
// Project 2: User classes
//
// Classes to help move the user.  The class UserRig internalizes the
// position of the VR headset and controllers.  Move the UserRig
// object to cause the user to change positions in VR.  The class
// UserPlatform represents platforms for the user to teleport to by
// clicking on, the small green circle indicates the front of the
// platform.

import * as THREE from '../extern/build/three.module.js';
import * as GUIVR from './GuiVR.js';

const controllerPointer =
    new THREE.Line(
	new THREE.BufferGeometry().setFromPoints([
	    new THREE.Vector3(0, 0, 0),
	    new THREE.Vector3(0, 0, -1)]),
	new THREE.LineBasicMaterial({
	    color: 0xff0000,
	    linewidth: 4}));
controllerPointer.name = 'pointer';
controllerPointer.scale.z = 20;


function disown(obj){
    for (var i = obj.children.length; i >= 0; i -= 1){
	let child = obj.children[i];
	obj.remove(child);
    }
}

export class UserRig extends THREE.Group {

    constructor(camera, xr){
	super();

	this.light = new THREE.PointLight(0xffffff,0.5);
	this.light.position.y = 4;
	this.add(this.light);
	this.camera = camera;
	this.xr = xr;
	this.add(camera);
	this.controllers = [];
	
	// Set up the controller to be represented as a line.
	// This code use to be in init() in main.js.
	for (var i = 0; i < 2; i++){
	    let controller = xr.getController(i);
	    if (controller != undefined){
		controller.triggered = false;
		this.controllers.push(controller);
	
		controller.addEventListener('selectstart',
					    (ev) => (this.onSelectStartVR(ev)));
		controller.addEventListener('selectend',
					    (ev) => (this.onSelectEndVR(ev)));
		
		this.add(controller); // Add controller to the rig.
		controller.add(controllerPointer.clone());
	    }
	}
    }

    reset(){

	this.position.x = 0;
	this.position.y = 0;
	this.position.z = 0;
	this.rotation.x = 0;
	this.rotation.y = 0;
	this.rotation.z = 0;
	
	disown(this);
	this.add(this.camera);
	this.add(this.light);

	// Set up the controller to be represented as a line.
	// This code use to be in init() in main.js.
	for (let i = 0; i < this.controllers.length; i += 1){
	    disown(this.controllers[i]);
	    this.add(this.controllers[i]);
	    this.controllers[i].setAnimation(function (dt) {});
	    this.controllers[i].add(controllerPointer.clone());
	}
	
    }
    
    // Returns the nth controller if it exists, and undefined otherwise.
    getController(n){
	if (n >= 0 && n < this.controllers.length){
	    return this.controllers[n];
	} else {
	    return undefined;
	}
    }

    onSelectStartVR(event){
	// VR trigger event handler.  Use to be in main.js, but
	// otherwise does what it did before.
	
	if (!(event instanceof MouseEvent) && this.xr.isPresenting()){
	    // Handle controller click in VR.
	    
	    // Retrieve the pointer object.
	    let controller = event.target;
	    let controllerPointer = controller.getObjectByName('pointer');

	    for (let i = 0; i < this.controllers.length; i++){
		if (controller == this.controllers[i]) {
		    console.log("Triggered");
		    controller.triggered = true;
		}
	    }
	    
	    // Create raycaster from the controller position along the
	    // pointer line.
	    let tempMatrix = new THREE.Matrix4();
	    tempMatrix.identity().extractRotation(controller.matrixWorld);
	    let raycaster = new THREE.Raycaster();
	    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
	    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
	    
	    // Register the click into the GUI.
	    let hit = GUIVR.intersectObjects(raycaster);
	    if (hit){
		//debugWrite("Hit something");
	    }
	    
	    //DEBUG.displaySession(this.xr);
	    //DEBUG.displaySources(this.xr);
	    //DEBUG.displayNavigator(navigator);
	}
    }

    onSelectEndVR(event){
	// VR trigger release event handler. 
	
	if (!(event instanceof MouseEvent) && this.xr.isPresenting()){
	    let controller = event.target;

	    for (let i = 0; i < this.controllers.length; i++){
		if (controller == this.controllers[i]){
		    controller.triggered = false;
		}
	    }
	    
	}
    }
}


export class UserPlatform extends GUIVR.GuiVR {

    constructor(userRig, onLand, onLeave){
	super();

	// Make the shape of a platform.
	var platform = new THREE.Mesh(
	    new THREE.CylinderGeometry(1, 1, 1, 8),
	    new THREE.MeshPhongMaterial({color: 0x0000FF}));

	var front = new THREE.Mesh(
	    new THREE.CylinderGeometry(0.1, 0.1, 0.1, 8),
	    new THREE.MeshPhongMaterial({color: 0x00FF00}));

	// The front direction of the platform is -z.
	front.position.y = 0.55;	
	front.position.z = -1;
	this.add(front);

	this.add(platform);
	this.collider = platform;

	this.userRig = userRig;
	this.onLand = onLand;
	this.onLeave = onLeave;
    }

    
    collide(uv, pt){
	// When the user clicks on this platform, move the user to it.
	let parent = this.userRig.parent;
	if (parent != undefined && (parent instanceof UserPlatform)){
	    if (parent.onLeave != undefined){
		parent.onLeave();
	    }
	}

	this.userRig.reset();
	
	this.add(this.userRig);
	if (this.onLand != undefined){
	    this.onLand();
	}
    }
}
