// Author: Ryan Kaplan
// CSC 385 Computer Graphics
// Version: Winter 2020
// Project 2: User classes
//


import * as THREE from '../../../extern/build/three.module.js';
import * as USER from '../../User.js';
import * as GUIVR from '../../GuiVR.js';
import * as ENEMY from './enemy.js';

var score = 0;
var enemyList = [];
var gameRunning;

export class ryanGame extends THREE.Group {

    constructor(userRig, animatedObjects, enemySpeed, fireRate){
  	super();

    gameRunning = 0;

            // Exhibit 2 - OBJ Loading Example
            let controllerModel = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 20, 20),
          new THREE.MeshPhongMaterial({color: 0x0078c2}));

            var exhibit = new THREE.Group();

            var buttons = [new GUIVR.GuiVRButton("Speed", enemySpeed, 0, 10, true,
        					 function(x){
                        enemySpeed = x/40;
                   }),
                   new GUIVR.GuiVRButton("Fire Rate", fireRate, 0, 10, true,
            					 function(x){
                         fireRate = 1/x;
                          }),
                    new GUIVR.GuiVRButton("Start", 0, 0, 1, true,
                   			function(x){
                              gameRunning = x;

                              }
                          )];
            var sign = new GUIVR.GuiVRMenu(buttons);
            sign.position.x = 0;
            sign.position.z = -1;
            sign.position.y = 1;
            exhibit.add(sign);

            animatedObjects.push(sign);

            sign.setAnimation(function (dt){
                if (gameRunning == true){
                  exhibit.remove(this);
                }
            });

            exhibit.add(new USER.UserPlatform(
          userRig,
          function (){
              //console.log("Landing at Exhibit 2");
              //  controller's position
              let controller = userRig.getController(0);
              // Add new model for controller (should be removed on leaving).
              controller.add(controllerModel);
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

                loader.load('extern/fonts/helvetiker_bold.typeface.json', function (font){
                var scoreText = new THREE.TextBufferGeometry("Score: " + "I".repeat(score), {
                font: font,
                size: 0.15,
                height: 0.02,
                curveSegments: 3,
                });
                var textMaterial = new THREE.MeshBasicMaterial({color: 0x140d73});
                var score_mesh = new THREE.Mesh(scoreText, textMaterial);
                score_mesh.position.x = -.5;
                score_mesh.position.y = 2.6;
                score_mesh.position.z = -4;
                exhibit.add(score_mesh);
            });

                // Decide to fire.
                if (controller.triggered
              && (this.t - this.lastFire >= (fireRate * 40)
                  || this.lastFire == undefined)){
              this.lastFire = this.t;

              // Create new projectile and set up motion.
              let proj = controllerModel.clone();
		    //console.log("Firing");

              controller.add(proj);

              proj.yVel = 0.03;
              proj.grav = -0.001;

              proj.setAnimation(
                  function (dt){
                if (this.t == undefined){
                    this.t = 0;
                }
                //checking collisions
                var i;
                for (i = 0; i < enemyList.length; i++) {
                  var enemy = enemyList[i];
                  var collided = false;

                  if ((enemy.position.x - 1 <= this.position.x) && (this.position.x <= enemy.position.x + 1)){
                    if ((enemy.position.y - 1 <= this.position.y) && (this.position.y <= enemy.position.y + 1)){
                      if ((enemy.position.z - 1 <= this.position.z) && (this.position.z <= enemy.position.z + 1)){
                          collided = true;
                          //console.log("got a point");
                          score += 1;
                          this.position.y += -300;
                          collided = false;
                          exhibit.remove(this);

                          enemy.position.z += -30;
                          enemyList.splice(i,1);
                      }
                    }
                  }
                }

                this.t += dt;
                this.position.z -= 2 * dt;
                this.position.y += this.yVel;
                this.yVel += this.grav;

                // Cause the projectile to disappear after t is 20.
                if (this.t > 10){
                    this.parent.parent.parent.remove(this);
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


            var loader = new THREE.FontLoader();

            loader.load('extern/fonts/helvetiker_bold.typeface.json', function (font){
            var textGeo = new THREE.TextBufferGeometry("Shoot the approaching horde!", {
            font: font,
            size: 0.15,
            height: 0.02,
            curveSegments: 3,
            });
            var textMaterial = new THREE.MeshBasicMaterial({color: 0x140d73});
            var debug_mesh = new THREE.Mesh(textGeo, textMaterial);
      	    debug_mesh.position.x = -1.5;
      	    debug_mesh.position.y = 3;
      	    debug_mesh.position.z = -4;
      	    exhibit.add(debug_mesh);
      	});
        loader.load('extern/fonts/helvetiker_bold.typeface.json', function (font){
        var scoreText = new THREE.TextBufferGeometry("Score: " + "I".repeat(score), {
        font: font,
        size: 0.15,
        height: 0.02,
        curveSegments: 3,
        });
        var textMaterial = new THREE.MeshBasicMaterial({color: 0x140d73});
        var score_mesh = new THREE.Mesh(scoreText, textMaterial);
        score_mesh.position.x = -.5;
        score_mesh.position.y = 2.6;
        score_mesh.position.z = -4;
        exhibit.add(score_mesh);
    });

    var enemy = new ENEMY.enemy();
    enemy.position.set(-5,1,-40);
    exhibit.add(enemy);
    enemyList.push(enemy);
    animatedObjects.push(enemy);

    enemy.setAnimation(
      function(dt){
        if (gameRunning == 1){
        this.position.z += enemySpeed;
        }

        if (this.position.z >= -2){
          this.position.z = -60;
        }

      });


    var enemy2 = new ENEMY.enemy();
    enemy2.position.set(0,1,-30);
    exhibit.add(enemy2);
    enemyList.push(enemy2);
    animatedObjects.push(enemy2);

    enemy2.setAnimation(
      function(dt){
        if (gameRunning == 1){
        this.position.z += enemySpeed;
        }

        if (this.position.z >= -2){
          this.position.z = -60;
        }

      });

    var enemy3 = new ENEMY.enemy();
    enemy3.position.set(5,1,-35);
    exhibit.add(enemy3);
    enemyList.push(enemy3);
    animatedObjects.push(enemy3);

    enemy3.setAnimation(
      function(dt){
        if (gameRunning == 1){
        this.position.z += enemySpeed;
        }

        if (this.position.z >= -2){
          this.position.z = -60;
        }

      });

      var signGeometry = new THREE.BufferGeometry();
      var signVertices = new Float32Array( [

        7,0,0,
        7,3,0,
        6,0,0,

        -7,3,0,
        -7,0,0,
        -6,0,0,

        8,0,0,
        7,5.5,0,
        7,0,0,

        -7,5.5,0,
        -8,0,0,
        -7,0,0,

        7,3,0,
        7,5.5,0,
        -7,5.5,0,


        -7,5.5,0,
          -7,3,0,
        7,3,0

      ] );

      // itemSize = 3 because there are 3 values (components) per vertex
      signGeometry.setAttribute( 'position', new THREE.BufferAttribute( signVertices, 3 ) );
      var signMaterial = new THREE.MeshBasicMaterial( { color: 0x804700} );
      var signMesh = new THREE.Mesh( signGeometry, signMaterial );
      signMesh.position.z = -10;
      exhibit.add(signMesh);

      var barrierGeometry = new THREE.BufferGeometry();
      var barrierVertices = new Float32Array( [

        7,1,0,
        -7,1,0,
        7,0,0,

        7,1,0,
        -7,1,0,
        -7,0,0

      ] );

      // itemSize = 3 because there are 3 values (components) per vertex
      barrierGeometry.setAttribute( 'position', new THREE.BufferAttribute( barrierVertices, 3 ) );
      var barrierMaterial = new THREE.MeshBasicMaterial( { color: 0x804700} );
      var barrierMesh = new THREE.Mesh( barrierGeometry, barrierMaterial );
      barrierMesh.position.z = -1;
      exhibit.add(barrierMesh);

      var postLeft = new THREE.Mesh(
    	    new THREE.CylinderGeometry(0.3, 0.3, 3, 32),
    	    new THREE.MeshPhongMaterial({color: 0x804700}));
        exhibit.add(postLeft);
        postLeft.position.x = -6.5;
        postLeft.position.z = -1;

        var postRight = new THREE.Mesh(
      	    new THREE.CylinderGeometry(0.3, 0.3, 3, 32),
      	    new THREE.MeshPhongMaterial({color: 0x804700}));
          exhibit.add(postRight);
          postRight.position.x = 6.5;
          postRight.position.z = -1;

          var backLeft = new THREE.Mesh(
        	    new THREE.CylinderGeometry(1, 1, 1, 32),
        	    new THREE.MeshPhongMaterial({color: 0x804700}));
            exhibit.add(backLeft);
            backLeft.position.x = -7;
            backLeft.position.z = -10;

            var backRight = new THREE.Mesh(
          	    new THREE.CylinderGeometry(1, 1, 1, 32),
          	    new THREE.MeshPhongMaterial({color: 0x804700}));
              exhibit.add(backRight);
              backRight.position.x = 7;
              backRight.position.z = -10;

              var tallLeft = new THREE.Mesh(
            	    new THREE.CylinderGeometry(0.3, 0.3, 11, 32),
            	    new THREE.MeshPhongMaterial({color: 0x804700}));
                exhibit.add(tallLeft);
                tallLeft.position.x = -7;
                tallLeft.position.z = -10;

                var tallRight = new THREE.Mesh(
              	    new THREE.CylinderGeometry(0.3, 0.3, 11, 32),
              	    new THREE.MeshPhongMaterial({color: 0x804700}));
                  exhibit.add(tallRight);
                  tallRight.position.x = 7;
                  tallRight.position.z = -10;

    this.add(exhibit);
      }
}
