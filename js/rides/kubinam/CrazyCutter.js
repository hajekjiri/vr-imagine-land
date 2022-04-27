import * as THREE from '../../../extern/build/three.module.js';
import {BasicObject} from './GameObjects.js';
import * as USER from '../../User.js';
import * as GUIVR from '../../GuiVR.js';

//todo prvni udelat while smycku ze ktere budou padat hovna
//todo button start a game, stop a game maybe
export class CrazyCutter extends THREE.Group {
    constructor(userRig, speedInt, genInt, threshold, userView, objectLen, speedShot) {
        super();

        //if quest

        this.bl = false;
        this.score = 0;
        this.init = 1;
        this.threshold = threshold;
        this.introText = new Text(userView[3], -3 + 0.3, userView[0]/3, objectLen, this.threshold);
        this.add(this.introText);
        this.scoreText;
        this.speedShot = speedShot;
        let stand = new Stand(userView, objectLen);
        this.add(stand);
        this.buttons = undefined;
        this.userView = userView;
        this.time = genInt[0];
        this.speed = speedInt[0];
        this.objectLen = objectLen;
        this.arrayObjects = [];
        this.projectileLen = 0.05;
        this.firstInterval;
        this.buttons;
        this.secondInterval;
        var sign;
        let that = this;
//


        var geometry = new THREE.BufferGeometry();
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
        var vertices = new Float32Array( [


            ////////

            -1, 0, 0,
            1,0, 0,
            1, 2, 0,

            1, 2, 0,
            -1, 2, 0,
            -1, 0, 0,

            1,0,0,
            2,1,0,
            1,2,0,

            1,2,0,
            0,4,0,
            -1,2,0,

            -1,2,0,
            -2, 1,0,
            -1,0,0,

            -1,0,0,
            0,-2,0,
            0,0,0,

            0,-2,0,
            1,0,0,
            0,0,0




        ] );

// itemSize = 3 because there are 3 values (components) per vertex
        geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.z = -0.05;
        mesh.position.y = -0.025
        //mesh.position.y = 1;

        mesh.scale.set(0.02,0.02, 0.02);



        ////
        /*

        let controllerModel = new THREE.Mesh(
            new THREE.BoxGeometry(that.projectileLen, that.projectileLen, that.projectileLen),
            new THREE.MeshPhongMaterial({color: 0xff0000}));*/
        let controllerModel = mesh;
        this.plt = new USER.UserPlatform(
            userRig,
            function () {


                // Get controller's position
                let controller = userRig.getController(0);
                // Add new model for controller (should be removed on leaving).
                controller.add(controllerModel);
                // Set animation to check whether trigger button is
                // pressed and then fire a projectile in the frame of the
                // controller if is and enough time has elapsed since last
                // firing.

                that.buttons = [new GUIVR.GuiVRButton("Start", that.init, 0, 1, true,
                    function(x){
                        if (!x){
                            that.runs = true;
                            that.remove(that.introText);
                            that.scoreText = new Score(userView[3],userView[0],userView[1], objectLen, that.score, that.threshold, speedShot, genInt[0], speedInt[0]);
                            that.add(that.scoreText);
                            //initializing objects
                            that.firstInterval = setInterval(function(){
                                that.addObject();
                            },that.lowerTime(genInt[1]));

                            that.secondInterval = setInterval(function(){
                                that.speedUp(speedInt[2]);
                            },speedInt[1]);


                            controller.setAnimation(
                                function (dt){
                                    if (this.t == undefined){
                                        this.t = 0;
                                    }
                                    this.t += dt;
                                    // Decide to fire.
                                    if (controller.triggered
                                        && (this.t - this.lastFire >= 3
                                            || this.lastFire == undefined)){
                                        this.lastFire = this.t;
                                        // Create new projectile and set up motion.
                                        let proj = controllerModel.clone();
                                        let tempGroup = new THREE.Group();
                                        tempGroup.position.x = controller.position.x;
                                        tempGroup.position.y = controller.position.y;
                                        tempGroup.position.z = controller.position.z;
                                        tempGroup.rotation.x = controller.rotation.x;
                                        tempGroup.rotation.y = controller.rotation.y;
                                        tempGroup.rotation.z = controller.rotation.z;

                                        tempGroup.add(proj);
                                        that.add(tempGroup);
                                        proj.setAnimation(
                                            function (dt){
                                                if (this.t == undefined){
                                                    this.t = 0;
                                                }
                                                this.t += that.speedShot;
                                                this.position.z -= that.speedShot;
                                                this.updateMatrixWorld();
                                                let coords = new THREE.Vector3();
                                                coords.setFromMatrixPosition(this.matrixWorld);

                                                for (var i = 0; i < that.arrayObjects.length; ++i){
                                                    var obj = that.arrayObjects[i];
                                                    obj.updateMatrixWorld();
                                                    var coordsNew = new THREE.Vector3();
                                                    coordsNew.setFromMatrixPosition(obj.matrixWorld);

                                                    var edge2 = (coordsNew.x + that.objectLen/2);

                                                    var edge1 = (coordsNew.x - that.objectLen/2);

                                                    var edge22 = (coordsNew.y + that.objectLen/2);

                                                    var edge11 = (coordsNew.y - that.objectLen/2);

                                                    var edge222 = (coordsNew.z + that.objectLen/2);

                                                    var edge111 = (coordsNew.z - that.objectLen/2);

                                                    if(that.isInRange(coords.x, edge1, edge2)
                                                        && that.isInRange(coords.y, edge11, edge22)
                                                        && that.isInRange(coords.z, edge111, edge222)){
                                                        that.score++;
                                                        //removing from array
                                                        that.removeFromArr(obj);
                                                        //removing obj
                                                        that.remove(obj);
                                                        //removing animation
                                                        this.parent.remove(this);
                                                    }
                                                }

                                                if (this.position.z < that.userView[3] - 2){
                                                    this.parent.remove(this);

                                                }
                                            }
                                        );
                                    }
                                }
                            );

                        }else{
                            that.endGame(threshold, that.firstInterval, that.secondInterval, speedShot, genInt[0], speedInt[0]);
                        }

                    })];

                sign = new GUIVR.GuiVRMenu(that.buttons);
                sign.position.x = 0;
                sign.position.z = -2;
                sign.position.y = 0.4;
                that.add(sign);
            },
            function () {
                that.buttons[0] = undefined;
                that.buttons = [];
                that.remove(sign);
                //that.sign = undefined;
                if(that.runs == true){
                    that.endGame(threshold, that.firstInterval, that.secondInterval, speedShot, genInt[0], speedInt[0]);

                }{

                    that.runs = false;
                    that.add(that.introText);
                    that.score = 0;
                    that.threshold = threshold;
                    that.arrayObjects = [];
                    that.speedShot = speedShot;
                    that.time = genInt;
                    that.speed = speedInt;
                    that.counter = 0;
                    that.bl = false;
                }
                that.bl = false;
                that.score = 0;
                that.threshold = threshold;
                that.speedShot = speedShot;
                that.arrayObjects = [];
                let controller = userRig.getController(0);
                // Clear the model added to controller.
                controller.remove(controllerModel);

                // Remove special animation attached to controller.
                controller.setAnimation(undefined);
            }
        );
        this.add(this.plt);
    }



    addObject() {
        let cube = new BasicObject(this.objectLen, this.speed, this);
        cube.position.x = this.getRandomFloat(-this.userView[0] / 2, this.userView[0] / 2);
        var index = this.arrayObjects.length;
        cube.index = index;
        this.arrayObjects.push(cube);
        this.add(cube);
    }

    endGame(threshold, firstInterval, secondInterval, speedShot, genInt, speedInt){
        for (var i = 0; i < this.arrayObjects.length; ++i) {
            let obj = this.arrayObjects[i];
            //this.removeFromArr(obj);
            this.remove(obj);
        }
        this.init = 1;
        this.arrayObjects = [];
        this.runs = false;
        this.remove(this.scoreText);
        this.add(this.introText);
        this.score = 0;
        this.threshold = threshold;
        clearTimeout(firstInterval);
        clearTimeout(secondInterval);
        this.arrayObjects = [];
        this.speedShot = speedShot;
        this.time = genInt;
        this.speed = speedInt;
        this.counter = 0;
        this.bl = false;
    }

    speedUp(dSpeed) {
        this.speed += dSpeed;
    }

    lowerTime(dGen) {
        return this.time -= dGen;
    }

    getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    isInRange(x, min, max) {
        if (x <= max + this.projectileLen / 2 && x >= min - this.projectileLen / 2) {
            return true;
        }
        return false;
    }


    removeFromArr(what) {
        this.arrayObjects.splice(this.arrayObjects.indexOf(what), 1);

    }

}

class Text extends THREE.Group{
    constructor(offsetZ, offsetX, offsetY, objectLen, threshold) {
        super();
        let introText = 'Hello gamer, your destiny is to shoot fruit falling down. You may use your\n right controller to trigger a projectile. Be careful of missed fruits! The\n threshold is just ' + threshold + '. Otherwise Game Over! Also the game is going to speed\n up and more fruit will be falling down. Red line shows remaining threshold\n Green line shows your progress." tap on the right side of the button for start.\n It is an neverending game GLHF';

        let loader = new THREE.FontLoader();
        let geometry;
        let that = this;
        loader.load( 'extern/fonts/helvetiker_bold.typeface.json', function ( font ) {

            geometry = new THREE.TextBufferGeometry( introText, {
                font: font,
                size: 0.11,
                height: 0.05
        } );
            let textMaterial = new THREE.MeshPhongMaterial({color: 0x133337});

            let mesh = new THREE.Mesh( geometry, textMaterial );
            that.add(mesh);
        } );

        this.position.z = offsetZ  + objectLen/2;
        this.position.x = offsetX ;
        this.position.y = offsetY;

    }
}

class Score extends THREE.Group{
    constructor(offsetZ, offsetX, offsetY, objectLen, score, threshold,speedShot, genInt,speedInt) {
        super();

        let width1 = 0.1;
        this.xLength = offsetX - 0.2;
        this.xChange = this.xLength/threshold;
        this.myLength = width1;
        this.myChange = this.xLength/200;

        let that = this;
        this.oldScore = score;
        this.oldThreshold = threshold;
        let width = this.xLength;
        let geometry = new THREE.BoxBufferGeometry( width, 0.1 , 0.1 );
        let textMaterial = new THREE.MeshPhongMaterial({color: 0xFF0000});
        let mesh = new THREE.Mesh(geometry, textMaterial);
        this.add(mesh);

        let geometry1 = new THREE.BoxBufferGeometry( width1, 0.1 , 0.1 );
        let textMaterial1 = new THREE.MeshPhongMaterial({color: 0x00FF00});
        let mesh1 = new THREE.Mesh(geometry1, textMaterial1);
        mesh1.position.y = -offsetY*3/4 - 0.4 ;
        mesh1.position.z = 0.1;
        this.add(mesh1);

        mesh.setAnimation(
                function (dt){

                    if(that.oldThreshold != that.parent.threshold){

                        that.oldThreshold = that.parent.threshold;
                        width -= that.xChange;
                        let scale = width / that.xLength;

                        if (scale <= 0){
                            that.bl = true;
                            that.parent.endGame(threshold, that.parent.firstInterval, that.parent.secondInterval, speedShot, genInt, speedInt);
                        }
                        mesh.scale.set(scale, 1, 1);
                    }
                });

        mesh1.setAnimation(
            function (dt){
                if (!that.bl == true){
                    if( that.oldScore != that.parent.score) {
                        that.oldScore = that.parent.score;
                        width1 += that.myChange;
                        let scale = width1/that.myLength ;
                        mesh1.scale.set(scale, 1, 1);
                    }
                }

            });
        this.position.z = offsetZ + 0.1 + objectLen;
        //this.position.x = offsetX;
        this.position.y = offsetY;

    }
}

class Stand extends THREE.Group{
    constructor(userView, objectLen){
        super();
        this.offsetZ = userView[3];
        this.windowLength = userView[0];
        this.windowHeight = userView[1];
        this.windowHeightDown = userView[2];

        var wallTexture = new THREE.TextureLoader().load( 'js/rides/kubinam//textures/wood.jpg' );
        //console.log(wallTexture);
        wallTexture.wrapS = THREE.RepeatWrapping;
        wallTexture.wrapT = THREE.RepeatWrapping;
        wallTexture.magFilter = THREE.LinearFilter;
        wallTexture.minFilter = THREE.LinearMipmapNearestFilter;
        wallTexture.repeat.set(5, 5);
        var wallMaterial = new THREE.MeshPhongMaterial();
        wallMaterial.map = wallTexture;

        var wallTexture1 = new THREE.TextureLoader().load( 'js/rides/kubinam/textures/stone.jpg' );
        wallTexture1.wrapS = THREE.RepeatWrapping;
        wallTexture1.wrapT = THREE.RepeatWrapping;
        wallTexture1.magFilter = THREE.LinearFilter;
        wallTexture1.minFilter = THREE.LinearMipmapNearestFilter;
        wallTexture1.repeat.set(5, 1);
        var wallMaterial1 = new THREE.MeshPhongMaterial();
        wallMaterial1.map = wallTexture1;


        //main
        let geometry = new THREE.BoxBufferGeometry( this.windowLength +objectLen/2, this.windowHeight + this.windowHeightDown + objectLen, 0.1 );
        let cube = new THREE.Mesh( geometry, wallMaterial );
        cube.position.z = this.offsetZ - 0.1/2 - objectLen/2;
        cube.position.y = (this.windowHeight + objectLen/2)/2;
        this.add( cube );

        //down
        let geometry1 = new THREE.BoxBufferGeometry( this.windowLength +objectLen/2, (this.windowHeightDown + objectLen), 0.1 );
        let cube1 = new THREE.Mesh( geometry1, wallMaterial1);
        cube1.position.y = (this.windowHeightDown + objectLen/2)/2;
        cube1.position.z = this.offsetZ + 0.1 + objectLen;
        this.add(cube1);

        //front
        let geometry2 = new THREE.BoxBufferGeometry( this.windowLength + objectLen/2 , (this.windowHeightDown + objectLen), 0.1 );
        let cube2 = new THREE.Mesh( geometry2, wallMaterial1);
        cube2.position.y = this.windowHeight + 0.1;
        cube2.position.z = this.offsetZ +  this.windowHeightDown -objectLen/4;
        this.add(cube2);

        //middle
        let geometry3 = new THREE.BoxBufferGeometry( this.windowLength + objectLen/2 , objectLen + 0.2, 0.1 );
        let cube3 = new THREE.Mesh( geometry3, wallMaterial1 );
        cube3.position.y = this.windowHeight + objectLen + 0.1;
        cube3.position.z = this.offsetZ + objectLen/2 - 0.1;
        cube3.rotation.x = THREE.Math.degToRad(90);
        this.add(cube3);

    }
}
