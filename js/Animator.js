// Author: Matthew Anderson
// CSC 385 Computer Graphics
// Version: Winter 2020
// Project 2: Animator class
//
// A class called Animator that allows setting and stepping through
// animations of objects.  This class is merged into with
// Three.Object3D so that all objects in Threejs now have this
// functionality via a weird Javascript feature called a "mixin".
// You shouldn't need to instantiate this class.

import * as THREE from '../extern/build/three.module.js';


class Animator {

    // Set the animation function of the object.  The function should
    // take a single float point parameter dt and set the state of the
    // object to result of advancing time by dt.  The function should
    // be written as through it were a member function of the object.
    // See example usage in main.js exhibits.
    setAnimation(selfAnimate){
	this.selfAnimate = selfAnimate;
    }

    // Advances the animate of this object and all objects below it in
    // the hierarchy by dt.  Calls each objects animation function if
    // set.
    animate(dt){
	let tris = 0;
	if (this.selfAnimate != undefined){
	    this.selfAnimate(dt);
	}

	if (this instanceof THREE.Mesh){
	    if (this.geometry && this.geometry.vertices){
		tris += this.geometry.vertices.length;
		//console.log(this);
	    }
	}
	
	if (this.children != undefined){
	    for (var i = 0; i < this.children.length; i++){
		var child = this.children[i];
		if (child.animate != undefined)
		    tris += child.animate(dt);
	    }
	}
	return tris;
    }
}


// Mix in Animator with THREEE.Object3D

function classMixin(cls, ...src) {
    // From: https://blog.bitsrc.io/understanding-mixins-in-javascript-de5d3e02b466
    for (let _cl of src) {
        for (var key of Object.getOwnPropertyNames(_cl.prototype)) {
            cls.prototype[key] = _cl.prototype[key]
        }
    }
}

classMixin(THREE.Object3D, Animator);
// Now all THREE.Object3D objects have both methods of Animator.

