export class Score {

    hit = 0;
    missed = 0;
    hitTotal = 0;
    missedTotal = 0;

    constructor(onScoreChanged) {
        this.onScoreChanged = onScoreChanged;
    }

    resetForLevel() {
        this.hit = 0;
        this.missed = 0;
    }

    resetForNewGame(){
        this.hit = 0;
        this.missed = 0;
        this.hitTotal = 0;
        this.missedTotal = 0;
    }

    addHit() {
        this.hit++;
        this.hitTotal++;
        this.onScoreChanged();

    }

    addMissed() {
        this.missed++;
        this.missed++;
        this.onScoreChanged();
    }
}