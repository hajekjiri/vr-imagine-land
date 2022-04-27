import * as THREE from '../../../extern/build/three.module.js';
import * as GUIVR from '../../GuiVR.js';

export class Cabine extends THREE.Group{
    constructor( radius, offset, userRig,  menu){
        super();
        offset = offset * 3/4;
        let cab = new Holder(userRig, radius, offset,  menu);
        this.add(cab);
    }

}

class Holder extends THREE.Group{
    constructor(userRig, radius, offset, menu){
        super();
        var geometry = new THREE.CylinderGeometry( radius, radius, 1, 32 );
        var material = new THREE.MeshPhongMaterial( {color: 0xc6e2ff} );
        var cylinder = new THREE.Mesh( geometry, material );
        this.position.z = -0.5;
        this.rotation.x = THREE.Math.degToRad(90);
        this.add( cylinder );

        const width = 0.1;
        var geometry = new THREE.BoxGeometry( offset,width , offset*2 );
        var material = new THREE.MeshPhongMaterial( {color: 0xff0000} );
        var materialGreen = new THREE.MeshPhongMaterial( {color: 0x00FF00} );
        var cube = new THREE.Mesh( geometry, material );

        var cab = new MyUserPlatform(userRig, radius, offset, cube,  menu);
        this.add(cab);

        var geometry1 = new THREE.BoxGeometry( offset/2 + 0.01, width + 0.01, offset*2 + 0.01 );
        var cube1 = new THREE.Mesh( geometry1, material );
        cube1.position.x = offset/2;
        cube1.position.y = offset/4 - width/2;
        cube1.rotation.z = THREE.Math.degToRad(90);
        var cab1 = new MyUserPlatform(userRig, radius, offset, cube1,  menu);
        this.add(cab1);

        var cube2 = new THREE.Mesh( geometry1, materialGreen );
        cube2.position.x = -offset/2;
        cube2.position.y = offset/4 - width/2;
        cube2.rotation.z = THREE.Math.degToRad(90);
        var cab2 = new MyUserPlatform(userRig, radius, offset, cube2,  menu);
        this.add(cab2);

        var geometry2 = new THREE.BoxGeometry( offset/2, width , offset );
        var cube3 = new THREE.Mesh(geometry2, material);
        this.add(cube3);
        cube3.position.y = offset/4 - width/2;
        cube3.rotation.y = THREE.Math.degToRad(90);
        cube3.rotation.x = THREE.Math.degToRad(90);
        cube3.position.z = offset - width/2;
        var cab3 = new MyUserPlatform(userRig, radius, offset, cube3,  menu);
        this.add(cab3);

        var cube4 = new THREE.Mesh(geometry2, material);
        this.add(cube4);
        cube4.position.y = offset/4 - width/2;
        cube4.rotation.y = THREE.Math.degToRad(90);
        cube4.rotation.x = THREE.Math.degToRad(90);
        cube4.position.z = - offset + width/2;
        var cab4 = new MyUserPlatform(userRig, radius, offset, cube4,  menu);
        this.add(cab4);
    }
}

class HelpGroup extends THREE.Group{
    constructor(menu) {
        super();
        this.menu = menu;
    }

    addMenu(){
        this.menu.position.y = 1;
        //this.menu.x = -3;
        this.menu.position.x = 0;
        this.menu.position.z = -1;
        this.add(this.menu);
    }
}

class MyUserPlatform extends GUIVR.GuiVR{

    constructor(userRig, radius, offset, cube, menu){
        super();
        // Make the shape of a platform.
        const width = 0.1;
        this.add(cube);

        this.collider = cube;

        this.userRig = userRig;
        this.position.y = -0.5;
        this.helpGroup = new HelpGroup(menu);
        this.helpGroup.position.y = -0.1;
        this.helpGroup.position.x = -0.3;
        this.helpGroup.rotation.y = THREE.Math.degToRad(90);
        this.add(this.helpGroup);
    }

    collide(uv, pt){
        // When the user clicks on this platform, move the user to it.
        this.helpGroup.addMenu();
        this.helpGroup.add(this.userRig);
    }
}
