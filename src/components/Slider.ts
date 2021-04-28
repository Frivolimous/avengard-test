import * as PIXI from 'pixi.js';

export class Slider extends PIXI.Container {
    public value: number = 0.5;
    public onUpdate: (value: number) => void;

    private background = new PIXI.Graphics();
    private mover = new PIXI.Graphics();

    private dragging = false;

    constructor(private size: number = 200) {
        super();

        this.background.lineStyle(2).moveTo(0, 0).lineTo(size, 0);

        this.mover.beginFill(0x00ffff).lineStyle(1).drawCircle(0, 0, 10);
        this.mover.interactive = true;
        this.mover.buttonMode = true;
        this.mover.position.set(size / 2, 0);

        this.addChild(this.background, this.mover);

        this.mover.addListener('pointerdown', this.onDown);
        this.mover.addListener('pointerup', this.onUp);
        this.mover.addListener('pointerupoutside', this.onUp);
        this.mover.addListener('pointermove', this.onMove);
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

        this.value = position.x / this.size;

        this.onUpdate && this.onUpdate(this.value);
    }

    private getSnapPoint(raw: PIXI.Point): PIXI.Point {
        raw.y = 0;

        raw.x = Math.min(Math.max(raw.x, 0), this.size);

        return raw;
    }
}
