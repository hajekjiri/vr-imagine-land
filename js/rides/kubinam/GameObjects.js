import * as THREE from '../../../extern/build/three.module.js';

//todo make own buffer objects
export class BasicObject extends THREE.Group{
    constructor(r, speed, that) {
        super();
        this.that = that;
        let geometry = new THREE.BoxGeometry( r, r, r);
        let material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
        let cube = new THREE.Mesh( geometry, material );
        this.position.y = that.userView[1] + r;
        this.try = 0;
        this.index = 0;
        this.position.z = that.userView[3];
        let temp = this;
        this.setAnimation(
            function (dt){
                this.position.y -= speed;
                if (this.position.y < that.userView[2]) {
                    that.removeFromArr(this);
                    that.remove(temp);
                    that.threshold--;
                }
            });
        this.add( cube );
    }

}
