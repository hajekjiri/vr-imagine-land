import * as THREE from '../../../extern/build/three.module.js';
import * as USER from "./User.js";
import * as GUIVR from "../../GuiVR.js";
import {array, getChildrenByName, removeChildrenByName, loadFBX, loadOBJ, getRig} from "./Utils.js";
import {CupPlatform} from "./User.js";


export class Teacups extends THREE.Group {

    constructor(userRig, numOfCups, numOfSeats, mainSpeed = 1, cupSpeed = 1) {
        super();

        this.userRig = userRig;
        this.numOfCups = numOfCups;
        this.numOfSeats = numOfSeats;
        this.mainMenuButtons = undefined;
        this.speed = mainSpeed;
        this.cupSpeed = cupSpeed;
        // this._addLight();
        this._addPlatform();
        this._addExhibit();
    }

    _addPlatform() {
        this.onLand = (_) => {
            this.mainMenuButtons[0].val = this.speed;
            this.mainMenuButtons[0].updateTexture();
            this.mainMenuButtons[1].val = this.cupSpeed;
            this.mainMenuButtons[1].updateTexture();
        };

        this.add(new USER.UserPlatform(this.userRig, this.onLand, undefined, "mainPlatform"));
    }

    _addLight() {
        let light = new THREE.AmbientLight(0xffffff, 0.1);
        light.position.x = 0;
        light.position.y = 6;
        light.position.z = 0;
        this.add(light)
    }

    _addExhibit() {
        this.exhibit = getRig(0, -5);

        this._generateMenu();
        this._generateFloor();
        this._generateJoker();
        this._generateCups();

        this.add(this.exhibit);
    }

    _generateJoker() {
        let jokerRig = getRig(0, 0, false);
        loadFBX('extern/models/joker/joker.fbx', joker => {
            joker.scale.x = 0.015;
            joker.scale.y = 0.015;
            joker.scale.z = 0.015;
            jokerRig.position.y = .32;
            jokerRig.add(joker);
        });
        this.exhibit.add(jokerRig);
    }

    _generateFloor() {
        let floorRig = getRig(0, 0, false);
        loadFBX('extern/models/puzzle/puzzle.fbx', floor => {
            floor.children[0].material.color.set(0xffff99);
            floor.scale.x = 0.01;
            floor.scale.y = 0.01;
            floor.scale.z = 0.01;
            floorRig.add(floor);
        });
        this.exhibit.add(floorRig);
    }

    _updateSpeed = (speed) => {
        this.exhibit.speed = speed; // change effective speed
        this.speed = speed; // just save the value
    };

    _updateCupSpeed = (speed) => {
        getChildrenByName(this.exhibit, "cup").forEach(c => c.speed = speed);
        this.cupSpeed = speed;
    };

    _generateMenu() {
        this.mainMenuButtons = [
            new GUIVR.GuiVRButton("Speed All", this.speed, 0, 10, true, this._updateSpeed),
            new GUIVR.GuiVRButton("Speed Cup", this.cupSpeed, 0, 10, true, this._updateCupSpeed),
            new GUIVR.GuiVRButton("# of cups", this.numOfCups, 0, 10, true, x => {
                    this.numOfCups = x;
                    this._generateCups();
                }
            ),
            new GUIVR.GuiVRButton("# of seats", this.numOfSeats, 0, 10, true, x => {
                    this.numOfSeats = x;
                    this.generateSeats();
                }
            )];

        let sign = new GUIVR.GuiVRMenu(this.mainMenuButtons);
        sign.position.x = -2;
        sign.position.z = -2.5;
        sign.position.y = 2;
        this.add(sign);
    }

    _attachSmallMenuTo = (group) => {
        let buttons = [
            new GUIVR.GuiVRButton("Speed All", this.speed, 0, 10, true, this._updateSpeed),
            new GUIVR.GuiVRButton("Speed Cup", this.cupSpeed, 0, 10, true, this._updateCupSpeed),
            new GUIVR.GuiVRButton("Exit", 0, 0, 1, true, x => {
                if (x === 1) {
                    removeChildrenByName(group, "cupMenu");
                    let v = this.getObjectByName("mainPlatform");
                    v.collide(v.x, v.y);
                }
            })
        ];
        let sign = new GUIVR.GuiVRMenu(buttons);
        sign.position.x = 1;
        sign.position.z = -1;
        sign.position.y = 1;
        sign.name = "cupMenu";
        group.add(sign);
    };

    _removeCupMenus = function () { // this should be cup platform, remove menu
        removeChildrenByName(this, "cupMenu");
    };

    _generateCups() {
        removeChildrenByName(this.exhibit, "cup");

        let cupRings = array(this.numOfCups, _ => getRig(0.32, 0));
        cupRings.forEach(r => {
            r.name = "cup";
            this.exhibit.add(r);
        });

        loadFBX('extern/models/cup/cup_n_saucer.fbx', cup => {
            cup.scale.x = 0.7;
            cup.scale.z = 0.7;
            cup.scale.y = 0.5;

            let distFromCenter = 1.8;
            let angle = 2 * Math.PI / this.numOfCups; // radians
            for (let i = 0; i < this.numOfCups; i++) {
                let t = new CupPlatform(this.userRig, cup.clone(), this._attachSmallMenuTo, this._removeCupMenus);
                cupRings[i].rotation.y = Math.random() * 2 * Math.PI; // random rotation for natural feel
                cupRings[i].position.x = Math.cos(angle * i) * distFromCenter;
                cupRings[i].position.z = Math.sin(angle * i) * distFromCenter;
                cupRings[i].add(t)
            }
        });

        this.generateSeats()
    }

    generateSeats() {
        let cupRings = this.exhibit.children.filter(c => c.name === "cup");

        cupRings.forEach(r => removeChildrenByName(r, "seat"));

        loadOBJ(
            '../../../extern/models/seat2/10216_Bean_Bag_Chair_v2_max2008_it2.mtl',
            '../../../extern/models/seat2/10216_Bean_Bag_Chair_v1_Diffuse.jpg',
            '../../../extern/models/seat2/10216_Bean_Bag_Chair_v2_max2008_it2.obj',
            seatObj => {
                seatObj.rotation.x = THREE.Math.degToRad(-85);
                seatObj.scale.x = 0.004;
                seatObj.scale.y = 0.004;
                seatObj.scale.z = 0.006;
                seatObj.position.y = 0.06;
                seatObj.name = "seat";

                let distFromCenter = 0.24;
                let angle = 2 * Math.PI / this.numOfSeats; // radians

                cupRings.forEach(rig => {
                    let seats = array(this.numOfSeats, _ => seatObj.clone());
                    for (let i = 0; i < this.numOfSeats; i++) {
                        seats[i].rotation.z = -angle * i - Math.PI / 2;
                        seats[i].position.x = Math.cos(angle * i) * distFromCenter;
                        seats[i].position.z = Math.sin(angle * i) * distFromCenter;
                        rig.add(seats[i])
                    }
                });
            });
    }
}
