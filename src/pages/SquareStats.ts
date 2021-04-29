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
import { StatSquare } from '../components/StatSquare';

type Stat = 'Ability Power' | 'Attack Power' | 'Attack Speed' | 'Attack Range' | 'Health' | 'Protection' | 'Stamina' | 'Movement Speed' | 'Building';

export class SquareStats extends BaseUI {
  private title: PIXI.Text;
  private statSquare = new StatSquare();
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

    this.statSquare.position.set(100, 150);
    this.circle.position.set(500, 300);
    this.addLabel('Attack', 40, 130);
    this.addLabel('Ability', 305, 350);
    this.addLabel('Defense', 40, 350);
    this.addLabel('Utility', 305, 130);

    let y = 400;
    for (let key of (Object.keys(this.stats))) {
      this.stats[key as Stat].position.set(200, y);
      y += 30;
      this.addChild(this.stats[key as Stat]);
    }

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
    // console.log(this.preStats[0] + this.preStats[1] + this.preStats[2] + this.preStats[3], this.preStats);
    this.circle.height = 100 + (this.preStats[0] + this.preStats[2]) / 2 * 100;
    this.circle.width = 50 + this.preStats[1] * 70 + this.preStats[0] * 30;
    this.circle.tint = this.gradient.getColorAt(0.5 + (this.preStats[2] - this.preStats[0]) / 2);
    // this.statDisplay.text = `Offense: ${this.toStat(stats[0])}\nDefense: ${this.toStat(stats[1])}\nUtility: ${this.toStat(stats[2])}`;

    this.calculateStats();
  }

  public calculateStats = () => {
    let P = Math.round(this.preStats[0] * 12);
    let D = Math.round(this.preStats[1] * 12);
    let M = Math.round(this.preStats[2] * 12);
    let U = 12 - P - D - M;

    // let PD = 0;
    // let MD = 0;
    // let MU = 0;
    // let PU = 0;

    // if (P > 1 && D > 1) {
    //   if (P > 2) {
    //     P--;
    //     PD++;
    //   }
    //   if (D > 2) {
    //     D--;
    //     PD++;
    //   }
    // }
    // if (M > 1 && D > 1) {
    //   if (M > 2) {
    //     M--;
    //     MD++;
    //   }
    //   if (D > 2) {
    //     D--;
    //     MD++;
    //   }
    // }
    // if (P > 1 && U > 1) {
    //   if (P > 2) {
    //     P--;
    //     PU++;
    //   }
    //   if (U > 2) {
    //     U--;
    //     PU++;
    //   }
    // }
    // if (M > 1 && U > 1) {
    //   if (M > 2) {
    //     M--;
    //     MU++;
    //   }
    //   if (U > 2) {
    //     U--;
    //     MU++;
    //   }
    // }

    this.stats['Ability Power'].value = Math.round( M * 2 / 3);
    this.stats['Attack Power'].value = Math.round(P * 2 / 3);
    this.stats['Attack Speed'].value = P - this.stats['Attack Power'].value;
    // let H1 = Math.round(PD * 2 / 3);
    // let H2 = Math.round(MD * 1 / 3);
    // this.stats['Health'].value = H1 + H2;
    this.stats['Health'].value = Math.round(D / 2);
    this.stats['Protection'].value = D - this.stats['Health'].value;
    this.stats['Stamina'].value = M - this.stats['Ability Power'].value;
    this.stats['Movement Speed'].value = Math.round(U * 1 / 3);
    this.stats['Building'].value = U - this.stats['Movement Speed'].value;

    // this.stats.Health.value += PD;
    // this.stats.Protection.value += MD;
    // this.stats.Stamina.value += MU;
    // this.stats['Attack Speed'].value += Math.ceil(PU / 2);
    // this.stats['Movement Speed'].value += Math.floor(PU / 2);
  }

  public toStat(n: number) {
    return Math.round(n * 100);
  }

  private startGame = () => {
    this.navForward(new BlankUI());
  }
}
