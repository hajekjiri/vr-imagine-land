import * as THREE from "../../../extern/build/three.module.js";

export class TextWrapper extends THREE.Group {

    constructor(font, text, color, x, y, z = -2, orientation = null, size = .5) {
        super();
        this.orientation = orientation;
        this.x = x;
        this.y = y;
        this.z = z;
        this.font = font;
        this.color = color;
        this.size = size;
        this.textMesh = null;
        this.setText(text)
    }

    setText = (text) => {
        if (this.textMesh != null) {
            this.remove(this.textMesh)
        }
        let material = new THREE.MeshPhongMaterial({color: this.color});
        let geom = new THREE.TextBufferGeometry(text, {
            font: this.font,
            size: this.size,
            height: .4 * this.size,
            curveSegments: 4,
            bevelEnabled: true,
            bevelThickness: .05,
            bevelSize: .06 * this.size,
            bevelOffset: .0,
            bevelSegments: 2
        });
        geom.center();
        this.textMesh = new THREE.Mesh(geom, material);

        this.textMesh.position.x = this.x;
        this.textMesh.position.y = this.y;
        this.textMesh.position.z = this.z;
        this.textMesh.rotation.x = 0.3;

        if (this.orientation === "R") {
            this.textMesh.rotation.y = -0.7;
        } else if (this.orientation === "L") {
            this.textMesh.rotation.y = 0.7;
        }

        this.add(this.textMesh);
    }
}
