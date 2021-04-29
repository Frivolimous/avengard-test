import * as PIXI from 'pixi.js';
import { BaseUI } from './_BaseUI';
import { Fonts } from '../data/Fonts';
import { IResizeEvent } from '../services/GameEvents';
import { BlankUI } from './BlankUI';
import { StatVisualizer } from '../components/StatVisualizer';
import { ColorGradient } from '../JMGE/others/Colors';
import { StatSquare } from '../components/StatSquare';
import { SelectList } from '../components/ui/SelectButton';
import { Stat, StatData, StatObj, StatVisualizerObj } from '../data/StatData';

export class SquareEquipment extends BaseUI {
  private title: PIXI.Text;
  private statSquare = new StatSquare();
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

    this.statSquare.position.set(100, 150);
    this.circle.position.set(500, 300);
    this.addLabel('Attack', 40, 130);
    this.addLabel('Ability', 305, 350);
    this.addLabel('Defense', 40, 350);
    this.addLabel('Utility', 305, 130);

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

    this.addChild(this.statSquare, this.circle);

    this.statSquare.onUpdate = this.updateStats;
    this.updateStats(this.statSquare.stats);
  }

  public navIn = () => {
  }

  public positionElements = (e: IResizeEvent) => {
    this.title.x = (e.innerBounds.width - this.title.width) / 2;
    this.title.y = 50;
  }

  public addLabel(s: string, x: number, y: number) {
    let label = new PIXI.Text(s, {fontSize: 15, fontFamily: Fonts.UI});
    label.position.set(x, y);
    this.addChild(label);
  }

  public updateStats = (stats: number[]) => {
    this.preStats[0] = stats[0] * stats[1];
    this.preStats[1] = stats[1] * stats[2];
    this.preStats[2] = stats[2] * stats[3];
    this.preStats[3] = stats[3] * stats[0];
    this.circle.height = 100 + (this.preStats[0] + this.preStats[2]) / 2 * 100;
    this.circle.width = 50 + this.preStats[1] * 70 + this.preStats[0] * 30;
    this.circle.tint = this.gradient.getColorAt(0.5 + (this.preStats[2] - this.preStats[0]) / 2);

    this.calculateStats();
  }

  public calculateStats = () => {
    this.baseStats = StatData.calculateSquareStat(this.preStats[0], this.preStats[1], this.preStats[2], this.preStats[3]);

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
