import * as PIXI from 'pixi.js';
import { BaseUI } from './_BaseUI';
import { Fonts } from '../data/Fonts';
import { IResizeEvent } from '../services/GameEvents';
import { BlankUI } from './BlankUI';
import { StatTriangle } from '../components/StatTriangle';
import { StatVisualizer } from '../components/StatVisualizer';
import { Slider } from '../components/Slider';
import { ColorGradient } from '../JMGE/others/Colors';
import { SelectList } from '../components/ui/SelectButton';
import { Stat, StatData, StatObj, StatVisualizerObj } from '../data/StatData';

export class TriangleEquipment extends BaseUI {
  private title: PIXI.Text;
  private statTriangle = new StatTriangle();
  private statSlider = new Slider();
  private gradient = new ColorGradient(0xffcccc, 0xccccff);

  private equipment: SelectList;

  private preStats: number[] = [0, 0, 0, 0, 0];
  private circle = new PIXI.Graphics();
  private stats: StatVisualizerObj = StatData.makeStatVisualizerObj(1);

  private baseStats: StatObj = StatData.makeStatObj();

  private currentEquipment: StatObj;

  constructor() {
    super({bgColor: 0x777777});
    this.interactive = true;
    this.title = new PIXI.Text('Avengard Stats Test', { fontSize: 30, fontFamily: Fonts.UI, fill: 0x3333ff });

    this.circle.beginFill(0xffffff).lineStyle(1).drawCircle(0, -50, 50);
    this.addChild(this.title);

    this.addLabel('Offense', 175, 80);
    this.addLabel('Defense', 65, 280);
    this.addLabel('Utility', 285, 280);
    this.addLabel('Attack', 60, 350);
    this.addLabel('Ability', 300, 350);

    let y = 400;
    for (let key of (Object.keys(this.stats))) {
      this.stats[key as Stat].position.set(500, y);
      y += 30;
      this.addChild(this.stats[key as Stat]);
    }

    this.equipment = new SelectList({width: 150, height: 40}, this.selectEquipment);
    StatData.equipmentStats.forEach(stat => {
      this.equipment.makeButton(stat.label);
    });

    this.equipment.buttons.forEach((button, i) => {
      this.addChild(button);
      button.position.set(80, 400 + i * 50);
    });
    this.equipment.selectButton(0);

    this.addChild(this.statTriangle, this.statSlider, this.circle);

    this.statTriangle.onUpdate = this.updateStats;
    this.statSlider.onUpdate = this.updateSlider;
    this.updateStats(this.statTriangle.stats);
    this.updateSlider(this.statSlider.value);
  }

  public navIn = () => {
  }

  public positionElements = (e: IResizeEvent) => {
    this.title.x = (e.innerBounds.width - this.title.width) / 2;
    this.title.y = 50;
    this.statTriangle.position.set(200, 100);
    this.statSlider.position.set(100, 350);
    this.circle.position.set(500, 300);
  }

  public addLabel(s: string, x: number, y: number) {
    let label = new PIXI.Text(s, {fontSize: 15, fontFamily: Fonts.UI});
    label.position.set(x, y);
    this.addChild(label);
  }

  public updateStats = (stats: number[]) => {
    this.preStats[0] = stats[0];
    this.preStats[1] = stats[1];
    this.preStats[2] = stats[2];
    this.circle.height = 100 + (stats[0] + stats[1]) / 2 * 100;
    this.circle.width = 50 + stats[1] * 70;

    this.calculateStats();
  }

  public updateSlider = (stat: number) => {
    this.preStats[3] = 1 - stat;
    this.preStats[4] = stat;
    this.circle.tint = this.gradient.getColorAt(stat);

    this.calculateStats();
  }

  public calculateStats = () => {
    this.baseStats = StatData.calculateTriStat(this.preStats[0], this.preStats[1], this.preStats[2], this.preStats[4]);

    this.finishStats();
  }

  public selectEquipment = (n: number) => {
    this.currentEquipment = StatData.equipmentStats[n].stats;

    this.finishStats();
  }

  public finishStats() {
    for (let key of Object.keys(this.stats)) {
      this.stats[key as Stat].value = this.baseStats[key as Stat] + this.currentEquipment[key as Stat];
    }
  }

  public toStat(n: number) {
    return Math.round(n * 100);
  }
}
