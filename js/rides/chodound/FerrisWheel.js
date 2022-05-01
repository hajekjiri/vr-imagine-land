// Author: Dominik Chodounsky
// CSC 385 Computer Graphics
// Version: Winter 2020
// Project 2: FerrisWheel class and MyUserPlatform

import * as THREE from '../../../extern/build/three.module.js';
import * as GUIVR from '../../GuiVR.js';
import * as USER from '../../User.js';
import * as CART from './Cart.js';

// Class to build and animate a Ferris Wheel (Exhibit no. 5)
export class FerrisWheel extends THREE.Group{

    constructor(userRig, animatedObjects, shape, cartCnt){
    super();

    // Build my own user platform
    var myPlatform = new MyUserPlatform(userRig, signRig);
    this.add(myPlatform);
    var signRig = new THREE.Group();

    // Base group for floor and support beams
    var base = new THREE.Group();
    base.position.y = 0.001;
    base.position.z = -11;
    this.add(base);

    // Create floor
    var groundGeo = new THREE.PlaneGeometry(9, 9);
    var groundMat = new THREE.MeshLambertMaterial({color: 0x08323E});
    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = THREE.Math.degToRad(-90);
    ground.receiveShadow = true;
    base.add(ground);

    // Group for moving ferris wheel and its components
    var bigWheel = new THREE.Group();
    bigWheel.cartCnt = cartCnt;
    var wheels = [];

    // Two parts of the big wheel
    for(var i = 0; i < 2; ++i){
        var wheelGeo = new THREE.RingGeometry(2.9, 3, shape);
        var wheelMat = new THREE.MeshLambertMaterial( {color: 0x08324E, side: THREE.DoubleSide} );
        var wheel = new THREE.Mesh(wheelGeo, wheelMat);
	    wheel.position.set(0, 0, -1 + i * 2);
        bigWheel.add(wheel);
        wheels.push(wheel);
    }

    // Center connection between wheels
    var centerGeo = new THREE.CylinderGeometry( 0.17, 0.17, 3, 32 );
    var centerMat = new THREE.MeshLambertMaterial( {color: 0x08324E} );
    var center = new THREE.Mesh( centerGeo, centerMat );
    center.rotation.x = THREE.Math.degToRad(90);
    bigWheel.add(center);

    var centerCircles = [];

    // Caps on ends of center connection
    for(var i = 0; i < 2; ++i){
        var circleGeo = new THREE.CircleGeometry(0.17, 32);
        var circleMat = new THREE.MeshLambertMaterial( {color: 0x981508} );
        var circle = new THREE.Mesh(circleGeo, circleMat);
        circle.position.set(0, 0, -1.5 + i * 3);
        bigWheel.add(circle);
        centerCircles.push(circle);
    }

    var wheelConnections = [];
    var wheelPivots = [];
    var connectionGeo = new THREE.CylinderGeometry( 0.03, 0.03, 2, 32 );
    var connectionMat = new THREE.MeshLambertMaterial( {color: 0xFE422F} );

    // Bars to connect wheels in places where cars will hang
    for(var i = 0; i < bigWheel.cartCnt; ++i){
        var pivot = new THREE.Group();
        bigWheel.add(pivot);
        pivot.position.set(0, 0, 0);
        
        var cylinder = new THREE.Mesh( connectionGeo, connectionMat );
        cylinder.rotation.x = THREE.Math.degToRad(90);

        cylinder.position.set(0, -2.75, 0);
        pivot.add(cylinder);
        wheelConnections.push(cylinder);
        wheelPivots.push(pivot);
        pivot.rotateZ(THREE.Math.degToRad(i * 360 / bigWheel.cartCnt));
    }

    var centerConnections = [];

    // Connections between center connection and outer edges of the wheels
    for(var i = 0; i < bigWheel.cartCnt; ++i){
        var pivot = new THREE.Group();
        bigWheel.add(pivot);
        pivot.position.set( 0.0, 0.0, 0 );
        for(var j = 0; j < 2; ++j){
            var connectionGeo = new THREE.CylinderGeometry( 0.05, 0.05, 2.9, 32 );
            var connectionMat = new THREE.MeshBasicMaterial( {color: 0x08324E} );
            var connection = new THREE.Mesh( connectionGeo, connectionMat );
            connection.position.set(0, - 1.45, j % 2 == 0 ? 1 : -1);
           
            pivot.add(connection);
            centerConnections.push(pivot);
        }
        pivot.rotateZ(THREE.Math.degToRad(i * 360 / bigWheel.cartCnt));
    }

    var supports = [];
    
    // Support beams for the wheel
    for(var i = 0; i < 2; ++i){
        for(var j = 0; j < 2; ++j){
            var supportGeo = new THREE.CylinderGeometry(0.05, 0.05, 5.7, 32);
            var supportMat = new THREE.MeshLambertMaterial( {color: 0x981508} );
            var support = new THREE.Mesh( supportGeo, supportMat );
            support.position.set(1.9 - (j % 2) * 2 * 1.9, 1.4, 1.4 - (i % 2) * 2 * 1.4);
            support.rotation.z = THREE.Math.degToRad(40 - (j % 2) * 2 * 40);
            base.add(support);
            supports.push(support);
        }
    }

    var carts = [];
    var cartPivots = [];

    // Carts grouped with their rotation pivot based at position of the connection bars
    for(var i = 0; i < bigWheel.cartCnt; ++i){        
        var cart = new CART.Cart(userRig, signRig, bigWheel.speed / 2, -0.3, animatedObjects, bigWheel.direction);
        carts.push(cart);

        var pivot = new THREE.Group();
        pivot.add(cart);
        pivot.rotation.z = THREE.Math.degToRad(i * 360 / bigWheel.cartCnt);

        // Set cart's starting position
        cart.myAxis = new THREE.Vector3(0, 0, 1);
        cart.rotateOnWorldAxis(cart.myAxis, THREE.Math.degToRad(-i * 360 / bigWheel.cartCnt));
        bigWheel.add(pivot);
        cartPivots.push(pivot);
    }

    bigWheel.position.set(0, 3.7, -11);
    bigWheel.speed = 1;
    bigWheel.direction = 0;
    this.add(bigWheel);
	
	bigWheel.setAnimation(
        function (dt){
            if(bigWheel.direction == 0) this.rotation.z += this.speed * 0.01;
            else this.rotation.z -= this.speed * 0.01;
        });
	

	//animatedObjects.push(bigWheel);

    var inited = false; // To keep button initialization below from moving the user

    // Make GUI signs.
    var buttons = [new GUIVR.GuiVRButton("Speed", 1, 0, 10, false,
					function(x){
                         bigWheel.speed = x;
                         for(var i = 0; i < carts.length; ++i) carts[i].speed = x / 2;
                    }),
                    new GUIVR.GuiVRButton("Direction", 0, 0, 1, true,
					  function(x){

                        if(x == 0) {
                            bigWheel.setAnimation(
                                function (dt){
                                    this.rotation.z += this.speed * 0.01;
                                });
                            for(var i = 0; i < carts.length; ++i){
                                carts[i].setAnimation(
                                    function (dt){
                                        this.rotation.z -= this.speed * 0.02;
                                    });
                            }
                        }
                        else{
                            bigWheel.setAnimation(
                                function (dt){
                                    this.rotation.z -= this.speed * 0.01;
                                });
                            for(var i = 0; i < carts.length; ++i){
                                carts[i].setAnimation(
                                    function (dt){
                                        this.rotation.z += this.speed * 0.02;
                                    });
                            }
                        }
                        bigWheel.direction = x;
                    })
          ];
    
    var sign = new GUIVR.GuiVRMenu(buttons);

    sign.position.x = 1.5;
    sign.position.z = -3;
    sign.position.y = 1.3;
    signRig.add(sign);

    myPlatform.add(signRig);

    var buttons2 = [new GUIVR.GuiVRButton("Shape", shape, 3, 20, true,
					function(x){
                        bigWheel.remove(wheels[0]).remove(wheels[1]);
                        wheels = [];
                        for(var i = 0; i < 2; ++i){
                            var wheelGeo = new THREE.RingGeometry(2.9, 3, x);
                            var wheelMat = new THREE.MeshLambertMaterial( {color: 0x08324E, side: THREE.DoubleSide} );
                            var wheel = new THREE.Mesh(wheelGeo, wheelMat);
                            wheel.position.set(0, 0, -1 + i * 2);
                            bigWheel.add(wheel);
                            wheels.push(wheel);
                        }
                        shape = x;
                    }),
                    // pass old cart speed and direction to new
                    new GUIVR.GuiVRButton("Cart count", cartCnt, 0, 10, true,
					function(x){                        
                        for(var i = 0; i < cartPivots.length; ++i) bigWheel.remove(cartPivots[i]).remove(carts[i]);
                        carts = [];
                        cartPivots = [];
                        var connectionGeo = new THREE.CylinderGeometry( 0.03, 0.03, 2, 32 );
                        var connectionMat = new THREE.MeshLambertMaterial( {color: 0xFE422F} );
                        
                        for(var i = 0; i < x; ++i){        
                            var cart = new CART.Cart(userRig, signRig, bigWheel.speed / 2, -0.3, animatedObjects, bigWheel.direction);
                            carts.push(cart);
                    
                            var pivot = new THREE.Group();
                            pivot.add(cart);
                            pivot.rotation.z = THREE.Math.degToRad(i * 360 / x);
                    
                            // Set cart's starting position
                            cart.myAxis = new THREE.Vector3(0, 0, 1);
                            cart.rotateOnWorldAxis(cart.myAxis, THREE.Math.degToRad(-i * 360 / x));
                            bigWheel.add(pivot);
                            cartPivots.push(pivot);
                        }
                        bigWheel.rotation.z = 0;
                        
                        for(var i = 0; i < wheelPivots.length; ++i) bigWheel.remove(wheelPivots[i]).remove(wheelConnections[i]);

                        wheelConnections = [];
                        wheelPivots = [];
                        var connectionGeo = new THREE.CylinderGeometry( 0.03, 0.03, 2, 32 );
                        var connectionMat = new THREE.MeshLambertMaterial( {color: 0xFE422F} );

                        // Bars to connect wheels in places where cars will hang.
                        for(var i = 0; i < x; ++i){
                            var pivot = new THREE.Group();
                            bigWheel.add(pivot);
                            pivot.position.set(0, 0, 0);

                            var cylinder = new THREE.Mesh( connectionGeo, connectionMat );
                            cylinder.rotation.x = THREE.Math.degToRad(90);
                        
                            cylinder.position.set(0, -2.75, 0);
                            pivot.add(cylinder);
                            wheelConnections.push(cylinder);
                            wheelPivots.push(pivot);
                            pivot.rotateZ(THREE.Math.degToRad(i * 360 / x));
                        }

                        for(var i = 0; i < centerConnections.length; ++i) bigWheel.remove(centerConnections[i]);
                        centerConnections = [];

                        // Connections between center connection and outer edges of the wheels
                        for(var i = 0; i < x; ++i){
                            var pivot = new THREE.Group();
                            bigWheel.add(pivot);
                            pivot.position.set( 0.0, 0.0, 0 );
                            for(var j = 0; j < 2; ++j){
                                var connectionGeo = new THREE.CylinderGeometry( 0.05, 0.05, 2.9, 32 );
                                var connectionMat = new THREE.MeshBasicMaterial( {color: 0x08324E} );
                                var connection = new THREE.Mesh( connectionGeo, connectionMat );
                                connection.position.set(0, - 1.45, j % 2 == 0 ? 1 : -1);
                               
                                pivot.add(connection);
                                centerConnections.push(pivot);
                            }
                            pivot.rotateZ(THREE.Math.degToRad(i * 360 / x));
                        }

                        bigWheel.cartCnt = x;                       
                    })
                    ];
    
    var sign2 = new GUIVR.GuiVRMenu(buttons2);

    sign2.position.x = -1.5;
    sign2.position.z = -3;
    sign2.position.y = 1.3;

    this.add(sign2);
    inited = true;
    }  
}

// Adjusted User Platform class to have unique color and pin sign when getting of the Ferris Wheel
export class MyUserPlatform extends USER.UserPlatform {

    constructor(userRig, signRig){
    super(userRig);
    this.signRig = signRig;

    this.remove(this.children[1]);
    var platform = new THREE.Mesh(
	    new THREE.CylinderGeometry(1, 1, 1, 32),
	    new THREE.MeshLambertMaterial({color: 0xFE422F}));
    this.add(platform);
    this.collider = platform;
    }

    // When getting of the Ferris Wheel to this specific platform, the sign will be pinned to exhibit and removed from userRig
    collide(uv, pt){
        // When the user clicks on this platform, move the user to it.
        this.add(this.userRig);
        this.userRig.rotation.y = 0;
        this.add(this.signRig);
    }
}
