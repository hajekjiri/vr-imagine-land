import * as THREE from "../../../extern/build/three.module.js";

export class BaseStructure extends THREE.Group{
    constructor(heightMid, depthOfBase, wireRadiuses, middleRadius){
        super();

        //setting up base stone
        const baseStone = new BaseStone(heightMid, depthOfBase, wireRadiuses);
        this.add(baseStone);


        //setting up middle stone small
        const middleStoneSmall = new MiddleStoneSmall(depthOfBase, heightMid,middleRadius);
        this.add(middleStoneSmall);


        //setting up middle base wires
        const baseWire = new BaseWire(heightMid, 0, heightMid / 2, depthOfBase / 2, wireRadiuses);
        this.add(baseWire);

        const baseWire1 = new BaseWire(heightMid, 0, heightMid / 2, -depthOfBase / 2, wireRadiuses);
        this.add(baseWire1);


        //counting c*c = a*a + b*b;
        const oldHeightMid = heightMid;
        heightMid = Math.sqrt(heightMid*heightMid*2);

        //setting up supporting wiress
        const wire1 = new BaseWire(heightMid, oldHeightMid/2 , oldHeightMid/2, depthOfBase/2 , wireRadiuses);
        wire1.rotation.z = THREE.Math.degToRad(45);
        this.add(wire1);

        const wire2 = new BaseWire(heightMid, oldHeightMid/2 , oldHeightMid/2, -depthOfBase/2 , wireRadiuses);
        wire2.rotation.z = THREE.Math.degToRad(45);
        this.add(wire2);

        const wire3 = new BaseWire(heightMid, -oldHeightMid/2 , oldHeightMid/2, depthOfBase/2 , wireRadiuses);
        wire3.rotation.z = THREE.Math.degToRad(-45);
        this.add(wire3);

        const wire4 = new BaseWire(heightMid, -oldHeightMid/2 , oldHeightMid/2, - depthOfBase/2, wireRadiuses);
        wire4.rotation.z = THREE.Math.degToRad(-45);
        this.add(wire4);



    }
}

class BaseWire extends THREE.Group{
    constructor(length, x, y, z, radius) {
        super();
        let geometry = new THREE.CylinderGeometry( radius[1], radius[0], length, 32);
        let material = new THREE.MeshPhongMaterial( {color: 0x654321} );
        let cylinder = new THREE.Mesh( geometry, material );
        this.position.x = x;
        this.position.y = y;
        if (z > 0){
            this.position.z = z - radius[0];
        }else{
            this.position.z = z + radius[0];
        }

        this.add(cylinder);
    }
}


class MiddleStoneSmall extends THREE.Group{
    constructor(length, height, radius){
        super();
        let geometry = new THREE.CylinderGeometry( radius, radius, length, 32);
        let material = new THREE.MeshPhongMaterial( {color: 0x654321} );
        let cylinder = new THREE.Mesh( geometry, material );
        this.position.y = height;
        this.rotation.x = Math.PI / 2;
        this.add(cylinder);
    }
}

class BaseStone extends THREE.Group{
    constructor(heightMid, depthOfBase, radius) {
        super();
        let geometry = new THREE.BoxGeometry( 2 * heightMid + 2*radius[0], radius[0] + 0.1, depthOfBase);
        let material = new THREE.MeshPhongMaterial( {color: 0xffc87c} );
        let cube = new THREE.Mesh( geometry, material );
        this.add(cube);
    }
}
