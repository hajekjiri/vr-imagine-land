// Author: Ryan Kaplan
// CSC 385 Computer Graphics
// Version: Winter 2020
// Project 2: User classes
//


import * as THREE from '../../../extern/build/three.module.js';
import * as USER from '../../User.js';
import * as GUIVR from '../../GuiVR.js';

export class enemy extends THREE.Group {

    constructor(){
  	super();

    var enemy = new THREE.Group();

    var geometry = new THREE.BufferGeometry();

    var vertices = new Float32Array( [
      //front
      -1.0, -1.0,  1.0,
       1.0, -1.0,  1.0,
       1.0,  1.0,  1.0,

       1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0, -1.0,  1.0,

      //horns
      -1,  1,  1.0,
      1,  1,  1.0,
      1, 1.5,  -1,

      1,  1,  1.0,
      -1,  1.5,  -1,
      -1, 1,  1,

      //sides
      -1,1,1,
      0,0,-2,
      -1,-1,1,

      1,1,1,
      1,-1,1,
      0,0,-2,

      //back
      1,1,1,
      0,0,-2,
      -1,1,1

    ] );

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    var material = new THREE.MeshBasicMaterial( { color: 0xbd0037} );
    var mesh = new THREE.Mesh( geometry, material );
    enemy.add(mesh);



    return enemy;
      }




}
