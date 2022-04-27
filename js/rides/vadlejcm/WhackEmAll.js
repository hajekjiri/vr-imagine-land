import * as THREE from '../../../extern/build/three.module.js';
import * as GUIVR from './GuiVR.js';
import * as USER from './User.js';
import {OBJLoader}  from '../../../extern/examples/jsm/loaders/OBJLoader.js';

export class WhackEmAll extends THREE.Group {
constructor(userRig, x, y, z, rX, rY, rZ, scene, animatedObjects, Hspeed, Sspeed, Tspeed, texticek){
    super();
    var tmpHammerHead;
    var hammerInited = false;


    var loader = new OBJLoader();

    // Exhibit 2 - OBJ Loading Example
    var exhibit = new THREE.Group();
    var moleRig = new THREE.Group();
    var tmpCont;
    exhibit.add(new USER.UserPlatform(
        userRig,
        function (){
            console.log("Whack-em-All");
            // Get controller's position
            let controller = userRig.getController(0);
            tmpCont = userRig.getController(0);
            // Add new model for controller (should be removed on leaving).
            
            loader.load(
                '../../../extern/models/game/hammer-stick.obj',
                function ( obj ) {
                    // Scale and add to the moleRig once loaded.
                    obj.scale.x = 0.03;
                    obj.scale.y = 0.03;
                    obj.scale.z = 0.03;
                    obj.rotation.y = THREE.Math.degToRad(180);
                    obj.children[0].material.color.set(0x654321);
                    //obj.position.x = -0.5;
                    //obj.position.y = -3.5;
                    //obj.castShadow = true;
                    //obj.receiveShadow = true;
                    controller.add(obj);
                },
                function (xhr){
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error){
                    console.log('An error happened');
                }
                );
            loader.load(
                '../../../extern/models/game/hammer-top.obj',
                function ( obj ) {
                    // Scale and add to the moleRig once loaded.
                    obj.scale.x = 0.03;
                    obj.scale.y = 0.03;
                    obj.scale.z = 0.03;
                    obj.rotation.y = THREE.Math.degToRad(180);
                    obj.children[0].material.color.set(0xaaa9ad);
                    tmpHammerHead = obj;
                    hammerInited = true;
                    //obj.position.x = -0.5;
                    //obj.position.y = -3.5;
                    //obj.castShadow = true;
                    //obj.receiveShadow = true;
                    controller.add(obj);
                },
                function (xhr){
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                function (error){
                    console.log('An error happened');
                }
                );
            
            //controller.add(hammer); Original adding of the model
            // Set animation to check whether trigger button is
            // pressed and then fire a projectile in the frame of the
            // controller if is and enough time has elapsed since last
            // firing.
            controller.setAnimation(
            function (dt){
                if (this.t == undefined){
                this.t = 0;
                }
                this.t += dt;
                // Decide to fire.
                //if (controller.triggered
                //&& (this.t - this.lastFire >= 10
                //    || this.lastFire == undefined)){
                //this.lastFire = this.t;
                //// Create new projectile and set up motion.
                //let proj = hammer.clone();
                //console.log("Firing");
                //controller.add(proj);
                //proj.setAnimation(
                //    function (dt){
                //    if (this.t == undefined){
                //        this.t = 0;
                //    }
                //    this.t += dt;
                //    this.position.z -= dt;
                //    // Cause the projectile to disappear after t is 20.
                //    if (this.t > 20){
                //        this.parent.remove(this);
                //    }
                //    }
                //);
                //}
            }
            );
    
        },
        function (){
            console.log("Leaving Exhibit 2");
            let controller = userRig.getController(0);
            // Clear the model added to controller.
            controller.remove(controllerModel);
            // Remove special animation attached to controller.
            controller.setAnimation(undefined);
        }
        ));



    










    
    // moleRig to hold the loaded model.
    var game = new THREE.Group();
    
    moleRig.timeout = 1;
    game.rotation.y = THREE.Math.degToRad(0);
    game.rotation.x = THREE.Math.degToRad(-90);
    game.position.y = 0;
    game.position.z = -5;
    var mole1 = new THREE.Group();
    mole1.up = false;
    mole1.hit = false;
    mole1.speed = 1;
    mole1.slow = false;
    mole1.moleHeight = 1;
    mole1.moleSpeed = 1;
    mole1.moleTimeout = 1;
    mole1.setAnimation(
        function (dt){
            //collisions

            



            //if(hammerInited){
            //    let v1 = new THREE.Vector3(0,0,0);
            //    this.children[0].getWorldPosition(v1);
            //    let v2 = new THREE.Vector3(0,0,0);
            //    tmpHammerHead.getWorldPosition(v2);
            //    let dx = v1.x - v2.x;
            //    let dy = v1.y - v2.y;
            //    let dz = v1.z - v2.z;
            //    let dist =  Math.sqrt( dx * dx + dy * dy + dz * dz );
            //    console.log(dist);
            //    
            //    this.position.z = 1.5;
            //    //return;
            //    //collision detection
            //    //if(dist < 1){
            //    //    this.hit = true;
            //    //    this.up = false;
            //    //    this.children[0].children[0].material[0].color.set(0x654321);
            //    //    this.children[0].children[0].material[1].color.set(0x00FF00);
            //    //    this.children[0].children[0].material[2].color.set(0x000000);
            //    //    this.children[0].children[0].material[3].color.set(0xFF0000);
            //    //    this.children[0].children[0].material[4].color.set(0x555555);
            //    //}
            //}
            
            
            //animation
            if (this.position.z < 0.3 && this.slow == false){
                this.slow = true;
                this.speed = THREE.Math.randFloat( 0.02 * moleRig.timeout * this.moleTimeout, 0.15 * moleRig.timeout * this.moleTimeout);
            }
            if (this.position.z > 0.3 && this.slow == true){
                this.slow =  false;
                this.speed = THREE.Math.randFloat(0.7 + (this.moleSpeed * 0.3), 1.5 + (this.moleSpeed * 0.3));
                //this.hit = false;
                //this.children[0].children[0].material[0].color.set(0x654321);
                //this.children[0].children[0].material[1].color.set(0x00FF00);
                //this.children[0].children[0].material[2].color.set(0x000000);
                //this.children[0].children[0].material[3].color.set(0xFF0000);
                //this.children[0].children[0].material[4].color.set(0x555555);
            }
            if(this.up){
                this.position.z += this.speed * 0.025;
                if(this.position.z > 0.5 + this.moleHeight * 0.5){
                    this.up = false;
                }
            }
            else{
                this.position.z -= this.speed * 0.025;
                if(this.position.z < 0){
                    this.up = true;
                }
            }
        });
    moleRig.add(mole1);
    var mole2 = new THREE.Group();
    mole2.up = false;
    mole2.speed = 1;
    mole2.slow = false;
    mole2.moleHeight = 1;
    mole2.moleSpeed = 1;
    mole2.moleTimeout = 1;
    mole2.setAnimation(
        function (dt){
            if (this.position.z < 0.3 && this.slow == false){
                this.slow = true;
                this.speed = THREE.Math.randFloat( 0.02 * moleRig.timeout * this.moleTimeout, 0.15 * moleRig.timeout * this.moleTimeout);
            }
            if (this.position.z > 0.3 && this.slow == true){
                this.slow =  false;
                this.speed = THREE.Math.randFloat(0.7 + (this.moleSpeed * 0.3), 1.5 + (this.moleSpeed * 0.3));
            }
            if(this.up){
                this.position.z += this.speed * 0.025;
                if(this.position.z > 0.5 + this.moleHeight * 0.5){
                    this.up = false;
                }
            }
            else{
                this.position.z -= this.speed * 0.025;
                if(this.position.z < 0){
                    this.up = true;
                }
        }});
    moleRig.add(mole2);
    var mole3 = new THREE.Group();
    mole3.up = false;
    mole3.speed = 1;
    mole3.slow = false;
    mole3.moleHeight = 1;
    mole3.moleSpeed = 1;
    mole3.moleTimeout = 1;
    mole3.setAnimation(
        function (dt){
            if (this.position.z < 0.3 && this.slow == false){
                this.slow = true;
                this.speed = THREE.Math.randFloat( 0.02 * moleRig.timeout * this.moleTimeout, 0.15 * moleRig.timeout * this.moleTimeout);
            }
            if (this.position.z > 0.3 && this.slow == true){
                this.slow =  false;
                this.speed = THREE.Math.randFloat(0.7 + (this.moleSpeed * 0.3), 1.5 + (this.moleSpeed * 0.3));
            }
            if(this.up){
                this.position.z += this.speed * 0.025;
                if(this.position.z > 0.5 + this.moleHeight * 0.5){
                    this.up = false;
                }
            }
            else{
                this.position.z -= this.speed * 0.025;
                if(this.position.z < 0){
                    this.up = true;
                }
        }});
    moleRig.add(mole3);
    var mole4 = new THREE.Group();
    mole4.up = false;
    mole4.speed = 1;
    mole4.slow = false;
    mole4.moleHeight = 1;
    mole4.moleSpeed = 1;
    mole4.moleTimeout = 1;
    mole4.setAnimation(
        function (dt){
            if (this.position.z < 0.3 && this.slow == false){
                this.slow = true;
                this.speed = THREE.Math.randFloat( 0.02 * moleRig.timeout * this.moleTimeout, 0.15 * moleRig.timeout * this.moleTimeout);
            }
            if (this.position.z > 0.3 && this.slow == true){
                this.slow =  false;
                this.speed = THREE.Math.randFloat(0.7 + (this.moleSpeed * 0.3), 1.5 + (this.moleSpeed * 0.3));
            }
            if(this.up){
                this.position.z += this.speed * 0.025;
                if(this.position.z > 0.5 + this.moleHeight * 0.5){
                    this.up = false;
                }
            }
            else{
                this.position.z -= this.speed * 0.025;
                if(this.position.z < 0){
                    this.up = true;
                }
            }});
    moleRig.add(mole4);
    var mole5 = new THREE.Group();
    mole5.up = false;
    mole5.speed = 1;
    mole5.slow = false;
    mole5.moleHeight = 1;
    mole5.moleSpeed = 1;
    mole5.moleTimeout = 1;
    mole5.setAnimation(
        function (dt){
            if (this.position.z < 0.3 && this.slow == false){
                this.slow = true;
                this.speed = THREE.Math.randFloat( 0.02 * moleRig.timeout * this.moleTimeout, 0.15 * moleRig.timeout * this.moleTimeout);
            }
            if (this.position.z > 0.3 && this.slow == true){
                this.slow =  false;
                this.speed = THREE.Math.randFloat(0.7 + (this.moleSpeed * 0.3), 1.5 + (this.moleSpeed * 0.3));
            }
            if(this.up){
                this.position.z += this.speed * 0.025;
                if(this.position.z > 0.5 + this.moleHeight * 0.5){
                    this.up = false;
                }
            }
            else{
                this.position.z -= this.speed * 0.025;
                if(this.position.z < 0){
                    this.up = true;
                }
        }});
    moleRig.add(mole5);
    var mole6 = new THREE.Group();
    mole6.up = false;
    mole6.speed = 1;
    mole6.slow = false;
    mole6.moleHeight = 1;
    mole6.moleSpeed = 1;
    mole6.moleTimeout = 1;
    mole6.setAnimation(
        function (dt){
            if (this.position.z < 0.3 && this.slow == false){
                this.slow = true;
                this.speed = THREE.Math.randFloat( 0.02 * moleRig.timeout * this.moleTimeout, 0.15 * moleRig.timeout * this.moleTimeout);
            }
            if (this.position.z > 0.3 && this.slow == true){
                this.slow =  false;
                this.speed = THREE.Math.randFloat(0.7 + (this.moleSpeed * 0.3), 1.5 + (this.moleSpeed * 0.3));
            }
            if(this.up){
                this.position.z += this.speed * 0.025;
                if(this.position.z > 0.5 + this.moleHeight * 0.5){
                    this.up = false;
                }
            }
            else{
                this.position.z -= this.speed * 0.025;
                if(this.position.z < 0){
                    this.up = true;
                }
        }});
    moleRig.add(mole6);
    var mole7 = new THREE.Group();
    mole7.up = false;
    mole7.speed = 1;
    mole7.slow = false;
    mole7.moleHeight = 1;
    mole7.moleSpeed = 1;
    mole7.moleTimeout = 1;
    mole7.setAnimation(
        function (dt){
            if (this.position.z < 0.3 && this.slow == false){
                this.slow = true;
                this.speed = THREE.Math.randFloat( 0.02 * moleRig.timeout * this.moleTimeout, 0.15 * moleRig.timeout * this.moleTimeout);
            }
            if (this.position.z > 0.3 && this.slow == true){
                this.slow =  false;
                this.speed = THREE.Math.randFloat(0.7 + (this.moleSpeed * 0.3), 1.5 + (this.moleSpeed * 0.3));
            }
            if(this.up){
                this.position.z += this.speed * 0.025;
                if(this.position.z > 0.5 + this.moleHeight * 0.5){
                    this.up = false;
                }
            }
            else{
                this.position.z -= this.speed * 0.025;
                if(this.position.z < 0){
                    this.up = true;
                }
        }});
    moleRig.add(mole7);
    var mole8 = new THREE.Group();
    mole8.up = false;
    mole8.speed = 1;
    mole8.slow = false;
    mole8.moleHeight = 1;
    mole8.moleSpeed = 1;
    mole8.moleTimeout = 1;
    mole8.setAnimation(
        function (dt){
            if (this.position.z < 0.3 && this.slow == false){
                this.slow = true;
                this.speed = THREE.Math.randFloat( 0.02 * moleRig.timeout * this.moleTimeout, 0.15 * moleRig.timeout * this.moleTimeout);
            }
            if (this.position.z > 0.3 && this.slow == true){
                this.slow =  false;
                this.speed = THREE.Math.randFloat(0.7 + (this.moleSpeed * 0.3), 1.5 + (this.moleSpeed * 0.3));
            }
            if(this.up){
                this.position.z += this.speed * 0.025;
                if(this.position.z > 0.5 + this.moleHeight * 0.5){
                    this.up = false;
                }
            }
            else{
                this.position.z -= this.speed * 0.025;
                if(this.position.z < 0){
                    this.up = true;
                }
        }});
    moleRig.add(mole8);
    var mole9 = new THREE.Group();
    mole9.up = false;
    mole9.speed = 1;
    mole9.slow = false;
    mole9.moleHeight = 1;
    mole9.moleSpeed = 1;
    mole9.moleTimeout = 1;
    mole9.setAnimation(
        function (dt){
            if (this.position.z < 0.3 && this.slow == false){
                this.slow = true;
                this.speed = THREE.Math.randFloat( 0.02 * moleRig.timeout * this.moleTimeout, 0.15 * moleRig.timeout * this.moleTimeout);
            }
            if (this.position.z > 0.3 && this.slow == true){
                this.slow =  false;
                this.speed = THREE.Math.randFloat(0.7 + (this.moleSpeed * 0.3), 1.5 + (this.moleSpeed * 0.3));
            }
            if(this.up){
                this.position.z += this.speed * 0.025;
                if(this.position.z > 0.5 + this.moleHeight * 0.5){
                    this.up = false;
                }
            }
            else{
                this.position.z -= this.speed * 0.025;
                if(this.position.z < 0){
                    this.up = true;
                }
        }});
    animatedObjects.push(moleRig);
    moleRig.add(mole9);
    game.add(moleRig);
    //game.add(hammer);// MRDKY
    exhibit.add(game);
    // Load the model
    
    
    
    
    loader.load(
        '../../../extern/models/game/table-closed.obj',
        function ( obj ) {
            // Scale and add to the moleRig once loaded.
            obj.scale.x = 0.05;
            obj.scale.y = 0.05;
            obj.scale.z = 0.05;
            obj.children[0].material.color.set(0x654321);
            obj.position.x = -0.5;
            obj.position.y = -3.5;
            //obj.castShadow = true;
            //obj.receiveShadow = true;
            moleRig.add(obj);
        },
        function (xhr){
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error){
            console.log('An error happened');
        }
        );
    
    loader.load(
        '../../../extern/models/game/table-closed-side.obj',
        function ( obj ) {
            // Scale and add to the moleRig once loaded.
            obj.scale.x = 0.05;
            obj.scale.y = 0.05;
            obj.scale.z = 0.05;
            obj.children[0].material.color.set(0x655432);
            obj.position.x = -0.5;
            obj.position.y = -3.5;
            //obj.castShadow = true;
            //obj.receiveShadow = true;
            moleRig.add(obj);
        },
        function (xhr){
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error){
            console.log('An error happened');
        }
        );
    
    var hammer = new THREE.Group();
    loader.load(
        '../../../extern/models/game/hammer-top.obj',
        function ( obj ) {
            // Scale and add to the moleRig once loaded.
            obj.scale.x = 0.05;
            obj.scale.y = 0.05;
            obj.scale.z = 0.05;
            obj.children[0].material.color.set(0x757575);
            obj.position.x = -0.5;
            obj.position.y = -3.5;
            //obj.castShadow = true;
            //obj.receiveShadow = true;
            hammer.add(obj);
        },
        function (xhr){
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error){
            console.log('An error happened');
        }
        );
    loader.load(
        '../../../extern/models/game/hammer-stick.obj',
        function ( obj ) {
            // Scale and add to the moleRig once loaded.
            obj.scale.x = 0.05;
            obj.scale.y = 0.05;
            obj.scale.z = 0.05;
            obj.children[0].material.color.set(0x655432);
            obj.position.x = -0.5;
            obj.position.y = -3.5;
            //obj.castShadow = true;
            //obj.receiveShadow = true;
            hammer.add(obj);
        },
        function (xhr){
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error){
            console.log('An error happened');
        }
        );
    
    //hammer.position.x += 2;
    //hammer.position.y += 0.5;
    //hammer.position.z += 1;
    //game.add(hammer);
        
        
    let height = 0.45;
    let column1 = 0.26;
    let row1 = 0.26;
    let column2 = 0.58;
    let row2 = 0.58;
    let column3 = 0.89;
    let row3 = 0.89;
    
    
    loader.load(
        '../../../extern/models/game/krtek.obj',
        function ( obj ) {
            // Scale and add to the moleRig once loaded.
            obj.scale.x = 0.003;
            obj.scale.y = 0.003;
            obj.scale.z = 0.003;
            obj.position.z = 0.4;
            obj.children[0].material[0].color.set(0x111111);
            obj.children[0].material[1].color.set(0x111111);
            obj.children[0].material[2].color.set(0x111111);
            obj.children[0].material[3].color.set(0x111111);
            obj.children[0].material[4].color.set(0x111111);
            obj.position.x = -0.5;
            obj.position.y = -3.5;
            //obj.castShadow = true;
            //obj.receiveShadow = true;
            mole1.add(obj);
            let obj2 = new THREE.Group();
            obj2.add(obj.children[0].clone())
            obj2.scale.x = 0.003;
            obj2.scale.y = 0.003;
            obj2.scale.z = 0.003;
            obj2.position.x = -0.5;
            obj2.position.y = -3.5;
            obj2.position.z = 0.4;
            mole2.add(obj2);
            let obj3 = new THREE.Group();
            obj3.add(obj.children[0].clone())
            obj3.scale.x = 0.003;
            obj3.scale.y = 0.003;
            obj3.scale.z = 0.003;
            obj3.position.x = -0.5;
            obj3.position.y = -3.5;
            obj3.position.z = 0.4;
            mole3.add(obj3);
            let obj4 = new THREE.Group();
            obj4.add(obj.children[0].clone())
            obj4.scale.x = 0.003;
            obj4.scale.y = 0.003;
            obj4.scale.z = 0.003;
            obj4.position.x = -0.5;
            obj4.position.y = -3.5;
            obj4.position.z = 0.4;
            mole4.add(obj4);
            let obj5 = new THREE.Group();
            obj5.add(obj.children[0].clone())
            obj5.scale.x = 0.003;
            obj5.scale.y = 0.003;
            obj5.scale.z = 0.003;
            obj5.position.x = -0.5;
            obj5.position.y = -3.5;
            obj5.position.z = 0.4;
            mole5.add(obj5);
            let obj6 = new THREE.Group();
            obj6.add(obj.children[0].clone())
            obj6.scale.x = 0.003;
            obj6.scale.y = 0.003;
            obj6.scale.z = 0.003;
            obj6.position.x = -0.5;
            obj6.position.y = -3.5;
            obj6.position.z = 0.4;
            mole6.add(obj6);
            let obj7 = new THREE.Group();
            obj7.add(obj.children[0].clone())
            obj7.scale.x = 0.003;
            obj7.scale.y = 0.003;
            obj7.scale.z = 0.003;
            obj7.position.x = -0.5;
            obj7.position.y = -3.5;
            obj7.position.z = 0.4;
            mole7.add(obj7);
            let obj8 = new THREE.Group();
            obj8.add(obj.children[0].clone())
            obj8.scale.x = 0.003;
            obj8.scale.y = 0.003;
            obj8.scale.z = 0.003;
            obj8.position.x = -0.5;
            obj8.position.y = -3.5;
            obj8.position.z = 0.4;
            mole8.add(obj8);
            let obj9 = new THREE.Group();
            obj9.add(obj.children[0].clone())
            obj9.scale.x = 0.003;
            obj9.scale.y = 0.003;
            obj9.scale.z = 0.003;
            obj9.position.x = -0.5;
            obj9.position.y = -3.5;
            obj9.position.z = 0.4;
            mole9.add(obj9);
        },
        function (xhr){
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error){
            console.log('An error happened');
        }
        );
        mole1.position.x = column1;
        mole1.position.y = row1;
        mole1.position.z = height;
    
        mole2.position.x = column2;
        mole2.position.y = row1;
        mole2.position.z = height;

        mole3.position.x = column3;
        mole3.position.y = row1;
        mole3.position.z = height;
        
        mole4.position.x = column1;
        mole4.position.y = row2;
        mole4.position.z = height;
        
        mole5.position.x = column2;
        mole5.position.y = row2;
        mole5.position.z = height;
 
        mole6.position.x = column3;
        mole6.position.y = row2;
        mole6.position.z = height;

        mole7.position.x = column1;
        mole7.position.y = row3;
        mole7.position.z = height;

        mole8.position.x = column2;
        mole8.position.y = row3;
        mole8.position.z = height;

        mole9.position.x = column3;
        mole9.position.y = row3;
        mole9.position.z = height;
    
    
    var light = new THREE.SpotLight(0xffffff, 0.3);
    light.target.position.z = 0;
    light.target.position.x = 0;
    light.target.position.y = 1;
    exhibit.add(light.target);
    light.position.x = 0;
    light.position.y = 3;
    light.position.z = 3;
    light.castShadow = true;
    light.shadow.camera.far = 15;				  
    //var shadowCamera = new THREE.CameraHelper(light.shadow.camera);
    //scene.add(shadowCamera);
    exhibit.add(light);



    var buttons = [new GUIVR.GuiVRButton("Height", Hspeed, 0, 2, true,
                            function(x){mole1.moleHeight = x; 
                                mole2.moleHeight = x;
                                mole3.moleHeight = x;
                                mole4.moleHeight = x;
                                mole5.moleHeight = x;
                                mole6.moleHeight = x;
                                mole7.moleHeight = x;
                                mole8.moleHeight = x;
                                mole9.moleHeight = x;
                            }),
                   new GUIVR.GuiVRButton("Speed", Sspeed, 0, 2, true,
                            function(x){mole1.moleSpeed = x;
                                mole2.moleSpeed = x;
                                mole3.moleSpeed = x;
                                mole4.moleSpeed = x;
                                mole5.moleSpeed = x;
                                mole6.moleSpeed = x;
                                mole7.moleSpeed = x;
                                mole8.moleSpeed = x;
                                mole9.moleSpeed = x;
                            }),
                   new GUIVR.GuiVRButton("Timeout", Tspeed, 1, 3, true,
                              function(x){mole1.moleTimeout = x;
                                mole2.moleTimeout = x;
                                mole3.moleTimeout = x;
                                mole4.moleTimeout = x;
                                mole5.moleTimeout = x;
                                mole6.moleTimeout = x;
                                mole7.moleTimeout = x;
                                mole8.moleTimeout = x;
                                mole9.moleTimeout = x;
                            })
                        ];
    var sign = new GUIVR.GuiVRMenu(buttons);
    sign.position.x = 2;
    sign.position.z = -2;
    sign.position.y = 1;
    exhibit.add(sign);


    var textLoader1 = new THREE.FontLoader();
    textLoader1.load( 'extern/fonts/helvetiker_bold.typeface.json', function ( font ) {

    var textGeometry = new THREE.TextGeometry( texticek, {

        font: font,

        size: 50,
        height: 10,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

    });

    var textMaterial = new THREE.MeshPhongMaterial( 
        { color: 0xff0000, specular: 0xffffff }
    );

    var textik = new THREE.Mesh( textGeometry, textMaterial );
    textik.scale.x = 0.01;
    textik.scale.y = 0.01;
    textik.scale.z = 0.01;
    textik.position.x = -2.5;
    textik.position.y = 2.7;
    textik.position.z = -3;

    
    exhibit.add( textik );

    });     

    textLoader1.load( 'extern/fonts/helvetiker_bold.typeface.json', function ( font ) {

    var textGeometry = new THREE.TextGeometry( "Enjoy a hammer that does nothing!", {

        font: font,

        size: 50,
        height: 10,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

    });

    var textMaterial = new THREE.MeshPhongMaterial( 
        { color: 0xffff00, specular: 0xffffff }
    );

    var textik2 = new THREE.Mesh( textGeometry, textMaterial );
    textik2.scale.x = 0.003;
    textik2.scale.y = 0.003;
    textik2.scale.z = 0.003;
    textik2.position.x = -2;
    textik2.position.y = 2.3;
    textik2.position.z = -3;

    
    exhibit.add( textik2 );

    });     
    
    
    textLoader1.load( 'extern/fonts/helvetiker_bold.typeface.json', function ( font ) {

    var textGeometry = new THREE.TextGeometry( "Score:", {

        font: font,

        size: 50,
        height: 10,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

    });

    var textMaterial = new THREE.MeshPhongMaterial( 
        { color: 0xffffff, specular: 0xffffff }
    );

    var textik3 = new THREE.Mesh( textGeometry, textMaterial );
    textik3.scale.x = 0.003;
    textik3.scale.y = 0.003;
    textik3.scale.z = 0.003;
    textik3.position.x = -2;
    textik3.position.y = 2;
    textik3.position.z = -3;

    
    exhibit.add( textik3 );

    });     
    
textLoader1.load( 'extern/fonts/helvetiker_bold.typeface.json', function ( font ) {

    var textGeometry = new THREE.TextGeometry( "0", {

        font: font,

        size: 50,
        height: 10,
        curveSegments: 12,

        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: true

    });

    var textMaterial = new THREE.MeshPhongMaterial( 
        { color: 0x000000, specular: 0xffffff }
    );

    var textik3 = new THREE.Mesh( textGeometry, textMaterial );
    textik3.scale.x = 0.003;
    textik3.scale.y = 0.003;
    textik3.scale.z = 0.003;
    textik3.position.x = -1.2;
    textik3.position.y = 2;
    textik3.position.z = -3;

    
    exhibit.add( textik3 );

    });     


    
    // Pose exhibit.
    exhibit.position.x = x;
    exhibit.position.y = y;
    exhibit.position.z = z;
    exhibit.rotation.x = THREE.Math.degToRad(rX);
    exhibit.rotation.y = THREE.Math.degToRad(rY);
    exhibit.rotation.z = THREE.Math.degToRad(rZ);
    //moleRig.position.z = -0;
    //moleRig.rotation.x = THREE.Math.degToRad(-90);
    scene.add(exhibit);       

}}


