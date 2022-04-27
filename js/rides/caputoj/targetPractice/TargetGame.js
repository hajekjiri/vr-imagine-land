import * as THREE from '../../../../extern/build/three.module.js';
import * as GUIVR from '../../../GuiVR.js';
import * as USER from '../../../User.js';
import { Ball } from './Ball.js';
import { Instructions } from './Instructions.js';
import { ScoreBoard } from './ScoreBoard.js';
import { Target } from './Target.js';
import { Timer } from './Timer.js';


export class TargetGame extends THREE.Group {
  constructor(userRig, numRows, numCols, maxTime, gravity) {
    super();
    this.mountedGame = false;
    this.gameStart = false;

    // Default parameter values.
    this.numRows = numRows === undefined ? 5 : numRows;
    this.numCols = numCols === undefined ? 5 : numCols;
    this.maxTime = maxTime === undefined ? 60 : maxTime;
    this.gravity = gravity === undefined ? 0.75 : gravity;

    var game = new THREE.Group();

    var textInstructions = new Instructions();

    var ball = new Ball();
    var balls = [];

    var boxes = [];
    var numBoxes = this.numRows * this.numCols;

    var gap = 2;

    var xPos = (-1 * this.numCols) + 1;
    var yPos = this.numRows;
    var zPos = (-2 * this.numRows) + 1;

    var capColor;
    for (var i = 0; i < numBoxes; i++) {

      if (i % 3 == 0) {
        capColor = 0x0000ff;
      } else if (i % 3 == 1) {
        capColor = 0x00ff00;
      } else if (i % 3 == 2) {
        capColor = 0xff0000;
      }

      var milkWidth = 1.075;
      var box = new Target(1.075, 2.45, milkWidth, capColor);
      box.position.x = xPos;
      box.position.y = yPos;
      box.position.z = zPos;

      box.scale.x = 0.5;
      box.scale.y = 0.5;
      box.scale.z = 0.5;
      boxes.push(box);
      game.add(box);
      xPos += gap;

      if (i % this.numCols == this.numCols - 1) {
        var boardWidth = ((this.numCols - 1) * gap) + (milkWidth);
        var boardGeometry = new THREE.BoxGeometry(boardWidth, 0.25, 0.5);
        var boardMaterial = new THREE.MeshPhongMaterial( {color: 0x654321} );
        var board = new THREE.Mesh(boardGeometry, boardMaterial);
        board.position.y = yPos - 0.125;
        board.position.z = zPos;
        game.add(board);

        var standHeight = board.position.y + 0.1;
        var standGeometry = new THREE.CylinderGeometry(0.3, 0.3, standHeight);
        var standMaterial = new THREE.MeshPhongMaterial( {color: 0x23120b} );
        var stand = new THREE.Mesh(standGeometry, standMaterial);
        stand.position.x = board.position.x - (boardWidth / 2) + 0.3;
        stand.position.y = (yPos / 2) - 0.235;
        stand.position.z = zPos;
        game.add(stand);
        var stand2 = stand.clone();

        stand2.position.x = board.position.x + (boardWidth / 2) - 0.3;
        game.add(stand2);

        xPos = (-1 * this.numCols) + 1;
        yPos -= 1;
        zPos -= -1;
      }
    }

    var targetGame = this;

    var settings = [
      new GUIVR.GuiVRButton("Gravity", this.gravity * 100, 0, 100, true,function(x){
        targetGame.gravity = x / 100;
      }),
      new GUIVR.GuiVRButton("Time", this.maxTime, 0, 60, true,function(x){
        targetGame.maxTime = x;
      }),
      new GUIVR.GuiVRButton("Distance", 0, 0, 10, true,function(x){
        game.position.z = -1 * x;
      })];
    var settingsSign = new GUIVR.GuiVRMenu(settings);
    this.add(settingsSign);

    var gameButtons = [
      new GUIVR.GuiVRButton("Start", 0, 0, 1, true,function(x){
        if (x == 1) {
          targetGame.gameStart = true;
          targetGame.timer.updateTime(targetGame.maxTime);
        } else {
          targetGame.gameStart = false;
        }
      }),
      new GUIVR.GuiVRButton("Instruction", 0, 0, 1, true,function(x){
        if (x == 1) {
          textInstructions.visible = true;
          textInstructions.position.y = 2;
          textInstructions.position.z = -1;
          var targetGame = this.parent.parent.parent.parent;
          targetGame.add(textInstructions);
        } else {
          textInstructions.visible = false;
        }
      }),
      new GUIVR.GuiVRButton("Settings", 0, 0, 1, true,function(x){
        if (x == 1) {
          settingsSign.visible = true;
          settingsSign.position.y = 2;
          settingsSign.position.z = -1;
          var targetGame = this.parent.parent.parent.parent;
          targetGame.add(settingsSign);
        } else {
          settingsSign.visible = false;
        }
      })];

    var gameSign = new GUIVR.GuiVRMenu(gameButtons);
    gameSign.position.y = 1;
    gameSign.position.z = -1;

    this.scoreBoard = new ScoreBoard();
    this.scoreBoard.position.x = -3;
    this.scoreBoard.position.z = -2;
    this.add(this.scoreBoard);

    this.score = 0;
    this.scoreBoard.updateScore(this.score);

    this.timer = new Timer();
    this.timer.position.x = 3;
    this.timer.position.z = -2;
    this.add(this.timer)

    this.add(new USER.UserPlatform(
      userRig,
      function (){
        this.parent.mountedGame = true;
        userRig.add(gameSign);

        // Get controller's position
  	    let controller = userRig.getController(0);
  	    // Add new model for controller (should be removed on leaving).
        ball.position.y = controller.position.y;
        controller.add(ball);


  	    // Set animation to check whether trigger button is
  	    // pressed and then fire a projectile in the frame of the
  	    // controller if is and enough time has elapsed since last
  	    // firing.
        this.prevTrig = false;
  	    controller.setAnimation(
          function (upperDt){
            var game = this.parent.parent.parent;
            if (game.mountedGame && game.gameStart) {
              if (this.t == undefined){
                this.t = 0;
              }
              this.t += upperDt;

              userRig.remove(gameSign);
              textInstructions.visible = false;
              settingsSign.visible = false;

              this.nowTrig = controller.triggered;
              if (this.nowTrig && !this.prevTrig) {
                this.prevControllerPosX = controller.position.x;
                this.prevControllerPosY = controller.position.y;
                this.prevControllerPosZ = controller.position.z;
              } else if (!this.nowTrig && this.prevTrig && (this.t - this.lastFire >= 10
                || this.lastFire == undefined)) {
                  this.lastFire = this.t;
                  // Create new projectile and set up motion.
                  let proj = ball.clone();
                  balls.push(proj);

                  this.parent.parent.parent.add(proj);
                  proj.position.set(controller.position.x, controller.position.y, controller.position.z);

                  proj.setAnimation(
                    function (dt){
                      if (this.t == undefined){
                        this.t = 0;
                      }
                      this.t += dt;

                      var thisGravity = this.parent.gravity;

                      if (this.velX == undefined) {
                        this.velX = (controller.position.x - controller.prevControllerPosX) / dt;
                      }
                      if (this.velY == undefined) {
                        this.velY = (controller.position.y - controller.prevControllerPosY) / dt;
                      }
                      if (this.velZ == undefined) {
                        this.velZ = (controller.position.z - controller.prevControllerPosZ) / dt;
                      }

                      if (this.position.y < 0.3 && this.velY < 0) {
                        this.velX *= thisGravity;
                        this.velY *= -1 * thisGravity;
                        this.velZ *= thisGravity;
                      } else {
                        this.velY = this.velY - (thisGravity * dt);
                      }

                      if (this.spinZ == undefined) {
                        this.spinZ = this.velZ * 25;
                      }
                      if (this.spinX == undefined) {
                        this.spinX = this.velX * 25;
                      }

                      if (this.velX > 0) {
                        this.rotation.y -= THREE.Math.degToRad(this.spinX);
                      } else if (this.velX < 0) {
                        this.rotation.y += THREE.Math.degToRad(this.spinX);
                      }

                      if (this.velZ > 0) {
                        this.rotation.x -= THREE.Math.degToRad(this.spinZ);
                      } else if (this.velZ < 0) {
                        this.rotation.x += THREE.Math.degToRad(this.spinZ);
                      }

			this.position.x += this.velX * (dt);// * upperDt);
			this.position.y += this.velY * (dt);// * upperDt);
			this.position.z += this.velZ * (dt);// * upperDt);
                      this.spinX *= 0.98;
                      this.spinZ *= 0.98;

                      // Cause the projectile to disappear after t is 20.
                      if (this.t > 100){
                        proj.visible = false;
                      }
                    }
                  );
                }
                this.prevTrig = this.nowTrig;
            } else {
              game.mountedGame = true;
            }
          }
        );
	    },
	function (){
	    let controller = userRig.getController(0);
	    // Clear the model added to controller.
	    controller.remove(ball);
	    // Remove special animation attached to controller.
	    controller.setAnimation(undefined);
      userRig.remove(gameSign);
      this.parent.mountedGame = false;
	}
    ));

    this.setAnimation(
      function (dt){
        if (this.mountedGame && this.gameStart) {
          if (this.t == undefined) {
            this.t = 0;
          }
          this.t = this.t + dt;

          this.timer.updateTime(this.maxTime - Math.round(this.t / 6.5));

          for (var i = 0; i < balls.length; i++) {
            for (var j = 0; j < boxes.length; j++) {
              var thisBall = balls[i];
              var thisBox = boxes[j];
              var xBoxPos = thisBox.position.x;
              var yBoxPos = thisBox.position.y;
              var zBoxPos = thisBox.position.z;
              var boxHalfWidth = thisBox.getWidth() / 2;
              var boxHalfHeight = thisBox.getHeight() / 2;
              var boxHalfDepth = thisBox.getDepth() / 2
              var xCollision = (thisBall.position.x - thisBall.getRadius() < boxHalfWidth + xBoxPos) &&
              (thisBall.position.x + thisBall.getRadius() > boxHalfWidth * -1 + xBoxPos);
              var yCollision = (thisBall.position.y - thisBall.getRadius() < boxHalfHeight + yBoxPos) &&
              (thisBall.position.y + thisBall.getRadius() > boxHalfHeight * -1 + yBoxPos);
              var zCollision = (thisBall.position.z - thisBall.getRadius() < boxHalfDepth + zBoxPos) &&
              (thisBall.position.z + thisBall.getRadius() > boxHalfDepth * -1 + zBoxPos);
              var standing = !thisBox.children[0].boxCollided;

              if (xCollision && yCollision && zCollision && standing) {
                thisBall.velZ *= -1;
                thisBox.children[0].boxCollided = true;
                this.score++;
                this.scoreBoard.updateScore(this.score);
              }
            }
          }

          if (Math.round(this.t / 6.5) >= this.maxTime) {
            this.timer.updateTime("Times Up!");
            this.gameStart = false;
          }
        }
      })
      this.add(game);
  }
}
