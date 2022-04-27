// Author: Ryan Kaplan
// CSC 385 Computer Graphics
// Version: Winter 2020
// Project 2: User classes
//


import * as THREE from '../../../extern/build/three.module.js';
import * as USER from '../../User.js';
import * as GUIVR from '../../GuiVR.js';
import * as PLAT from'./ryanPlatform.js';

export class ryanExhibit extends THREE.Group {

    constructor(userRig, animatedObjects, spinSpeed, verticalSpeed){
  	super();

    var verticalSpeed1 = verticalSpeed;
    var verticalSpeed2 = verticalSpeed;
    var verticalSpeed3 = verticalSpeed;
    var verticalSpeed4 = verticalSpeed;

    var ryanGroup = new THREE.Group();

    var platform = new USER.UserPlatform(userRig);
    platform.position.set(0,0,15);


    var buttons = [new GUIVR.GuiVRButton("Spin", spinSpeed, 0, 10, true,
					 function(x){spinSpeed = x/10;})];
    var sign = new GUIVR.GuiVRMenu(buttons);
    sign.position.x = 0;
    sign.position.z = -2;
    sign.position.y = 1;
    platform.add(sign);

    ryanGroup.add(platform);

  	// Make the shape of a tower.
  	var tower = new THREE.Mesh(
  	    new THREE.CylinderGeometry(.00001, 7, 15, 4),
  	    new THREE.MeshPhongMaterial({color: 0x272727}));

        tower.position.set(0,7.5,0);
        tower.rotateZ(THREE.Math.degToRad(180));
        tower.setAnimation(
    	function (dt){
    	    tower.rotateY(THREE.Math.degToRad(spinSpeed));
    	});
	//animatedObjects.push(tower);
    ryanGroup.add(tower);

    // Make the shape of a second tower.
    var tower2 = new THREE.Mesh(
        new THREE.CylinderGeometry(.00001, 7, 5, 4),
        new THREE.MeshPhongMaterial({color: 0xFFFFFF}));

        tower2.position.set(0,15,0);
        tower2.rotateZ(THREE.Math.degToRad(180));
        tower2.setAnimation(
      function (dt){
          tower2.rotateY(THREE.Math.degToRad(-spinSpeed));
      });
	//animatedObjects.push(tower2);
    ryanGroup.add(tower2);

    var pole1 = new THREE.Mesh(
  	    new THREE.CylinderGeometry(.2, .2, 7, 30),
  	    new THREE.MeshPhongMaterial({color: 0xFF0000}));
    pole1.position.set(4.5,3,0);
    pole1.rotateZ(THREE.Math.degToRad(-90));
    var goingUp = false;
    pole1.setAnimation(
      function(dt){
      if ((pole1.position.y < 5) && (goingUp == true)){
       pole1.position.y += verticalSpeed1;
      }
      if ((pole1.position.y > 5) && (goingUp == true)){
       goingUp = false;
      }
      if ((pole1.position.y > -5) && (goingUp == false)){
       pole1.position.y += -verticalSpeed1;
      }
      if ((pole1.position.y < -5) && (goingUp == false)){
       goingUp = true;
      }
      });
	//animatedObjects.push(pole1);
    tower.add(pole1);

    var platform1 = new PLAT.ryanPlatform(0xFF0000,userRig);
    pole1.add(platform1);
    platform1.rotateZ(THREE.Math.degToRad(-90));
    platform1.position.set(0,3.5,0);

    var buttons1 = [new GUIVR.GuiVRButton("Bounce", verticalSpeed, 0, 10, true,
					 function(x){verticalSpeed1 = x/200;})];
    var sign1 = new GUIVR.GuiVRMenu(buttons1);
    sign1.position.x = 0;
    sign1.position.z = -2;
    sign1.position.y = 1;
    platform1.add(sign1);

    var pole2 = new THREE.Mesh(
  	    new THREE.CylinderGeometry(.2, .2, 7, 30),
  	    new THREE.MeshPhongMaterial({color: 0x27FF00}));
    pole2.position.set(-4.5,-3,0);
    pole2.rotateZ(THREE.Math.degToRad(-90));
    var goingUp2 = false;
    pole2.setAnimation(
      function(dt){
      if ((pole2.position.y < 5) && (goingUp2 == true)){
       pole2.position.y += verticalSpeed2;
      }
      if ((pole2.position.y > 5) && (goingUp2 == true)){
       goingUp2 = false;
      }
      if ((pole2.position.y > -5) && (goingUp2 == false)){
       pole2.position.y += -verticalSpeed2;
      }
      if ((pole2.position.y < -5) && (goingUp2 == false)){
       goingUp2 = true;
      }
      });
	///animatedObjects.push(pole2);
    tower.add(pole2);

    var platform2 = new PLAT.ryanPlatform(0x27FF00,userRig);
    pole2.add(platform2);
    platform2.rotateZ(THREE.Math.degToRad(-90));
    platform2.rotateY(THREE.Math.degToRad(180));
    platform2.position.set(0,-3.5,0);

    var buttons2 = [new GUIVR.GuiVRButton("Bounce", verticalSpeed, 0, 10, true,
					 function(x){verticalSpeed2 = x/200;})];
    var sign2 = new GUIVR.GuiVRMenu(buttons2);
    sign2.position.x = 0;
    sign2.position.z = -2;
    sign2.position.y = 1;
    platform2.add(sign2);


    var pole3 = new THREE.Mesh(
  	    new THREE.CylinderGeometry(.2, .2, 7, 30),
  	    new THREE.MeshPhongMaterial({color: 0xFFFF00}));
    pole3.position.set(0,3,-4.5);
    pole3.rotateZ(THREE.Math.degToRad(-90));
    pole3.rotateX(THREE.Math.degToRad(-90));
    var goingUp3 = true;
    pole3.setAnimation(
      function(dt){
      if ((pole3.position.y < 5) && (goingUp3 == true)){
       pole3.position.y += verticalSpeed3;
      }
      if ((pole3.position.y > 5) && (goingUp3 == true)){
       goingUp3 = false;
      }
      if ((pole3.position.y > -5) && (goingUp3 == false)){
       pole3.position.y += -verticalSpeed3;
      }
      if ((pole3.position.y < -5) && (goingUp3 == false)){
       goingUp3 = true;
      }
      });
	//animatedObjects.push(pole3);
    tower.add(pole3);


    var platform3 = new PLAT.ryanPlatform(0xFFFF00,userRig);
    pole3.add(platform3);
    platform3.rotateZ(THREE.Math.degToRad(-90));
    platform3.position.set(0,3.5,0);

    var buttons3 = [new GUIVR.GuiVRButton("Bounce", verticalSpeed, 0, 10, true,
					 function(x){verticalSpeed3 = x/200;})];
    var sign3 = new GUIVR.GuiVRMenu(buttons3);
    sign3.position.x = 0;
    sign3.position.z = -2;
    sign3.position.y = 1;
    platform3.add(sign3);

    var pole4 = new THREE.Mesh(
  	    new THREE.CylinderGeometry(.2, .2, 7, 30),
  	    new THREE.MeshPhongMaterial({color: 0x2700FF}));
    pole4.position.set(0,-3,4.5);
    pole4.rotateZ(THREE.Math.degToRad(-90));
    pole4.rotateX(THREE.Math.degToRad(-90));
    var goingUp4 = true;
    pole4.setAnimation(
      function(dt){
      if ((pole4.position.y < 5) && (goingUp4 == true)){
       pole4.position.y += verticalSpeed4;
      }
      if ((pole4.position.y > 5) && (goingUp4 == true)){
       goingUp4 = false;
      }
      if ((pole4.position.y > -5) && (goingUp4 == false)){
       pole4.position.y += -verticalSpeed4;
      }
      if ((pole4.position.y < -5) && (goingUp4 == false)){
       goingUp4 = true;
      }
      });
	//animatedObjects.push(pole4);
    tower.add(pole4);


    var platform4 = new PLAT.ryanPlatform(0x2700FF,userRig);
    pole4.add(platform4);
    platform4.rotateZ(THREE.Math.degToRad(-90));
    platform4.rotateY(THREE.Math.degToRad(180));
    platform4.position.set(0,-3.5,0);

    var buttons4 = [new GUIVR.GuiVRButton("Bounce", verticalSpeed, 0, 10, true,
					 function(x){verticalSpeed4 = x/200;})];
    var sign4 = new GUIVR.GuiVRMenu(buttons4);
    sign4.position.x = 0;
    sign4.position.z = -2;
    sign4.position.y = 1;
    platform4.add(sign4);



    //tower.rotateY(THREE.Math.degToRad(-180));

    this.add(ryanGroup);
      }




}
