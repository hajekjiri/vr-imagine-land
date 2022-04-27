import * as THREE from '../../../extern/build/three.module.js';
import * as USER from '../../User.js';
import {OBJLoader} from '../../../extern/examples/jsm/loaders/OBJLoader.js';
import * as GUIVR from '../../GuiVR.js';
import { VRButton } from '../../../extern/VRButton.js';

export class teacupRide extends THREE.Group{

    constructor(userRig, rideBaseRadius, numTeaCups, speedOfBase) {
        super();
        this.rideBaseRadius = rideBaseRadius;
        this.numTeaCups = numTeaCups;
        this.degreeOfRotation = -360 / numTeaCups;
        this.speedOfBase = speedOfBase;

        this.teacupRide(userRig, this.rideBaseRadius, this.numTeaCups, this.speedOfBase);
	let platform = new USER.UserPlatform(userRig);
	let sign = this.makeButton();
	sign.position.y = 1;
        platform.add(sign);
	
	this.add(platform);
    }

    teacupRide(userRig, rideBaseRadius, numTeaCups, speedOfBase) {
        //radius = 5
        var rideBase = new THREE.Mesh(
            new THREE.CylinderGeometry(rideBaseRadius, rideBaseRadius, .5, 60),
            new THREE.MeshPhongMaterial({color: 0x0000FF}));
        rideBase.rotation.y = THREE.Math.degToRad(90);
        rideBase.position.z = -7;
        rideBase.position.x = 0;
        rideBase.position.y = 0;
        //.75
        rideBase.speed = speedOfBase;
        var ride = this;
        rideBase.setAnimation(
            function (dt) {
                this.rotation.y += ride.speedOfBase * 0.01;
            });
        //animatedObjects.push(rideBase);
        this.add(rideBase);

        if(rideBaseRadius >= 5) {
            var vector1 = new THREE.Vector3(3, .5, 0);
            // Rotate triangle about y-axis to make more teacups.
            //-90
	    var rot1 = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(this.degreeOfRotation));
            this.addTeacups(rideBase, vector1, userRig, numTeaCups, speedOfBase*-1,rot1);
        }
        else{
	    var vector2 = new THREE.Vector3(2, .5, 0);
	    var rot2 = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), THREE.Math.degToRad(this.degreeOfRotation));
            this.addTeacups(rideBase, vector2, userRig, numTeaCups, speedOfBase*-1, rot2);
        }
    }

    addTeacups(rideBase, vec, userRig, num, speedOfSeats, rot) {



        // Load the teacup model
        var loader1 = new OBJLoader();

        loader1.load(
            'extern/models/teacup/spinningTeacup.obj',
            function (obj) {

                // Scale and add to the rig once loaded.
                obj.scale.x = 0.01;
                obj.scale.y = 0.01;
                obj.scale.z = 0.01;



		// Rotate triangle about y-axis to make more teacups.
		//-90

		for (var j = 0; j < num; j++) {
		    var platform = new USER.UserPlatform(userRig);
		    //platform.rotation.y = THREE.Math.degToRad(-90);
		    platform.speed = 1; // new member variable to track speed
		    // platform.position.z = 0;
		    // platform.position.x = -4.1;
		    platform.position.y = -.5;
		    var group = new THREE.Group();
                    vec.applyMatrix4(rot);
		    
                    group.position.x = vec.x;
                    group.position.y = vec.y;
                    group.position.z = vec.z;
                    //-1
                    group.speed = speedOfSeats;
                    obj.rotation.x = THREE.Math.degToRad(-90);
                    group.setAnimation(
			function () {
                            this.rotation.y += speedOfSeats * -0.01;
			});
                    //animatedObjects.push(group);
                    group.add(obj.clone());
                    rideBase.add(group);
                    group.add(platform);
		}
            },
            function (xhr) {
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.log('An error happened');
            }
        );
    }

    setSpeed(speed){
        this.speedOfBase = speed;
    }

    makeButton(){
        var current = this;
        var button = [new GUIVR.GuiVRButton("Speed", current.speedOfBase, 0, 10, true,
            function(x){current.setSpeed(x);})];
        var sign = new GUIVR.GuiVRMenu(button);
        // sign.position.x = x; //0
        // sign.position.z = y; //-2
        // sign.position.y = z; //1
        return sign;
    }
}
