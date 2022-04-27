// Author: Matthew Anderson
// CSC 385 Computer Graphics
// Version: Winter 2020
// Project 2: Main program.
// Initializes scene, VR system, and event handlers.

import * as THREE from '../extern/build/three.module.js';
import { VRButton } from '../extern/VRButton.js';
import {DebugConsole, debugWrite} from './DebugConsole.js';
import * as DEBUG from './DebugHelper.js';
import * as GUIVR from './GuiVR.js';
import * as ANIMATOR from './Animator.js';
import * as USER from './User.js';

// Student imports
import * as BurkekRide from './rides/burkek/FlyingSaucer.js';
import * as CaputojRide from './rides/caputoj/swing/SwingRide.js';
import * as CaputojGame from './rides/caputoj/targetPractice/TargetGame.js'
import * as ChodoundRide from './rides/chodound/FerrisWheel.js'
import * as ChodoundGame from './rides/chodound/BeatSaber.js'
import * as DulchinmRide from './rides/dulchinm/Teacups.js';
import * as DulchinmGame from './rides/dulchinm/Balloon.js';
import * as HajekjRide from './rides/hajekj/Ride.js';
import * as HajekjGame from './rides/hajekj/Game.js';
import * as InancgRide from './rides/inancg/ferris_wheel.js';
import * as JancicklRide from './rides/jancickl/Ferris.js';
import * as JancicklGame from './rides/jancickl/Range.js';
import * as KaplanrRide from './rides/kaplanr/ryanExhibit.js';
import * as KaplanrGame from './rides/kaplanr/ryanGame.js';
import * as KubinamRide from './rides/kubinam/FerrisWheel.js';
import * as KubinamGame from './rides/kubinam/CrazyCutter.js';
import * as LankmRide from "./rides/lankm/Teacups.js";
import * as LankmGame from "./rides/lankm/CarnivalGame.js";
import * as LehmanbnRide from './rides/lehmanbn/SixFlagsSwashbuckler.js';
import * as PiconikRide from './rides/piconik/Ride.js';
import * as RamirezjRide from './rides/ramirezj/TeaCup.js';
import * as SebastirRide from './rides/sebastir/Scrambler.js';
import * as TremblamRide from './rides/tremblam/TeacupRide.js';
import * as TremblamGame from './rides/tremblam/BalloonDarts.js';
import * as UmulinglGame from './rides/umulingl/bGame.js';
import * as UmulinglRide from './rides/umulingl/Ride.js';
import * as VadlejcmRide from './rides/vadlejcm/Carousel.js';
import * as VosickytRide from './rides/vosickyt/FerrisWheel/index.js';
//import * as VosickytGame from './rides/vosickyt/WackyWire/index.js';
//import * as WanyRide from './rides/wany/Ride.js';
import * as Wud2Ride from './rides/wud2/SkyScreamer.js'
import * as Wud2Game from './rides/wud2/MountainClimb.js'

import { Sky } from '../extern/jsm/objects/Sky.js';

const NINETY = THREE.Math.degToRad(90);
// Global variables for high-level program state.
var camera, scene, renderer;
var initGroup, loaderGroup, initScene; // To show loading screen.
var userRig; // rig to move the user
var animatedObjects = []; // List of objects whose animation function needs to be called each frame.
var rides = [];
var lastT; // Use to match animation timing to real time between frames.

// Variables to control lighting.
var effectController = {
    turbidity: 10,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    luminance: 1,
    inclination: -0.1, // elevation / inclination
    azimuth: 0.25, // Facing front,
    sun: ! true
};
var distance = 400000;
var sky;
var sunSphere;
var dirLight;
var ambient;

// Hide games / rides at distance greater than DRAW_DIST.
// Primarily to improve rendering performance.
const DRAW_DIST = 30; // Won't draw meshes that are at a greater distance.
const EMPTY_OBJ = new THREE.Mesh(new THREE.SphereGeometry(1, 1, 1),
				 new THREE.MeshBasicMaterial());
EMPTY_OBJ.visible = false;

// Track whether all models, textures, audio have been loaded.
// Controls whether loading screen shows.
var loadingComplete = false;
var loading = false;


// Adds a ride at the give (x, z) with the given y rotation.
function addAt(ride, x, z, ry){

    // Use level of detail to hide rides too far out.
    var lod = new THREE.LOD();
    lod.addLevel(ride,0);
    lod.addLevel(EMPTY_OBJ, DRAW_DIST);
    scene.add(lod);
    lod.position.x = x;
    lod.position.z = z;
    lod.rotation.y = ry;
    animatedObjects.push(lod);
}

function updateSun(dt){
    // From THREE sun demo.
    effectController.inclination += dt*0.01;
    ambient.intensity = 0.1 + 0.3 * (Math.sin(Math.PI * effectController.inclination)+1)/2;
    var uniforms = sky.material.uniforms;
    uniforms[ "turbidity" ].value = effectController.turbidity;
    uniforms[ "rayleigh" ].value = effectController.rayleigh;
    uniforms[ "mieCoefficient" ].value = effectController.mieCoefficient;
    uniforms[ "mieDirectionalG" ].value = effectController.mieDirectionalG;
    uniforms[ "luminance" ].value = effectController.luminance;
    
    let theta = Math.PI * ( effectController.inclination  );
    let phi = 2 * Math.PI * ( effectController.azimuth );
    
    sunSphere.position.x = distance * Math.cos( phi );
    sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
    sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );

    let pos = sunSphere.position.clone().normalize();
    dirLight.position.set(pos.x, pos.y, pos.z);
    
    sunSphere.visible = effectController.sun;
    
    uniforms[ "sunPosition" ].value.copy( sunSphere.position );
}

// Initialize loading screen.
function initLoading(userRig){
   
    initGroup = new THREE.Group();
    loaderGroup = new THREE.Group();
    
    var loader = new THREE.FontLoader();
    loader.load( 'extern/fonts/helvetiker_bold.typeface.json', function ( font ) {
	
	let size = 0.35;
	let box1= new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.1),
				 new THREE.MeshPhongMaterial({color:0xff0000}));
	box1.position.x = 0.6;
	box1.position.y = 4.20;
	box1.position.z = -2;
	box1.scale.x = 10;
	let box2= new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.52, 0.1),
				 new THREE.MeshPhongMaterial({color:0x23e504}));
	box2.position.x = 0.6;
	box2.position.y = 4.20;
	box2.position.z = -2;

	loaderGroup.add(box1);
	loaderGroup.add(box2);

	let params = {
	    font: font,
	    size: size,
            height: .1 * size,
            curveSegments: 1,
            bevelEnabled: true,
            bevelThickness: .01,
            bevelSize: .04 * size,
            bevelOffset: .001,
            bevelSegments: 1
	}
	
	let textGeo = new THREE.TextBufferGeometry("  Loading:", params);
	let textMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0x777777});
	let mesh = new THREE.Mesh(textGeo, textMaterial);
	mesh.position.x = -4.5;
	mesh.position.y = 4;
	mesh.position.z = -2;
	loaderGroup.add(mesh);
	initGroup.add(loaderGroup);
	
	textGeo = new THREE.TextBufferGeometry("Welcome to CSC 385's Imagine Land!", params);
	textMaterial = new THREE.MeshPhongMaterial({color: 0x23e504, specular: 0x777777});
	mesh = new THREE.Mesh(textGeo, textMaterial);
	mesh.position.x = -4.5;
	mesh.position.y = 2;
	mesh.position.z = -2;
	initGroup.add(mesh);

	size = size / 1.5;
	params.size = size;
	textGeo = new THREE.TextBufferGeometry( "Instructions:\n1. Point and use trigger button to interact.\n2. Point and click objects to move to them.\n3. Interact with floating menus to change settings.", params );
	textMaterial = new THREE.MeshPhongMaterial( { color: 0x8fe382, specular: 0x111111 } );
	mesh = new THREE.Mesh( textGeo, textMaterial );
	mesh.position.x = -4;
	mesh.position.y = 1.5;
	mesh.position.z = -2;
	initGroup.add(mesh);
	
    });
    initScene.add(initGroup);
    initGroup.position.z = -5;
    
}

// Initialize grass, road, and sky of scene.
function initWorld(userRig){

    // Set up lighting
    // Ambient light
    ambient = new THREE.AmbientLight(0xFFFFFF, 0.2);
    scene.add(ambient);
    // Sky / sun light
    sky = new Sky();
    sky.scale.setScalar( 450000 );
    scene.add( sky );
    sunSphere = new THREE.Mesh(
	new THREE.SphereBufferGeometry( 20000, 16, 8 ),
	new THREE.MeshBasicMaterial( { color: 0xffffff } )
    );
    sunSphere.position.y = - 700000;
    sunSphere.visible = false;
    scene.add( sunSphere );
    // Directional light oriented towards sun.
    dirLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(dirLight);
    updateSun(0);

    // Create grass.
    let grassTexture = new THREE.TextureLoader().load("grass.jpg");
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.magFilter = THREE.LinearFilter;
    grassTexture.minFilter = THREE.LinearMipmapLinearFilter;
    grassTexture.repeat.set(100, 100);
    grassTexture.anisotropy = 16;
    let grassMaterial = new THREE.MeshPhongMaterial({map: grassTexture});
    let grass = new THREE.Mesh(new THREE.PlaneBufferGeometry(400, 400), grassMaterial);
    grass.geometry.rotateX(THREE.Math.degToRad(-90));
    grass.geometry.translate(0,0,-5);
    scene.add(grass);
    
    // Create road.    
    let roadTexture = new THREE.TextureLoader().load("brick.jpg");
    roadTexture.wrapS = THREE.RepeatWrapping;
    roadTexture.wrapT = THREE.RepeatWrapping;
    roadTexture.magFilter = THREE.LinearFilter;
    roadTexture.minFilter = THREE.LinearMipmapLinearFilter;
    roadTexture.repeat.set(400, 10);
    roadTexture.anisotropy = 16;
    let roadMaterial = new THREE.MeshPhongMaterial({map: roadTexture});
    let road = new THREE.Mesh(new THREE.PlaneBufferGeometry(400, 10), roadMaterial);
    road.geometry.rotateX(THREE.Math.degToRad(-90));
    road.geometry.translate(0,0.01,-5);
    scene.add(road);

}

// Initialize student rides and games.
function initRides(userRig){
    
    // Right side of park.
    rides = [];

    rides.push(() => addAt(new BurkekRide.FlyingSaucer(userRig, 10, 'red'), 0, -17, 0));
    rides.push(() => addAt(new CaputojRide.SwingRide(userRig, 20, 4, 5, 3, 4), 15, -10, 0));
    rides.push(() => addAt(new CaputojGame.TargetGame(userRig, 3, 3, 30, 0.6), 26, -10, 0));
    rides.push(() => addAt(new InancgRide.FerrisWheel(userRig,3,1), 35, -5, 0));
    rides.push(() => addAt(new JancicklRide.Ferris([],userRig,5,true,4), 45, -10, 0));
    rides.push(() => addAt(new KaplanrRide.ryanExhibit(userRig, [], 5,5), 55, -25, 0));
    rides.push(() => addAt(new PiconikRide.Ride(userRig,scene, [], 4,4,4, new Array(0,0,4)), 60, -6, 2*NINETY));
    rides.push(() => addAt(new KubinamGame.CrazyCutter(userRig, [0.01, 10000,0.0025], [4000,10], 10, [6,4,0.5, -6], 0.4, 0.3), 68, -10, 0));
    rides.push(() => addAt(new SebastirRide.Scambler(userRig, []), 75, -10, 0));
    rides.push(() => addAt(new RamirezjRide.initExhibit5(userRig,1,15,0.01,0.05), 85, -10, 0));
    rides.push(() => addAt(new UmulinglRide.Ride(userRig,3,3), 95, 10, 0));
    rides.push(() => addAt(new Wud2Ride.SkyScreamer(userRig, 10), 107, 2, 0));
    rides.push(() => addAt(new JancicklGame.Range(renderer.xr,[],userRig,4,4,4,4), 115, -8, 0));
    rides.push(() => addAt(new UmulinglGame.GameB(userRig,2,3), 120, -7, -NINETY));
    rides.push(() => addAt(new Wud2Game.MountainClimb(userRig,4), 135, -4.5, -NINETY)); 
    
    // Left side of park.
    rides.push(() => addAt(new ChodoundRide.FerrisWheel(userRig, [], 8, 6), -15, -10, 0));
    rides.push(() => addAt(new ChodoundGame.BeatSaber(userRig, [], 1, 0.7, 10), -25, -10, 0));
    rides.push(() => addAt(new DulchinmGame.Balloon(userRig,10,3,0.1), -35, -10, 0));
    rides.push(() => addAt(new DulchinmRide.Teacups(userRig,5,1,-2,-7,90), -42, -10, 0));
    rides.push(() => addAt(new HajekjGame.Game(userRig, new THREE.Vector3(-10, 0, -5), new THREE.Vector3(0, 0, 0), 5, 5, 3, 2, 3), -48, -8, 0))
    rides.push(() => addAt(new KubinamRide.FerrisWheel( 5,5, [0.2, 0.1], 0.2, 3,[0.2,0.1], 10, -1, userRig), -70, -20, 0))
    rides.push(() => addAt(new TremblamRide.teacupRide(userRig, 5, 4, .5), -81, -10, 0))
    rides.push(() => addAt(new LehmanbnRide.Swashbuckler(userRig, [], 2, 4, 15), -87, -7, NINETY))
    rides.push(() => addAt(new LankmGame.CarnivalGame(userRig, 0, 1), -105, -10, 0))
    rides.push(() => addAt(new VadlejcmRide.Carousel(userRig, 0,0,0, 0,0,0, scene, [], -5, 0, 0, "Krazier Karusel"), -112, -10, 0));
    rides.push(() => addAt(new VosickytRide.FerrisWheel(userRig, { speed: 1 }, null), -122,-10,0));    
    rides.push(() => addAt(new Wud2Game.MountainClimb(userRig,4), -130, -4.5, NINETY)); 

    // === Rides with Models too computationally expensive to load / render ===
    // addAt(new HajekjRide.Ride(userRig, new THREE.Vector3(0, 0,0), new THREE.Vector3(0, Math.PI, 0), 10, 5), 0, -10, 0);
    // addAt(new LankmRide.Teacups(userRig, 3, 6, 1, 1), 0, -10, 0);
    // addAt(new TremblamGame.balloonDartGame(userRig, 12, .5), 0, -10, 0);
    
    // === Conflicting interactions with renderer ===
    //addAt(new VosickytGame.WackyWire(renderer, userRig, { shape: 2 }), -118,-10,0);  
    
}

function init() {

    // Set up renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0x000000, 1); 
    
    // Create scenes
    initScene = new THREE.Scene();
    scene = new THREE.Scene();

    // Create the main camera.
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight,
					 0.1, 100);
    camera.position.set(0, 1.6, 1);

    // Encapsulate user camera and controllers into a rig.
    userRig = new USER.UserRig(camera, renderer.xr);
    userRig.reset();
    
    initScene.add(userRig);
    
    // Create the contents of the room.
    initLoading(userRig);
    initWorld(userRig);
    initRides(userRig);

    // The code below is a bit of a hack to sequence ride
    // initialization and loading.  If I were designing it from
    // scratch I would NOT implement it this way.
    let numRides = rides.length;
    let startCount = 0;
    
    // Set loading manager to track progress of loading student assets.
    THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

	if (!loadingComplete && initGroup.children.length > 2){
	    // Update loading progress bar.
	    let progressBar = loaderGroup.children[1];
	    progressBar.scale.x = ((numRides - rides.length) / numRides) * 10;
	}

    };
    
    THREE.DefaultLoadingManager.onStart= function (url, itemsLoaded, itemsTotal) {
	startCount += 1; // If this changes after instantiating a ride, the student's initialization code requested loading an asset.
    }
    THREE.DefaultLoadingManager.onLoad = function ( ) {

	if (!loadingComplete){

	    let prevCount = startCount;
	    if (rides.length !== 0){
		// Initialize the next ride until out of rides or a
		// ride requires loading assets.
		while (prevCount == startCount && rides.length !== 0){
		    let ride = rides.pop();
		    ride();
		}		
	    }

	    // Move to main scene if all rides are initialized and
	    // completed their loading.
	    if (rides.length == 0 && prevCount == startCount){
		loadingComplete = true;
		
		// Remove loading progress bar.
		initGroup.remove(loaderGroup);
		
		// Set handler for mouse clicks.
		window.onclick = onSelectStart;
		
		// Switch to main scene.
		scene.add(initGroup);
		scene.add(userRig);
		userRig.reset();
		userRig.position.x = -60;
		
		// Add VR button.
		window.addEventListener('resize', onWindowResize, false);
		document.body.appendChild(VRButton.createButton(renderer));
	    }
	}
	
    };

    lastT = new Date().getTime();
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

    if (loadingComplete) {
	// Render main scene.

	// Compute time since last animation.
	let dt = lastT;
	lastT = new Date().getTime();
	dt = (lastT - dt) * 0.002;
	let vertCounts = [];
	
	for (let i = 0; i < animatedObjects.length; i++){
	    vertCounts.push(animatedObjects[i].animate(dt));
	}
	userRig.animate(dt);
	updateSun(dt);
	
	renderer.render(scene, camera);
    } else {
	// Render loading scene.
	renderer.render(initScene, camera);
    }
}

// Main program.
// Sets up everything.
init();



