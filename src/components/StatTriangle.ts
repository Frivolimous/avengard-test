import * as PIXI from 'pixi.js';

export class StatTriangle extends PIXI.Container {
    public stats: number[] = [0.33, 0.33, 0.33];
    public points: PIXI.Point[] = [];
    public onUpdate: (stats: number[]) => void;

    private background = new PIXI.Graphics();
    private mover = new PIXI.Graphics();

    private dragging = false;

    constructor(private size: number = 200) {
        super();

        this.points = [
            new PIXI.Point(0, 0),
            new PIXI.Point(-size / 2, size * Math.sqrt(3) / 2),
            new PIXI.Point(size / 2, size * Math.sqrt(3) / 2),
        ];

        this.background.beginFill(0xddffff).lineStyle(1).drawPolygon(this.points);

        this.mover.beginFill(0x00ffff).lineStyle(1).drawCircle(0, 0, 10);
        this.background.interactive = true;
        this.mover.interactive = true;
        this.mover.buttonMode = true;
        this.mover.position.set(0, this.points[1].y * 2 / 3);

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
        let height = this.size * Math.sqrt(3) / 2;

        this.stats[0] = 1 - position.y / height ;

        let dX = position.x - this.points[1].x;
        let dY = position.y - this.points[1].y;
        let a = Math.atan2(dY, dX) + Math.PI / 2;
        let A = Math.sqrt(dX * dX + dY * dY);

        this.stats[1] = 1 - A * Math.sin(Math.PI / 6 + a) / height;

        dX = position.x - this.points[2].x;
        dY = position.y - this.points[2].y;
        a = Math.atan2(dY, dX) - Math.PI / 2;
        A = Math.sqrt(dX * dX + dY * dY);

        this.stats[2] = 1 + A * Math.sin(Math.PI / 6 - a) / height;

        this.onUpdate && this.onUpdate(this.stats);
    }

    private getSnapPoint(raw: PIXI.Point): PIXI.Point {
        if (this.hitTestPoint(raw)) {
            return raw;
        } else {
            // if (raw.y > this.points[1].y) {
            //     raw.y = this.points[1].y;
            // } else if (raw.y < 0) {
            //     raw.y = 0;
            // }

            // if (raw.x > 0) {
            //     raw.x = this.getSnapPointLine(raw.x, raw.y, [this.points[0], this.points[2]]).x;
            // } else {
            //     raw.x = this.getSnapPointLine(raw.x, raw.y, [this.points[0], this.points[1]]).x;
            // }
            // return raw;
            return null;
        }
    }

    private hitTestPoint = (point: {x: number, y: number}): boolean => {
        let numCrosses: number = 0;

        let j: number = this.points.length - 1;
        for (let i: number = 0; i < this.points.length; i += 1) {
          if (point.x >= Math.min(this.points[i].x, this.points[j].x) && point.x <= Math.max(this.points[i].x, this.points[j].x)) {
            let dx: number = this.points[i].x - this.points[j].x;
            let dy: number = this.points[i].y - this.points[j].y;
            let ratio: number = dy / dx;
            let d2x: number = point.x - this.points[j].x;
            let d2y: number = ratio * d2x;
            let yAtX: number = this.points[j].y + d2y;

            if (yAtX > point.y) {
              numCrosses += 1;
            }
          }
          j = i;
        }
        return (numCrosses % 2 === 1);
    }

    private getSnapPointLine = (x: number, y: number, line: {x: number, y: number}[]): PIXI.Point => {
        let ang = Math.atan2(line[1].y - line[0].y, line[1].x - line[0].x);
        let ang2 = Math.atan2(y - line[0].y, x - line[0].x);

        let hyp = Math.sqrt((x - line[0].x) * (x - line[0].x) + (y - line[0].y) * (y - line[0].y));
        let mag = hyp * Math.cos(ang2 - ang);

        let m = new PIXI.Point(line[0].x + mag * Math.cos(ang), line[0].y + mag * Math.sin(ang));
        m.x = Math.max(Math.min(m.x, Math.max(line[0].x, line[1].x)), Math.min(line[0].x, line[1].x));
        m.y = Math.max(Math.min(m.y, Math.max(line[0].y, line[1].y)), Math.min(line[0].y, line[1].y));
        return m;
    }
}
