import * as THREE from '../../../extern/build/three.module.js';
import * as GUIVR from '../../GuiVR.js';

const EASY=1;
const MED=2;
const HARD=3;
//from https://discoverthreejs.com/book/first-steps/shapes-transformations/
//https://hacks.mozilla.org/2016/03/build-the-virtual-reality-web-with-a-frame/

export class Buck extends THREE.Group {

    constructor(userRig,color){
  super();
  this.createMeshes(color);
}

   createMaterials(color) {

    const body = new THREE.MeshStandardMaterial( {
      //color: 0x29b868,
      color: color,
      flatShading: true,
    } );

      body.color.convertSRGBToLinear();

    const detail = new THREE.MeshStandardMaterial( {
      //color: 0xb89529,
      color: color,
      flatShading: true,
    } );
    detail.color.convertSRGBToLinear();

    return {

      body,
      detail,

    };
}

//all the shapes for the duck
  createGeometries() {

    const head = new THREE.SphereBufferGeometry( 0.2,3.1,3.1);

    const body = new THREE.SphereBufferGeometry( 0.5,3.1,3.1);

    const nose = new THREE.CylinderBufferGeometry( 0.03, 0.40, 6);

    return {
      head,
      body,
      nose,
    };

    }

// create a Group to hold the pieces of the full Mesh
 createMeshes(color) {

    const materials = this.createMaterials(color);
    const geometries = this.createGeometries();

    const head = new THREE.Mesh( geometries.head, materials.body );

    const body = new THREE.Mesh( geometries.body, materials.body );

    const nose = new THREE.Mesh( geometries.nose, materials.detail );

    this.add(

      head,
      nose,
      body,

    );
  }
  /////////

  // Set animation function to repeatedly move by a variable called speed.
   setSpeed(speed)
  {
    //difficulty of the game is determined by the speed
    this.setAnimation(
  	function (dt){
      if (this.t == undefined) {
    this.t = 0;
      }
      this.t = this.t + dt;
      this.position.x += dt * (speed/2);
      this.position.x = ((this.position.x + 5) % 10) - 5;
  	});
  }

  // mapping the difficulty level to its respective speed of the car
  setDifficulty(difLevel)
  {
    if (difLevel==EASY)
    {
      this.setSpeed(EASY);
    }
    else if (difLevel==MED)
    {
      this.setSpeed(MED);
    }
    else {
      this.setSpeed(HARD);
    }
  }
    }
