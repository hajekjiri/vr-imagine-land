import * as THREE from "../../../extern/build/three.module.js";
import {Cabine} from './Cabine.js';
import * as GUIVR from '../../GuiVR.js';
import * as USER from '../../User.js';

export class MovingCore extends THREE.Group{
    constructor(heightMid, depthOfBase, middleRadius, numberOfCabines, infoWire,offset, speed, userRig){
        super();
        speed = speed * 0.001;
        //setting wires length
        const radius = (heightMid - 1.5) / 2;
        //setting up middle stonef
        const middleStone = new MiddleStone(2*(offset + infoWire[0]), heightMid, middleRadius,
            infoWire, numberOfCabines, radius, offset, speed, userRig);
        this.add(middleStone);
    }
}

class MiddleStone extends THREE.Group{
    constructor(length, height, radius,  infoWire, numberOfCabines, radiusNew, offset, speed, userRig){
        super();
        var geometry = new THREE.CylinderGeometry( radius, radius, length, 32);
        var material = new THREE.MeshPhongMaterial( {color: 0xffc87c} );
        var cylinder = new THREE.Mesh( geometry, material );

        this.speed = speed;
        this.rotation.x = Math.PI / 2;
        this.position.y = height;
        this.add(cylinder);

        this.clocks = 0;
        var init;
        if (speed < 0){
            init = -speed/0.001;
            this.clocks = -1;
        }else{
            init = speed/0.001;
            this.clocks = 1;
        }
        var counter = 0;
        var buttons = [new GUIVR.GuiVRButton("Speed", init, 1, 20, true,
            (x) => {
            if (counter++ > 0 ){
                this.speed = this.clocks*x*0.001;
            }
            }),
            new GUIVR.GuiVRButton("Direction", 0, 0, 1, true,
                (x) => {
                    if (counter++ > 1 ){
                        this.speed = -this.speed;
                    }
                })];

        var menu = new GUIVR.GuiVRMenu(buttons);

        this.setAnimation(
            function (dt){
                this.rotation.y += this.speed;
            });
        
        var groupOfWires = new GroupOfWires(numberOfCabines, infoWire, radiusNew, offset, speed, userRig, menu, this);
        
        this.add(groupOfWires);

    }
}

class GroupOfWires extends THREE.Group{
    constructor(numberOfCabines, infoWire, radius, offset, speed, userRig, menu, that){
        super();
        const theta = 2*Math.PI/numberOfCabines;

        var thetaCounter = theta;
        for (let i = 0; i < numberOfCabines ; ++i) {
            let wire = new Wire(infoWire, radius, offset, false, thetaCounter, speed, userRig, menu, that);
            wire.position.x = Math.sin(thetaCounter) * radius;
            wire.position.y = -Math.cos(thetaCounter) * radius ;
            wire.position.z = offset;
            wire.rotation.z = thetaCounter;
            this.add(wire);

            thetaCounter += theta;
        }


        thetaCounter = theta;
        for (let i = 0; i < numberOfCabines ; ++i) {
            let wire = new Wire(infoWire, radius, offset, true, thetaCounter, speed, userRig, menu,that);
            wire.position.x = Math.sin(thetaCounter) * radius;
            wire.position.y = -Math.cos(thetaCounter) * radius ;
            wire.position.z = -offset;
            wire.rotation.z = thetaCounter;
            this.add(wire);

            thetaCounter += theta;
        }




        this.rotation.x = THREE.Math.degToRad(90);
    }
}

class Wire extends THREE.Group{
    constructor(infoWire, radius, offset, bool, theta, speed, userRig, menu, that) {
        super();
        var geometry = new THREE.CylinderGeometry( infoWire[0], infoWire[1], radius*2, 32);
        var material = new THREE.MeshPhongMaterial( {color: 0xffc87c} );
        var cylinder = new THREE.Mesh( geometry, material );
        this.add(cylinder);

        if (bool){
            var cabine = new CabineHolder(infoWire, offset, theta, speed, userRig, menu, that);
            cabine.position.y = -radius ;
            cabine.position.z = offset ;
            cabine.rotation.x = THREE.Math.degToRad(90);
            this.add(cabine);
        }


    }
}

class CabineHolder extends THREE.Group{
    constructor(infoWire, offset, theta, speed, userRig, menu, that) {
        super();
        var r = infoWire[1];
        var geometry = new THREE.CylinderGeometry( r, r, (offset + infoWire[1]) * 2, 32 );
        var material = new THREE.MeshPhongMaterial( {color: 0xffc87c} );
        var cylinder = new THREE.Mesh( geometry, material );
        this.add( cylinder);
        this.speed = speed;
        this.rotation.y = -theta;
        this.setAnimation(
            function (dt){

                this.rotation.y += that.speed;
            });
        var cabine = new Cabine(r, offset, userRig,  menu);
        this.add(cabine);

    }
}
