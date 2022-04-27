import * as THREE from '../../../../extern/build/three.module.js';
import * as USER from '../../../User.js';

export class Seat extends USER.UserPlatform {
  constructor(userRig, onLand, onLeave) {
    super(userRig, onLand, onLeave);
    var seat = new THREE.Group();

    // Remove the original seating structure.
    this.children.pop();
    this.children.pop();

    var bottomGeometry = new THREE.BoxGeometry(0.2, 1, 0.75);
    var bottomMaterial = new THREE.MeshPhongMaterial( {color: 0xa0a0a0} );
    var bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);

    bottom.rotation.y = THREE.Math.degToRad(90);
    bottom.rotation.z = THREE.Math.degToRad(-90);

    var backGeometry = new THREE.BoxGeometry(0.2, 1, 1);
    var backMaterial = new THREE.MeshPhongMaterial( {color: 0xa0a0a0} );
    var back = new THREE.Mesh(backGeometry, backMaterial);

    var leftArmGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.2);
    var leftArmMaterial = new THREE.MeshPhongMaterial( {color: 0xa0a0a0} );
    var leftArm = new THREE.Mesh(leftArmGeometry, leftArmMaterial);
    leftArm.position.z = 0.6;
    leftArm.position.y = 0.5;

    var rightArmGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.2);
    var rightArmMaterial = new THREE.MeshPhongMaterial( {color: 0xa0a0a0} );
    var rightArm = new THREE.Mesh(rightArmGeometry, rightArmMaterial);
    rightArm.position.z = -0.6;
    rightArm.position.y = 0.5;

    back.position.x = 0.275;
    back.position.y = 0.6;

    seat.add(bottom);
    seat.add(back);
    seat.add(leftArm);
    seat.add(rightArm);

    seat.rotation.y = THREE.Math.degToRad(-90);

    this.userRig = userRig;
    this.collider = back;

    seat.position.z = 0.5;
    this.add(seat);
  }
}
