import * as THREE from '../../../../extern/build/three.module.js';
import { Milk } from './Milk.js'

export class Target extends THREE.Group {
  constructor(depth, height, width, color) {
    super();

    this.depth = depth;
    this.height = height;
    this.width = width;

    var boxGeometry = new THREE.BoxGeometry(this.depth, this.height, this.width);
    var boxMaterial = new THREE.MeshPhongMaterial( {color: 0xa0a0a0} );
    var box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.rotation.y = THREE.Math.degToRad(90);
    box.position.y = height / 2;

    var milk = new Milk(color);
    milk.position.z = 4.5;
    milk.position.x = 0.175;

    var smallGeometry = new THREE.BoxGeometry(.1, .1, .1);
    var smallMaterial = new THREE.MeshPhongMaterial( {color: 0xa0a0a0} );
    var small = new THREE.Mesh(smallGeometry, smallMaterial);

    small.add(milk);

    this.boxCollided = false;

    small.setAnimation(
      function (dt){
        if (this.t == undefined) {
          this.t = 0;
        }
        this.t = this.t + dt;

        if (this.boxCollided && this.rotation.x >= THREE.Math.degToRad(-85)) {
          this.rotation.x += THREE.Math.degToRad(-5);
        }
      })

    this.add(small);
  }

  getHeight() {
    return this.height;
  }

  getWidth() {
    return this.width;
  }

  getDepth() {
    return this.depth;
  }
}
