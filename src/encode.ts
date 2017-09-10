/*
    The information that has to be encoded to store a full build including the hero:

    Hero: 0-120(Ordered by relese date)
    Tier 0: 0-4
    Tier 1: 0-4
    Tier 2: 0-4
    Tier 3: 0-4
    Tier 4: 0-4
    Tier 5: 0-4
    Tier 6: 0-4

    This adds up to 9 375 00 combiations

    Using URL safe characters, easily typed characters, and excluding characters that
    are easy to mix up would yield the follwing alphabet:

    Σ = {ABCDEFGHJKLMNPQRSTUVXYZ23456789}

    The cardinality of this alphabet is 31.

    The formula for calculating the required symbols to encode x combinations using an
    alphabet of cardinalty n is:

        \lceil\log_{n}x\rceil

    Which in our case would be 5

    If you were to include lowercase letters it would be 4.
*/

const alphabet = "ABCDEFGHJKLMNPQRSTUVXYZ23456789".split("");

export interface IEncoding {
    [id: string]: number;
}

export const pack = <T extends IEncoding>(encoding: T, values: T): number =>
    Object.keys(encoding).reduce((prev, key) => prev * encoding[key] + values[key], 0);

export const unpack = <T extends IEncoding>(encoding: T, value: number): T =>
    Object.keys(encoding).reverse().reduce((prev: T, key) => {
        prev[key] = value % encoding[key];
        value = (value - value % encoding[key]) / encoding[key];
        return prev;
    }, {}) as T;

export const str2values = (input: string): number =>
    input.split("").reduce((prev, symbol, index) => prev + alphabet.indexOf(symbol) * alphabet.length ** (input.length - index - 1), 0);

export const value2str = (value: number): string => {
    throw Error("Unimplemeted");
};
