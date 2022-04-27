import * as THREE from '../../../extern/build/three.module.js';
import { BaseStructure } from './BaseStructure.js';
import {MovingCore} from './MovingCore.js';
import * as USER from '../../User.js';
import * as GUIVR from '../../GuiVR.js';

export class FerrisWheel extends THREE.Group{
	constructor( heightMid, depthOfBase, wiredRadiuses, middleRadius, numberOfCabines, infoWire, speed, clocks, userRig){
		super();
		let userPlatform = new USER.UserPlatform(userRig);
		userPlatform.position.z = depthOfBase*2;
		this.add(userPlatform);



		//position for cabines
		const positionOffset = depthOfBase/2 - wiredRadiuses[0] - infoWire[0];
		const movingCore = new MovingCore(heightMid, depthOfBase, middleRadius, numberOfCabines, infoWire, positionOffset, speed*clocks, userRig);
		this.add(movingCore);
		this.movingCore = movingCore;

		// Make GUI sign.

		const baseStructure = new BaseStructure(heightMid, depthOfBase, wiredRadiuses, middleRadius/2);
		this.add(baseStructure);
		const temp = this;
		let counter1 = 0;
		let counter2 = 0;
		let counter3 = 0;
		this.oldSleep = speed;
		let buttons = [new GUIVR.GuiVRButton("Cabines", numberOfCabines, 1, 15, true,
			function(x){
				if(counter1++ > 0){
					temp.remove(temp.movingCore);
					numberOfCabines = x;
					temp.movingCore = new MovingCore(heightMid, depthOfBase, middleRadius, numberOfCabines, infoWire, positionOffset, speed*clocks, userRig);
					temp.add(temp.movingCore);
				}

			}),
			new GUIVR.GuiVRButton("Speed", speed, 1, 20, true,
				function(x){
					if(counter2++ > 0){
						temp.remove(temp.movingCore);
						if(speed == 0){
							temp.movingCore = new MovingCore(heightMid, depthOfBase, middleRadius, numberOfCabines, infoWire, positionOffset, 0, userRig);
							temp.oldSleep = x;
							temp.add(temp.movingCore);
						}else{
							speed = x;
							temp.movingCore = new MovingCore(heightMid, depthOfBase, middleRadius, numberOfCabines, infoWire, positionOffset, speed*clocks, userRig);
							temp.add(temp.movingCore);
						}
					}
				}),
			new GUIVR.GuiVRButton("Direction", clocks, -1, 1, true,
				function(x){
					if(counter3++ > 0){
						temp.remove(temp.movingCore);
						if(x == 1 || x == -1){
							clocks = x;
							if (speed == 0){
								speed = temp.oldSleep;
							}
							temp.remove(temp.movingCore);
							temp.movingCore = new MovingCore(heightMid, depthOfBase, middleRadius, numberOfCabines, infoWire, positionOffset, x*speed, userRig);
							temp.add(temp.movingCore);
						}
						else{
							temp.remove(temp.movingCore);
							temp.oldSleep = speed;
							speed = 0;
							temp.movingCore = new MovingCore(heightMid, depthOfBase, middleRadius, numberOfCabines, infoWire, positionOffset, speed, userRig);
							temp.add(temp.movingCore);
						}
					}
				})];
		let sign = new GUIVR.GuiVRMenu(buttons);
		sign.position.x = 1;
		sign.position.z = depthOfBase;
		sign.position.y = 1;
		this.add(sign);
	}
}

