import * as THREE from '../../../extern/build/three.module.js';
import * as USER from "../../User.js";
import * as GUIVR from "../../GuiVR.js";
import {array, arrayRandomN, getRig, removeChildrenByName} from "./Utils.js";
import {Color} from "./Constants.js";
import {levels} from "./Levels.js";
import {TextWrapper} from "./TextWrapper.js";
import {Hammer} from "./Hammer.js";
import {Score} from "./Score.js";
import {MoleBox} from "./MoleBox.js";


export class CarnivalGame extends THREE.Group {

    Status = { // with log messages
        NOT_INITIALISED: "Waiting for user to get on the platform",
        IDLE: "Idle - waiting for user to press button.",
        RUNNING: "Running",
        FAIL: "Level Failed",
        LEVEL_FINISHED: "Level finished",
        OVER: "Game Finished",
        PAUSED: "User paused game"
    };

    Text = {
        PRESS_TO_START: "      Click to start a game.\nClick during game to pause.\nClick twice anytime to quit.",
        LEVEL_FAILED: "    Level failed.\nClick to restart.",
        LEVEL_FINISHED: "       Level done!\nClick to start next.",
        GAME_OVER: "       GAME OVER\nClick to enter menu.",
        GAME_NAME: "Whac-A-Box",
        GAME_PAUSED: "   Game paused.\nClick to continue.",
        LABEL_LEVEL: "LEVEL",
        LABEL_SCORE: "SCORE",
        LABEL_MISS: "MISS",
        MENU_CONTROLLERS: "Controllers",
        MENU_DIFFICULTY: "Difficulty",
        MENU_CONTINUE: "Start",
        MENU_EXIT: "Exit"
    };

    constructor(userRig, difficulty = 0, controllerCount = 1) {
        super();

        this.userRig = userRig;
        this.difficulty = difficulty;
        this.controllerCount = controllerCount;

        this.score = new Score(this.onScoreChanged);
        this.status = this.Status.NOT_INITIALISED;
        this.moles = [];
        this.mainMenuButtons = [];
        this.levelIndex = 0;
        this.level = levels[difficulty][this.levelIndex];

        this.createTexts();
        // this.addLight();
        this.addPlatform();
        this.addExhibit();

        this.menu = this.addGameMenu();
	this.setAnimation(function (dt) {this.update();});
    }

    updateMenuItem(pos, value) {
        this.menu.buttonList[pos].val = value;
        this.menu.buttonList[pos].updateTexture();
    }

    createTexts() {
        let loader = new THREE.FontLoader();
        loader.load('extern/fonts/helvetiker_bold.typeface.json', font => {
            this.txtInfo = new TextWrapper(font, "", Color.WHITE, 0, 2, -1.5, null, .25);
            this.txtInfo.rotation.x -= 0.1;

            this.textFinalScore = new TextWrapper(font, "", Color.YELLOW, 0, 1.5, -1.5, null, .25);
            this.textFinalScore.rotation.x = -0.3;

            this.textLevelLabel = new TextWrapper(font, this.Text.LABEL_LEVEL, Color.BLUE, -2.5, 3.5, -2, "L");

            this.textLevel = new TextWrapper(font, "", Color.VIOLET, -2.5, 2.5, -2, "L");
            this.textScoreLabel = new TextWrapper(font, this.Text.LABEL_SCORE, Color.RED, 2.5, 3.5, -2, "R");

            this.textScore = new TextWrapper(font, "", Color.YELLOW, 2.5, 2.5, -2, "R");

            this.textMissLabels = [
                new TextWrapper(font, this.Text.LABEL_MISS, Color.RED, -1.5, 0.5, -1, "L"),
                new TextWrapper(font, this.Text.LABEL_MISS, Color.RED, -2.5, 1, -2, "L"),
                new TextWrapper(font, this.Text.LABEL_MISS, Color.RED, 1.5, 0.5, -1, "R"),
                new TextWrapper(font, this.Text.LABEL_MISS, Color.RED, 2.5, 1, -2, "R")
            ];

            this.textLevelLabel.visible = false;
            this.textScoreLabel.visible = false;

            this.textGameName = new TextWrapper(font, this.Text.GAME_NAME, Color.GREY, 0, 11, -10, null, 2.3);

            this.exhibit.add(this.textScoreLabel);
            this.exhibit.add(this.textLevelLabel);
            this.exhibit.add(this.textScore);
            this.exhibit.add(this.textLevel);
            this.textMissLabels.forEach(l => this.exhibit.add(l));
            this.textMissLabels.forEach(l => l.visible = false);
            this.exhibit.add(this.textGameName);
            this.exhibit.add(this.txtInfo);
            this.exhibit.add(this.textFinalScore);
        })
    }

    showRandomMiss = () => {
        let item = arrayRandomN(this.textMissLabels, 1, x => x.visible === false)[0];
        item.visible = true;
        item.scale.set(1, 1, 1);
        item.setAnimation(function (dt) {
            this.scale.x += 0.003;
            this.scale.y += 0.003;
            this.scale.z += 0.003;
        });
        setTimeout(_ => {
            item.setAnimation(null);
            item.visible = false
        }, 1000)
    };

    resetGame = (_) => {
        this.levelIndex = 0;
        this.level = levels[this.difficulty][0];
        this.score.resetForNewGame();
        this.movingMoles = [];
        this.generateGameGrid();
    };

    onGameStateChanged = (status) => {
        if (this.status === status) {
            return
        }
        //console.log(`Status: ${status}`);
        this.status = status;

        switch (status) {

            case this.Status.PAUSED:
                this.txtInfo.setText(this.Text.GAME_PAUSED);
                this.txtInfo.visible = true;
                break;
            case this.Status.NOT_INITIALISED:
                this.txtInfo.visible = false;
                break;
            case this.Status.FAIL:
                this.txtInfo.setText(this.Text.LEVEL_FAILED);
                this.txtInfo.visible = true;
                this.textFinalScore.setText(`FINAL SCORE ${this.calculateTotalScore()}`);
                this.textFinalScore.visible = true;
                this.resetGame();
                this.onGameStateChanged(this.Status.IDLE);
                break;
            case this.Status.IDLE:
                break;
            case this.Status.RUNNING:
                this.onScoreChanged();
                this.txtInfo.visible = false;
                this.textFinalScore.visible = false;
                this.textLevelLabel.visible = true;
                this.textScore.visible = true;
                this.textLevel.visible = true;
                this.textScoreLabel.visible = true;
                this.play();
                break;
            case this.Status.LEVEL_FINISHED:
                if (++this.levelIndex < levels[this.difficulty].length) {
                    this.level = levels[this.difficulty][this.levelIndex];
                    this.generateGameGrid();
                    this.score.resetForLevel();
                    this.txtInfo.setText(this.Text.LEVEL_FINISHED);
                    this.txtInfo.visible = true;
                    this.onGameStateChanged(this.Status.IDLE);
                } else {
                    this.onGameStateChanged(this.Status.OVER);
                }
                break;
            case this.Status.OVER:
                this.txtInfo.setText(this.Text.GAME_OVER);
                this.txtInfo.visible = true;
                this.textFinalScore.setText(`FINAL SCORE ${this.calculateTotalScore()}`);
                this.textFinalScore.visible = true;
                this.resetGame();
                break;
        }
    };

    calculateTotalScore() {
        return Math.max((this.difficulty + 1) * (this.levelIndex + 1) * (this.score.hitTotal - this.score.missedTotal), 0)
    }

    onScoreChanged = (_) => {
        //console.log(`Score: lvl: ${this.levelIndex + 1} / hits: ${this.score.hit} / ${this.score.missed}`);
        this.textLevel.setText(`${this.levelIndex + 1} / ${levels[this.difficulty].length}`);
        this.textScore.setText(`${this.score.hit} / ${this.level.goal}`);
        this.onGameStateChanged(this.getLevelStatus())
    };

    getControllers = _ => {
        return array(this.controllerCount, (c, i) => this.userRig.getController(i))
    };

    /**
     * Gets called when VR is clicked (one time, is not called again when user keep triggering)
     */
    onVRCLick() {
        switch (this.status) {
            case this.Status.IDLE:
                this.onGameStateChanged(this.Status.RUNNING);
                break;
            case this.Status.RUNNING:
                this.onGameStateChanged(this.Status.PAUSED);
                break;
            case this.Status.PAUSED:
                this.onGameStateChanged(this.Status.RUNNING);
                break;
            case this.Status.OVER:
                this.enterMenu();
                break;
        }
    }

    enterMenu() {
        this.menu.visible = true;
        this.txtInfo.visible = false;
        this.textScore.visible = false;
        this.textLevel.visible = false;
        this.textLevelLabel.visible = false;
        this.textScoreLabel.visible = false;
        this.textFinalScore.visible = false;
        this.updateMenuItem(2, 0);
        this.destroyControllers();
        this.resetGame();
    }

    onVRDoubleClick() {
        this.enterMenu();
        // this.onGameStateChanged(this.Status.OVER);
        this.destroyControllers();
        this.triggered = false;
    }

    initControllers = (_) => {
        // console.log("enter")
        if (this.status === this.Status.NOT_INITIALISED) return;

        this.hammers = array(this.controllerCount, x => new Hammer());
        let controllers = this.getControllers();

        controllers.forEach((c, i) => {
                c.getChildByName("pointer").visible = false;
                c.add(this.hammers[i]);
            }
        );

        let animation = _ => {
            if (controllers.filter(c => c.triggered).length > 0) {
                if (!this.triggered) {
                    this.triggered = true;

                    // FIRST CLICKS HERE
                    if (!this.setTimeout) {
                        this.setTimeout = true;
                        this.t0 = performance.now();
                        setTimeout(x => {
                            if (!this.callDoubleClick) {
                                this.onVRCLick();
                            } else {
                                this.onVRDoubleClick()
                            }
                            this.setTimeout = false;
                            this.callDoubleClick = false;
                        }, 500)
                    } else {
                        // SECOND CLICKS HERE
                        this.callDoubleClick = performance.now() - this.t0 < 500;
                    }
                }
            } else {
                this.triggered = false;
            }
        };

        this.userRig.getController(0).setAnimation(animation)
    };

    destroyControllers = (_) => {
        if (this.hammers === undefined) return;

        this.getControllers().forEach((c, i) => {
            c.remove(this.hammers[i]);
            c.getChildByName("pointer").visible = true;
            c.setAnimation(undefined);
        });
    };

    addPlatform() {
        this.add(new USER.UserPlatform(this.userRig, _ => this.initControllers(),
            _ => {
                this.destroyControllers();
                this.onGameStateChanged(this.Status.NOT_INITIALISED)
            }, "mainPlatform"));
    }

    addLight() {
        let light = new THREE.AmbientLight(0xffffff, 0.1);
        light.position.x = 0;
        light.position.y = 6;
        light.position.z = 0;
        this.add(light)
    }

    addExhibit() {
        this.exhibit = getRig(0, -2);
        this.generateGameGrid();
        this.add(this.exhibit);
    }

    onDifficultyChanged = (d) => {
        this.difficulty = d;
        this.level = levels[d][this.levelIndex];
        this.generateGameGrid()
    };

    onControllersCountChanged = (c) => {
        if (this.menu.visible) {
            this.controllerCount = c;
        } else {
            this.destroyControllers();
            this.controllerCount = c;
            this.initControllers();
        }
    };

    onGameStart = () => {
        this.txtInfo.setText(this.Text.PRESS_TO_START);
        this.txtInfo.visible = true;
        this.textFinalScore.visible = false;
        setTimeout(x => {
            this.onGameStateChanged(this.Status.IDLE);
            this.initControllers();
        }, 200);

        this.menu.visible = false;
    };


    addGameMenu() {
        this.mainMenuButtons = [
            new GUIVR.GuiVRButton(this.Text.MENU_DIFFICULTY, this.difficulty, 0, levels.length - 1, true, x => {
                if (this.menu && this.menu.visible) {
                    this.onDifficultyChanged(x)
                }
            }),
            new GUIVR.GuiVRButton(this.Text.MENU_CONTROLLERS, this.controllerCount, 1, 2, true, x => {
                if (this.menu && this.menu.visible) {
                    this.onControllersCountChanged(x)
                }
            }),
            new GUIVR.GuiVRButton(this.Text.MENU_CONTINUE, 0, 0, 1, true, x => {
                if (this.menu && this.menu.visible && x) {
                    this.onGameStart()
                }
            })
        ];

        let sign = new GUIVR.GuiVRMenu(this.mainMenuButtons);
        sign.position.y = 1.5;
        sign.position.z = -2;
        this.add(sign);
        return sign;
    }

    generateGameGrid() {
        let numOfBoxes = this.level.width;
        let fieldLength = numOfBoxes / 2;

        removeChildrenByName(this.exhibit, "grid");
        this.moles = [];

        let boxes = new THREE.Group();
        boxes.name = "grid";
        let outerRadius = fieldLength / numOfBoxes; // may depend on level
        let innerRadius = outerRadius * 0.6;

        for (let h = 0; h < numOfBoxes; h++) {
            for (let v = 0; v < numOfBoxes; v++) {
                let mole = new MoleBox(this.level.color, outerRadius, innerRadius, this.onMoleDown);
                mole.position.x = (h - numOfBoxes / 2) * (outerRadius + outerRadius * .2) + outerRadius * .6;
                mole.position.z = (v - numOfBoxes / 2) * (outerRadius + outerRadius * .2);
                this.moles.push(mole);
                boxes.add(mole);
            }
        }
        boxes.position.z -= fieldLength / 2 - 1;
        this.exhibit.add(boxes);
    }

    jumpRandomMole(speed) {
        while (true) {
            let m = arrayRandomN(this.moles, 1)[0];
            if (!this.movingMoles.includes(m)) { // choosing random mole which is not moving already
                this.movingMoles.push(m);
                m.jump(speed);
                break;
            }
        }
    }

    /**
     * Callback when a mole gets back to box.
     * @param mole instance of mole that got back to box
     * @param wasHit [bool] if mole was hit
     */
    onMoleDown = (mole, wasHit) => {
        if (!wasHit && this.status === this.Status.RUNNING) {
            this.score.addMissed();
            this.showRandomMiss();
        }

        if (this.status === this.Status.RUNNING) { // continue mole jump only if game still running (= not failed or paused)
            this.movingMoles = this.movingMoles.filter(item => item !== mole); // remove itself from moving list
            this.jumpRandomMole(this.level.speed)
        }
    };

    /**
     * Starts the game flow after IDLE state, that is at the beginning or after level up.
     */
    play() {
        this.movingMoles = arrayRandomN(this.moles, this.level.parallel);
        this.movingMoles.forEach(m => {
            setTimeout(() => m.jump(this.level.speed), Math.random() * 1800)
        });
    }

    update() {
        if (this.status === this.Status.RUNNING) {
            this.checkMoleHit()
        }
    }

    checkMoleHit() {
        let hammersBB = this.hammers.map(h => new THREE.Box3().setFromObject(h.top));

        this.movingMoles.forEach(m => {
            let bb = new THREE.Box3().setFromObject(m.mole);
            let gridBB = new THREE.Box3().setFromObject(m.box);
            hammersBB.forEach(hb => {
                let collisionHammerMole = hb.intersectsBox(bb);
                let collisionHammerGrid = hb.intersectsBox(gridBB);
                if (collisionHammerMole && !collisionHammerGrid && !m.dead && this.status === this.Status.RUNNING) {
                    m.hit();
                    this.score.addHit()
                }
            })
        })
    }

    getLevelStatus() {
        if (this.score.missed >= this.level.allowedMiss) {
            return this.Status.FAIL;
        }

        if (this.score.hit >= this.level.goal) {
            return this.Status.LEVEL_FINISHED;
        }

        return this.status;
    }
}
