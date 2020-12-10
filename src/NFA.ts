

type State = string;
type InputSymbol = string;


export interface NFADescription {
    transitions: {
        [key:string]: {
            0: State,
            1: State,
        }
    },
    start: State,
    acceptStates: State[],
}

export default class NFA {
    private description: NFADescription

    constructor(description: NFADescription) {
        this.description = description;
    }

    transition(state: State, symbol: InputSymbol): State {
        const { description: { transitions } } = this;
        return transitions[state][symbol];
    }

    accepts(s: string): boolean {
        const { description: { start, acceptStates } } = this;

        let state = start;

        for (const symbol of s) {
            state = this.transition(state, symbol);
        }

        return acceptStates.includes(state);
    }
}