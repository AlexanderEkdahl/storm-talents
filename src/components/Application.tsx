import { Component, h } from "preact";
import fetchJson from "../fetchJson";
import heroes from "../heroes";
import { IHero, TIERS } from "../interfaces";
import HeroSelect from "./HeroSelect";
import Tree from "./Tree";

export interface IApplicationState {
    talentSelections: number[];
    hero: IHero | null;
    width: number;
    height: number;
    lastSelectTier: number;
}

const initialTalentSelections = TIERS.map(() => -1);

const getHero = async (heroId: string): Promise<IHero> => {
    return await fetchJson<IHero>(`/heroes/${heroId}.json`);
};

export default class Application extends Component<{}, IApplicationState> {
    public state: IApplicationState = {
        height: window.innerHeight,
        hero: null,
        lastSelectTier: -1,
        talentSelections: initialTalentSelections,
        width: window.innerWidth,
    };
    private rqf: number | null;

    public async componentDidMount() {
        window.addEventListener("resize", this.onResize, false);
        window.addEventListener("keypress", this.onKeyPress, false);

        const hero = await getHero(heroes[Math.floor(Math.random() * heroes.length)].id);

        this.setState({
            hero,
            lastSelectTier: -1,
        });
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    public render() {
        const { hero, talentSelections } = this.state;

        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;

        if (hero == null) {
            return <span />;
        }

        return (
            <div>
                <HeroSelect height={100} heroes={heroes} selected={hero.id} onSelection={this.onHeroSelected} />
                <Tree
                    width={width}
                    height={height - 100}
                    tierOffset={hero.id === "Chromie" ? -1 : 0}
                    talents={hero.talents}
                    onClick={this.selectTalent}
                    selections={talentSelections}
                />
            </div>
        );
    }

    private onResize = () => {
        if (this.rqf) { return; }
        this.rqf = window.requestAnimationFrame(() => {
            this.rqf = null;
            this.setState({
                height: window.innerHeight,
                width: window.innerWidth,
            });
        });
    }

    private selectTalent = (i: number, j: number) => {
        if (i < 0 || i >= TIERS.length || j < 0 || j >= this.state.hero!.talents[i].length) {
            return;
        }

        const newTalentSelections = this.state.talentSelections.slice();
        newTalentSelections[i] = j;

        this.setState({
            lastSelectTier: i,
            talentSelections: newTalentSelections,
        });
    }

    private onHeroSelected = (heroId: string) => {
        getHero(heroId).then((hero) => {
            this.setState({
                hero,
                lastSelectTier: -1,
                talentSelections: initialTalentSelections,
            });
        });
    }

    private onKeyPress = (event: KeyboardEvent) => {
        if (event.keyCode >= 49 && event.keyCode <= 53) {
            this.selectTalent(this.state.lastSelectTier + 1, event.keyCode - 49);
        }
    }
}
