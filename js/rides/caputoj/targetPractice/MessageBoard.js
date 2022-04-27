import * as THREE from '../../../../extern/build/three.module.js';

// Constants determining size of text and window.
const NUM_LINES = 13;

// Class for displaying  text in VR.  Specialized THREE.Group.
export class MessageBoard extends THREE.Group {

    // Creates a new instance with the specified width in world units.
    constructor(width, message, fontSize){
      super(width);

      this.output = "";
      this.fontSize = fontSize;

      // Determine world dimensions of consoles.
    	this.w = width;
    	this.h = 0.14 * NUM_LINES;

    	// Create canvas that will display the output.
    	this.ctx = document.createElement('canvas').getContext('2d');
    	this.ctx.canvas.width = 512;
    	this.ctx.canvas.height = 512;
    	// Create texture from canvas.
    	this.texture = new THREE.CanvasTexture(this.ctx.canvas);
    	this.texture.magFilter = THREE.LinearFilter;
    	this.texture.minFilter = THREE.LinearFilter;
    	this.updateTexture(this.fontSize);

    	var c = new THREE.Mesh(new THREE.PlaneBufferGeometry(this.w, this.h),
    			       new THREE.MeshBasicMaterial({map: this.texture}));
    	this.add(c);

      var loader = new THREE.FontLoader();
    	var current = this;
    	loader.load( 'extern/fonts/helvetiker_bold.typeface.json', function ( font ) {
    	    var textGeo = new THREE.TextBufferGeometry( message, {
    		font: font,
    		size: 0.1,
    		height: 0.02,
    		curveSegments: 3,
    	    } );
    	    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xad7fa8, specular: 0x111111 } );
    	    var mesh = new THREE.Mesh( textGeo, textMaterial );
    	    mesh.position.x = -current.w / 2 + 0.02;
    	    mesh.position.y = current.h / 2 + 0.03;
    	    mesh.position.z = 0.01;
    	    current.add(mesh);
    	});
    }

    // Update the texture of this board to match the current output.
    updateTexture(fontSize){
    	var ctx = this.ctx;

    	ctx.fillStyle = '#AA00AA';
    	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    	ctx.fillStyle = '#AAAAAA';
    	ctx.fillRect(2, 2, ctx.canvas.width-4, ctx.canvas.height-4);
    	// Display the output.
    	ctx.fillStyle = '#000000';
    	ctx.font = "bold " + fontSize + "px Courier";
    	var lines = this.output.split('\n');
    	for (var i = 0; i < lines.length; i++){
    	    ctx.fillText(lines[i], 15, fontSize + fontSize * 1.25 * i);
    	}
    	this.texture.needsUpdate = true;
    }

    // Writes msg to board.  Scrolls if lines more than
    // NUM_LINES.  Overlong lines are cropped when displayed.
    write(msg){
        this.output += msg + "\n";

        // Determine the lines of text that appear.
        var lines = this.output.split('\n');
        lines = lines.slice(-NUM_LINES-1, -1);
        this.output = lines.join("\n") + "\n";

        // Update the display of board.
        this.updateTexture(this.fontSize);
    }

    clear(){
    	this.output = "";
    	this.updateTexture(this.fontSize);
    }
}
