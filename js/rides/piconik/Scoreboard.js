// Author: Matthew Anderson & Kallan Piconi
// CSC 385 Computer Graphics
// Version: Winter 2020
// Project 1: Scoreboard.
// Scoreboard, displays text outputs as GuiVR object.

import * as THREE from '../../../extern/build/three.module.js';
import * as GUIVR from './GuiVR.js';

// Constants determining size of text and window.
const NUM_LINES = 13;
const FONT_SIZE = 300;

const scoreboards = [];
var scoreOutput = "";

// Writes msg to all active scoreboards.  Scrolls if lines more than
// NUM_LINES.  Overlong lines are cropped when displayed.
export function scoreWrite(msg){
    scoreOutput += msg + "\n";

    // Determine the lines of text that appear.
    var lines = scoreOutput.split('\n');
    lines = lines.slice(-NUM_LINES-1, -1);
    scoreOutput = lines.join("\n") + "\n";

    // Update the display of all scoreboards.
    for (var i = 0; i < scoreboards.length; i++){
        scoreboards[i].updateTexture();
    }
}

// Class for displaying score text in VR.  Specialized THREE.Group.
export class Scoreboard extends GUIVR.GuiVR {

    // Creates a new instance with the specified width in world units.
    constructor(w){
        super();
        this.score = 0;

        // Determine world dimensions of boards.
        this.w = w;
        this.h= .9;
        //this.h = 0.14 * NUM_LINES;

        // Create canvas that will display the output.
        this.ctx = document.createElement('canvas').getContext('2d');
        this.ctx.canvas.width = 512;
        this.ctx.canvas.height = 512;
        // Create texture from canvas.
        this.texture = new THREE.CanvasTexture(this.ctx.canvas);
        this.texture.magFilter = THREE.LinearFilter;
        this.texture.minFilter = THREE.LinearFilter;
        this.updateTexture();
        // Create rectangular mesh textured with output that is displayed.
        var c = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.w, this.h),
            new THREE.MeshBasicMaterial({map: this.texture}));
        this.add(c);
        // Set the board's rectangle to collider as a gui element.
        this.collider = c;

        // Make a fancy 3D label "Score" at the top.
        var loader = new THREE.FontLoader();
        var current = this;
        loader.load( 'extern/fonts/helvetiker_bold.typeface.json', function ( font ) {
            var textGeo = new THREE.TextBufferGeometry( "  Score", {
                font: font,
                size: 0.2,
                height: 0.02,
                curveSegments: 3,
            } );
            var textMaterial = new THREE.MeshPhongMaterial( { color: '#655421', specular: 0x111111 } );
            var score_mesh = new THREE.Mesh( textGeo, textMaterial );
            score_mesh.position.x = -current.w / 2 + 0.02;
            score_mesh.position.y = current.h / 2 + 0.03;
            score_mesh.position.z = 0.01;
            current.add(score_mesh);
        });

        // Register in a list of all the scoreboards created so that
        // new output can be mirrored to all.
        scoreboards.push(this);
        scoreWrite(this.score);
    }

    // Update the texture of this board to match the current scoreOutput.
    updateTexture(){
        var ctx = this.ctx;
        // Clear the canvas.
        ctx.fillStyle = '#AA00AA';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#AAAAAA';
        ctx.fillRect(2, 2, ctx.canvas.width-4, ctx.canvas.height-4);
        // Display the output.
        ctx.fillStyle = '#000000';
        ctx.font = "bold " + FONT_SIZE.toString() + "px Courier";
        var lines = scoreOutput.split('\n');
        for (var i = 0; i < lines.length; i++){
            ctx.fillText(lines[i], 15, FONT_SIZE + FONT_SIZE * 1.25 * i);
        }
        // Force the renderer to update the texture.
        this.texture.needsUpdate = true;
    }

    // Click handler, resets all Scoreboards.
    collide(uv, pt){
        this.clear();
    }

    // Resets all ScoreBoards.
    clear(){
        // Empty debugOutput.
        scoreOutput = "";
        // Update the display of all DebugConsoles.
        for (var i = 0; i < scoreboards.length; i++){
            scoreboards[i].updateTexture();
        }

    }

    increaseScore(){
        this.score +=1;
        this.clear();
        scoreWrite(this.score);
    }

}
