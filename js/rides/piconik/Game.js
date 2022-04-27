// Author: Kallan Piconi
// CSC 385 Computer Graphics
// Version: Winter 2020
// Project 2: Ride class
//
// A class called Game that simulates an axe-throwing game useing threejs.
// When the user clicks on the UserPlatform, an axe will appear on their controller.
// They can then press and release the controller's trigger to throw the axe at the
// board. If the axe hits a wood board, they will gain points.

import * as THREE from '../../../extern/build/three.module.js';
import * as GUIVR from './GuiVR.js';
import * as USER from './User.js';
import {OBJLoader}  from '../../../extern/examples/jsm/loaders/OBJLoader.js';
import * as AXE from './Axe.js';
import {DebugConsole, debugWrite} from './DebugConsole.js';
import {scoreWrite, Scoreboard} from './Scoreboard.js';
import {instructionWrite, InstructionBoard} from './InstructionBoard.js';
import * as DEBUG from './DebugHelper.js';

export class Game extends THREE.Group{
    constructor(userRig, xr, scene, animatedObjects, level, exhibitPosition) {
        super();
        this.xr = xr;

        var collideSize = 1; //default

        var exhibit = new THREE.Group();
        exhibit.position.z = exhibitPosition[2];
        exhibit.position.x = exhibitPosition[0];
        exhibit.position.y = exhibitPosition[1];

        // Make the shape of a platform.
        var board = new THREE.Mesh(
            new THREE.BoxBufferGeometry(5, 4, .4),
            new THREE.MeshPhongMaterial({color: '#8b5d2e'}));
        board.position.y = 2 ;
        board.position.z = -10;
        exhibit.add(board);
        //load brick texture for board
        var texLoader = new THREE.TextureLoader();
        texLoader.load("bricks.jpg",
            function (texture) {
                let geom = new THREE.BoxBufferGeometry(5, 4, .5);
                let mesh = new THREE.MeshPhongMaterial(
                    {
                        color: 0xffffff,
                        map: texture
                    });
                var board1 = new THREE.Mesh(geom, mesh);
                board1.position.y = 0;
                board1.position.z = .01;
                board.add(board1);
            });

        // // Create debug console to right of board.
        // let debugConsoles = [];
        // let debugConsole = new DebugConsole(2.5);
        // debugConsole.rotateY(THREE.Math.degToRad(-45));
        // debugConsole.position.x = 4;
        // debugConsole.position.y = 1;
        // debugConsole.position.z = 3;
        // board.add(debugConsole);
        // debugConsoles.push(debugConsole);


        //Make collider boards
        //collider 1
        if (level == 1 || level == 3) {
            texLoader.load("wood.jpg",
                function (texture) {
                    let geom = new THREE.BoxBufferGeometry(collideSize, collideSize * 3, .1);
                    let mesh = new THREE.MeshPhongMaterial(
                        {
                            color: 0xffffff,
                            map: texture
                        });
                    var woodMesh = new THREE.Mesh(geom, mesh);
                    woodMesh.position.z = .3;
                    board.add(woodMesh);
                });
            var collider1 = new THREE.Mesh(
                new THREE.BoxBufferGeometry( collideSize, collideSize*3, .1 ),
                new THREE.MeshPhongMaterial({color: '#ff6781'}));
            collider1.position.z=-.3;
            board.add(collider1);
        }

        //collider 2
        if (level == 1 || level == 2) {
            texLoader.load("wood.jpg",
                function (texture) {
                    let geom = new THREE.BoxBufferGeometry(collideSize, collideSize * 3, .1);
                    let mesh = new THREE.MeshPhongMaterial(
                        {
                            color: 0xffffff,
                            map: texture
                        });
                    var woodMesh = new THREE.Mesh(geom, mesh);
                    woodMesh.position.z = .3;
                    woodMesh.position.x = 5 / 3;
                    board.add(woodMesh);
                });
            var collider2 = new THREE.Mesh(
                new THREE.BoxBufferGeometry( collideSize, collideSize*3, .1 ),
                new THREE.MeshPhongMaterial({color: '#ff6781'}));
            collider2.position.z=-.3;
            collider2.position.x= 5/3;
            board.add(collider2);
        }

        //collider 3
        if (level == 1 || level == 2) {
            texLoader.load("wood.jpg",
                function (texture) {
                    let geom = new THREE.BoxBufferGeometry(collideSize, collideSize * 3, .01);
                    let mesh = new THREE.MeshPhongMaterial(
                        {
                            color: 0xffffff,
                            map: texture
                        });
                    var woodMesh = new THREE.Mesh(geom, mesh);
                    woodMesh.position.z = .3;
                    woodMesh.position.x = -5 / 3;
                    board.add(woodMesh);
                });
            var collider3 = new THREE.Mesh(
                new THREE.BoxBufferGeometry( collideSize, collideSize*3, .1 ),
                new THREE.MeshPhongMaterial({color: '#ff6781'}));
            collider3.position.z=-.3;
            collider3.position.x= -5/3;
            board.add(collider3);
        }


        // Create score board to right of board.
        let scoreboards = [];
        let scoreboard = new Scoreboard(1.2);
        scoreboard.rotateY(THREE.Math.degToRad(-45));
        scoreboard.position.x = 4;
        scoreboard.position.y = .5;
        scoreboard.position.z = 3;
        board.add(scoreboard);
        scoreboards.push(scoreboard);


        var platform = new USER.UserPlatform(
            userRig,
            function () {
                console.log("Landing at Axe-throwing Game");
                // Get controller's position
                // Add new model for controller (should be removed on leaving).
                var controller = userRig.getController(0);
                //let controllerModel = new USER.Axe(userRig);
                let controllerModel = new AXE.Axe(userRig);

                controllerModel.position.z += -.6;
                controllerModel.position.y += -2.2;
                controller.add(controllerModel);
                // Set animation to check whether trigger button is
                // pressed and then fire a projectile in the frame of the
                // controller if is and enough time has elapsed since last
                // firing.
                controller.setAnimation(
                    function (dt) {
                        if (this.t == undefined) {
                            this.t = 0;
                        }
                        this.t += dt;

                        // Decide to fire.
                        if (controller.triggered && ((this.t - this.lastFire >= 10) || this.lastFire == undefined)) {

                            this.lastFire = this.t;
                            // Create new projectile and set up motion.
                            //let axe = new USER.Axe(userRig);
                            let axe = new AXE.Axe(userRig);
                            axe.position.z += -.6;
                            axe.position.y += -2.2;
                            var controllerRotationz = controller.rotation.z;
                            axe.rotation.z -= controllerRotationz;
                            axe.speed = -3;
                            controller.add(axe);
                            axe.setAnimation(
                                function (dt) {
                                    if (this.t == undefined) {
                                        this.t = 0;
                                    }
                                    if (this.t > 12){
                                        controller.remove(axe);
                                    }
                                    controller.rotation.z = 0;
                                    this.t += dt;
                                    let vec1 = new THREE.Vector3(0, 0, 0);
                                    let vec2 = new THREE.Vector3(0, 0, 0);
                                    board.updateMatrixWorld();
                                    let axeWorldPos = vec1.setFromMatrixPosition(axe.matrixWorld);
                                    let axeWorldz = axeWorldPos.z;
                                    let axeWorldx = axeWorldPos.x;
                                    let axeWorldy = axeWorldPos.y;
                                    let boardWorldPos =vec2.setFromMatrixPosition(board.matrixWorld);
                                    let boardWorldz = boardWorldPos.z;
                                    if (axeWorldz <= (boardWorldz + 2.3)) { //axe reached board
                                        axe.speed = 0;
                                        controller.triggered = false;
                                        //check if hit a point board
                                        board.updateMatrixWorld();
                                        //magic numbers were found experimentally
                                        if(level ==3) { //has collider board 1
                                            let vec4 = new THREE.Vector3(0, 0, 0);
                                            let coll1 = vec4.setFromMatrixPosition(collider1.matrixWorld);
                                            let coll1x = coll1.x;
                                            let coll1y = coll1.y -2;
                                            board.updateMatrixWorld();

                                            //hit collider board 1
                                            if ((axeWorldx + .2) <= (coll1x + (collideSize / 2) + .05) && (axeWorldx - .4) >= (coll1x - (collideSize / 2))
                                                && axeWorldy <= (coll1y + (collideSize * 1.5 / 2.3)) && (axeWorldy) >= (coll1y - (collideSize * 1.5 / 2))) {
                                                scoreboard.increaseScore();//add point
                                            }
                                        }
                                        else if(level ===2) { //has collider boards 2 and 3
                                            let vec3 = new THREE.Vector3(0, 0, 0);
                                            let coll2 = vec3.setFromMatrixPosition(collider2.matrixWorld);
                                            let coll2x = coll2.x;
                                            let coll2y = coll2.y -2;
                                            let vec5 = new THREE.Vector3(0, 0, 0);
                                            let coll3 = vec5.setFromMatrixPosition(collider3.matrixWorld);
                                            let coll3x = coll3.x;
                                            let coll3y = coll3.y -2;
                                            board.updateMatrixWorld();
                                            //hit collider board 3
                                            if (axeWorldx <= (coll3x + (collideSize / 2) + .9) && axeWorldx >= (coll3x - (collideSize / 2) + 1.4)
                                                && axeWorldy <= (coll3y + (collideSize * 1.5 / 2.3)) && (axeWorldy) >= (coll3y - (collideSize * 1.5 / 2.3))) {
                                                scoreboard.increaseScore();//add point
                                            }
                                            //hit collider board 2
                                            else if ((axeWorldx + .7) <= (coll2x + (collideSize / 2) - .2) && (axeWorldx + .5) >= (coll2x - (collideSize / 2))
                                                && axeWorldy <= (coll2y + (collideSize * 1.5 / 2.3)) && (axeWorldy) >= (coll2y - (collideSize * 1.5 / 2))) {
                                                scoreboard.increaseScore();
                                            }
                                        }
                                        else if (level ===1){ //has all collider boards
                                            let vec3 = new THREE.Vector3(0, 0, 0);
                                            let coll2 = vec3.setFromMatrixPosition(collider2.matrixWorld);
                                            let coll2x = coll2.x;
                                            let coll2y = coll2.y -2;
                                            let vec4 = new THREE.Vector3(0, 0, 0);
                                            let coll1 = vec4.setFromMatrixPosition(collider1.matrixWorld);
                                            let coll1x = coll1.x;
                                            let coll1y = coll1.y -2;
                                            let vec5 = new THREE.Vector3(0, 0, 0);
                                            let coll3 = vec5.setFromMatrixPosition(collider3.matrixWorld);
                                            let coll3x = coll3.x;
                                            let coll3y = coll3.y -2;
                                            board.updateMatrixWorld();
                                            //hit collider board 3
                                            if (axeWorldx <= (coll3x + (collideSize / 2) + .9) && axeWorldx >= (coll3x - (collideSize / 2) + 1.4)
                                                && axeWorldy <= (coll3y + (collideSize * 1.5 / 2.3)) && (axeWorldy) >= (coll3y - (collideSize * 1.5 / 2.3))) {
                                                scoreboard.increaseScore();//add point
                                            }
                                            //hit collider board 1
                                            else if ((axeWorldx + .2) <= (coll1x + (collideSize / 2) + .05) && (axeWorldx - .4) >= (coll1x - (collideSize / 2))
                                                && axeWorldy <= (coll1y + (collideSize * 1.5 / 2.3)) && (axeWorldy) >= (coll1y - (collideSize * 1.5 / 2))) {
                                                scoreboard.increaseScore();//add point
                                            }
                                            //hit collider board 2
                                            else if ((axeWorldx + .7) <= (coll2x + (collideSize / 2) - .2) && (axeWorldx + .5) >= (coll2x - (collideSize / 2))
                                                && axeWorldy <= (coll2y + (collideSize * 1.5 / 2.3)) && (axeWorldy) >= (coll2y - (collideSize * 1.5 / 2))) {
                                                scoreboard.increaseScore();//add point
                                            }
                                        }


                                    }
                                    if (axeWorldy <= -1.2) { //axe hits ground
                                        axe.speed = 0;
                                    }
                                    axe.position.z += (axe.speed*.2) * dt;
                                    axe.rotation.x += (axe.speed / 8) * dt;
                                    if (axe.speed != 0) {
                                        axe.position.y += (.5 * (-9.8) * (dt * dt) / 10);
                                    }
                                });
                        }
                    }
                );

            },
            function () {
                console.log("Leaving Exhibit 2");
                let controller = userRig.getController(0);
                // Clear the model added to controller.
                controller.remove(controllerModel);
                // Remove special animation attached to controller.
                controller.setAnimation(undefined);
            }
        );

        // Add landing platform for the exhibit.
        exhibit.add(platform);
        platform.position.x=0;
        platform.position.y=0;
        platform.position.z=-4;

        let instructionBoards = [];
        let instructionBoard = new InstructionBoard(2.6);
        instructionBoard.rotateY(THREE.Math.degToRad(45));
        instructionBoard.position.x = -4;
        instructionBoard.position.y = .5;
        instructionBoard.position.z = 3;
        board.add(instructionBoard);
        instructionBoards.push(instructionBoard);
        instructionWrite("Press and release the \ncontroller's trigger to \nshoot an axe at the \nboards while holding the \ncontroller still.\n" +
            "If you hit one of \nthe wooden boards, you \nwill gain points. \nIf you miss, you \nwill gain no points.\n" +
            "Good luck!");

        scene.add(exhibit);
    }


}

function throwAxe(axeInst) {
    axeInst.speed = -2;
}

function resetAxePos(axeInst){
    axeInst.position.z += -.6;
    axeInst.position.y += -2.2;
}


//sources:
//https://cs.wellesley.edu/~cs307/lectures/10new.html
//https://pixabay.com/photos/vintage-wood-texture-wooden-wall-1557993/

