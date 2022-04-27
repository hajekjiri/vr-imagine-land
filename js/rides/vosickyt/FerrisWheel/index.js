import * as THREE from '../../../../extern/build/three.module.js';
//import Animator from '../../../Animator.js';
import * as START_USER from '../../../User.js';
import * as GUIVR from '../GuiVR.js';
import { BufferGeometryUtils } from '../../../../extern/examples/jsm/utils/BufferGeometryUtils.js';
import { distance, Memorizer } from '../util.js';
import Booth from './Booth.js';

export class FerrisWheel extends THREE.Group {
  constructor(userRig, defaults = {}) {
    super();

      let defaultPlatform = new START_USER.UserPlatform(userRig);
      this.add(defaultPlatform);
      this.defaults = defaults;
      
      this.defaultPlatform = defaultPlatform;
    this.userRig = userRig;
    this.speed = 1;
    this.quantity = 12;
    this.booths = [];

    this.numbers = {};
    this.numbers.height = 19;
    this.numbers.radius = 14;
    this.numbers.distanceBetween = 1.5;
    this.numbers.innerRadius = this.numbers.radius - this.numbers.distanceBetween;
    this.numbers.tubeSize = 0.2;
    this.numbers.handleLength = 5;
    this.numbers.handleRadius = 1;
    this.numbers.cableStrength = 0.05;
    
    this.container = new THREE.Group();
    this.container.scale.set(0.2, 0.2, 0.2);
    this.container.position.z = -5;
    this.add(this.container);
    
    this.wheel = new THREE.Group();
    this.wheel.position.y = this.numbers.height;
    this.container.add(this.wheel);

    this.initBoothSign();
    this.initModel();
    this.initSign();
  }

  setSpeed(speed) {
    this.speed = speed / 10;
  }

  setQuantity(quantity) {
    this.quantity = quantity;
    this.initBooths();
  }

  setAngle(angle) {
    this.angle = (angle / 360) * (-Math.PI * 2);

    if (this.oneFoot && this.twoFoot && this.wheel) {
      this.oneFoot.rotation.x = this.angle;
      this.twoFoot.rotation.x = this.angle;
      this.wheel.rotation.x = -this.angle;
    }
  }

  initBooths() {
    if (this.booths.length) {
      this.booths.forEach(booth => this.wheel.remove(booth));
      this.booths = [];
    }
    
    const radius = this.numbers.radius + 1;
    for (let i = 0; i < this.quantity; i++) {
      const angle = (i / this.quantity) * 2 * Math.PI;
      const booth = new Booth(this.userRig, this.sign, this);
      booth.position.x = radius * Math.cos(angle);
      booth.position.y = radius * Math.sin(angle);
      this.booths.push(booth);
      this.wheel.add(booth);
    }
  }

  initFeet() {
    const { height, handleLength } = this.numbers;
    const group = new THREE.Group();

    const geometry = FerrisWheel.createGeometry('foot', () => {
      const geometry = new THREE.CylinderBufferGeometry(0.2, 0.6, height + 2);
      geometry.translate(0, -(height + 2) / 2, handleLength / 2 + 1);
      return geometry;
    });

    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    this.oneFoot = new THREE.Mesh(geometry, material);
    this.oneFoot.position.y = (height - 2) / 2;
    this.oneFoot.rotation.x = -Math.PI / 10;
    this.oneFoot.rotation.z = Math.PI / 10;
    group.add(this.oneFoot);

    this.twoFoot = new THREE.Mesh(geometry, material);
    this.twoFoot.position.y = (height - 2) / 2;
    this.twoFoot.rotation.x = -Math.PI / 10;
    this.twoFoot.rotation.z = -Math.PI / 10;
    group.add(this.twoFoot);

    group.position.y = height/2;
    
    this.container.add(group);
  }

  initInnerCables() {
    const { handleLength, handleRadius, cableStrength, innerRadius } = this.numbers;

    const centerToCable = distance(handleLength / 2, handleRadius);
    const offset = 0.75;
    const cableInnerRadius = innerRadius - offset;
    const cableRadius = distance(cableInnerRadius, centerToCable);

    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

    const [ geometry1, geometry2 ] = FerrisWheel.createGeometry('innerCables', () => {
      const geometry1 = new THREE.CylinderBufferGeometry(cableStrength, cableStrength, cableRadius);
      geometry1.translate(0, -cableRadius / 2, 0);
      geometry1.rotateZ(Math.PI / 5);
      geometry1.translate(0, - offset, 0);
      const geometry2 = geometry1.clone();

      geometry1.rotateX((-Math.atan(cableInnerRadius / centerToCable) + Math.PI / 2));
      geometry2.rotateX(-(-Math.atan(cableInnerRadius / centerToCable) + Math.PI / 2));
      return [ geometry1, geometry2 ];
    })

    for (let i = 0; i < 12; i++) {
      const cable = new THREE.Mesh(geometry1, material);
      cable.position.z = handleLength / 2;
      cable.rotation.z = (i / 12) * 2 * Math.PI;
      this.rotatingGroup.add(cable);
    }

    for (let i = 0; i < 12; i++) {
      const cable = new THREE.Mesh(geometry2, material);
      cable.position.z = -handleLength / 2;////////
      cable.rotation.z = ((i + 0.5) / 12) * 2 * Math.PI;///
      this.rotatingGroup.add(cable);
    }
  }

  initOuterCables() {
    const { distanceBetween, innerRadius, tubeSize } = this.numbers;

    const u = distance(3,3) / 2;
    const length = distance(distanceBetween, u);
    const angle = Math.acos(distanceBetween/u);
    const geometry1 = new THREE.CylinderBufferGeometry(tubeSize, tubeSize, length);
    geometry1.translate(0, length/2, 0);

    const geometry2 = geometry1.clone();
    const geometry3 = geometry1.clone();
    const geometry4 = geometry1.clone();

    geometry1.rotateZ(angle);
    geometry1.rotateX(angle);

    geometry2.rotateZ(-angle);
    geometry2.rotateX(angle);

    geometry3.rotateZ(angle);
    geometry3.rotateX(-angle);

    geometry4.rotateZ(-angle);
    geometry4.rotateX(-angle);

    const final = BufferGeometryUtils.mergeBufferGeometries([geometry1, geometry2, geometry3, geometry4]);
    final.translate(0, innerRadius, 0);

    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * 2 * Math.PI + Math.PI / 5;
      const cable = new THREE.Mesh(final, this.baseMaterial);
      cable.rotation.z = angle;
      this.rotatingGroup.add(cable);
    }
  }

    initSign() {
	/*
    const buttons = [
      new GUIVR.GuiVRButton('Speed', this.defaults.speed || 0, -10, 10, true, x => this.setSpeed(x)),
      new GUIVR.GuiVRButton('Angle', this.defaults.angle || 1, 0, 45, true, x => this.setAngle(x)),
      new GUIVR.GuiVRButton('#capsules', this.defaults.quantity || 12, 0, 45, true, x => this.setQuantity(x)),
    ];
    const sign = new GUIVR.GuiVRMenu(buttons);
    sign.position.x = 0;
    sign.position.z = -2;
    sign.position.y = 0.5;
      this.add(sign);*/
  }

    initBoothSign() {
	/*
    const buttons = [
      new GUIVR.GuiVRButton('Speed', 0, -10, 10, true, x => this.setSpeed(x)),
      new GUIVR.GuiVRButton('Angle', 1, 0, 45, true, x => this.setAngle(x)),
      new GUIVR.GuiVRButton('Exit', 0, 0, 1, true, x => {
        console.log(this.currentBooth);
        
        this.currentBooth.handleLeave(); 
      }, false),
    ];
    this.sign = new GUIVR.GuiVRMenu(buttons);
    this.sign.position.z = -2;
    this.sign.position.x = 0;
    this.sign.position.y = 0.5;*/
  }

  initRings() {
    const { radius, tubeSize, innerRadius } = this.numbers;

    FerrisWheel.createGeometry('outerRing', () => new THREE.TorusBufferGeometry(radius, tubeSize, 9, 113));

    const firstRing = new THREE.Mesh(FerrisWheel.getGeometry('outerRing'), this.baseMaterial);
    firstRing.position.z = -1.5;
    this.wheel.add(firstRing);

    const secondRing = new THREE.Mesh(FerrisWheel.getGeometry('outerRing'), this.baseMaterial);
    secondRing.position.z = 1.5;
    this.wheel.add(secondRing);

    const geometry = FerrisWheel.createGeometry('innerRing', () => new THREE.TorusBufferGeometry(innerRadius, tubeSize, 9, 113));
    const innerRing = new THREE.Mesh(geometry, this.baseMaterial);
    this.wheel.add(innerRing);
  }

  initCenter() {
    const { handleLength, handleRadius } = this.numbers;
    const geometry = FerrisWheel.createGeometry('handle', () => new THREE.CylinderBufferGeometry(handleRadius, handleRadius, handleLength));
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const handle = new THREE.Mesh(geometry, material);
    handle.rotation.x = Math.PI / 2;
    this.wheel.add(handle);

    const feetHolderGeo = FerrisWheel.createGeometry('feetHolder', () => new THREE.CylinderBufferGeometry(0.5, 0.6, 2));
    const feetHolderMat = new THREE.MeshLambertMaterial({ color: 0x5555ff });
    const feetHolder = new THREE.Mesh(feetHolderGeo, feetHolderMat);
    feetHolder.rotation.x = Math.PI / 2;
    feetHolder.position.z = handleLength / 2 + 2 / 2;
    this.rotatingGroup.add(feetHolder);
  }

  initModel() {
    this.rotatingGroup = new THREE.Group();
    this.wheel.add(this.rotatingGroup);
    this.baseMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

    this.initRings();
    this.initInnerCables();
    this.initOuterCables();
    this.initCenter();
    this.initBooths();
    this.initFeet();

    const groundGeo = FerrisWheel.createGeometry('ground', () => new THREE.BoxBufferGeometry(60, 0.5, 25));
    const groundMat = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = 0.5/2;
    this.container.add(ground);

    this.setAnimation(function () {
      const wheelDelta = this.speed * 0.01;
      this.wheel.rotation.z += wheelDelta;

      this.booths.forEach(booth => {
        booth.rotation.z -= wheelDelta;
      });
    });
  }
}


//Animator.mix(FerrisWheel);
Memorizer(FerrisWheel);


