import * as THREE from '../../../../extern/build/three.module.js';
import * as GUIVR from '../../../GuiVR.js';
import CapsuleBufferGeometry from '../../../../extern/CapsuleGeometry.js';
import { Memorizer } from '../util.js';
import { Platform } from '../User.js';

class Booth extends Platform {
  constructor(userRig, sign, parent, onLand, onLeave) {
    const handleLand = () => { if (onLand) onLand(); this.handleLand() };
    const handleLeave = () => { if (onLeave) onLeave(); this.handleLeave() };
    super(userRig, handleLand, handleLeave);

    this.userRig = userRig;
    
    var geometry = Booth.createGeometry('boothGeometry', () => {
      var geometry = new CapsuleBufferGeometry(1, 1, 2, 8, 1, 7, 7);
      geometry.rotateX(Math.PI / 2);
      return geometry;
    });

    var material = new THREE.MeshStandardMaterial({ color: 0x555555, side: THREE.DoubleSide });

    this.mesh = new THREE.Mesh(geometry, material);
    this.add(this.mesh);

    var geometry = new THREE.SphereBufferGeometry(1, 10, 10);
    var material = new THREE.MeshStandardMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
    material.transparent = true;
    material.opacity = 0;
    this.collider = new THREE.Mesh(geometry, material);
    this.add(this.collider);

    this.wheel = parent;

    this.chair = new THREE.Group();
    this.chair.position.y = -1;
    this.add(this.chair);

    this.sign = sign;
  }

  handleLand() {

    this.collider.visible = false;

    this.wheel.currentBooth = this;
    
    this.chair.add(this.userRig);

    this.mesh.visible = false;
    this.mesh.material.transparent = true;
    this.mesh.material.opacity = 0.2;

    this.add(this.sign);
  }

  handleLeave() {
    console.log('handleLeave');

    this.collider.visible = true;

    this.wheel.defaultPlatform.add(this.userRig);

    this.mesh.visible = true;
    this.mesh.material.transparent = false;
    this.mesh.material.opacity = true;

    this.remove(this.sign);
  }
}

Memorizer(Booth);

export default Booth;
