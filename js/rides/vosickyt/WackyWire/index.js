// Parts of code taken from https://github.com/toji/webvr.info/blob/master/samples/XX-vr-controllers.html and https://github.com/stewdio/THREE.VRController

import * as THREE from '../../../../extern/build/three.module.js'
import Animator from '../Animator.js';
import { Curves } from '../Curves.js';
import * as GUIVR from '../../../GuiVR.js';
import * as USER from '../User.js';
import { debugWrite } from '../../../DebugConsole.js';
import { TransformControls } from '../../../../extern/examples/jsm/controls/TransformControls.js';
import Board from './Board.js';
import { createSlider } from '../util.js';

const STATES = {
  OUTSIDE: 'OUTSIDE',
  INSIDE: 'INSIDE',
  TOUCHING: 'TOUCHING',
}

const MAX_VIBRATION_DURATION = 1000;
const RAYCAST_COUNT = 16;
const DEFAULT_PENALIZATION = 1000;

const curves = [Curves.GrannyKnot, Curves.HeartCurve, Curves.VivianiCurve, Curves.KnotCurve, Curves.HelixCurve, Curves.TrefoilKnot, Curves.TorusKnot, Curves.CinquefoilKnot, Curves.TrefoilPolynomialKnot, Curves.FigureEightPolynomialKnot, Curves.DecoratedTorusKnot4a, Curves.DecoratedTorusKnot4b, Curves.DecoratedTorusKnot5a, Curves.DecoratedTorusKnot5c];

export class WackyWire extends THREE.Group {
  constructor(renderer, userRig, defaults = {}) {
    super();
      
      this.add(new USER.UserPlatform(userRig, () => this.initGame(), () => this.endGame()));
      
    this.renderer = renderer;
    this.defaults = defaults;
    this.userRig = userRig;
    
    this.raycaster = new THREE.Raycaster();
    this.defaultLoopSize = 10;
    this.loopSize = 10;

    this.maxTime = 30000;

    // initialize rays directions
    this.ways = [];
    for (let i = 0; i < RAYCAST_COUNT; i++) {
      const angle = (i / RAYCAST_COUNT) * (2 * Math.PI);
      const dir = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
      dir.normalize();
      this.ways.push(dir);
    }

    this.touchingState = {
      active: false,
      start: 0,
      intensity: 0,
    };

    this.gameState = {
      timeStarted: 0,
      started: false,
    };

    this.group = new THREE.Group()
    this.group.scale.set(0.01, 0.01, 0.01);
    this.group.position.z = -2.2;
    this.add(this.group);
    this.wire = null;

    this.setAnimation(this.update);
    this.init();
  }

  init() {
    this.initGamepads();
    this.initBox();
    this.initBoard();
    this.initScoreBar();
    this.initSign();
  }

  initSign() {
    var buttons = [
      new GUIVR.GuiVRButton('Shape', this.defaults.shape || 2, 1, 14, 1, x => this.setShape(x - 1)),
      new GUIVR.GuiVRButton('Loop Size', this.defaults.loopSize || 10, 10, 20, 1, x => this.setLoopSize(x)),
      new GUIVR.GuiVRButton('Time', this.defaults.time || 30, 1, 150, 1, x => this.setMaxTime(x)),
    ];
    var sign = new GUIVR.GuiVRMenu(buttons);
    sign.position.set(0, 1, 0);
    this.add(sign);
  }

  initLoop() {
    if (!this.loop) {
      const loopGeometry = new THREE.TorusBufferGeometry(this.defaultLoopSize/100, 1/100, 9, 113);
      const loopMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      this.loop = new THREE.Mesh(loopGeometry, loopMaterial);
    }
  }

  initScoreBar() {
    const geometry = new THREE.BoxBufferGeometry(10, 100, 10);
    const material = new THREE.MeshStandardMaterial({ color: 0xff9900 });
    this.scoreBar = new THREE.Mesh(geometry, material);
    this.scoreBar.position.set(-90, 0, -90);
    this.setScoreSize(0);
    this.group.add(this.scoreBar);
  }

  setScoreSize(percent) {
    let scale = 3;
    if (percent <= 0) {
      this.scoreBar.visible = false;
    } else {
      this.scoreBar.visible = true;
      this.scoreBar.scale.y = percent * scale;
      this.scoreBar.position.y = (percent * scale) / 50;
    }
  }

  setMaxTime(seconds) {
    this.maxTime = seconds * 1000;
  }

  setController(index) {
    if (this.controller) {
      this.controller.removeEventListener('selectstart', this.onButtonStart);
    }

    this.controllerIndex = index;
    this.controller = this.renderer.xr.getController(index);

    this.initLoop();
    
    this.controller.add(this.loop);
    this.add(this.controller);

    this.controller.addEventListener('selectstart', this.onButtonStart);
  }

  setDebugController() {
    if (this.controller) {
      this.controller.removeEventListener('selectstart', this.onButtonStart);
    }

    this.controllerIndex = -1;
    this.controller = new THREE.Group();

    this.initLoop();

    this.controller.add(this.loop);
    this.add(this.controller);


    window.addEventListener('contextmenu', () => {
      this.startGame();
    });
  }

  onButtonStart = () => {
    this.startGame();
  }

  startGame() {
    this.gameState.timeStarted = window.performance.now();
    this.gameState.started = true;
  }

  stopGame() {
    this.gameState.timeStarted = 0;
    this.gameState.started = false;

    this.setScoreSize(0);
  }

  initGame() {
    this.setController(0);
    this.startGame();
  }

  endGame() {
    this.stopGame();
    this.clean();
  }

  initBoard() {
    this.group.add(new Board());
  }

  initBox() {
    var boxGeometry = new THREE.BoxBufferGeometry(200, 15, 200);
    var boxMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      roughness: 0.4,
    });
    this.box = new THREE.Mesh(boxGeometry, boxMaterial);
    this.box.position.y = 15 / 2;
    this.group.add(this.box);

    var lightBoxGeometry = new THREE.BoxBufferGeometry(20, 20, 20);
    var lightBoxMaterial = new THREE.MeshPhongMaterial({
      color: 0xff0000,
    });
    this.lightBox = new THREE.Mesh(lightBoxGeometry, lightBoxMaterial);
    this.lightBox.position.set(70, 20, -70);
    this.box.add(this.lightBox);

    this.light = new THREE.PointLight(0xff0000, 1, 3);
    this.light.position.set(0, 0, 0);
    this.lightBox.add(this.light);
  }

  setLoopSize(size) {
    if (this.loop) {
      this.loop.scale.set(size / 10, size / 10, size / 10);
      this.loopSize = size;
    }
  }

  setShape(index = 0) {
    if (this.wire) {
      this.wire.geometry.dispose();
      this.wire.material.dispose();
      this.group.remove(this.wire.mesh);
      this.wire = null;
    }

    const Curve = curves[index];

    let material;
    if (false) {
      var loader = new THREE.CubeTextureLoader();
      loader.setPath('js/rides/vosickyt/textures/cubemap/');

      var textureCube = loader.load([
        'posx.jpg', 'negx.jpg',
        'posy.jpg', 'negy.jpg',
        'posz.jpg', 'negz.jpg'
      ]);

      material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,

        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x000000,
        envMap: textureCube,
      });
    } else {
      material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });
    }

    const extrudePath = new Curve();
    const geometry = new THREE.TubeBufferGeometry(extrudePath, 300, 2, 5, true);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(1, 1, 1);
    mesh.position.z = -10;
    mesh.position.y = 100;

    this.group.add(mesh);

    this.wire = {
      geometry,
      material,
      mesh,
    };
  }

  // find out, if loop is touching wire or not
  checkCollision(data) {
    if (!this.wire || !this.loop) return;

    const tempMatrix = new THREE.Matrix4();
    tempMatrix.identity().extractRotation(this.loop.matrixWorld);
    this.raycaster.ray.origin.setFromMatrixPosition(this.loop.matrixWorld);

    // we don't care of anything further than 11 "units"
    this.raycaster.far = 0.11;

    for (let i = 0; i < this.ways.length; i++) {
      const dir = this.ways[i];
      this.raycaster.ray.direction.set(dir.x, dir.y, dir.z).applyMatrix4(tempMatrix);

      const intersections = this.raycaster.intersectObject(this.wire.mesh);

      if (intersections.length > 0) {
        // intersections are sorted out by distance, we need only the closest one
        const intersection = intersections[0];
        const distance = Math.round(intersection.distance * 10000) / 100;
        const innerCircle = distance >= 5;

        // console.log(i, distance, innerCircle, intersections.length, dir.dot(intersection.uv), new THREE.Vector3().set(dir.x, dir.y, dir.z).cross(intersection.uv));
        if (data) data.distance = distance;
        return innerCircle ? STATES.TOUCHING : STATES.INSIDE;
      }
    }
    return STATES.OUTSIDE;
  }

  addDebugControls(camera, orbit) {
    return;
    this.control = new TransformControls(camera, document.getElementById('container'));
    this.control.addEventListener('change', () => console.log(this.checkCollision()));
    this.control.addEventListener('dragging-changed', function (event) {
      orbit.enabled = !event.value;
    });
    
    // this.setDebugController();
    // this.loop.position.set(-30/100, 160/100, -10/100);

    // this.loop.rotation.y = Math.PI / 2;
    // this.loop.rotation.x = Math.PI / 2;

    // this.loop.material.opacity = 0.6;
    // this.loop.material.transparent = true;

    this.control.attach(this.loop);
    this.add(this.control);

    // Ray Arrow Helpers
    for (let i = 0; i < this.ways.length; i++) {
      var dir = this.ways[i];
      var arrow = new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), 11, i === 0 ? 0xff0000 : 0xffff00);
      this.loop.add(arrow);
    }
  }

  getCurrentGamepad() {
    if (this.renderer.vr.getSession()) {
      return this.renderer.vr.getSession().inputSources[this.controllerIndex].gamepad;
    }
    return null;
  }

  update() {
    // Game Time Logic
    if (this.gameState.started) {
      const currentTime = window.performance.now();
      const deltaTime = currentTime - this.gameState.timeStarted;
      const remainingTime = this.maxTime - deltaTime;
      this.setScoreSize(remainingTime / this.maxTime);
      
      if (remainingTime < 0) {
        this.stopGame();
      }
    }
    

    if (this.loop) {
      // Handle coloring loop if it touches or not
      const data = { distance: 0 };
      const collision = this.checkCollision(data);
  
      if (collision === STATES.TOUCHING) {
        this.startTouching(1);
        this.loop.material.color.set(0xff0000);
        this.lightBox.material.color.set(0xff0000);
        this.light.intensity = 1;
      } else {
        this.stopTouching();
  
        if (collision === STATES.INSIDE) {
          this.loop.material.color.set(0x00ffff);
          this.lightBox.material.color.set(0x11ff22);
          this.light.intensity = 0;
        } else {
          this.loop.material.color.set(0xffffff);
          this.lightBox.material.color.set(0x11ff22);
          this.light.intensity = 0;
        }
      }
    }

    this.updateGamepad();
  }

  startTouching(intensity) {
    if (!this.touchingState.active) {
      this.touchingState.active = true;
      this.touchingState.start = window.performance.now();

      // Penalize player when touching the shape
      this.gameState.timeStarted = this.gameState.timeStarted - DEFAULT_PENALIZATION;
    }

    if (this.touchingState.start - window.performance.now() > MAX_VIBRATION_DURATION) {
      this.stopTouching();
      return;
    }

    this.touchingState.intensity = intensity;
  }

  stopTouching() {
    if (this.touchingState.active) {
      this.touchingState.active = false;
      this.touchingState.start = 0;
      this.touchingState.intensity = 0;
    }
  }

  initGamepads() {
    // needed to expose gamepads
    if (navigator.getVRDisplays) {
      navigator.getVRDisplays();
    }
  }

  clean() {
    if (this.controller) {
      this.controller.removeEventListener('selectstart', this.onButtonStart);
      this.controller.remove(this.loop);
      
      this.userRig.add(this.controller);
      this.controller = null;
    }
  }

  updateGamepad() {
    if (this.touchingState.active) {
      const gamepads = navigator.getGamepads();
      for (let i = 0; i < gamepads.length; ++i) {
        const gamepad = gamepads[i];

        if (gamepad) {
          if (this.controllerIndex !== gamepad.index) {
            if ("hapticActuators" in gamepad && gamepad.hapticActuators.length > 0) {
              gamepad.hapticActuators[0].pulse(this.touchingState.intensity, 100);
              break;
            }
          }
        }
      }
    }
  }
}

Animator.mix(WackyWire);
