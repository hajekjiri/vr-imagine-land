// Author: Noah Lehman-Borer
// CSC 385 Computer Graphics
// Version: Winter 2020

import * as THREE from '../../../extern/build/three.module.js';
import { VRButton } from '../../../extern/VRButton.js';
import * as GUIVR from './GuiVR.js';
import * as ANIMATOR from './Animator.js';
import * as USER from './User.js';



export class Toss extends THREE.Group {

    constructor(userRig, animatedObjects, rows, columns, distance){
        super();

        rows = (typeof rows !== 'undefined') ?  rows : 3
        columns = (typeof columns !== 'undefined') ?  columns : 5
        distance = (typeof distance !== 'undefined') ? distance : 10

        this.rows = rows;
        this.columns = columns;
        this.distance = distance;

        this.userRig = userRig;
        this.animatedObjects = animatedObjects;
        this.exhibit = this.init();
        return this.exhibit;
    }

    

    init(){
    // Toss Exhibit
    
    function makeRing(){
        var ringGeometry = new THREE.TorusGeometry(10,1,8,20);
        var ringMaterial = new THREE.MeshPhongMaterial( {color: 0x00ffff});
        var ring = new THREE.Mesh(ringGeometry,ringMaterial);
    }

    let controllerModel = new THREE.Mesh(
    new THREE.TorusGeometry(.10,.01,8,20),
    new THREE.MeshPhongMaterial({color: 0x00ffff}));


    var exhibit = new THREE.Group();
    exhibit.add(new USER.UserPlatform(
    this.userRig,
    function (){
        console.log("Landing at Exhibit 2");
        // Get controller's position
        let controller = this.userRig.getController(0);
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

    // Rig to hold the loaded model.
    var rig = new THREE.Group();
    rig.rotation.y = THREE.Math.degToRad(10);
    rig.lift = 0;
    rig.angle = 0;
    rig.position.y = -0.4;
    rig.position.z = -5;


    exhibit.add(rig);
    this.animatedObjects.push(rig);
    rig.position.z = -10;



    var greenGeometry = new THREE.BoxGeometry(this.rows, 0.1, this.columns + this.distance);
    var greenMaterial = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
    var green = new THREE.Mesh(greenGeometry, greenMaterial);
    green.position.z = -(this.columns + this.distance)/2
    exhibit.add(green);

    




    /*
    var baseGeometry = new THREE.CylinderGeometry(8,8,1,16);
    var baseMaterial = new THREE.MeshPhongMaterial( {color: 0x00a0e0} );
    var base = new THREE.Mesh(baseGeometry,baseMaterial);

    base.speed = 0;

    base.setAnimation(
    function (dt){
        this.rotation.y += this.speed * 0.01;
    });

    var wallGeometry = new THREE.CylinderGeometry(8,8,3,15,1,true,0,5.89);
    var wallMaterial = new THREE.MeshPhongMaterial({ color: 0xce215f});
    wallMaterial.transparent = true;
    wallMaterial.opacity = 0.5;
    var wall = new THREE.Mesh(wallGeometry,wallMaterial);
    wall.material.side = THREE.DoubleSide;
    wall.position.y = 2;
    base.add(wall);

    var hydraulicGeometry = new THREE.CylinderGeometry(1,1,10,16);
    var hydraulicMaterial = new THREE.MeshPhongMaterial({ color: 0xdddddd});
    var hydraulic = new THREE.Mesh(hydraulicGeometry,hydraulicMaterial);
    
    var bearingGeometry = new THREE.SphereGeometry(0.5,32,32);
    var bearingMaterial = hydraulicMaterial;
    var bearing = new THREE.Mesh(bearingGeometry,bearingMaterial);
    
    hydraulic.position.y = -5;
    bearing.position.y += 5;

    bearing.add(base);
    hydraulic.add(bearing);

    bearing.setAnimation(
    function (dt){
        var adjustedAngle = THREE.Math.degToRad(Math.min(rig.angle,(hydraulic.position.y+5)*5));
        if (this.rotation.x < adjustedAngle - 0.003) {
            this.rotation.x += .002;
        } else if (this.rotation.x > adjustedAngle + 0.003) {
            this.rotation.x -= .002;
        }
    });

    hydraulic.setAnimation(
    function (dt){
        if (this.position.y < rig.lift-5 - 0.03) {
            this.position.y += .02;
        } else if (this.position.y > rig.lift-5 + 0.03) {
            this.position.y -= .02;
        }
    });
        */

   var buttons = [new GUIVR.GuiVRButton("rows", this.rows, 2, 5, true,
                     function(x){
                        this.rows = x;
                        //reset();
                    }), new GUIVR.GuiVRButton("columns", this.columns, 2, 5, true,
                     function(x){
                        this.columns = x;
                        //reset();
                     }), new GUIVR.GuiVRButton("distance", this.distance, 2, 30, true,
                     function(x){
                        this.distance = x;
                        //reset();
                     })];
    
    var sign = new GUIVR.GuiVRMenu(buttons);
    sign.position.x = -1;
    sign.position.z = -2;
    sign.position.y = 0.5;

    exhibit.add(sign);    
/*
    var numPlatforms = 7;
    var radsPerPlatform = THREE.Math.degToRad(360/numPlatforms);
    for (var i = 0; i < numPlatforms; i++) {
        var up = new USER.UserPlatform(this.userRig,undefined,undefined);
        up.position.x = Math.sin(radsPerPlatform*i)*7;
        up.position.z = Math.cos(radsPerPlatform*i)*7;
        up.position.y = 0.01;
        up.rotation.y = radsPerPlatform*i;
        up.add(makeSign());
        base.add(up);
    }

    rig.add(hydraulic);
*/

    // Pose exhibit.
    exhibit.rotation.y = THREE.Math.degToRad(90);
    exhibit.position.z = -5;
    exhibit.position.x = -3;

    return(exhibit);
}
}
