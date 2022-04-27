
import * as THREE from '../../../../extern/build/three.module.js';
const FONT_SIZE = 14;

export default class Board extends THREE.Group {
  constructor() {
    super();

    this.w = 70;
    this.h = 35;

    this.ctx = document.createElement('canvas').getContext('2d');
    this.ctx.canvas.width = 256;
    this.ctx.canvas.height = 128;

    this.texture = new THREE.CanvasTexture(this.ctx.canvas);
    this.texture.magFilter = THREE.NearestFilter;
    this.updateTexture();

    var box = new THREE.Mesh(new THREE.BoxBufferGeometry(this.w, this.h, 1),
      new THREE.MeshBasicMaterial({ color: 0x000000 }));
    this.add(box);

    var plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.w, this.h),
      new THREE.MeshBasicMaterial({ map: this.texture, side: THREE.DoubleSide }));
      plane.position.z = 0.6;
    box.add(plane);
    box.position.y = 82;
    box.rotation.x = -Math.PI / 4;

    var geometry = new THREE.CylinderBufferGeometry(2, 2, 80);
    var material = new THREE.MeshStandardMaterial({ color: 0x000000 });
    var cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.y = 80/2;
    this.add(cylinder);

    this.position.x = 150;
    this.position.z = -65;
    this.rotation.y = -Math.PI/10;

  }

  updateTexture() {
    var debugOutput = `Welcome to Wacky Wire.

Use your left controller to move
loop from one side to another
side of the shape without
touching wire.

Start by pressing back button.`;

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
