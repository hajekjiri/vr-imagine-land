import * as THREE from '../../../extern/build/three.module.js';
import * as USER from './User.js';
import * as ANIMATOR from './Animator.js';
import * as GUIVR from './GuiVR.js';
import * as MAIN from './main.js';
import {FBXLoader}  from '../../../extern/examples/jsm/loaders/FBXLoader.js';

export class whackAMole extends THREE.Group{
  constructor(userRig){
  super();

  var radOfPlatform= 0;
  // keeps track of the score
  var score = -1;
  var frame = 0;

  // creates a hurt box
  let controllerModel = new THREE.Mesh(
  new THREE.BoxGeometry(0.25, 0.45, 0.25),
  new THREE.MeshPhongMaterial({color: 0xff0000}));

  // creates three hit boxes and add them to a list of hit boxes

  var exhibit = new THREE.Group();
  exhibit.add(new USER.UserPlatform(
userRig,
function (){
    console.log("Landing at Exhibit 2");
    // Get controller's position
    let controller = userRig.getController(0);
    var loader = new FBXLoader();
      loader.load(
    '../../../extern/models/thor-hammer.fbx',
    function ( obj ) {
        // Scale and add to the rig once loaded.
        obj.scale.x = 0.01;
        obj.scale.y = 0.01;
        obj.scale.z = 0.01;
        obj.rotation.x=THREE.Math.degToRad(-180);
        obj.rotation.z=THREE.Math.degToRad(90);
        obj.position.z=0.4;
        obj.position.x=0.15;
        controller.add(obj);
        controller.add(controllerModel);

    },
    function (xhr){
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error){
      console.log('An error happened');
    }
      );
    // Add new model for controller (should be removed on leaving).
    //controller.add(loader);
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
      // Decide to fire.
      if (controller.triggered
    && (this.t - this.lastFire >= 10
        || this.lastFire == undefined)){
    this.lastFire = this.t;
    // Create new projectile and set up motion.
    let proj = controllerModel.clone();
    console.log("Firing");
    controller.add(proj);
    proj.setAnimation(
        function (dt){
      if (this.t == undefined){
          this.t = 0;
      }
      this.t += dt;
      this.position.z -= dt;
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
    console.log("Leaving Exhibit 2");
    let controller = userRig.getController(0);
    // Clear the model added to controller.
    controller.remove(controllerModel);
    // Remove special animation attached to controller.
    controller.setAnimation(undefined);
}
  ));

  exhibit.rotation.y = THREE.Math.degToRad(-180);
  exhibit.position.z = -3;
  exhibit.position.x = 0;




  var geometry = new THREE.BoxGeometry( 8, 0.2, 3);
  var material = new THREE.MeshBasicMaterial( {color: 0x655144} );
  var cube = new THREE.Mesh( geometry, material );
  cube.position.z= -5;
  cube.position.y=0;

  var speed=0;
  var levels = [
           new GUIVR.GuiVRButton("Levels", 1, 1, 3, true,
                           function(x){
                             speed = x/70;
                             }
                           )];

  var sign1 = new GUIVR.GuiVRMenu(levels);
  sign1.position.x = 1.5;
  sign1.position.z = -1;
  sign1.position.y = 1;
  exhibit.add(sign1);

// ------------------ First Mole -----------------------------------------
  // creates the center Mole --- and will be the hurt box for the mole
  // Rig to hold the loaded model.

  var hitBox1 = new THREE.Mesh(
  new THREE.BoxGeometry(0.25, 0.45, 0.25),
  new THREE.MeshPhongMaterial({opacity:0,transparent:true}));

  var rig = new THREE.Group();
  //rig.rotation.y = THREE.Math.degToRad(-90);
  rig.speed = 1;
  rig.position.y = 0;
  //rig.position.z = -5;
  // Make the rig slowly rotate.
  var numToStop=0;
  rig.setAnimation(
function (dt){
  var box1= new THREE.Box3().setFromObject(hitBox1);
  var bbox = new THREE.Box3().setFromObject(controllerModel);
  if (bbox.intersectsBox(box1)){
    frame ++;
      if (score==-1 || frame%70==0){
        score++;
        console.log('score ' + score);
        var loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',function (font){
             var message = "Score: " + score;
             var matLite = new THREE.MeshBasicMaterial({
              color:'blue',
              transparent:true,
              opacity:0.8,
              side:THREE.DoubleSide
             })
             var shapes = font.generateShapes(message,20);
             var geometry = new THREE.ShapeBufferGeometry(shapes)
                                     .translate( -70, 0, 0 );
             var  text = new THREE.Mesh( geometry, matLite );
             text.position.z = 0.15;
             text.position.y=-0.2;
             text.position.x= 0.2;
             text.scale.x = 0.02;
             text.scale.y = 0.02;
             banner.add(text);
           });
  }
}
  if(numToStop!=5 ){
    this.position.y += this.speed * speed;
    if(this.position.y>0.25){
      numToStop=5;
    }
  }
  if (numToStop!=0){
    this.position.y -= this.speed * speed;
    if(this.position.y<(-2.5 + (Math.random()*1.5)))
    {
      numToStop=0;
    }
  }
});

  cube.add(rig);
  // create one mole
  var loader = new FBXLoader();
    loader.load(
  '../../../extern/models/lambo/Lamborghini_Aventador.fbx',
  function ( obj ) {
      // Scale and add to the rig once loaded.
      obj.scale.x = 0.01;
      obj.scale.y = 0.01;
      obj.scale.z = 0.01;
      rig.add(obj);
      hitBox1.position.y=0.25;
      rig.add(hitBox1);
  },
  function (xhr){
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error){
    console.log('An error happened');
  }
    );

// ----------------------------------------------- Second Mole --------------------------------------------------

  // creates the left Mole
    // Rig to hold the loaded model.

    var hitBox2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.25, 0.25),
    new THREE.MeshPhongMaterial({opacity:0,transparent:true}));



    var rig2 = new THREE.Group();
    //rig.rotation.y = THREE.Math.degToRad(-90);
    rig2.speed = 1;
    rig2.position.y = 0;
    rig2.position.x = -2;
    // Make the rig slowly rotate.
    var numToStop2=0;
    rig2.setAnimation(
  function (dt){
    var box2= new THREE.Box3().setFromObject(hitBox2);
    var bbox = new THREE.Box3().setFromObject(controllerModel);
    if (bbox.intersectsBox(box2)){
      frame ++;
        if (score==-1 || frame%70==0){
          score++;
          console.log('score ' + score);
          var loader = new THREE.FontLoader();
          loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',function (font){
               var message = "Score: " + score;
               var matLite = new THREE.MeshBasicMaterial({
                color:'blue',
                transparent:true,
                opacity:0.8,
                side:THREE.DoubleSide
               })
               var shapes = font.generateShapes(message,20);
               var geometry = new THREE.ShapeBufferGeometry(shapes)
                                       .translate( -70, 0, 0 );
               var  text = new THREE.Mesh( geometry, matLite );
               text.position.z = 0.15;
               text.position.y=-0.2;
               text.position.x= 0.2;
               text.scale.x = 0.02;
               text.scale.y = 0.02;
               banner.add(text);
             });
    }
  }
    if(numToStop2!=5 ){
      this.position.y += this.speed * speed;
      if(this.position.y>0.25){
        numToStop2=5;
      }
    }
    if (numToStop2!=0){
      this.position.y -= this.speed * speed;
      if(this.position.y<(-2.5 + (Math.random()*1.5)))
      {
        numToStop2=0;
      }
    }
  });

    cube.add(rig2);
    // create one mole
    var loader2 = new FBXLoader();
      loader.load(
    '../../../extern/models/lambo/Lamborghini_Aventador.fbx',
    function ( obj ) {
        // Scale and add to the rig once loaded.
        obj.scale.x = 0.01;
        obj.scale.y = 0.01;
        obj.scale.z = 0.01;
        rig2.add(obj);
        hitBox2.position.y=0.25;
        rig2.add(hitBox2);
    },
    function (xhr){
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error){
      console.log('An error happened');
    }
      );


//---------------------------------THIRD MOLE---------------------------------

    // create the hitbox to test against the hurt box
    var hitBox3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.25, 0.25),
    new THREE.MeshPhongMaterial({opacity:0,transparent:true}));



      // creates the right mole
      // Rig to hold the loaded model.
      var rig3 = new THREE.Group();
      //rig.rotation.y = THREE.Math.degToRad(-90);
      rig3.speed = 1;
      rig3.position.y = 0;
      rig3.position.x = 2;
      // Make the rig slowly rotate.
      var numToStop3=0;
      rig3.setAnimation(
    function (dt){
      var box= new THREE.Box3().setFromObject(hitBox3);
      var bbox = new THREE.Box3().setFromObject(controllerModel);
      if (bbox.intersectsBox(box)){
        frame ++;
          if (score==-1 || frame%70==0){
            score++;
            console.log('score ' + score);
            var loader = new THREE.FontLoader();
            loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',function (font){
                 var message = "Score: " + score;
                 var matLite = new THREE.MeshBasicMaterial({
                  color:'blue',
                  transparent:true,
                  opacity:0.8,
                  side:THREE.DoubleSide
                 })
                 var shapes = font.generateShapes(message,20);
                 var geometry = new THREE.ShapeBufferGeometry(shapes)
                                         .translate( -70, 0, 0 );
                 var  text = new THREE.Mesh( geometry, matLite );
                 text.position.z = 0.15;
                 text.position.y=-0.2;
                 text.position.x= 0.2;
                 text.scale.x = 0.02;
                 text.scale.y = 0.02;
                 banner.add(text);
               });

      }
    }
      if(numToStop3!=5 ){
        this.position.y += this.speed * speed;
        if(this.position.y>0.25){
          numToStop3=5;
        }
      }
      if (numToStop3!=0){
        this.position.y -= this.speed * speed;
        if(this.position.y<(-2.5 + (Math.random()*1.5)))
        {
          numToStop3=0;
        }
      }
    });

      cube.add(rig3);
      // create one mole
      var loader3 = new FBXLoader();
        loader3.load(
      '../../../extern/models/lambo/Lamborghini_Aventador.fbx',
      function ( obj ) {
          // Scale and add to the rig once loaded.
          obj.scale.x = 0.01;
          obj.scale.y = 0.01;
          obj.scale.z = 0.01;
          rig3.add(obj);
          hitBox3.position.y= 0.25;
          rig3.add(hitBox3);
      },
      function (xhr){
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      function (error){
        console.log('An error happened');
      }
        );



//------------------------------------------------------------------


// banner to display score

  var geometry = new THREE.BoxGeometry( 3, 1, 0.25);
  var material = new THREE.MeshNormalMaterial( {color: 0x655144} );
  var banner = new THREE.Mesh( geometry, material );
  banner.position.z= -8;
  banner.position.y=0.5;
  exhibit.add(banner);





  exhibit.add(cube);

  this.add(exhibit);
}

}
