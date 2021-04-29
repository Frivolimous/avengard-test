import { StatVisualizer } from '../components/StatVisualizer';

export class StatData {
    public static equipmentStats: {label: string, stats: StatObj}[] = [
        {
            label: 'Sword and Shield',
            stats: {
            'Power': 1,
            'Attack Speed': 0,
            'Attack Range': 0,
            'Health': 2,
            'Protection': 3,
            'Stamina': 0,
            'Movement Speed': 1,
            'Building': 0,
            },
        },
        {
            label: 'Bow and Arrow',
            stats: {
            'Power': 2,
            'Attack Speed': 2,
            'Attack Range': 3,
            'Health': 0,
            'Protection': 0,
            'Stamina': 0,
            'Movement Speed': 0,
            'Building': 0,
            },
        },
        {
            label: 'Greatsword',
            stats: {
            'Power': 3,
            'Attack Speed': 0,
            'Attack Range': 1,
            'Health': 2,
            'Protection': 0,
            'Stamina': 0,
            'Movement Speed': 1,
            'Building': 0,
            },
        },
        {
            label: 'Twin Daggers',
            stats: {
            'Power': 2,
            'Attack Speed': 3,
            'Attack Range': 0,
            'Health': 0,
            'Protection': 0,
            'Stamina': 0,
            'Movement Speed': 2,
            'Building': 0,
            },
        },
        {
            label: 'Staff',
            stats: {
            'Power': 3,
            'Attack Speed': 0,
            'Attack Range': 2,
            'Health': 0,
            'Protection': 0,
            'Stamina': 2,
            'Movement Speed': 0,
            'Building': 0,
            },
        },
        {
            label: 'Building Hammer',
            stats: {
            'Power': 1,
            'Attack Speed': 0,
            'Attack Range': 0,
            'Health': 0,
            'Protection': 0,
            'Stamina': 2,
            'Movement Speed': 0,
            'Building': 4,
            },
        },
    ];

    public static makeStatVisualizerObj(offset = 1): StatVisualizerObj {
        return {
            'Power': new StatVisualizer('Power', offset),
            'Attack Speed': new StatVisualizer('Attack Speed', offset),
            'Attack Range': new StatVisualizer('Attack Range', offset),
            'Health': new StatVisualizer('Health', offset),
            'Protection': new StatVisualizer('Protection', offset),
            'Stamina': new StatVisualizer('Stamina', offset),
            'Movement Speed': new StatVisualizer('Movement Speed', offset),
            'Building': new StatVisualizer('Building', offset),
        };
    }

    public static makeStatObj(): StatObj {
        return {
            'Power': 0,
            'Attack Speed': 0,
            'Attack Range': 0,
            'Health': 0,
            'Protection': 0,
            'Stamina': 0,
            'Movement Speed': 0,
            'Building': 0,
        };
    }

    public static calculateTriStat(offense: number, defense: number, utility: number, ability: number): StatObj {
        let obj = StatData.makeStatObj();

        let O = Math.round(offense * 9);
        let D = Math.round(defense * 9);
        let U = 9 - O - D;

        obj.Power = Math.round(O * 5 / 9);
        O -= obj.Power;
        obj.Health = Math.round(D * 3 / 9);
        obj.Protection = obj.Health;
        D -= obj.Health + obj.Protection;
        obj.Building = Math.round(U * 5 / 9);
        U -= obj.Building;

        let MO = Math.round(O * ability);
        let PO = O - MO;
        let MD = Math.round(D * ability);
        let PD = D - MD;
        let MU = Math.round(U * ability);
        let PU = U - MU;

        obj['Attack Speed'] = PO;
        obj.Stamina = Math.round(MO * 3 / 4);
        obj.Power += MO - obj.Stamina;
        obj.Health += PD;
        obj.Protection += MD;
        obj['Movement Speed'] = PU;
        obj.Stamina += MU;

        return obj;
    }

    public static calculateSquareStat(physical: number, defense: number, magical: number, utility: number): StatObj {
        let obj = StatData.makeStatObj();

        let P = Math.round(physical * 9);
        let D = Math.round(defense * 9);
        let M = Math.round(magical * 9);
        let U = 9 - P - D - M;

        let PP = Math.round(P * 5 / 9);
        let MP = Math.round(M * 6 / 9);

        obj.Power = PP + MP;
        obj['Attack Speed'] = P - PP;
        obj.Health = Math.round(D * 5 / 9);
        obj.Protection = D - obj.Health;
        obj['Movement Speed'] = Math.round(U * 4 / 9);
        obj.Stamina = M - MP + U - obj['Movement Speed'];
        obj.Building = 0;

        return obj;
    }
}

export type StatVisualizerObj = {[key in Stat]: StatVisualizer};
export type StatObj = {[key in Stat]: number};
export type Stat = 'Power' | 'Attack Speed' | 'Attack Range' | 'Health' | 'Protection' | 'Stamina' | 'Movement Speed' | 'Building';
