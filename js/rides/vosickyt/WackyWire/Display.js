
import * as THREE from '../../../../extern/three.module.js';
const FONT_SIZE = 14;

export default class Board extends THREE.Group {
  constructor() {
    super();

    this.w = 50;
    this.h = 25;

    this.ctx = document.createElement('canvas').getContext('2d');
    this.ctx.canvas.width = 300;
    this.ctx.canvas.height = 150;

    this.texture = new THREE.CanvasTexture(this.ctx.canvas);
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.minFilter = THREE.LinearFilter;
    this.updateTexture();

    var c = new THREE.Mesh(new THREE.BoxBufferGeometry(this.w, this.h, 1),
      new THREE.MeshBasicMaterial({ map: this.texture, side: THREE.DoubleSide }));
    this.add(c);
    c.position.y = 52;
    c.rotation.x = -Math.PI / 4;


    var geometry = new THREE.CylinderBufferGeometry(2, 2, 50);
    var material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    var cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.y = 25;
    this.add(cylinder);


    this.position.x = 150;

  }

  updateTexture() {
    var debugOutput = `Welcome to Wacky Wire.

Use your left controller to move
loop from one side to another
side of the shape without
touching wire.`;

    var ctx = this.ctx;
    // Clear the canvas.
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#AAAAAA';
    ctx.fillRect(2, 2, ctx.canvas.width - 4, ctx.canvas.height - 4);
    // Display the output.
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Courier';
    var lines = debugOutput.split('\n');
    for (var i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 15, FONT_SIZE + FONT_SIZE * 1.25 * i);
    }
    // Force the renderer to update the texture.
    this.texture.needsUpdate = true;
  }
}
