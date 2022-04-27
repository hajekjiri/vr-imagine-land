/*
Author: Di Wu
CSC 385 Computer Graphics
Version: Winter 2020
Part1: Rotational Animation Park Ride
*/

import * as THREE from '../../../extern/build/three.module.js';
import { VRButton } from '../../../extern/VRButton.js';
import * as GUIVR from '../../GuiVR.js';
import * as USER from '../../User.js';
import * as ANIMATOR from '../../Animator.js';


export class SkyScreamer extends THREE.Group {

  // Exibit Sky Screamer
  constructor(userRig, rotationVelocity = 1, translationVelocity = 1){

    super();

    var closerLook = new USER.UserPlatform(userRig);
    closerLook.position.z = 8;
    this.add(closerLook);

    // Create a pillar that support the sky screamer
    var pillar = this.initializePillar(0XC2FE39);
    this.add(pillar);

    // initialize base of the tower
    var base = this.initializeBase(0xFFFF00);
    this.add(base);

    // initialize things at the top of the tower
    var decoration = this.initializeDecoration("WoodyTower",0XF782B2);
    decoration.setAnimation(
      function(dt){
        this.rotation.y += 0.005 * rotationVelocity;
      }
    );
    this.add(decoration);

    // Child of spinObj: add the ascending/descending platform
    var geometry = new THREE.RingBufferGeometry(0.2, 1, 6);
    var material = new THREE.MeshPhongMaterial({color: 0XF7CC77,
    side: THREE.DoubleSide});
    var platform = new THREE.Mesh(geometry, material);
    platform.rotation.x = THREE.Math.degToRad(90);

    // Child of armObj: initialize arms using sin curve buffer geometry
    var arms = this.initializeArms(0XF78577, platform.position.y);

    // Child of armObj: initialize seats
    var seat1 = new Seat(userRig);
    var seat2 = new Seat(userRig);
    var seat3 = new Seat(userRig);
    var seat4 = new Seat(userRig);
    seat1.position.x = 3.4;
    seat2.position.x = -3.4;
    seat3.position.z = 3.4;
    seat4.position.z = -3.4;

    // add seat
    arms.add(seat1);
    arms.add(seat2);
    arms.add(seat3);
    arms.add(seat4);

    // Make a GUI sign.
    var buttons = [
      new GUIVR.GuiVRButton("Rot Speed", 1, 0, 5, true,
      function(x){
        platform.rotationSpeed = x;
      }),
      new GUIVR.GuiVRButton("Up Speed", 1, 0, 5, true,
      function(x){
        platform.upSpeed = x;
      }
    )];
    var sign = new GUIVR.GuiVRMenu(buttons);
    sign.position.x = 0;
    sign.position.z = 2;
    sign.position.y = 0.5;
    this.add(sign);

    // construct THREE Group for animation
    var spinObj = new THREE.Group();
    spinObj.add(arms);
    spinObj.add(platform);
    spinObj.position.y = 3;
    var up = true;
    spinObj.setAnimation(
      function(dt){
        this.rotation.y += platform.rotationSpeed * 0.01 * rotationVelocity;
        if (this.position.y >= 9){
          up = false;
        }
        else if (this.position.y <= 3){
          up = true;
        }
        if (up){
          this.position.y += 0.1 * dt * platform.upSpeed * translationVelocity;
        }
        else{
          this.position.y -= 0.1 * dt * platform.upSpeed * translationVelocity;
        }
      }
    );

    this.add(spinObj);
    // Pose skyscreamer
    this.position.z = -20;
  }

  initializePillar(color){
    var pillarGeometry = new THREE.CylinderGeometry(0.2,0.2,20,32);
    var pillarMaterial = new THREE.MeshPhongMaterial({color: color});
    var pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
    pillar.receiveShadow = true;
    return pillar;
  }

  initializeDecoration(title, color){
    var decoration = new THREE.Group();
    // initilize title
    var loader = new THREE.FontLoader();
    loader.load('extern/fonts/helvetiker_bold.typeface.json', function (font){
      var textGeometry = new THREE.TextBufferGeometry('WoodyTower',
      {
        font: font,
        size: 0.5,
        height: 0.8,
        curveSegments: 3,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.08,
        bevelOffset: 0,
        bevelSegments: 1,
      });
      var textMaterial = new THREE.MeshPhongMaterial({color: color, specular: 0x000000});
      var title = new THREE.Mesh(textGeometry, textMaterial);
      title.position.y = 10.8;
      title.receiveShadow = true;
      title.geometry.center();
      decoration.add(title);
    });
    var topGeometry = new THREE.OctahedronBufferGeometry(0.5);
    var topMaterial = new THREE.MeshPhongMaterial({color: color});
    var top = new THREE.Mesh(topGeometry,topMaterial);
    top.position.y = 10;
    top.receiveShadow = true;
    decoration.add(top);
    return decoration;
  }

  initializeArms(color, height){
    var arms = new THREE.Group();
    CustomSinCurve.prototype = Object.create(THREE.Curve.prototype);
    CustomSinCurve.prototype.constructor = CustomSinCurve;
    CustomSinCurve.prototype.getPoint = function(t){
      var tx = t * 3 - 1.5;
      var ty = Math.sin( 2 * Math.PI * t );
      var tz = 0;
      return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
    };
    var path = new CustomSinCurve();

    var armGeometry = new THREE.TubeGeometry(path, 20, 0.12, 100, false);
    var armMaterial = new THREE.MeshPhongMaterial({color: color});
    var arm1 = new THREE.Mesh(armGeometry, armMaterial);
    arm1.position.x = 2;
    arm1.position.y = height;

    var path = new CustomSinCurve();
    var arm2 = new THREE.Mesh(armGeometry, armMaterial);
    arm2.position.x = 0;
    arm2.rotation.y = THREE.Math.degToRad(-90);
    arm2.position.z = 2;
    arm2.position.y = height;

    var path = new CustomSinCurve();
    var arm3 = new THREE.Mesh(armGeometry, armMaterial);
    arm3.position.x = -2;
    arm3.rotation.y = THREE.Math.degToRad(-180);
    arm3.position.y = height;

    var path = new CustomSinCurve();
    var arm4 = new THREE.Mesh(armGeometry, armMaterial);
    arm4.position.x = 0;
    arm4.rotation.y = THREE.Math.degToRad(90);
    arm4.position.y = height;
    arm4.position.z = -2;

    arms.add(arm1);
    arms.add(arm2);
    arms.add(arm3);
    arms.add(arm4);
    return arms;
  }

  initializeBase(color){
    var baseGeometry = new THREE.ConeBufferGeometry(1.5, 3, 32);
    var baseMaterial = new THREE.MeshPhongMaterial({color: color});
    var base = new THREE.Mesh(baseGeometry,baseMaterial);
    return base;
  }
}

function CustomSinCurve(scale){
  THREE.Curve.call(this);
  this.scale = (scale === undefined) ? 1 : scale;
}


class Seat extends USER.UserPlatform {

  constructor(userRig, onLand, onLeave){
    super();
    this.scale.x = 0.3;
    this.scale.y = 0.3;
    this.scale.z = 0.3;
    var points = [];
    for ( var i = 0; i < 10; i ++ ) {
      points.push( new THREE.Vector2(Math.sin(i * 0.15), (i - 3) * 0.1));
    }
    var seatComponent = new THREE.Mesh(
      new THREE.LatheBufferGeometry(points),
      new THREE.MeshPhongMaterial({color: 0XC2FE39}));
    seatComponent.scale.x = 3.5;
    seatComponent.scale.y = 3.5;
    seatComponent.scale.z = 3.5;
    const color = 0xFFFFFF;
    const intensity = 1;
      //const light = new THREE.DirectionalLight(color, intensity);
    this.add(seatComponent);
      //this.add(light);
    this.collider = seatComponent;
    this.userRig = userRig;
  	this.onLand = onLand;
  	this.onLeave = onLeave;
  }
}
