import * as THREE from '../../../extern/build/three.module.js';
import * as USER from '../../User.js';
import {OBJLoader} from '../../../extern/examples/jsm/loaders/OBJLoader.js';
import * as GUIVR from '../../GuiVR.js';
import {DebugConsole, debugWrite} from '../../DebugConsole.js';

export class balloonDartGame extends THREE.Group{

    constructor(userRig, numBalloons, dartBoardSpeed) {
        super();
        this.balloonsPerRow = numBalloons/3;
        this.balloonsPerColumn = 3;
        this.dartBoardSpeed = dartBoardSpeed;

        this.balloonDartGame(userRig, this.balloonsPerRow, this.dartBoardSpeed);

        let controllerModel = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.25, 0.25),
            new THREE.MeshPhongMaterial({color: 0xff0000}));

        this.add(new USER.UserPlatform(
            userRig,
            function (){
                console.log("Landing at Exhibit 2");
                // Get controller's position
                let controller = userRig.getController(0);
                // Add new model for controller (should be removed on leaving).
                controller.add(controllerModel);
                // Set animation to check whether trigger button is
                // pressed and then fire a projectile in the frame of the
                // controller if is and enough time has elapsed since last
                // firing.
                controller.setAnimation(
                    function (dt){
                        console.log(this);
                        if (this.t == undefined){
                            this.t = 0;
                        }
                        this.t += dt;
                        // Decide to fire.
                        if (controller.triggered
                            && (this.t - this.lastFire >= 10
                                || this.lastFire == undefined)){
                            this.lastFire = this.t;
                            // Create new projectile and set up motion.
                            //let proj = controllerModel.clone();

                            //make dart
                            var dartHandle = new THREE.Mesh(
                                new THREE.CylinderGeometry(.05, .05, .5, 20, 10),
                                new THREE.MeshPhongMaterial({color: 0xFF0000}));
                            var dartTip = new THREE.Mesh(
                                new THREE.ConeGeometry(.05, .1, .05, 6, 6, 6),
                                new THREE.MeshPhongMaterial({color: 0xFF0000}));
                            dartTip.position.y = dartHandle.position.y + .298;

                            var dart = new THREE.Group();
                            dart.add(dartHandle);
                            dart.add(dartTip);
                            dart.rotation.x = THREE.Math.degToRad(-90);

                            console.log("Firing");
                            controller.add(dart);
                            var score = 0;
                            dart.setAnimation(
                                function (dt){
                                    if (this.t == undefined){
                                        this.t = 0;
                                    }
                                    this.t += dt;
                                    this.position.z -= dt;

                                    for(var i = 0; i < listOfBalloons.length; i++){
                                        if(this.collided(listOfBalloons[i], dart) != null){
                                            this.popBalloon(listOfBalloons[i]);
                                            score += 1;
                                        }
                                    }
                                    // Cause the projectile to disappear after t is 20.
                                    if (this.t > 20){
                                        this.parent.remove(this);
                                    }
                                }
                            );
                        }
                    }
                );

            },
            function (){
                console.log("Leaving carnival game");
                let controller = userRig.getController(0);
                // Clear the model added to controller.
                controller.remove(controllerModel);
                // Remove special animation attached to controller.
                controller.setAnimation(undefined);
            }
        ));

        //score board
        var debugConsole = new DebugConsole(2.5);
        //debugConsole.rotateY(THREE.Math.degToRad(-45));
        debugConsole.position.x = .6;
        debugConsole.position.y = .98;
        debugConsole.position.z = -0.7;
        debugConsole.scale.x = .2;
        debugConsole.scale.y = .2;
        debugConsole.scale.z = .2;
        this.children[0].add(debugConsole);
	let plat = this.children[0];

        var loader = new THREE.FontLoader();
        loader.load('extern/fonts/helvetiker_bold.typeface.json', function (font){
            var textGeo = new THREE.TextBufferGeometry("Shoot darts at the balloons by clicking the \n trigger button " +
                "of the controller. Gain 1 point for \n each balloon hit. If you get 3 points, you win!", {
                font: font,
                size: 0.03,
                height: 0.02,
                curveSegments: 3,
            });
            var textMaterial = new THREE.MeshPhongMaterial({color: 0xFF0000, specular: 0x729FCF});
            var debug_mesh = new THREE.Mesh(textGeo, textMaterial);
            debug_mesh.position.x = -.8; //-1.15
            debug_mesh.position.y = 1.2;
            debug_mesh.position.z = -0.7;
            plat.add(debug_mesh);
        });
    }

    balloonDartGame(userRig, balloonsPerRow, dartBoardSpeed) {
        var dartBoard = new THREE.Mesh(
            new THREE.CubeGeometry(5, 3, .5, 1, 1, 1),
            new THREE.MeshPhongMaterial({color: 0x0000FF}));
        dartBoard.position.x = 0;
        dartBoard.position.y = 2;
        dartBoard.position.z = -3;
        //.5
        dartBoard.speed = dartBoardSpeed;
        dartBoard.setAnimation(
            function (dt){
                if (this.t == undefined) {
                    this.t = 0;
                }
                this.t = this.t + dt;
                this.position.x += dt * dartBoardSpeed;
                this.position.x = ((this.position.x + 5) % 10) - 5;
            });
        this.add(dartBoard);

        // var platform = new USER.UserPlatform(userRig);
        // platform.position.y = -.2;
        // this.add(platform);

        var v1 = new THREE.Vector3(-2, -1, .8);
        var t1 = new THREE.Matrix4().makeTranslation(1,0,0);
        for(var j = 0; j < this.balloonsPerColumn; j++){
            for(var i = 0; i < balloonsPerRow; i++){
                this.addBalloon(dartBoard, v1.x, v1.y, v1.z);
                v1.applyMatrix4(t1);
            }
            v1.x = -2;
            v1.y -= 1;
        }

        var listOfBalloons = [];
        for(var k = 0; k < dartBoard.children.length; k++){
            listOfBalloons.push(dartBoard.children[k]);
        }
        return listOfBalloons;
    }

    collided(balloon, dart) {
        balloon.geometry.computeBoundingSphere();
        dart.geometry.computeBoundingSphere();
        balloon.updateMatrixWorld();
        dart.updateMatrixWorld();

        var sphere1 = balloon.geometry.boundingSphere.clone();
        sphere1.applyMatrix4(balloon.matrixWorld);

        var sphere2 = dart.geometry.boundingSphere.clone();
        sphere2.applyMatrix4(dart.matrixWorld);

        if(sphere1.intersectSphere(sphere2)){
            return balloon;
        }
        else{
            return null;
        }
    }

    popBalloon(balloon){
        balloon.setAnimation(
            function (){
                balloon.scale.x = 0.1;
                balloon.scale.y = 0.1;
                balloon.scale.z = 0.1;
            });
    }

    addBalloon(dartBoard, x, y, z){
        // Load the balloon model
        var loader2 = new OBJLoader();
        loader2.load(
            '../../../extern/models/balloon/balloon.obj',
            function ( obj) {
                // Scale and add to the rig once loaded.
                obj.remove(obj.children[0]);
                obj.remove(obj.children[2]);
                obj.scale.x = .006;
                obj.scale.y = .006;
                obj.scale.z = .006;
                obj.position.x = x;
                obj.position.y = y;
                obj.position.z = z;
                obj.rotation.x = THREE.Math.degToRad(90);
                obj.rotation.y = THREE.Math.degToRad(180);
                var material = new THREE.MeshStandardMaterial({color: 0x00FF00});
                //can make random color for balloons
                obj.children[0].material = material;
                obj.children[1].material = material;
                dartBoard.add(obj);
            },
            function (xhr){
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error){
                console.log('An error happened');
            }
        );
    }
}
