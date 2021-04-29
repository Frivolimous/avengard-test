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
import { SelectList } from '../components/ui/SelectButton';

type Stat = 'Ability Power' | 'Attack Power' | 'Attack Speed' | 'Attack Range' | 'Health' | 'Protection' | 'Stamina' | 'Movement Speed' | 'Building';

export class TriangleEquipment extends BaseUI {
  private title: PIXI.Text;
  private statTriangle = new StatTriangle();
  private statSlider = new Slider();
  private gradient = new ColorGradient(0xffcccc, 0xccccff);

  private equipment: SelectList;

  private preStats: number[] = [0, 0, 0, 0, 0];
  private circle = new PIXI.Graphics();
  private stats: {[key in Stat]: StatVisualizer} = {
    'Ability Power': new StatVisualizer('Ability Power', 0),
    'Attack Power': new StatVisualizer('Attack Power', 0),
    'Attack Speed': new StatVisualizer('Attack Speed', 0),
    'Attack Range': new StatVisualizer('Attack Range', 0),
    'Health': new StatVisualizer('Health', 0),
    'Protection': new StatVisualizer('Protection', 0),
    'Stamina': new StatVisualizer('Stamina', 0),
    'Movement Speed': new StatVisualizer('Movement Speed', 0),
    'Building': new StatVisualizer('Building', 0),
  };

  private baseStats: {[key in Stat]: number} = {
    'Ability Power': 0,
    'Attack Power': 0,
    'Attack Speed': 0,
    'Attack Range': 0,
    'Health': 0,
    'Protection': 0,
    'Stamina': 0,
    'Movement Speed': 0,
    'Building': 0,
  };

  private currentEquipment: {[key in Stat]: number};

  private equipmentStats: {label: string, stats: {[key in Stat]: number}}[] = [
    {
      label: 'Sword and Shield',
      stats: {
        'Ability Power': 2,
        'Attack Power': 3,
        'Attack Speed': 2,
        'Attack Range': 1,
        'Health': 3,
        'Protection': 2,
        'Stamina': 3,
        'Movement Speed': 4,
        'Building': 1,
      },
    },
    {
      label: 'Bow and Arrow',
      stats: {
        'Ability Power': 2,
        'Attack Power': 3,
        'Attack Speed': 3,
        'Attack Range': 4,
        'Health': 1,
        'Protection': 1,
        'Stamina': 3,
        'Movement Speed': 3,
        'Building': 1,
      },
    },
    {
      label: 'Greatsword',
      stats: {
        'Ability Power': 2,
        'Attack Power': 4,
        'Attack Speed': 2,
        'Attack Range': 2,
        'Health': 3,
        'Protection': 1,
        'Stamina': 2,
        'Movement Speed': 4,
        'Building': 1,
      },
    },
    {
      label: 'Twin Daggers',
      stats: {
        'Ability Power': 3,
        'Attack Power': 3,
        'Attack Speed': 4,
        'Attack Range': 1,
        'Health': 2,
        'Protection': 1,
        'Stamina': 2,
        'Movement Speed': 4,
        'Building': 1,
      },
    },
    {
      label: 'Staff',
      stats: {
        'Ability Power': 4,
        'Attack Power': 2,
        'Attack Speed': 2,
        'Attack Range': 3,
        'Health': 2,
        'Protection': 1,
        'Stamina': 4,
        'Movement Speed': 2,
        'Building': 1,
      },
    },
  ];

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
    this.equipmentStats.forEach(stat => {
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
    let PO = Math.round(this.preStats[0] * 6);
    let PD = Math.round(this.preStats[1] * 6);
    let PU = 6 - PO - PD;
    let MO = 0;
    let MD = 0;
    let MU = 0;

    MO = Math.round (PO * this.preStats[4]);
    PO = PO - MO;
    MD = Math.round (PD * this.preStats[4]);
    PD = PD - MD;
    MU = Math.round (PU * this.preStats[4]);
    PU = PU - MU;

    this.baseStats['Ability Power'] = MO;
    this.baseStats['Attack Power'] = Math.round(PO * 2 / 3);
    this.baseStats['Attack Speed'] = PO - this.baseStats['Attack Power'];
    let H1 = Math.round(PD * 2 / 3);
    let H2 = Math.round(MD * 1 / 3);
    this.baseStats['Health'] = H1 + H2;
    this.baseStats['Protection'] = PD - H1 + MD - H2;
    this.baseStats['Stamina'] = Math.round(MU * 2 / 3);
    this.baseStats['Movement Speed'] = Math.round(PU * 1 / 3);
    this.baseStats['Building'] = MU - this.baseStats['Stamina'] + PU - this.baseStats['Movement Speed'];

    this.finishStats();
  }

  public selectEquipment = (n: number) => {
    this.currentEquipment = this.equipmentStats[n].stats;

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

  private startGame = () => {
    this.navForward(new BlankUI());
  }
}
