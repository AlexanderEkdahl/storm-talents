import { Component, h } from "preact";
import { fetchJson } from "../fetch-json.js";
import heroes from "../heroes.js";
import { IHero, TIERS } from "../interfaces.js";
import HeroSelect from "./HeroSelect.js";
import Tree from "./Tree.js";

export interface IApplicationState {
    talentSelections: number[];
    hero: IHero | null;
    lastSelectTier: number;
}

const initialTalentSelections = TIERS.map(() => -1);

const getHero = (heroId: string): Promise<IHero> =>
    fetchJson(`heroes/${heroId}.json`);

export default class Application extends Component<{}, IApplicationState> {
    public state: IApplicationState = {
        hero: null,
        lastSelectTier: -1,
        talentSelections: initialTalentSelections,
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

        if (hero == null) {
            return <span />;
        }

        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;

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
        if (this.rqf) {
            return;
        }
        this.rqf = window.requestAnimationFrame(() => {
            this.rqf = null;
            this.forceUpdate();
        });
    };

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
    };

    private onHeroSelected = async (heroId: string) => {
        const hero = await getHero(heroId);

        this.setState({
            hero,
            lastSelectTier: -1,
            talentSelections: initialTalentSelections,
        });
    };

    private onKeyPress = (event: KeyboardEvent) => {
        if (event.keyCode >= 49 && event.keyCode <= 53) {
            this.selectTalent(this.state.lastSelectTier + 1, event.keyCode - 49);
        }
    };
}
