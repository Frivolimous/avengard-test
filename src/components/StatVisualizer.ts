import * as PIXI from 'pixi.js';
import { Fonts } from '../data/Fonts';
import { ColorGradient } from '../JMGE/others/Colors';

export class StatVisualizer extends PIXI.Container {
    private label = new PIXI.Text('', {fontSize: 20, fontFamily: Fonts.UI});
    private _Value: number = 0;
    private bars: PIXI.Graphics[] = [];
    private gradient: ColorGradient = new ColorGradient(0xffcccc, 0xccffcc);

    constructor(label: string, private offset: number = 1) {
        super();

        this.label.text = label;
        this.label.position.set(-this.label.width, 0);

        this.addChild(this.label);
        this.value = 0;
    }

    public get value(): number {
        return this._Value;
    }

    public set value(v: number) {
        v = Math.max(v, 0);
        this._Value = v;
        while (this.bars.length > v) {
            let vis = this.bars.pop();
            vis && vis.destroy();
        }
        for (let i = 0; i < v + this.offset; i++) {
            if (!this.bars[i]) {
                this.bars[i] = this.makeBar(i);
            }
            this.bars[i].tint = this.gradient.getColorAt(v / 12);
        }
    }

    private makeBar(v: number) {
        let bar = new PIXI.Graphics();
        this.addChild(bar);
        bar.beginFill(0xffffff).lineStyle(1).drawRect(0, 0, 30, 10);
        bar.position.set(10 + v * 30, 7);
        return bar;
    }
}
