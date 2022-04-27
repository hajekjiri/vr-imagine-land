import * as THREE from '../../../../extern/build/three.module.js';
import { MessageBoard } from './MessageBoard.js';

export class Instructions extends THREE.Group {
  constructor() {
    super();

    this.instructionBoard = new MessageBoard(2.5, "Instructions", 25);

    this.instructionBoard.write("Welcome to the Bottle");
    this.instructionBoard.write("Tipping Challenge!");
    this.instructionBoard.write("Here are the rules:");
    this.instructionBoard.write("1. Hold the right trigger");
    this.instructionBoard.write("   to start throwing");
    this.instructionBoard.write("2. Move the controller");
    this.instructionBoard.write("   as if you were throwing");
    this.instructionBoard.write("   an actual ball.");
    this.instructionBoard.write("3. Release the trigger");
    this.instructionBoard.write("   to stop throwing");
    this.instructionBoard.write("4. Hit as many jugs as");
    this.instructionBoard.write("   possible before time");
    this.instructionBoard.write("   runs out!");
    this.instructionBoard.write("NOTE: Works best on the");
    this.instructionBoard.write("      Oculus Quest!");
    this.add(this.instructionBoard);
  }
}
