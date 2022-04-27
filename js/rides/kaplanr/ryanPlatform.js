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

import * as THREE from '../../../extern/build/three.module.js';
import * as GUIVR from '../../GuiVR.js';


export class ryanPlatform extends GUIVR.GuiVR {

    constructor(platColor, userRig, onLand, onLeave){
	super();

	// Make the shape of a platform.
	var platform = new THREE.Mesh(
	    new THREE.CylinderGeometry(1, 0.0001, 1, 32),
	    new THREE.MeshPhongMaterial({color: platColor}));

	var front = new THREE.Mesh(
	    new THREE.CylinderGeometry(0.1, 0.1, 0.1, 32),
	    new THREE.MeshPhongMaterial({color: 0xFFFFFF}));

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
	if (parent != undefined && (parent instanceof ryanPlatform)){
	    if (parent.onLeave != undefined){
		parent.onLeave();
	    }
	}

	this.add(this.userRig);
	if (this.onLand != undefined){
	    this.onLand();
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
