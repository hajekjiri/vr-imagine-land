// Author: Matthew Anderson & Kallan Piconi
// CSC 385 Computer Graphics
// Version: Winter 2020
// Project 2: Axe class
//
// Classes to represent an axe object using threejs.
// the blade of the axe is a collider.

import * as THREE from '../../../extern/build/three.module.js';
import * as GUIVR from './GuiVR.js';
import {OBJLoader}  from '../../../extern/examples/jsm/loaders/OBJLoader.js';
import {FBXLoader}  from '../../../extern/examples/jsm/loaders/FBXLoader.js';

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


export class Axe extends GUIVR.GuiVR {

    constructor(userRig){
        super();
        this.xr = userRig.xr;

        // Load the model
        var objLoader = new FBXLoader();
        let myThis = this;

        // collider for blade
        var collideBlade = new THREE.Mesh(
            new THREE.CylinderGeometry(.1, .1, .6, 32),
            new THREE.MeshPhongMaterial({color: '#ffff00', opacity: 0, transparent: true}));
        collideBlade.rotation.x= THREE.Math.degToRad(-8);
        collideBlade.rotation.z= THREE.Math.degToRad(5);
        collideBlade.position.z= .1;
        collideBlade.position.y= 2.5;
        collideBlade.position.x= 0;

        this.add(collideBlade);
        this.collider = collideBlade;


        //Load the axe
        objLoader.load(
	    '../../../extern/models/lambo/Lamborghini_Aventador.fbx',
            //'./FreeAxe_OBJ/FREE AXE.obj',
            function ( obj ) {
                // Scale and add to the rig once loaded.
                obj.scale.x = 0.001;
                obj.scale.y = 0.001;
                obj.scale.z = 0.001;
                obj.position.y= 2;
                obj.rotation.x = THREE.Math.degToRad(90);

                myThis.add(obj);
            },
            function (xhr){
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error){
                console.log('An error happened');
            }
        );

        this.userRig = userRig;
    }


    collide(uv, pt){
        // When the user clicks on the axe, move the axe to the user.
        //var controller = userRig.getController(0);
        //controller.add(this);
        //controller.add(this);
        //this.position.z += -.6;
        //this.position.y += -2.2;
    }
}
