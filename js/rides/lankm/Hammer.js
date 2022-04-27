import * as THREE from "../../../extern/build/three.module.js";
import {Color} from "./Constants.js";

export class Hammer extends THREE.Group {

    constructor() {
        super();
        let hammerLength = 2;
        let handle = new THREE.Mesh(
            new THREE.BoxBufferGeometry(0.1, 0.1, hammerLength),
            new THREE.MeshPhongMaterial({color: Color.BROWN}));

        this.top = new THREE.Mesh(
            new THREE.BoxBufferGeometry(0.2, .4, 0.1),
            new THREE.MeshPhongMaterial({color: Color.SILVER}));
        this.top.rotation.x = Math.PI;
        this.top.position.z = -hammerLength / 2;

        this.add(this.top);
        this.add(handle);
    }
}
