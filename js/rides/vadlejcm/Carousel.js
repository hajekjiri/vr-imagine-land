import * as THREE from '../../../extern/build/three.module.js';
import * as GUIVR from '../../GuiVR.js';
import {OBJLoader}  from '../../../extern/examples/jsm/loaders/OBJLoader.js';

export class HorseExhibit extends GUIVR.GuiVR {

    constructor(userRig, sign){
	super();
	
    // Make the shape of a platform.
    var platform = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 1, 32),
        new THREE.MeshPhongMaterial({color: 0x0000FF}));

    var front = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.1, 32),
        new THREE.MeshPhongMaterial({color: 0x00FF00}));

    // The front direction of the platform is -z.
    front.position.y = 0.55;	
    front.position.z = -1;
    this.add(front);

    this.add(platform);
    this.collider = platform;

    this.userRig = userRig;
        
    this.sign = sign;
    }

    
    collide(uv, pt){
	// When the user clicks on this platform, move the user to it.
	this.userRig.position.x = 0;
    this.userRig.position.y =  0;
    this.userRig.position.z =  0;
	this.userRig.rotation.y= 0;//THREE.Math.degToRad(180);
    this.add(this.sign);
    this.add(this.userRig);
    }
}
export class HorsePlatform1 extends GUIVR.GuiVR {

    constructor(userRig, obj, sign, exhibition, pX, pY, pZ, rX, rY, rZ){
	super();
	
	// Make the shape of a platform.
	var platform = obj.children[0];
	platform.scale.x = 0.01;
	platform.scale.y = 0.01;
	platform.scale.z = 0.01;
	platform.position.x = pX;
	platform.position.y = pY;
	platform.position.z = pZ;
	platform.rotation.x = rX;
	platform.rotation.y = rY;
	platform.rotation.z = rZ;
	this.add(platform);
	this.collider = platform;

    this.userRig = userRig;
    
    this.sign = sign;
    this.exhibition = exhibition;
    }

    
    collide(uv, pt){
	// When the user clicks on this platform, move the user to it.
	this.userRig.position.x = -1.2;
    this.userRig.position.y =  0.1;
    this.userRig.position.z =  0;
	this.userRig.rotation.y= THREE.Math.degToRad(180);
    this.add(this.userRig);
    this.userRig.add(this.sign);
    }
}
export class HorsePlatform2 extends GUIVR.GuiVR {

    constructor(userRig, obj, sign, exhibition, pX, pY, pZ, rX, rY, rZ){
	super();
	
	// Make the shape of a platform.
	var platform = obj.children[0];
	platform.scale.x = 0.01;
	platform.scale.y = 0.01;
	platform.scale.z = 0.01;
	platform.position.x = pX;
	platform.position.y = pY;
	platform.position.z = pZ;
	platform.rotation.x = rX;
	platform.rotation.y = rY;
	platform.rotation.z = rZ;
	this.add(platform);
	this.collider = platform;

    this.userRig = userRig;
    this.sign = sign;
    this.exhibition = exhibition;
    }

    
    collide(uv, pt){
	// When the user clicks on this platform, move the user to it.
	this.userRig.position.x = 1.2;
    this.userRig.position.y = 0.1;
    this.userRig.position.z = 0;
	this.userRig.rotation.y= 0;//THREE.Math.degToRad(-90);
    this.add(this.userRig);
    this.userRig.add(this.sign);
    }
}
export class HorsePlatform3 extends GUIVR.GuiVR {

    constructor(userRig, obj, sign, exhibition, pX, pY, pZ, rX, rY, rZ){
	super();
	
	// Make the shape of a platform.
	var platform = obj.children[0];
	platform.scale.x = 0.01;
	platform.scale.y = 0.01;
	platform.scale.z = 0.01;
	platform.position.x = pX;
	platform.position.y = pY;
	platform.position.z = pZ;
	platform.rotation.x = rX;
	platform.rotation.y = rY;
	platform.rotation.z = rZ;
	this.add(platform);
	this.collider = platform;

    this.userRig = userRig;
    this.sign = sign;
    this.exhibition = exhibition;
    }

    
    collide(uv, pt){
	// When the user clicks on this platform, move the user to it.
    this.userRig.position.x = 0;
	this.userRig.position.y = 0.1;
    this.userRig.position.z = -1.2;
	this.userRig.rotation.y= THREE.Math.degToRad(90);
    this.add(this.userRig);
    this.userRig.add(this.sign);
    }
}
export class HorsePlatform4 extends GUIVR.GuiVR {

    constructor(userRig, obj, sign, exhibition, pX, pY, pZ, rX, rY, rZ){
	super();
	
	// Make the shape of a platform.
	var platform = obj.children[0];
	platform.scale.x = 0.01;
	platform.scale.y = 0.01;
	platform.scale.z = 0.01;
	platform.position.x = pX;
	platform.position.y = pY;
	platform.position.z = pZ;
	platform.rotation.x = rX;
	platform.rotation.y = rY;
	platform.rotation.z = rZ;
	this.add(platform);
	this.collider = platform;

    this.userRig = userRig;
    this.sign = sign;
    this.exhibition = exhibition;
    }

    
    collide(uv, pt){
	// When the user clicks on this platform, move the user to it.
	this.userRig.position.x = 0;
	this.userRig.position.y = 0.1;
    this.userRig.position.z = 1.2;
	this.userRig.rotation.y= THREE.Math.degToRad(-90);
    this.add(this.userRig);
    this.userRig.add(this.sign);
    }
}

export class Carousel extends THREE.Group {

    constructor(userRig, x, y, z, rX, rY, rZ, scene, animatedObjects, Cspeed, Hspeed, Kspeed, texticek){
        super();
        var exhibit = new THREE.Group();
    

     
    
        // horseRig to hold the loaded model.
        var carousel = new THREE.Group();
        carousel.rotation.y = THREE.Math.degToRad(-90);
        carousel.position.y = 0;
        carousel.position.z = -5;
        
        var horses1 = new THREE.Group();
        var horses2 = new THREE.Group();
        var horses3 = new THREE.Group();
        var horses4 = new THREE.Group();
        var horseRig = new THREE.Group();
        horseRig.speed = 1;
        horses1.speed = 1;
        horses2.speed = 1;
        horses3.speed = 1;
        horses4.speed = 1;
        horses1.up = true;
        horses2.up = false;
        horses3.up = true;
        horses4.up = false;
        horses1.crazy = 0;
        horses2.crazy = 0;
        horses3.crazy = 0;
        horses4.crazy = 0;
        horses1.wild = true;
        horses2.wild = false;
        horses3.wild = true;
        horses4.wild = false;
        // Make the horses slowly go up and down.
        horses1.setAnimation(
        function (dt){
            if(this.up){
                this.position.y += this.speed * 0.01;
                if(this.position.y > 0.15){
                    this.up = false;
                }
            }
            else{
                this.position.y -= this.speed * 0.01;
                if(this.position.y < -0.1){
                    this.up = true;
                }
            }
            if(this.wild){
                this.rotation.x += this.crazy * 0.01;
                if(this.rotation.x > 0.15){
                    this.wild = false;
                }
            }
            else{
                this.rotation.x -= this.crazy * 0.01;
                if(this.rotation.x < -0.15){
                    this.wild = true;
                }
            }
        });
        // Make the horses slowly go up and down.
        horses2.position.y = 0.15;
        horses2.setAnimation(
        function (dt){
            if(this.up){
                this.position.y += this.speed * 0.01;
                if(this.position.y > 0.15){
                    this.up = false;
                }
            }
            else{
                this.position.y -= this.speed * 0.01;
                if(this.position.y < -0.1){
                    this.up = true;
                }
            }
            if(this.wild){
                this.rotation.x += this.crazy * 0.01;
                if(this.rotation.x > 0.15){
                    this.wild = false;
                }
            }
            else{
                this.rotation.x -= this.crazy * 0.01;
                if(this.rotation.x < -0.15){
                    this.wild = true;
                }
            }
        });
        horses3.setAnimation(
        function (dt){
            if(this.up){
                this.position.y += this.speed * 0.01;
                if(this.position.y > 0.15){
                    this.up = false;
                }
            }
            else{
                this.position.y -= this.speed * 0.01;
                if(this.position.y < -0.1){
                    this.up = true;
                }
            }
            if(this.wild){
                this.rotation.z += this.crazy * 0.01;
                if(this.rotation.z > 0.15){
                    this.wild = false;
                }
            }
            else{
                this.rotation.z -= this.crazy * 0.01;
                if(this.rotation.z < -0.15){
                    this.wild = true;
                }
            }
        });
        // Make the horses slowly go up and down.
        horses4.position.y = 0.15;
        horses4.setAnimation(
        function (dt){
            if(this.up){
                this.position.y += this.speed * 0.01;
                if(this.position.y > 0.15){
                    this.up = false;
                }
            }
            else{
                this.position.y -= this.speed * 0.01;
                if(this.position.y < -0.1){
                    this.up = true;
                }
            }
            if(this.wild){
                this.rotation.z += this.crazy * 0.01;
                if(this.rotation.z > 0.15){
                    this.wild = false;
                }
            }
            else{
                this.rotation.z -= this.crazy * 0.01;
                if(this.rotation.z < -0.15){
                    this.wild = true;
                }
            }
        });
        // Make the horseRig slowly rotate.
        horseRig.setAnimation(
        function (dt){
            this.rotation.y += this.speed * 0.01;
        });
        //animatedObjects.push(horseRig);
        horseRig.add(horses1);
        horseRig.add(horses2);
        horseRig.add(horses3);
        horseRig.add(horses4);
        carousel.add(horseRig);
        exhibit.add(carousel);
    
    
        //var inited = false; // To keep button initialization below from moving the user.
        // Make GUI sign.
        var buttons = [new GUIVR.GuiVRButton("Carousel", Cspeed, -10, 10, true,
                         function(x){horseRig.speed = x;}),
                       new GUIVR.GuiVRButton("Horse", Hspeed, 0, 3, true,
                         function(x){horses1.speed = x; horses2.speed = x;
                                     horses3.speed = x; horses4.speed = x;}),
                       new GUIVR.GuiVRButton("Crazy", Kspeed, 0, 3, true,
                           function(x){horses1.crazy = x; horses2.crazy = x;
                                    horses3.crazy = x; horses4.crazy = x;}),
                       //new GUIVR.GuiVRButton("1st person", 0, 0, 1, true,
                       //  function(x){
                       //     if (x == 0) {
                       //         userRig.position.y = 0;
                       //         if (inited){
                       //             exhibit.children[0].add(userRig);
                       //             userRig.position.x = 0;
                       //             userRig.position.y = 0;
                       //             userRig.position.z = 0;
                       //             userRig.add(sign);
                       //         }
                       //         exhibit.add(sign);
                       //     } else {
                       //         userRig.position.y = 0.02;
                       //         userRig.position.x = 1.2;
                       //         horses1.add(userRig);
                       //         horses1.add(sign);
                       //         }
                       //  })
                        ];
        //inited = true; // To keep button initialization below from moving the user.
        //buttons[0].scale.x = 2;
        //buttons[1].scale.x = 2;
        //buttons[0].w = 2;
        //buttons[1].w = 2;
        var sign = new GUIVR.GuiVRMenu(buttons);
        sign.position.x = 1.25;
        sign.position.z = -1.75;
        sign.position.y = 1;
    
        exhibit.add(new HorseExhibit(userRig, sign )); 
        exhibit.add(sign);
        
        // Load the model
        var loader = new OBJLoader();
        
        loader.load(
        'extern/models/carousel/carousel-bottom.obj',
        function ( obj ) {
            // Scale and add to the horseRig once loaded.
            obj.scale.x = 0.01;
            obj.scale.y = 0.01;
            obj.scale.z = 0.01;
            obj.children[0].material.color.set(0x303030);
            obj.rotation.x = THREE.Math.degToRad(-90);
            obj.castShadow = true;
            obj.receiveShadow = true;
            horseRig.add(obj);
        },
        function (xhr){
            //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error){
            console.log('An error happened');
        }
        );
        
        
        loader.load(
            'extern/models/carousel/carousel-top.obj',
            function ( obj ) {
                // Scale and add to the horseRig once loaded.
                obj.scale.x = 0.01;
                obj.scale.y = 0.01;
                obj.scale.z = 0.01;
                obj.castShadow = true;
                obj.receiveShadow = true;
                obj.children[0].material.color.set(0xFC0FC0);
                obj.rotation.x = THREE.Math.degToRad(-90);
                carousel.add(obj);
            },
            function (xhr){
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error){
                console.log('An error happened');
            }
            );
        
        loader.load(
            'extern/models/carousel/carousel-curb.obj',
            function ( obj ) {
                // Scale and add to the horseRig once loaded.
                obj.scale.x = 0.01;
                obj.scale.y = 0.01;
                obj.scale.z = 0.01;
                obj.castShadow = true;
                obj.receiveShadow = true;
                //obj.position.y = 0.55;
                obj.children[0].material.color.set(0x00008B);
                obj.rotation.x = THREE.Math.degToRad(-90);
                carousel.add(obj);
            },
            function (xhr){
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error){
                console.log('An error happened');
            }
            );
        
        loader.load(
            'extern/models/carousel/carousel-middle.obj',
            function ( obj ) {
                // Scale and add to the horseRig once loaded.
                obj.scale.x = 0.01;
                obj.scale.y = 0.01;
                obj.scale.z = 0.01;
                obj.castShadow = true;
                obj.receiveShadow = true;
                obj.children[0].material.color.set(0x24e3f8);
                //obj.position.y = 0.55;
                obj.rotation.x = THREE.Math.degToRad(-90);
                carousel.add(obj);
            },
            function (xhr){
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error){
                console.log('An error happened');
            }
            );
        
        loader.load(
            'extern/models/carousel/simpleHorse.obj',
            function ( obj ) {
                // Scale and add to the horseRig once loaded.
                obj.scale.x = 0.01;
                obj.scale.y = 0.01;
                obj.scale.z = 0.01;
                let objpX = -1.2;
                let objpY = 0.4;
                let objpZ = 0;
                obj.castShadow = true;
                obj.receiveShadow = true;
                obj.children[0].material.color.set(0xC39B77);
                let objrX = THREE.Math.degToRad(-90);
                let objrY = 0;
                let objrZ = 0;
                
                var horse1 = new HorsePlatform1(userRig, obj, sign, exhibit, objpX, objpY, objpZ, objrX, objrY, objrZ);
        
                horses1.add(horse1);
            },
            function (xhr){
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error){
                console.log('An error happened');
            }
            );
        
        loader.load(
            'extern/models/carousel/simpleHorse.obj',
            function ( obj ) {
                // Scale and add to the horseRig once loaded.
                obj.scale.x = 0.01;
                obj.scale.y = 0.01;
                obj.scale.z = 0.01;
                let objpX = 1.2;
                let objpZ = 0;
                let objpY = 0.4;
                obj.castShadow = true;
                obj.receiveShadow = true;
                obj.children[0].material.color.set(0xB5651D);
                let objrZ = THREE.Math.degToRad(180);
                let objrX = THREE.Math.degToRad(-90);
                let objrY = 0;
        
                var horse2 = new HorsePlatform2(userRig, obj, sign, exhibit, objpX, objpY, objpZ, objrX, objrY, objrZ);
        
                horses2.add(horse2);
            },
            function (xhr){
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error){
                console.log('An error happened');
            }
            );
        loader.load(
            'extern/models/carousel/simpleHorse.obj',
            function ( obj ) {
                obj.scale.x = 0.01;
                obj.scale.y = 0.01;
                obj.scale.z = 0.01;
                let objpX = 0;
                let objpY = 0.4;
                let objpZ = -1.2;
                obj.castShadow = true;
                obj.receiveShadow = true;
                obj.children[0].material.color.set(0x9B7653);
                let objrZ = THREE.Math.degToRad(-90);
                let objrX = THREE.Math.degToRad(-90);
                let objrY = 0;
                
                var horse3 = new HorsePlatform3(userRig, obj, sign, exhibit, objpX, objpY, objpZ, objrX, objrY, objrZ);
        
                horses3.add(horse3);
            },
            function (xhr){
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error){
                console.log('An error happened');
            }
            );
        
        loader.load(
            'extern/models/carousel/simpleHorse.obj',
            function ( obj ) {
                // Scale and add to the horseRig once loaded.
                obj.scale.x = 0.01;
                obj.scale.y = 0.01;
                obj.scale.z = 0.01;
                let objpY = 0.4; 
                let objpZ = 1.2;
                let objpX = 0;
                obj.castShadow = true;
                obj.receiveShadow = true;
                obj.children[0].material.color.set(0x654321);
                let objrX = THREE.Math.degToRad(-90);
                let objrZ = THREE.Math.degToRad(90);
                let objrY = 0;
                
                var horse4 = new HorsePlatform4(userRig, obj, sign, exhibit, objpX, objpY, objpZ, objrX, objrY, objrZ);
        
                horses4.add(horse4);
            },
            function (xhr){
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error){
                console.log('An error happened');
            }
            );
        
        
        
        // Create a spot light.
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
        
        // Pose exhibit.
        exhibit.rotation.x = THREE.Math.degToRad(rX);
        exhibit.rotation.y = THREE.Math.degToRad(rY);
        exhibit.rotation.z = THREE.Math.degToRad(rZ);
        exhibit.position.x = x;
        exhibit.position.y = y;
        exhibit.position.z = z;
    
    
        var textLoader2 = new THREE.FontLoader();
        textLoader2.load( 'extern/fonts/helvetiker_bold.typeface.json', function ( font ) {
    
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
        textik.position.x = -2.3;
        textik.position.y = 2.7;
        textik.position.z = -3;
    
        
        exhibit.add( textik );
    
        });     
    
    
    
    
    
    
        
        this.add(exhibit);    
    }


}


