// Author : Larissa Umulinga
// CSC 385 Computer Graphics
// Winter 2020
// Project 2: Class for creating the TeaCup Ride

import * as THREE from '../../../extern/build/three.module.js';
import * as DEBUG from '../../DebugHelper.js';
import * as GUIVR from '../../GuiVR.js';
import * as USER from '../../User.js';
import * as BUCK from './Buckets.js';
import {GLTFLoader}  from '../../../extern/examples/jsm/loaders/GLTFLoader.js';
import {FBXLoader}  from '../../../extern/examples/jsm/loaders/FBXLoader.js';
var tempMatrix = new THREE.Matrix4();
export class Ride extends THREE.Group
{
  constructor(userRig,speed,size)
  {
    super();

    this.speed=speed;
    this.size=size;
    this.ridePlatform=new USER.UserPlatform(userRig);
    this.ridePlatform.position.z=-10;
    this.ridePlatform.rotation.y = THREE.Math.degToRad(180);
    //adding a light
      //var light1 = new THREE.PointLight(0xFFFFFF, 0.5);
      //light1.position.y += 4.5;
      //this.add(light1);
    this.base=this.createBase(userRig,this.speed); //create base
    //this.base.add(this.createCylinder());
    var center=this.createSeat(userRig,0,0.7,0,0.2,1); //center
    this.base.add(center);
    var seat1=this.createSeat(userRig,-0.8,0.7,0,0.2,1.5); //seat1
    this.base.add(seat1);
    var seat2=this.createSeat(userRig,0.8,0.7,0,0.2,2); //seat2
    this.base.add(seat2);
    var seat3=this.createSeat(userRig,0,0.7,0.8,0.2,2.5); //seat3
    this.base.add(seat3);
    var seat4=this.createSeat(userRig,0,0.7,-0.8,0.2,0.5); //seat4
    this.base.add(seat4);
    this.ridePlatform.add(this.createGui());
    //userRig.add(this.createGui());
    this.setAnimation(this.speed);
    this.setSize(this.size);
    var loader = new THREE.FontLoader();
  	var current = this.ridePlatform;
  	loader.load('extern/fonts/helvetiker_bold.typeface.json', function (font){
  	    var textGeo = new THREE.TextBufferGeometry("|Sip a cup on the Teacup|", {
  		font: font,
  		size: 0.15,
  		height: 0.02,
  		curveSegments: 10,

	    });
	    var textMaterial = new THREE.MeshPhongMaterial({color: 0xFF7A33, specular: 0x33daff,shininess: 30});
	    var debug_mesh = new THREE.Mesh(textGeo, textMaterial);
	    debug_mesh.position.x = -1;
	    debug_mesh.position.y = 2.5;
	    debug_mesh.position.z = -2;
	    current.add(debug_mesh);
	});

    this.add(this.base);
    this.add(this.ridePlatform);
    this.position.z = -30;
    this.position.x =3;
    this.rotation.y = THREE.Math.degToRad(-180);
  }

  //
  createCylinder()
  {
    //middle bar
    var geometry = new THREE.CylinderGeometry( 0.025, 0.025, 20, 2 );
    var material = new THREE.MeshBasicMaterial( {color: 0x333DFF} );
    var cylinder = new THREE.Mesh( geometry, material);
    var points = [];
    for ( var i = 0; i < 10; i ++ ) {
    	points.push( new THREE.Vector2( Math.sin( i * 0.04 ) * 2 + 0.5, ( i - 0.5 ) * 0.3 ) );
    }
    var geometry = new THREE.LatheBufferGeometry( points );
    var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    var lathe = new THREE.Mesh( geometry, material );
    // cylinder.add(lathe);
    // cylinder.rotation.x=180;
    return cylinder;
  }

  //creating a MeshBasicMaterial
  createBase(userRig,speed)
  {
    var base = new THREE.Mesh(
  	    new THREE.CylinderGeometry(1, 1, 1, 32),
  	    new THREE.MeshPhongMaterial({color: 0x0000FF}));
    base.rotation.y =  THREE.Math.degToRad(90);
    base.position.z = -2;
    base.position.x = 0;
    base.position.y=0;
    base.scale.x=5;
    base.scale.y=0.7;
    base.scale.z=5;
    this.rotateSeat(base,speed);
    //base.add(this.createCylinder());
    return base;
  }
  //creating a seat
  // each seat should have its own GUI
  // but while added to the seat, the parameters change
  // but the number on the menu does not change
  createSeat(userRig,x,y,z,scale,speed)
  {

    //userRig.add(this.createGui());
    var seat=new USER.UserPlatform(userRig);
    var points = [];
    for ( var i = 0; i < 10; i ++ ) {
    	points.push( new THREE.Vector2( Math.sin( i * 0.04 ) * 2 + 0.5, ( i - 0.5 ) * 0.3 ) );
    }
    var geometry = new THREE.LatheBufferGeometry( points );
    var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    var lathe = new THREE.Mesh( geometry, material );
    seat.add(lathe);

    // Load the model
    var loader = new FBXLoader();
/*
    loader.load(
  '../../../extern/models/lambo/dragon.fbx',
  function ( obj ) {
      // Scale and add to the rig once loaded.
      obj.scale.x = 0.01;
      obj.scale.y = 0.01;
      obj.scale.z = 0.01;
      seat.add(obj);
  },
  function (xhr){
  	console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error){
  	console.log('An error happened');
  });*/

    seat.position.x = x;
    seat.position.y=y;
    seat.position.z =z;
    seat.speed=speed;
    seat.scale.x=scale;
    seat.scale.y=scale;
    seat.scale.z=scale;

    //userRig.add(this.createGui());
    this.rotateSeat(seat,speed/5);
    //this.setAnimation(speed);
    seat.add(this.createCylinder());
    return seat;

  }

    createGui()
    {
      let myThis=this;
      // var buttons = [new GUIVR.GuiVRButton("SPEED", 1, 0, 3, true,
      //                  function(x){speed=x;})];
      var buttons = [new GUIVR.GuiVRButton("Speed", 1, 0, 5, true,
                        function(x){myThis.setAnimation(x);}),
                    new GUIVR.GuiVRButton("Size", 1, 1, 5, true,
                                          function(x){myThis.setSize(x);})
                      ];
      var sign = new GUIVR.GuiVRMenu(buttons);
      sign.position.x = -1;
      sign.position.z = -3;
      sign.position.y = 1;
      return sign;
    }

    //rotating the platform along y axis
    rotateSeat(seat,speed)
    {
      seat.setAnimation(
      function (dt){
          this.rotation.y -= speed*0.05;
      });
    }

    //setting the size of the Teacup
    setSize(size)
    {
      this.base.scale.x=size;
      this.base.scale.z=size;

    }

    //changing the speed of the base
     setAnimation(s)
    {
      //this.rotate(this.base,s);
      this.base.setAnimation(
      function (dt){
          this.rotation.y -= s*0.01;
      });
    }



}
