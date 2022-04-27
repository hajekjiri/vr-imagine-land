import * as THREE from '../../../../extern/build/three.module.js';
import { Seat } from './Seat.js'

export class SwingArm extends THREE.Group {
    constructor(userRig, onLand, onLeave) {
      super();

      var swingArm = new THREE.Group();

      var armGeometry = new THREE.CylinderGeometry(.05, .05, 2, 64);
      var armMaterial = new THREE.MeshPhongMaterial( {color: 0x4b8b3b} );
      var arm1 = new THREE.Mesh(armGeometry, armMaterial);

      arm1.position.x = -1;
      arm1.rotation.z = THREE.Math.degToRad(-30);

      swingArm.add(arm1);

      var bottomSwing = new THREE.Group();

      var arm2Geometry = new THREE.CylinderGeometry(.05, .05, 3, 64);
      var arm2Material = new THREE.MeshPhongMaterial( {color: 0x4b8b3b} );
      var arm2 = new THREE.Mesh(arm2Geometry, arm2Material);

      arm2.position.y = -1.5;

      bottomSwing.add(arm2);

      var hingeGeo = new THREE.SphereGeometry(0.15, 64, 64);
      var hingeMaterial = new THREE.MeshPhongMaterial( {color: 0x4b8b3b} );
      var hinge = new THREE.Mesh(hingeGeo, hingeMaterial);

      bottomSwing.add(hinge);

      var swingSeat = new Seat(userRig, onLand, onLeave);
      swingSeat.position.y = -3;
      swingSeat.position.z = -0.8;

      bottomSwing.add(swingSeat);

      bottomSwing.position.x = -0.525;
      bottomSwing.position.y = 0.8;

      bottomSwing.spin = 0;

      bottomSwing.setAnimation(
        function (dt){
          if (this.t == undefined) {
            this.t = 0;
          }
          this.t = this.t + dt;

          // Change rotation of ride.
          if ((this.spin > 0 && this.rotation.z >= 1) ||
            (this.spin < 0 && this.rotation.z <= 0)) {
            this.rotation.z += 0;
          } else {
            this.rotation.z += THREE.Math.degToRad(dt * this.spin);
          }
        });

      swingArm.add(bottomSwing);

      swingArm.position.y = 2;

      this.add(swingArm);
    }
  }
