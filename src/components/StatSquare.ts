import * as PIXI from 'pixi.js';

export class StatSquare extends PIXI.Container {
    public stats: number[] = [0.5, 0.5, 0.5, 0.5];
    public points: PIXI.Point[] = [];
    public onUpdate: (stats: number[]) => void;

    private background = new PIXI.Graphics();
    private mover = new PIXI.Graphics();

    private dragging = false;

    constructor(private size: number = 200) {
        super();

        this.points = [
            new PIXI.Point(0, 0),
            new PIXI.Point(0, size),
            new PIXI.Point(size, size),
            new PIXI.Point(size, 0),
        ];

        this.background.beginFill(0xddffff).lineStyle(1).drawPolygon(this.points);

        this.mover.beginFill(0x00ffff).lineStyle(1).drawCircle(0, 0, 10);
        this.background.interactive = true;
        this.mover.interactive = true;
        this.mover.buttonMode = true;
        this.mover.position.set(size / 2, size / 2);

        this.addChild(this.background, this.mover);

        this.mover.addListener('pointerdown', this.onDown);
        this.background.addListener('pointerdown', this.onDown);
        this.background.addListener('pointerup', this.onUp);
        this.mover.addListener('pointerup', this.onUp);
        this.background.addListener('pointerupoutside', this.onUp);
        this.mover.addListener('pointerupoutside', this.onUp);
        this.background.addListener('pointermove', this.onMove);
    }

    private onDown = (e: PIXI.interaction.InteractionEvent) => {
        this.dragging = true;
    }

    private onUp = (e: PIXI.interaction.InteractionEvent) => {
        this.dragging = false;
    }

    private onMove = (e: PIXI.interaction.InteractionEvent) => {
        if (!this.dragging) return;

        let position = this.getSnapPoint(e.data.getLocalPosition(this));

        if (!position) {
            return;
        }

        this.mover.position.set(position.x, position.y);
        this.stats[2] = position.y / this.size;
        this.stats[3] = position.x / this.size;
        this.stats[0] = 1 - this.stats[2];
        this.stats[1] = 1 - this.stats[3];

        this.onUpdate && this.onUpdate(this.stats);
    }

    private getSnapPoint(raw: PIXI.Point): PIXI.Point {
        if (raw.x < 0) raw.x = 0;
        else if (raw.x > this.size) raw.x = this.size;
        if (raw.y < 0) raw.y = 0;
        else if (raw.y > this.size) raw.y = this.size;

        return raw;
    }
}
