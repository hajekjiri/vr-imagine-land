// Author: Matthew Anderson
// CSC 385 Computer Graphics
// Version: Winter 2020
// Project 2: Main program.
// Initializes scene, VR system, and event handlers.



import * as THREE from '../../../extern/build/three.module.js';
import { VRButton } from '../../../extern/VRButton.js';
import {DebugConsole, debugWrite} from './DebugConsole.js';
import * as DEBUG from './DebugHelper.js';
import * as GUIVR from './GuiVR.js';
import * as ANIMATOR from './Animator.js';
import * as USER from './User.js';
import * as FERRISWHEEL from './ferris_wheel.js';
import * as WHACKAMOLE from './whack_a_mole.js';

// Imports for model loading.  The import depends on the model file type.
// There are other model types that can be loaded.
import {FBXLoader}  from '../../../extern/examples/jsm/loaders/FBXLoader.js'; 
//import {GLTFLoader}  from '../../../extern/examples/jsm/loaders/GLTFLoader.js';
//import {OBJLoader}  from '../../../extern/examples/jsm/loaders/OBJLoader.js';


// Global variables for high-level program state.
var camera, scene, renderer;
var userRig; // rig to move the user
var animatedObjects = []; // List of objects whose animation function needs to be called each frame.

// Initialize THREE objects in the scene.
function initExhibits(userRig){

    // Use canvas to create texture for holodeck-inspired walls.
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = 512;
    ctx.canvas.height = 512;
    ctx.fillStyle = '#EDD400';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(3, 3, ctx.canvas.width-6, ctx.canvas.height-6);
    var wallTexture = new THREE.CanvasTexture(ctx.canvas);
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.magFilter = THREE.LinearFilter;
    wallTexture.minFilter = THREE.LinearMipmapNearestFilter;
    wallTexture.repeat.set(100, 100);
    var wallMaterial = new THREE.MeshPhongMaterial();
    wallMaterial.map = wallTexture;

    // Create the floor.
    var floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100), wallMaterial);
    floor.geometry.rotateX(THREE.Math.degToRad(-90));
    floor.geometry.translate(0,0,0);
    scene.add(floor)

    // Create a light in the room.
    var light = new THREE.PointLight(0xffffff, 0.5);
    light.position.y = 20;
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xFFFFFF, 0.3));

}

function init() {

    // Set up renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0x00BFFF, 1); 

    // Extra settings to enable shadows.
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Create a scene
    scene = new THREE.Scene();

    // Create the main camera pointing at the board.
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight,
					 0.1, 50);
    camera.position.set(0, 1.6, 1);

    // Encapsulate user camera and controllers into a rig.
    userRig = new USER.UserRig(camera, renderer.xr);
    scene.add(userRig);
    
    //create a ferriswheel with max speed, 3
    var ferriswheel = new FERRISWHEEL.FerrisWheel(userRig,3,1);
    scene.add(ferriswheel);
    ferriswheel.position.z = -10;
    ferriswheel.position.x = -6; 

    //create a ferriswheel with scale up
    var ferriswheel2 = new FERRISWHEEL.FerrisWheel(userRig,1,3);
    scene.add(ferriswheel2);
    ferriswheel2.position.z = -25;
    ferriswheel2.position.x = 0;

    //create a ferriswheel with scale 1 but steady
    var ferriswheel3 = new FERRISWHEEL.FerrisWheel(userRig,0,1);
    scene.add(ferriswheel3);
    ferriswheel3.position.z = -10;
    ferriswheel3.position.x = 6;

    //LOOK TO THE LEFT
    //create a whack a mole game - speed 1 - easy
    var whackamole = new WHACKAMOLE.WhackAMole(userRig,1);
    scene.add(whackamole);
    whackamole.rotation.y = THREE.Math.degToRad(90);
    whackamole.position.z = -10;
    whackamole.position.x = -6;

     //create a whack a mole game - speed 5 - medium
    var whackamole2 = new WHACKAMOLE.WhackAMole(userRig,5);
    scene.add(whackamole2);
    whackamole2.rotation.y = THREE.Math.degToRad(90);
    whackamole2.position.z = -6;
    whackamole2.position.x = -6;

     //create a whack a mole game - speed 10 - hard
    var whackamole3 = new WHACKAMOLE.WhackAMole(userRig,10);
    scene.add(whackamole3);
    whackamole3.rotation.y = THREE.Math.degToRad(90);
    whackamole3.position.z = -2;
    whackamole3.position.x = -6;
    

    
    // Create the contents of the room.
    initExhibits(userRig);
    
    // Add VR button.
    document.body.appendChild(VRButton.createButton(renderer));
    window.addEventListener('resize', onWindowResize, false);

    // Set handler for mouse clicks.
    window.onclick = onSelectStart;

    animatedObjects.push(ferriswheel);
    animatedObjects.push(ferriswheel2);
    animatedObjects.push(ferriswheel3);
    animatedObjects.push(whackamole);
    animatedObjects.push(whackamole2);
    animatedObjects.push(whackamole3);
    

    
    // Starts main rendering loop.
    renderer.setAnimationLoop(render);
}

// Event handler for controller clicks when in VR mode, and for mouse
// clicks outside of VR mode.
function onSelectStart(event){

    if (event instanceof MouseEvent && !renderer.xr.isPresenting()){
	// Handle mouse click outside of VR.
	// Determine screen coordinates of click.
	var mouse = new THREE.Vector2();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
	// Create raycaster from the camera through the click into the scene.
	var raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mouse, camera);

	// Register the click into the GUI.
	GUIVR.intersectObjects(raycaster);
    }
    
}


// Update the camera aspect ratio when the window size changes.
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Updates world and renders one frame.
// Is repeatedly called by main rendering loop.
function render() {

    let dt = 0.1;
    // Force the gui to appear as heads up display tracking headset
    // position.
    for (let i = 0; i < animatedObjects.length; i++){
	animatedObjects[i].animate(dt);
    }
    userRig.animate(dt);
    
    renderer.render(scene, camera);
}

// Main program.
// Sets up everything.
init();
