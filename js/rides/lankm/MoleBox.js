import * as THREE from "../../../extern/build/three.module.js";
import {Color} from "./Constants.js";
import {BoxGeometry} from "../../../extern/build/three.module.js";

export class MoleBox extends THREE.Group {

    constructor(color, outerRadius, innerRadius, onDown) {
        super();
        this.onDown = onDown;
        this.box = this._generateBox(color, outerRadius, innerRadius);
        this.add(this.box);
        this.mole = this._generateMole(innerRadius);
        this.add(this.mole);
        this.dead = false;

    }

    jump(speed = 1) {
        this.mole.pos = 0;
        this.dead = false;
        this.mole.material.color.set(Color.RED);
        this.mole.setAnimation(dt => {
            this.mole.pos += (speed) * dt / 5;
            this.mole.position.y = Math.sin(this.mole.pos) * .8;
            if (this.mole.position.y < 0) {
                this.mole.setAnimation(undefined);
                this.onDown(this, false)
            }
        });
    }


    hit() {
        this.dead = true;
        this.mole.material.color.set(Color.YELLOW);
        this.mole.setAnimation(dt => {
            this.mole.position.y -= Math.sin(this.mole.pos) * .15;
            if (this.mole.position.y < -0.8) { // give some extra time
                this.mole.setAnimation(undefined);
                this.onDown(this, true)
            }
        });
    }

    _generateBox(color, outerRadius, innerRadius) {
        let height = 1.5;
        let arcShape = new THREE.Shape();
        arcShape.moveTo(outerRadius * 2, outerRadius);
        arcShape.absarc(outerRadius, outerRadius, outerRadius, 0, Math.PI * 2, false);
        let holePath = new THREE.Path();
        holePath.moveTo(outerRadius + innerRadius, outerRadius);
        holePath.absarc(outerRadius, outerRadius, innerRadius, 0, Math.PI * 2, true);
        arcShape.holes.push(holePath);

        let geometry = new THREE.ExtrudeBufferGeometry(arcShape, {
            depth: height,
            bevelEnabled: false,
            steps: 1,
            curveSegments: 2
        });
        geometry.center();
        geometry.rotateX(Math.PI / 2);
        geometry.rotateY(Math.PI / 4);
        return new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: color}));
    }

    _generateMole(innerRadius) {
        let r = innerRadius / 0.7;
        let material = new THREE.MeshStandardMaterial({color: Color.RED});
        let geom = new BoxGeometry(r, 1, r);
        return new THREE.Mesh(geom, material);
    }

}
