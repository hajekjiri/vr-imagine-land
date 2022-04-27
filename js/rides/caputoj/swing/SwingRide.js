import * as THREE from '../../../../extern/build/three.module.js';
import * as GUIVR from '../../../GuiVR.js';
import * as USER from '../../../User.js';
import { SwingArm } from './SwingArm.js'

export class SwingRide extends THREE.Group {
    constructor(userRig, height, seats, maxLift, maxSpin, maxSwing) {
      super();

      // Default parameter values.
      height = height === undefined ? 50 : height;
      seats = seats === undefined ? 20 : seats;
      maxLift = (maxLift === undefined) ? 3 : maxLift;
      maxSpin = (maxSpin === undefined || maxSpin > 5) ? 5 : maxSpin;
      maxSwing = (maxSwing === undefined) ? 3 : maxSwing;

      if (maxLift > 5) {
        maxLift = 5;
      }
      if (maxSwing > 5) {
        maxSwing = 5;
      }

      var ride = new THREE.Group();
      // Add landing platform for the ride.
      ride.add(new USER.UserPlatform(userRig, function() {
        userRig.add(rideSign);
      }, function() {
        userRig.remove(rideSign);
      }));

      // Add stand.
      var standGeometry = new THREE.CylinderGeometry(.30, .30, height, 64);
      var standMaterial = new THREE.MeshPhongMaterial( {color: 0x9b3c31} );
      var stand = new THREE.Mesh(standGeometry, standMaterial);
      stand.position.y = height / 2;
      stand.position.z = -10;
      ride.add(stand);

      var knobGeo = new THREE.SphereGeometry(1, 64, 64);
    	var knobMaterial = new THREE.MeshPhongMaterial( {color: 0x9b3c31} );
    	var knob = new THREE.Mesh(knobGeo, knobMaterial);
      knob.position.y = height + 1;
      knob.position.z = stand.position.z;
      ride.add(knob)

      var swing = new THREE.Group();

      // Add moving platform.
      var swingPlatform = new THREE.Group();

      var swingGeometry = new THREE.CylinderGeometry(4, 4, 0.2, 64);
      var swingMaterial = new THREE.MeshPhongMaterial( {color: 0x2222ff} );
      var swingPlatform1 = new THREE.Mesh(swingGeometry, swingMaterial);
      var swingPlatform2 = new THREE.Mesh(swingGeometry, swingMaterial);

      swingPlatform1.position.y = 1.6;
      swingPlatform2.position.y = 1.3;

      var swingGeometry = new THREE.CylinderGeometry(3.5, 3.5, 0.3, 64);
      var swingMaterial = new THREE.MeshPhongMaterial( {color: 0x00008b} );
      var swingMain = new THREE.Mesh(swingGeometry, swingMaterial);

      swingMain.position.y = 1.45;

      swingPlatform.add(swingPlatform1);
      swingPlatform.add(swingPlatform2);
      swingPlatform.add(swingMain);

      var currentSwings = 0;
      var manySwings = seats;
      var rotation = 0;

      while (currentSwings < manySwings) {

        var swingAndArm = new THREE.Group();

        var swingArm = new SwingArm(userRig,
          function() { userRig.add(rideSign); },
          function() { userRig.remove(rideSign); });
        swingArm.position.x = 5.4;
        swingArm.position.y = 0.5;

        swingAndArm.add(swingArm);

        swingAndArm.rotation.y = THREE.Math.degToRad(rotation);
        swing.add(swingAndArm);

        rotation += (360 / seats);
        currentSwings += 1;
      }

      this.maxLift = Math.abs(maxLift);
      this.maxSpin = Math.abs(maxSpin);
      this.maxSwing = Math.abs(maxSwing);

      var rideButtons = [
        new GUIVR.GuiVRButton("Lift", 0, maxLift * -1, maxLift, true,function(x){swing.lift = x;}),
        new GUIVR.GuiVRButton("Spin", 0, 0, maxSpin, true,function(x){swing.spin = x;}),
        new GUIVR.GuiVRButton("Swing", 0, maxSpin * -1, maxSpin, true,function(x){
          var childrenArray = swing.children.length - 1;
          for (var i = 0; i < childrenArray; i++) {
            swing.children[i].children[0].children[0].children[1].spin = x;
          }
          })];
      var rideSign = new GUIVR.GuiVRMenu(rideButtons);
      rideSign.position.x = 1;
      rideSign.position.y = 1;
      rideSign.position.z = -1;

      swing.add(swingPlatform);

      swing.rotation.y = THREE.Math.degToRad(-90);
      swing.lift = 0; // new member variable to track speed
      swing.spin = 0;
      swing.position.z = -5;

      // Set animation function to move from y=0 to y=50.

      // TODO: Make the rise function more natural; give it acceleration
      // and max velocity
      swing.setAnimation(
        function (dt){
          if (this.t == undefined) {
            this.t = 0;
          }
          this.t = this.t + dt;


          if (this.acceleration == undefined
              || Math.abs(this.lift) == 0
              || (this.prevLift > 0 && this.lift < 0)
              || (this.prevLift < 0 && this.lift > 0)) {
            this.acceleration = 0;
          }
          if (Math.abs(this.lift) > 0 && this.acceleration < 1) {
            this.acceleration += 0.01;
          }

          if (this.prevLift == undefined) {
            this.prevLift = 0;
          }

          // Change y position of ride.
          if ((this.position.y >= height - 1.5 && this.lift > 0) ||
          (this.position.y <= 0 && this.lift < 0)) {
            this.lift = 0;
          } else {
            this.position.y += dt * this.lift * this.acceleration;
          }

          this.prevLift = this.lift;

          // Change spin of ride.
          this.rotation.y += THREE.Math.degToRad(dt * this.spin);
        });

        swing.position.z = -10;
        ride.add(swing);

        this.add(ride);
    }
}
