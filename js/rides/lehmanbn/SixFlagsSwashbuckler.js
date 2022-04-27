// Author: Noah Lehman-Borer
// CSC 385 Computer Graphics
// Version: Winter 2020

import * as THREE from '../../../extern/build/three.module.js';
import { VRButton } from '../../../extern/VRButton.js';
import * as GUIVR from '../../GuiVR.js';
import * as ANIMATOR from '../../Animator.js';
import * as USER from '../../User.js';



export class Swashbuckler extends THREE.Group {

    constructor(userRig, animatedObjects, speed, lift, angle){
        super();

        speed = (typeof speed !== 'undefined') ?  speed : 0
        lift = (typeof lift !== 'undefined') ?  lift : 0
        angle = (typeof angle !== 'undefined') ? angle : 0

        this.userRig = userRig;
        this.animatedObjects = animatedObjects;
        this.exhibit = this.init(speed, lift, angle);
        return this.exhibit;
    }

    init(initialSpeed, initialLift, initialAngle){
    // Swashbuckler Exhibit
    
    var exhibit = new THREE.Group();
    exhibit.add(new USER.UserPlatform(
    this.userRig,
    function (){
        //console.log("Landing at Swashbuckler");
        // Get controller's position
        let controller = this.userRig.getController(0);
        

    },
    function (){
        //console.log("Leaving Swashbuckler");
        let controller = this.userRig.getController(0);        
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
	//this.animatedObjects.push(rig);
    rig.position.z = -10;


    
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
        

    function makeSign(){
    // Make GUI sign.
    var buttons = [new GUIVR.GuiVRButton("Speed", initialSpeed, 0, 10, true,
                     function(x){base.speed = x;}), new GUIVR.GuiVRButton("Lift", initialLift, 0, 10, true,
                     function(x){rig.lift = x;}), new GUIVR.GuiVRButton("Angle", initialAngle, 0, 30, true,
                     function(x){rig.angle = x;})];
    var sign = new GUIVR.GuiVRMenu(buttons);
    sign.position.x = -1;
    sign.position.z = -2;
    sign.position.y = 1;
    return sign
}

    var sign = makeSign();
    sign.position.y = 0.5;
    exhibit.add(sign);


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


    // Pose exhibit.
    exhibit.rotation.y = THREE.Math.degToRad(-90);
    exhibit.position.z = -5;
    exhibit.position.x = 3;

    return(exhibit);
}
}
