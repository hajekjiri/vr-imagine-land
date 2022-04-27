import * as THREE from '../../../extern/build/three.module.js';
import * as USER from './User.js';
import * as ANIMATOR from '../../Animator.js';
import * as GUIVR from '../../GuiVR.js';


export class initExhibit5 extends THREE.Group{

    constructor(userRig, startSpeed, maxSpeed,pfSpeedIn, cupSpeedIn){
    super();

    var radOfPlatform= 10;

	// Exhibit 4 - Lighting
	this.platform = new USER.UserPlatform(userRig);
	this.add(this.platform);



    // create the platform for the teacup ride
    var groundGeo = new THREE.CylinderBufferGeometry(radOfPlatform, radOfPlatform,1);
    var groundMat = new THREE.MeshNormalMaterial();
    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.speed = 1;
    ground.position.z = -20;
    ground.receiveShadow = true;

    // responsible for setting the animation of the ride
    ground.setAnimation(function (dt){
       this.rotation.y += this.speed * pfSpeedIn;
   });
    // find a way to just make the ground spin and not everything



    //creates the pole that holds the roof top
    var poleGeo = new THREE.CylinderBufferGeometry(0.15, 0.15,15);
    var poleMat = new THREE.MeshNormalMaterial();
    var pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y =7;
    ground.add(pole);


    // creates the roof top of the ride
    var geometry = new THREE.ConeGeometry( 10, 5, 32);
    var material = new THREE.MeshNormalMaterial();
    var cone = new THREE.Mesh( geometry, material );
    cone.position.y=15;
    ground.add(cone);

    // creates bulb to place around the platform
   var positionBulb= [-radOfPlatform,radOfPlatform, 7.20,7];
    for (var numBulbs = 0;numBulbs<8; numBulbs++){
      var bulbGeometry = new THREE.SphereGeometry(0.2,30,30);
      var bulbMat = new THREE.MeshNormalMaterial();
      var bulb= new THREE.Mesh(bulbGeometry,bulbMat);
      if(numBulbs==0 || numBulbs==1){ bulb.position.x=positionBulb[numBulbs]; }
      else if(numBulbs==2 || numBulbs==3){bulb.position.z=positionBulb[numBulbs-2];}
      else if(numBulbs==4 || numBulbs==5){
        bulb.position.x=-7.20;
        if(numBulbs==4){
        bulb.position.z=7 ;
        }
        else{ bulb.position.z=-7;}}
      else{
        bulb.position.x=7.20;
        if(numBulbs==6){bulb.position.z=7;}
      else{bulb.position.z=-7}}
      bulb.position.y = 0.25;
      ground.add(bulb);
  }

  // creates all four teacups
  var position = [-5,5];
  var teacups=[]
  for (var numOfTeapots=0; numOfTeapots<4; numOfTeapots ++){
    var teacup= new USER.TeaCupPlatform(userRig);
    teacup.setAnimation(function (dt){ this.rotation.y += this.speed * cupSpeedIn;});
    if(numOfTeapots==0 || numOfTeapots==1){
    teacup.position.x=position[numOfTeapots];
  }
  else{
    teacup.position.z=position[numOfTeapots-2];
  }
  teacups.push(teacup);
    ground.add(teacup);
}

  // will individually create a button for every teacup
    var buttonTeaCup1 = [
             new GUIVR.GuiVRButton("Rotate", startSpeed, 0, maxSpeed, true,
                             function(x){
                               teacups[0].speed = x*0.1;})];

    var buttonTeaCup2 = [
              new GUIVR.GuiVRButton("Rotate", startSpeed, 0, maxSpeed, true,
                              function(x){
                                teacups[1].speed = x*0.1;})];

    var buttonTeaCup3 = [
              new GUIVR.GuiVRButton("Rotate", startSpeed, 0, maxSpeed, true,
                              function(x){
                                  teacups[2].speed = x*0.1;})];

    var buttonTeaCup4 = [
        new GUIVR.GuiVRButton("Rotate", startSpeed, 0, maxSpeed, true,
                              function(x){
                                  teacups[3].speed = x*0.1;})];

    var rideSpeed= [new GUIVR.GuiVRButton("Speed", startSpeed, 0, maxSpeed, true,
        function(x){ground.speed = x;})];

  // adds the sign to the exhibit
    var sign1 = new GUIVR.GuiVRMenu(buttonTeaCup1);
    sign1.position.x = 0;
    sign1.position.z = -2;
    sign1.position.y = 1;
    teacups[0].add(sign1);

    var sign2 = new GUIVR.GuiVRMenu(buttonTeaCup2);
    sign2.position.x = 0;
    sign2.position.z = -2;
    sign2.position.y = 1;
    teacups[1].add(sign2);

    var sign3 = new GUIVR.GuiVRMenu(buttonTeaCup3);
    sign3.position.x = 0;
    sign3.position.z = -2;
    sign3.position.y = 1;
    teacups[2].add(sign3);

    var sign4 = new GUIVR.GuiVRMenu(buttonTeaCup4);
    sign4.position.x = 0;
    sign4.position.z = -2;
    sign4.position.y = 1;
    teacups[3].add(sign4);

    var rideSpeedSign = new GUIVR.GuiVRMenu(rideSpeed);
    rideSpeedSign.position.x = 0;
    rideSpeedSign.position.z = -2;
    rideSpeedSign.position.y = 1;
	this.platform.add(rideSpeedSign);


	//exhibit.add(ground);
	
  this.add(ground);

  }
}
