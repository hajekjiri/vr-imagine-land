// Author: Kallan Piconi
// CSC 385 Computer Graphics
// Version: Winter 2020
// Project 2: Ride class
//
// A class called Ride that simulates a spinning teacup ride using threejs.
// The user can interact with the ride by hopping onto a cup or by changing
// the speeds of the cups, saucers, and base. The user should first click the user platform
// then they click any cup to teleport to it.

import * as THREE from '../../../extern/build/three.module.js';
import * as GUIVR from '../../GuiVR.js';
import * as USER from '../../User.js';
import {OBJLoader}  from '../../../extern/examples/jsm/loaders/OBJLoader.js';
import * as CUP from './UserCup.js';

export class Ride extends THREE.Group{
    constructor(userRig, scene, animatedObjects, baseSpeed, saucersSpeed, cupsSpeed, exhibitPosition) {
        super();

        // Exhibit 5 - TeaCups
        //var exhibit = new THREE.Group();

        // Add landing platform for the exhibit.
        var platform = new USER.UserPlatform(userRig);
        platform.position.x=exhibitPosition[0];
        platform.position.y=exhibitPosition[1];
        platform.position.z=exhibitPosition[2];
        platform.rotation.y = THREE.Math.degToRad(180);
        this.add(platform);

        // Make the shape of a platform.
        var base = new THREE.Mesh(
            new THREE.CylinderGeometry(3.8, 4.8, .3, 32),
            new THREE.MeshPhongMaterial({color: '#ffc0cb'}));
        base.position.y = 0;
        base.position.z= -6;
        //make base rotate
        base.speed = baseSpeed;
        base.setAnimation(
            function (dt){
                base.rotation.y += base.speed * 0.01;
            });
        //animatedObjects.push(base);

        platform.add(base);

        var pillar = new THREE.Mesh(
            new THREE.CylinderGeometry(.1, .1, 2.8, 32),
            new THREE.MeshPhongMaterial({color: '#ff6781'}));
        pillar.position.x = 1.8;
        pillar.position.y = 1.5;
        pillar.position.z = 1.8;
        base.add(pillar);
        var pillar1 = new THREE.Mesh(
            new THREE.CylinderGeometry(.1, .1, 2.8, 32),
            new THREE.MeshPhongMaterial({color: '#ff6781'}));;
        pillar1.position.x = -1.8;
        pillar1.position.y = 1.5;
        pillar1.position.z = -1.8;
        base.add(pillar1);
        var pillar3 = new THREE.Mesh(
            new THREE.CylinderGeometry(.1, .1, 2.8, 32),
            new THREE.MeshPhongMaterial({color: '#ff6781'}));
        pillar3.position.x = -1.8;
        pillar3.position.y = 1.5;
        pillar3.position.z = 1.8;
        base.add(pillar3);
        var pillar2 = new THREE.Mesh(
            new THREE.CylinderGeometry(.1, .1, 2.8, 32),
            new THREE.MeshPhongMaterial({color: '#ff6781'}));
        pillar2.position.x = 1.8;
        pillar2.position.y = 1.5;
        pillar2.position.z = -1.8;
        base.add(pillar2);

        var ceiling = new THREE.Mesh(
            new THREE.CylinderGeometry(2, 3, .2, 32),
            new THREE.MeshPhongMaterial({color: '#ff6781'}));
        ceiling.position.y = 3;
        base.add(ceiling);

        //purple
        var cupBase1 = new THREE.Mesh(
            new THREE.CylinderGeometry(1.2, 1.4, .2, 32),
            new THREE.MeshPhongMaterial({color: '#c938ff'}));
        cupBase1.position.x = 2;
        cupBase1.position.y = .3;
        //make base rotate
        cupBase1.speed = saucersSpeed;
        cupBase1.setAnimation(
            function (dt){
                cupBase1.rotation.y += cupBase1.speed * 0.01;
            });
        //animatedObjects.push(cupBase1);
        base.add(cupBase1);

        //blue
        var cupBase2 = new THREE.Mesh(
            new THREE.CylinderGeometry(1.2, 1.4, .2, 32),
            new THREE.MeshPhongMaterial({color: '#32d9ff'}));
        cupBase2.position.z = 2;
        cupBase2.position.y = .3;
        //make base rotate

        cupBase2.speed = saucersSpeed;
        cupBase2.setAnimation(
            function (dt){
                cupBase2.rotation.y += cupBase2.speed * 0.01;
            });
        //animatedObjects.push(cupBase2);

        base.add(cupBase2);

        //yellow
        var cupBase3 = new THREE.Mesh(
            new THREE.CylinderGeometry(1.2, 1.4, .2, 32),
            new THREE.MeshPhongMaterial({color: '#f4ff62'}));
        cupBase3.position.y = .3;
        //platform.rotation.y = THREE.Math.degToRad(-90);
        cupBase3.position.x= -2;
        //make base rotate

        cupBase3.speed = saucersSpeed;
        cupBase3.setAnimation(
            function (dt){
                cupBase3.rotation.y += cupBase3.speed * 0.01;
            });
        //animatedObjects.push(cupBase3);

        base.add(cupBase3);

        //green
        var cupBase4 = new THREE.Mesh(
            new THREE.CylinderGeometry(1.2, 1.4, .2, 32),
            new THREE.MeshPhongMaterial({color: '#85ff76'}));
        cupBase4.position.y = .3;
        //platform.rotation.y = THREE.Math.degToRad(-90);
        cupBase4.position.z= -2;
        //make base rotate

        cupBase4.speed = saucersSpeed;
        cupBase4.setAnimation(
            function (dt){
                cupBase4.rotation.y += cupBase4.speed * 0.01;
            });
        //animatedObjects.push(cupBase4);

        base.add(cupBase4);

        var cup1 = new CUP.UserCup(userRig);

        //make cup rotate
        cup1.speed = cupsSpeed;
        cup1.setAnimation(
            function (dt){
                cup1.rotation.y += cup1.speed * 0.01;
            });
        cup1.position.x= .6;
        cup1.position.y= .1;
        //animatedObjects.push(cup1);
        cupBase1.add(cup1);

        var cup2 = new CUP.UserCup(userRig);

        //make cup rotate
        cup2.speed = cupsSpeed;
        cup2.setAnimation(
            function (dt){
                cup2.rotation.y += cup2.speed * 0.01;
            });
        cup2.position.z= .6;
        cup2.position.x = 0;
        cup2.position.y= .1;
        //animatedObjects.push(cup2);
        cupBase2.add(cup2);

        var cup3 = new CUP.UserCup(userRig);

        //make cup rotate
        cup3.speed = cupsSpeed;
        cup3.setAnimation(
            function (dt){
                cup3.rotation.y += cup3.speed * 0.01;
            });
        cup3.position.x= -.6;
        cup3.position.y= .1;
        //animatedObjects.push(cup3);
        cupBase3.add(cup3);

        var cup4 = new CUP.UserCup(userRig);

        //make cup rotate
        cup4.speed = cupsSpeed;
        cup4.setAnimation(
            function (dt){
                cup4.rotation.y += cup4.speed * 0.01;
            });
        cup4.position.z= -.6;
        cup4.position.y= .1;
        //animatedObjects.push(cup4);
        cupBase4.add(cup4);

        // Make GUI sign.
        var buttons = [new GUIVR.GuiVRButton("Base Speed", baseSpeed, 0, 10, true,
            function(x){base.speed = x;}), new GUIVR.GuiVRButton("Purple Cup", cupsSpeed, 0, 10, true,
            function(x){cup1.speed = x;}), new GUIVR.GuiVRButton("Blue Cup", cupsSpeed, 0, 10, true,
            function(x){cup2.speed = x;}), new GUIVR.GuiVRButton("Yellow Cup", cupsSpeed, 0, 10, true,
            function(x){cup3.speed = x;}), new GUIVR.GuiVRButton("Green Cup", cupsSpeed, 0, 10, true,
            function(x){cup4.speed = x;}), new GUIVR.GuiVRButton("Purple Saucer", saucersSpeed, 0, 10, true,
            function(x){cupBase1.speed = x;}), new GUIVR.GuiVRButton("Blue Saucer", saucersSpeed, 0, 10, true,
            function(x){cupBase2.speed = x;}), new GUIVR.GuiVRButton("Yellow Saucer", saucersSpeed, 0, 10, true,
            function(x){cupBase3.speed = x;}), new GUIVR.GuiVRButton("Green Saucer", saucersSpeed, 0, 10, true,
            function(x){cupBase4.speed = x;})];
        var sign = new GUIVR.GuiVRMenu(buttons);
        sign.position.x = 2.2;
        sign.position.z = -2;
        sign.position.y = 1;
        platform.add(sign);
        //userRig.add(sign);

        var button1 = [new GUIVR.GuiVRButton("Cup Speed", cupsSpeed, 0, 10, true,
            function(x){cup1.speed = x;}), new GUIVR.GuiVRButton("Saucer Speed", saucersSpeed, 0, 10, true,
            function(x){cupBase1.speed = x;})];
        var sign1 = new GUIVR.GuiVRMenu(button1);
        sign1.position.x = .6;
        sign1.position.z = -1.2;
        sign1.position.y = 0.9;
        cup1.add(sign1);

        var button2 = [new GUIVR.GuiVRButton("Cup Speed", cupsSpeed, 0, 10, true,
            function(x){cup2.speed = x;}), new GUIVR.GuiVRButton("Saucer Speed", saucersSpeed, 0, 10, true,
            function(x){cupBase2.speed = x;})];
        var sign2 = new GUIVR.GuiVRMenu(button2);
        sign2.position.x = .6;
        sign2.position.z = -1.2;
        sign2.position.y = 0.9;
        cup2.add(sign2);

        var button3 = [new GUIVR.GuiVRButton("Cup Speed", cupsSpeed, 0, 10, true,
            function(x){cup3.speed = x;}), new GUIVR.GuiVRButton("Saucer Speed", saucersSpeed, 0, 10, true,
            function(x){cupBase3.speed = x;})];
        var sign3 = new GUIVR.GuiVRMenu(button3);
        sign3.position.x = .6;
        sign3.position.z = -1.2;
        sign3.position.y = 0.9;
        cup3.add(sign3);

        var button4 = [new GUIVR.GuiVRButton("Cup Speed", cupsSpeed, 0, 10, true,
            function(x){cup4.speed = x;}), new GUIVR.GuiVRButton("Saucer Speed", saucersSpeed, 0, 10, true,
            function(x){cupBase4.speed = x;})];
        var sign4 = new GUIVR.GuiVRMenu(button4);
        sign4.position.x = .6;
        sign4.position.z = -1.2;
        sign4.position.y = 0.9;
        cup4.add(sign4);


        // Load the kettle
        var objLoader = new OBJLoader();
        objLoader.load(
            'js/rides/piconik/kettle.obj',
            function ( obj ) {
                // Scale and add to the rig once loaded.
                obj.scale.x = 9.1;
                obj.scale.y = 9.1;
                obj.scale.z = 9.1;
                obj.position.y= 3;
                //animatedObjects.push(obj);
                base.add(obj);
            },
            function (xhr){
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error){
                console.log('An error happened');
            }
        );


        // Pose exhibit.
        //exhibit.position.z = -6;

        //scene.add(exhibit);

    }
}
