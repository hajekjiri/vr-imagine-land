import {FBXLoader} from "../../../extern/examples/jsm/loaders/FBXLoader.js";
import {MTLLoader} from "../../../extern/examples/jsm/loaders/MTLLoader.js";
import {OBJLoader} from "../../../extern/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "../../../extern/build/three.module.js";

let fbxLoader = new FBXLoader();
let mtlLoader = new MTLLoader();

export function loadFBX(filename, onLoaded) {
    fbxLoader.load(filename, onLoaded,
		   xhr => {},//console.log(filename, (xhr.loaded / xhr.total * 100) + '% loaded'),
        error => console.log('An error happened', error)
    );
}


function loadMTL(filenameTextureMTL, onLoaded) {
    mtlLoader.load(filenameTextureMTL, onLoaded,
		   xhr => {},//console.log(filenameTextureMTL, (xhr.loaded / xhr.total * 100) + '% loaded'),
        error => console.log('An error happened', error)
    );
}

export function loadOBJ(filenameTextureMTL, filenameImgTexture, filenameObj, onLoaded) {
    loadMTL(filenameTextureMTL, function (materials) {
        materials.preload();
        new OBJLoader()
            .setMaterials(materials)
            .load(filenameObj, obj => {
                    onLoaded(obj);

                    let texture = new THREE.TextureLoader().load(filenameImgTexture);
                    obj.traverse(function (child) {   // aka setTexture
                        if (child instanceof THREE.Mesh) {
                            child.material.map = texture;
                        }
                    });

                },
                  xhr => {},//console.log(filenameObj, (xhr.loaded / xhr.total * 100) + '% loaded'),
                error => console.log('An error happened', error)
            );
    });
}

export function array(n, initFun) {
    return Array(n).fill("").map(initFun);
}

export function removeChildrenByName(group, name) {
    let toRemove = group.children.filter(c => c.name === name);
    toRemove.forEach(o => group.remove(o))
}

export function getChildrenByName(group, name) {
    return group.children.filter(c => c.name === name);
}

export function arrayRandomN(array, n, constraintFun){
    let items = [];
    while (items.length < n) {
        let m = array[Math.random() * array.length >> 0];
        if (!items.includes(m) || (constraintFun !== undefined && constraintFun(m))) {
            items.push(m)
        }
    }
    return items;
}

export function getRig (yPos = 0, zPos = 0, rotate = true) {
    let rig = new THREE.Group();
    rig.speed = 0;
    rig.position.y = yPos;
    rig.position.z = zPos;
    // Make the rig slowly rotate.
    if (rotate) {
        rig.setAnimation(
            function (dt) {
                this.rotation.y += this.speed * 0.01;
            });
    }
    return rig
}
