import * as THREE from '../../../extern/build/three.module.js';
import * as USER from '../../User.js';
import * as GUIVR from '../../GuiVR.js';
import {GLTFLoader} from '../../../extern/examples/jsm/loaders/GLTFLoader.js';


class RidePillar extends THREE.Mesh {
  constructor(height, texture) {
      super(
          new THREE.CylinderGeometry(0.25, 0.25, height, 15),
          new THREE.MeshPhongMaterial({map: texture, color: 0x0091ff})
          //new THREE.MeshPhongMaterial({color: 0xff0000})
      );
      this.translateY(height / 2);
  }
}


class RidePlatform extends GUIVR.GuiVR {
  constructor(offsetY, userRig, signRig) {
    super();
    this.userRig = userRig;
    this.signRig = signRig;
    this.userIsOn = false;
    this.collider = null;
    this.hasCollider = false;
    this.offsetY = offsetY;
    this.addTrigger();
    this.seats = [];
    this.color = new THREE.Color(
        Math.random(), Math.random(), Math.random()).getHex();

    let loader = new GLTFLoader().setPath('extern/models/plane_seat/');

    const PLATFORM_HEIGHT = 0.5;

    let geometry = new THREE.CubeGeometry(0.5, PLATFORM_HEIGHT, 2.5);
    let material = new THREE.MeshPhongMaterial({color: this.color});
    let platform = new THREE.Mesh(geometry, material);
    platform.translateY(0.25 + offsetY)
    platform.translateZ(1.5);
    this.add(platform);

    geometry = new THREE.CubeGeometry(0.5, 0.21, 0.59);
    let platform2 = new THREE.Mesh(geometry, material);
    platform2.translateY(0.6 + offsetY);
    platform2.translateZ(2.455)
    this.add(platform2);

    // Load a glTF resource
    loader.load(
        // resource URL
        //'Duck.gltf',
        'scene.gltf',
        // called when the resource is loaded
        (gltf) => {
          gltf.scene.scale.set(0.01, 0.01, 0.01);
          gltf.scene.rotateY(Math.PI);
          const box = new THREE.Box3().setFromObject( gltf.scene );
          const center = box.getCenter( new THREE.Vector3() );
          gltf.scene.position.x += ( gltf.scene.position.x - center.x );
          gltf.scene.position.y += ( gltf.scene.position.y - center.y );
          gltf.scene.position.z += ( gltf.scene.position.z - center.z );
            
          //gltf.scene.translateY(1.09 + PLATFORM_HEIGHT);
          gltf.scene.translateY(1.3 + PLATFORM_HEIGHT);
          gltf.scene.translateZ(-2.475);
          this.add(gltf.scene);

          gltf.animations; // Array<THREE.AnimationClip>
          gltf.scene; // THREE.Scene
          gltf.scenes; // Array<THREE.Scene>
          gltf.cameras; // Array<THREE.Camera>
          gltf.asset; // Object
          //this.userRig.translateZ(1);
        },
        // called while loading is progressing
        (xhr) => {
            //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        (error) => {
          console.log( 'An error happened' );
          console.log(error);
        }
    );
  }

  addTrigger() {
    if (this.hasCollider === false) {
      let geometry = new THREE.CubeGeometry(0.84, 1.2, 0.78);
      let material = new THREE.MeshBasicMaterial({color: 0xff0000});
      material.transparent = true;
      material.opacity = 0.0;
      let trigger = new THREE.Mesh(geometry, material);
      trigger.translateY(0.6 + this.offsetY + 0.5);
      trigger.translateZ(2.475)
      this.add(trigger);
      this.collider = trigger;
      this.hasCollider = true;
    }
  }

  removeTrigger() {
    if (this.hasCollider === true) {
      this.remove(this.collider);
      this.collider = new THREE.Group();
      this.hasCollider = false;
    }
  }

  collide(uv, pt) {
    // When the user clicks on this platform, move the user to it.
    if (this.userIsOn === false) {

      if (this.userRig.jirisGui === null) {
        this.userRig.add(this.signRig);
        this.userRig.jirisGui = this.signRig;
      } else {
        this.userRig.remove(this.userRig.jirisGui);
        this.userRig.add(this.signRig);
        this.userRig.jirisGui = this.signRig;
      }

      this.add(this.userRig);
      if (this.userRig.position.z === 0.0) {
        this.userRig.translateZ(1.75);
        this.userRig.translateY(1);
      }
      
      for (let i = 0; i < this.seats.length; ++i) {
        this.seats[i].addTrigger();
        this.seats[i].userIsOn = false;
      }
      this.removeTrigger();
      this.userIsOn = true;
    }
  }
}


class MyGuiVRButton extends GUIVR.GuiVRButton {
  constructor(label, initVal, minVal, maxVal, isInt, updateCallback) {
    super(label, initVal, minVal, maxVal, isInt, updateCallback);

    this.label = label;
    this.val = initVal;
    this.minVal = minVal;
    this.maxVal = maxVal;
    this.isInt = isInt;
    this.updateCallback = updateCallback;

    this.updateCallback(this.val);
    
    this.w = 1;
    this.h = 0.2;
    // Create canvas that will display the button.
    this.ctx = document.createElement('canvas').getContext('2d');
    this.ctx.canvas.width = 600;
    this.ctx.canvas.height = Math.floor(this.ctx.canvas.width * this.h / this.w);
    // Create texture from canvas.
    this.texture = new THREE.CanvasTexture(this.ctx.canvas);
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.minFilter = THREE.LinearFilter;
    this.updateTexture();
    this.meshMaterial = new THREE.MeshBasicMaterial({color: 0xAAAAAA});
    this.meshMaterial.map = this.texture;
    // Create rectangular mesh textured with the button that is displayed.
    this.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.w, this.h), this.meshMaterial);
    this.add(this.mesh);
  }
}


class PreviewPlatform extends GUIVR.GuiVR {
  constructor(userRig, signRig, seats) {
    super();
    this.userRig = userRig;
    this.signRig = signRig;
    this.seats = seats;

    // create platform
    let platform = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 1, 32),
        new THREE.MeshPhongMaterial({color: 0x0000FF})
    );

    let front = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.1, 32),
        new THREE.MeshPhongMaterial({color: 0x00FF00})
    );

    front.translateY(0.55);
    front.translateZ(-1);
    this.add(front);
    this.add(platform);

    this.collider = platform;
  }

  collide(uv, pt) {
    this.add(this.userRig);

    this.userRig.remove(this.userRig.jirisGui);
    this.userRig.jirisGui = null;

    //if (this.signRig)
    //this.userRig.add(this.signRig);

    for (let i = 0; i < this.seats.length; ++i) {
      this.seats[i].addTrigger();
      this.seats[i].userIsOn = false;
    }

    if (this.userRig.position.z === 1.75) {
      this.userRig.translateZ(-1.75);
      this.userRig.translateY(-1);
    }
  }
}


export class Ride extends THREE.Group {
  constructor(userRig, relPos = new THREE.Vector3(0, 0, -5), relRot = new THREE.Vector3(0, 0, 0), radius = 10, seatsAmt = 5) {
    super();
    this.userRig = userRig;
    this.radius = radius;
    if (seatsAmt < 1) {
      this.seatsAmt = 1;
    } else if (seatsAmt > 4 * radius / 5) {
      this.seatsAmt = Number(4 * radius / 5);
    } else {
      this.seatsAmt = seatsAmt;
    }
    this.relPos = relPos;
    this.relRot = relRot;

    if (this.userRig.hasOwnProperty('jirisGui') === false) {
      this.userRig.jirisGui = null;
    }

    this.seats = [];

    this.rotateX(this.relRot.x);
    this.rotateY(this.relRot.y);
    this.rotateZ(this.relRot.z);

    this.translateX(this.relPos.x);
    this.translateY(this.relPos.y);
    this.translateZ(this.relPos.z);

    this.exhibit = new THREE.Group();
    this.exhibit.translateZ(-radius - 5)
    this.add(this.exhibit);
    this.rigs = [];

    // Make GUI sign.
    this.signRig = new THREE.Group();
    let buttons = [
      new MyGuiVRButton("outer speed", 0, 0, 100, true, (x) => {
          this.speed = 2 * x / 300;
      }),
      new MyGuiVRButton("inner speed", 0, 0, 100, true, (x) => {
        for (let i = 0; i < this.rigs.length; ++i) {
          this.rigs[i].speed = -2 * x / 300;
        }
      }),
    ];

    let sign = new GUIVR.GuiVRMenu(buttons);
    sign.position.x = 1;
    sign.position.z = -2;
    sign.position.y = 0.2;
    this.signRig.add(sign);

    this.buildPlatform();
    this.buildRide();

    this.exhibit.setAnimation((dt) => {
      this.exhibit.rotateY(dt * this.speed);
    });
  }

  buildPlatform() {
    this.previewPlatform =
        new PreviewPlatform(this.userRig, this.signRig, this.seats);
    this.add(this.previewPlatform);
  }

  buildRide() {
    let geometry = new THREE.CylinderGeometry(this.radius, this.radius, 0.5, 50);
    let texture = new THREE.TextureLoader()
        .load('extern/textures/smiley.svg');
      
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);

    let material = new THREE.MeshPhongMaterial({map: texture});
    //let material = new THREE.MeshPhongMaterial({color: 0xffff00, map: texture});
    //let material = new THREE.MeshPhongMaterial({color: 0xffff00});
    let cylinder = new THREE.Mesh(geometry, material);
    cylinder.translateY(0.25);
    
    this.exhibit.add(cylinder);

    for (let i = 0; i < this.seatsAmt; ++i) {
      let rig = new THREE.Group();
      rig.translateY(0.5);

      let texture = new THREE.TextureLoader()
          .load('extern/textures/brushed_metal.jpg');
      
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);

      const RIDE_PILLAR_HEIGHT = 0.5;
      rig.add(new RidePillar(2 * RIDE_PILLAR_HEIGHT, texture));

      let platform =
          new RidePlatform(RIDE_PILLAR_HEIGHT, this.userRig, this.signRig);
      this.seats.push(platform);
      rig.add(platform);

      rig.rotateY(i * 2 * Math.PI / this.seatsAmt);
      rig.translateX(this.radius * 3 / 4);
      //rig.rotateY(-i * 2 * Math.PI / this.seatsAmt + Math.PI);
      rig.rotateY(Math.random() * 2 * Math.PI);

      rig.speed = 0;
      rig.setAnimation((dt) => {
        rig.rotateY(dt * rig.speed);
      });

      this.exhibit.add(rig);
      this.rigs.push(rig);
    }
    for (let i = 0; i < this.seats.length; ++i) {
      this.seats[i].seats = this.seats;
    }
  }
}
