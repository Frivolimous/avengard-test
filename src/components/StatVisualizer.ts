import * as PIXI from 'pixi.js';
import { Fonts } from '../data/Fonts';
import { ColorGradient } from '../JMGE/others/Colors';

export class StatVisualizer extends PIXI.Container {
    private label = new PIXI.Text('', {fontSize: 20, fontFamily: Fonts.UI});
    private _Value: number = 0;
    private bars: PIXI.Graphics[] = [];
    private gradient: ColorGradient = new ColorGradient(0xffcccc, 0xccffcc);

    constructor(label: string, value: number = 0) {
        super();

        this.label.text = label;
        this.label.position.set(-this.label.width, 0);

        this.addChild(this.label);
        this.value = value;
    }

    public get value(): number {
        return this._Value;
    }

    public set value(v: number) {
        this._Value = v;
        while (this.bars.length > v) {
            this.bars.pop().destroy();
        }
        for (let i = 0; i < v + 1; i++) {
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