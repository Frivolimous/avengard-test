import * as PIXI from 'pixi.js';
import { BaseUI } from './_BaseUI';
import { Button } from '../components/ui/Button';
import { Fonts } from '../data/Fonts';
import { IResizeEvent } from '../services/GameEvents';
import { StringData } from '../data/StringData';
import { JMTween } from '../JMGE/JMTween';
import { AssetLoader } from '../services/AssetLoader';
import { DragonSpriteBasic } from '../components/DragonAvatar/DragonSpriteBasic';
import { TooltipReader } from '../components/tooltip/TooltipReader';
import { BlankUI } from './BlankUI';
import { StatTriangle } from '../components/StatTriangle';
import { StatVisualizer } from '../components/StatVisualizer';
import { Slider } from '../components/Slider';
import { ColorGradient } from '../JMGE/others/Colors';

type Stat = 'Ability Power' | 'Attack Power' | 'Attack Speed' | 'Attack Range' | 'Health' | 'Protection' | 'Stamina' | 'Movement Speed' | 'Building';

export class MenuUI extends BaseUI {
  private title: PIXI.Text;
  private statTriangle = new StatTriangle();
  private statSlider = new Slider();
  private gradient = new ColorGradient(0xffcccc, 0xccccff);

  private preStats: number[] = [0, 0, 0, 0, 0];
  private circle = new PIXI.Graphics();
  private stats: {[key in Stat]: StatVisualizer} = {
    'Ability Power': new StatVisualizer('Ability Power'),
    'Attack Power': new StatVisualizer('Attack Power'),
    'Attack Speed': new StatVisualizer('Attack Speed'),
    'Attack Range': new StatVisualizer('Attack Range'),
    'Health': new StatVisualizer('Health'),
    'Protection': new StatVisualizer('Protection'),
    'Stamina': new StatVisualizer('Stamina'),
    'Movement Speed': new StatVisualizer('Movement Speed'),
    'Building': new StatVisualizer('Building'),
  };

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
      this.stats[key as Stat].position.set(200, y);
      y += 30;
      this.addChild(this.stats[key as Stat]);
      // let sv = new StatVisualizer(key, 0);
      // sv.position.set(200, y);
      // this.
      // y += 20;
    }

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
    this.circle.position.set(500, 300)
    // this.statDisplay2.position.set(350, 290);
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
    // this.statDisplay.text = `Offense: ${this.toStat(stats[0])}\nDefense: ${this.toStat(stats[1])}\nUtility: ${this.toStat(stats[2])}`;

    this.calculateStats();
  }

  public updateSlider = (stat: number) => {
    this.preStats[3] = 1 - stat;
    this.preStats[4] = stat;
    this.circle.tint = this.gradient.getColorAt(stat);
    // this.statDisplay2.text = `Physical: ${this.toStat(1 - stat)}\nMagical: ${this.toStat(stat)}`;

    this.calculateStats();
  }

  public calculateStats = () => {
    let PO = Math.round(this.preStats[0] * 12);
    let PD = Math.round(this.preStats[1] * 12);
    let PU = 12 - PO - PD;
    let MO = 0;
    let MD = 0;
    let MU = 0;

    MO = Math.round (PO * this.preStats[4]);
    PO = PO - MO;
    MD = Math.round (PD * this.preStats[4]);
    PD = PD - MD;
    MU = Math.round (PU * this.preStats[4]);
    PU = PU - MU;

    this.stats['Ability Power'].value = MO;
    this.stats['Attack Power'].value = Math.round(PO * 2 / 3);
    this.stats['Attack Speed'].value = PO - this.stats['Attack Power'].value;
    let H1 = Math.round(PD * 2 / 3);
    let H2 = Math.round(MD * 1 / 3);
    this.stats['Health'].value = H1 + H2;
    this.stats['Protection'].value = PD - H1 + MD - H2;
    this.stats['Stamina'].value = Math.round(MU * 2 / 3);
    this.stats['Movement Speed'].value = Math.round(PU * 1 / 3);
    this.stats['Building'].value = MU - this.stats['Stamina'].value + PU - this.stats['Movement Speed'].value;

    // this.statDisplay.text = '';
    // for (let key of Object.keys(this.stats)) {
    //   this.statDisplay.text += `${key}: ${this.stats[key as Stat]}\n`;
    // }
    // this.statDisplay.text = `Offense: ${this.toStat(stats[0])}\nDefense: ${this.toStat(stats[1])}\nUtility: ${this.toStat(stats[2])}`;
  }

  public toStat(n: number) {
    return Math.round(n * 100);
  }

  private startGame = () => {
    this.navForward(new BlankUI());
  }
}
