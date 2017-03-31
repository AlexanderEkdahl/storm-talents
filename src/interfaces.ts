export const TIERS = [1, 4, 7, 10, 13, 16, 20];

export interface ITalent {
    id: string;
    name: string;
    description: string;
    icon: string;
    // prerequisite?: string;
}

export interface IHero {
    id: string;
    name: string;
    title: string;
    talents: ITalent[][];
}
