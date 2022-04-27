// Author: Matthew Anderson & Kallan Piconi
// CSC 385 Computer Graphics
// Version: Winter 2020
// Project 2: UserCup
//
// Class to represent a teacup in threejs. The cup is a collider,
// so when the user clicks on it they will be transported to it.

import * as THREE from '../../../extern/build/three.module.js';
import * as GUIVR from '../../GuiVR.js';
import {OBJLoader}  from '../../../extern/examples/jsm/loaders/OBJLoader.js';

export class UserRig extends THREE.Group {

    constructor(camera, xr){
        super();

        this.add(camera); // Add camera to the rig.
        this.xr = xr;
        this.controllers = [];

        // Set up the controller to be represented as a line.
        // This code use to be in init() in main.js.
        for (var i = 0; i < 2; i++){
            let controller = xr.getController(i);
            if (controller != undefined){
                this.controllers.push(controller);

                controller.addEventListener('selectstart',
                    (ev) => (this.onSelectStartVR(ev)));
                controller.addEventListener('selectend',
                    (ev) => (this.onSelectEndVR(ev)));

                this.add(controller); // Add controller to the rig.
                let controllerPointer =
                    new THREE.Line(
                        new THREE.BufferGeometry().setFromPoints([
                            new THREE.Vector3(0, 0, 0),
                            new THREE.Vector3(0, 0, -1)]),
                        new THREE.LineBasicMaterial({
                            color: 0xff0000,
                            linewidth: 4}));
                controllerPointer.name = 'pointer';
                controllerPointer.scale.z = 20;
                controller.add(controllerPointer.clone());
            }
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



var loaded = false;
var loadInto = [];

export class UserCup extends GUIVR.GuiVR {

    constructor(userRig){
        super();

        // Load the model
        var objLoader = new OBJLoader();
        let myThis = this;
        var collide = new THREE.Mesh(
            new THREE.CylinderGeometry(.6, .6, .5, 32),
            new THREE.MeshPhongMaterial({color: 0x0000FF, opacity: 0.0, transparent: true}));
        collide.position.y= .25;
        this.add(collide);
        this.collider = collide;

	if (loaded === false){

	    if (loadInto.length == 0){

		objLoader.load(
		    'js/rides/piconik/15188_Spinning_Teacup_v1_NEW.obj',
		    function ( obj ) {
			// Scale and add to the rig once loaded.
			obj.scale.x = 0.01;
			obj.scale.y = 0.01;
			obj.scale.z = 0.01;
			//obj.position.z= 1.5;
			//obj.position.y= -.25;
			obj.rotation.x = THREE.Math.degToRad(270);
				//myThis.collider = obj;
			loaded = obj;
			for (let i = 0; i < loadInto.length; i++){
			    loadInto[i].add(obj.clone());
			}
		    },
		    function (xhr){
			//console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		    },
		    function (error){
			console.log('An error happened');
		    }
		);
	    } 
	    loadInto.push(this);		

	} else {
	    this.add(loaded.clone());
	}

        this.userRig = userRig;
    }


    collide(uv, pt){
        // When the user clicks on this platform, move the user to it.
        this.add(this.userRig);
    }
}
