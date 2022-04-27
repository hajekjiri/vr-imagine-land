import * as THREE from '../../../../extern/build/three.module.js';

export class Ball extends THREE.Group {
    constructor() {
      super();

    	this.radius = 0.15;
    	var topGeo = new THREE.SphereGeometry(this.radius, 64, 64, 0, Math.PI);
    	var topMaterial = new THREE.MeshPhongMaterial( {color: 0xffffff} );
    	var top = new THREE.Mesh(topGeo, topMaterial);
      this.add(top);

    	var bottomGeo = new THREE.SphereGeometry(this.radius , 64, 64, 0, Math.PI);
    	var bottomMaterial = new THREE.MeshPhongMaterial( {color: 0x8d021f} );
    	var bottom = new THREE.Mesh(bottomGeo, bottomMaterial);
    	bottom.rotation.y = THREE.Math.degToRad(180);
      this.add(bottom);
      this.rotation.x = THREE.Math.degToRad(90);
      }

      getRadius() {
        return this.radius;
      }
    }
