import * as THREE from '../../../../extern/build/three.module.js';
import { MessageBoard } from './MessageBoard.js';

export class Timer extends THREE.Group {
  constructor() {
    super();

    var board = new THREE.Group();

    this.scoreBoard = new MessageBoard(2.5, "", 75);
    this.scoreBoard.scale.set(0.35, 0.35, 0.35);
    this.scoreBoard.position.y = 1.125;
    this.scoreBoard.position.z = 0.225;

    this.scoreBoard.write("Time Left:");

    var scoreStandGeometry = new THREE.CylinderGeometry(0.075, 0.075, 2);
    var scoreStandMaterial = new THREE.MeshPhongMaterial( {color: 0x50c878} );
    var scoreStand = new THREE.Mesh(scoreStandGeometry, scoreStandMaterial);
    board.add(scoreStand);

    var scoreBoardGeo = new THREE.BoxGeometry(1, 0.8, 0.1);
    var scoreBoardMat = new THREE.MeshPhongMaterial( {color: 0x50c878} );
    var backBoard = new THREE.Mesh(scoreBoardGeo, scoreBoardMat);
    backBoard.position.y = 1.125;
    backBoard.position.z = 0.125;
    board.add(backBoard);

    board.add(this.scoreBoard);
    board.rotation.y = THREE.Math.degToRad(-45);

    this.add(board);
  }

  updateTime(newTime) {
    this.scoreBoard.clear();
    this.scoreBoard.write("Time Left:");
    this.scoreBoard.write(newTime);
  }
}
