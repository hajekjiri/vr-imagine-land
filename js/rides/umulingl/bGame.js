// Author : Larissa Umulinga
// CSC 385 Computer Graphics
// Winter 2020
// Project 2: Class for running the game
//Inspiration from
//https://discoverthreejs.com/book/first-steps/shapes-transformations/

//import * as BUCK from './Buckets.js';
import * as THREE from '../../../extern/build/three.module.js';
import {DebugConsole, debugWrite} from '../../DebugConsole.js';
import * as DEBUG from '../../DebugHelper.js';
import * as GUIVR from '../../GuiVR.js';
import * as USER from '../../User.js';

import {FBXLoader}  from '../../../extern/examples/jsm/loaders/FBXLoader.js';
var buckets=[];

export class GameB extends THREE.Group
{

  constructor(userRig,size,speed)
  {
    super();
    var numCones=20;
    this.speed=speed;
    this.size=size;
    var perRow=numCones/2;
    this.score=0;
    this.gamePlatform=new THREE.Group();
    this.cGame=new THREE.Group();

    var c=[0x29b868,0x2F7833];
    var cones=[];
    var i=0;
    while (i<numCones)
    {
      if (i==4)
      {
        var c=this.createCone(i,0xFF0000);
      }
      else {
        var c=this.createCone(i,0x29b868);
      }
      c.position.z=-7;
      cones.push(c);
      this.cGame.add(c);
      i+=2;
    }

    var j=1;
    while (j<numCones)
    {
      var d=this.createCone(j,0x868833);
      d.position.z=-9;
      cones.push(d);
      this.cGame.add(d);
      j+=2;
    }


    this.gamePlatform.add(this.createGui());
    let myThis=this;
    this.target=cones[1];
    // target.geometry.computeBoundingSphere();
    //adding a shooter
    let controllerModel = new THREE.Mesh(
       new THREE.CylinderGeometry(0.25, 0.25, 0.025),
        new THREE.MeshPhongMaterial({color: 0xFF33B9}));
    var bullet = new THREE.Mesh(
       new THREE.CylinderGeometry(0.05, 0.05, 1),
        new THREE.MeshPhongMaterial({color: 0xff0000}));
    bullet.rotation.x=-360;
        // Load the model
        var loader = new FBXLoader();

        loader.load(
    	'extern/models/gun/gun.fbx',
    	function ( obj ) {
      	    // Scale and add to the rig once loaded.
      	    obj.scale.x = 0.005;
      	    obj.scale.y = 0.005;
      	    obj.scale.z = 0.005;
            obj.position.y=0.1;
            obj.position.z=0.15;
            obj.position.x=-0;
            obj.rotation.z=180;
      	    controllerModel.add(obj);
      	},
      	function (xhr){
      	    //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      	},
      	function (error){

      		console.log('An error happened');
      	}
          );


    //adding the shooting
    this.add(new USER.UserPlatform(
       userRig,
    function (){
      let controller = userRig.getController(0);
      controller.add(controllerModel);
      //controller.position.y=1;
      controller.setAnimation(
    function (dt){
        if (this.t == undefined){
      this.t = 0;
        }
        this.t += dt;
        // Decide to fire.
        if (controller.triggered && (this.t - this.lastFire >= 10  || this.lastFire == undefined)){
      this.lastFire = this.t;
      //var a=myThis.detectCollision(this.t,target);
      // Create new projectile and set up motion.
      //let proj = controllerModel.clone();
      let proj = bullet.clone();
      //console.log("Firing");
      controller.add(proj);
      //let myThis=this;
      proj.setAnimation(
          function (dt){
        if (this.t == undefined){
            this.t = 0;
        }
        this.t += dt;
        this.position.z -= dt;
        //checking the collision here
        var a=myThis.detectCollision(this, myThis.target);
        if (a==true)
        {
            //myThis.cGame.pop(target);

          myThis.score+=1;
	    debugWrite(myThis.score);
        }
        // if (a)
        // {
        //   console.log ("Hit");
        // }
        if (this.t > 10){
            this.parent.remove(this);
        }
          }
      );
        }
    }
      );

  },
  function (){
      //console.log("Leaving Exhibit 2");
      let controller = userRig.getController(0);
      // Clear the model added to controller.
      controller.remove(controllerModel);
      // Remove special animation attached to controller.
      controller.setAnimation(undefined);
  }
    ));

    //adding TITLE
    var loader = new THREE.FontLoader();
  	var current = this.gamePlatform;
  	loader.load('extern/fonts/helvetiker_bold.typeface.json', function (font){
  	    var textGeo = new THREE.TextBufferGeometry("|Shoot the red cone|", {
  		font: font,
  		size: 0.15,
  		height: 0.02,
  		curveSegments: 10,

	    });
	    var textMaterial = new THREE.MeshPhongMaterial({color: 0x868833, specular: 0x33daff,shininess: 30});
	    var debug_mesh = new THREE.Mesh(textGeo, textMaterial);
	    debug_mesh.position.x = -1;
	    debug_mesh.position.y = 2.5;
	    debug_mesh.position.z = -2;
	    current.add(debug_mesh);
	});


    //adding a debugConsole to print data out
    var debugConsole = new DebugConsole(2.5);
    var tempMatrix = new THREE.Matrix4();
    debugConsole.position.x = -2.5;
    debugConsole.position.y = 1.5;
    debugConsole.position.z = -3;
    tempMatrix.makeRotationZ(THREE.Math.degToRad(0));
    debugConsole.applyMatrix(tempMatrix);
    debugConsole.scale.x=0.5;
    debugConsole.scale.y=0.5;
    debugWrite(this.score);
    this.add(debugConsole);
    this.setSize(this.size);
    this.setSpeed(this.speed);
    this.add(this.cGame);
    this.add(this.gamePlatform);
    this.position.z = -5;
    this.position.x =-3;
    this.rotation.y = THREE.Math.degToRad(90);

  }

    //creating individual cones by combining multiple Meshes
    //takes in a color to differentiate the target and the x for positioning
    createCone(x,color)
    {
      var cone=new THREE.Mesh();
      const materials = this.createMaterials(color);
      const geometries = this.createGeometries();
      const head = new THREE.Mesh( geometries.head, materials.body );


      const body = new THREE.Mesh( geometries.body, materials.body );
      const nose = new THREE.Mesh( geometries.nose, materials.detail);
      cone.add(

        //head,
        nose,
        body,

      );
      cone.position.x=x;
      cone.position.z=-9;
      return cone;
    }

    //material for the cones
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


 //all the shapes for the cones
 // with the help of
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


    //create GUI menu to change paraneters of the GAME
    //change the size and the speed
    createGui()
    {
      //var g=new GAME.GameB(userRig);
      let myThis=this;
      var speed=0;
      var buttons = [new GUIVR.GuiVRButton("Speed", 1, 0, 5, true,
                       function(x){myThis.setSpeed(x);}),
                       new GUIVR.GuiVRButton("Size", 1, 0.5, 5, true,
                                        function(x){myThis.setSize(x);})
                     ];
      var sign = new GUIVR.GuiVRMenu(buttons);
      sign.position.x = -1;
      sign.position.z = -1;
      sign.position.y = 1;
      return sign;
    }


    // function for detecting collision between the getWorldPosition
    // Takes in two meshes (bullet and target)
    // Returns true if they intersect and false otherwise
    // Collision is checked by the intersection of the bounding sphere on both Meshes
    // The function does not currently work
    detectCollision(bullet, target)
    {
      var a = new THREE.Vector3();
      var ob1=bullet.getWorldPosition ( a );
      bullet.updateMatrixWorld(true);
      bullet.geometry.computeBoundingSphere();

      var b = new THREE.Vector3();
      var ob2=target.getWorldPosition ( b );
      target.updateMatrixWorld(true);
      target.geometry.computeBoundingSphere();

      var distance=Math.sqrt((ob1.x-ob2.x) * (ob1.x-ob2.x) +
                              (ob1.y-ob2.y) * (ob1.y-ob2.y) +
                              (ob1.z-ob2.z) * (ob1.z-ob2.z));

      return distance<(bullet.radius+target.radius);
    }

      // setting the size of the cones
      setSize(size)
      {
        this.cGame.scale.x=size;
        this.cGame.scale.y=size;
        //this.cGame.scale.z=size;

      }

      //setting the speed of the cones 
      setSpeed(s)
      {
        this.cGame.setAnimation(
        function (dt){
            if (this.t == undefined) {
            this.t = 0;
            }
            this.t = this.t + dt;
            this.position.x += dt * s*0.5;
            this.position.x = ((this.position.x + 5) % 10) - 5;
        });
      }
  }
