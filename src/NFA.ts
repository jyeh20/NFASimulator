

type InputSymbol = string;


export interface NFADescription {
    transitions: {
        [key:string]: {

        }
    },
    start: string,
    acceptStates: string[],
    statesWithLambda: string[],
}

export default class NFA {
    private description: NFADescription

    constructor(description: NFADescription) {
        this.description = description;
    }

    getTransitions(state, symbol: InputSymbol): string[] {
        const { description: { transitions } } = this;
        if (transitions[state] == undefined) {
            return ['-1'];
        }
        let transition = transitions[state][symbol];
        if (transition == undefined) {
            return ['-1'];
        }
        return transition;
    }

    handleLambda(s:string, state:string): boolean {
        const transitions = this.getTransitions(state, 'lambda');

        for (let element in transitions) {
            if (this.accepts(s, transitions[element])) {
                return true;
            }
        }

        return false;
    }

    accepts(s: string, state: string): boolean {
        s = s.trim();
        const { description: { acceptStates, statesWithLambda } } = this;

        // Base case
        if(s.length == 0 && acceptStates.includes(state)) {
            console.log("String \"" + s + "\" is accepted by the NFA!");
            console.log(" ");
            return true;
        }

        else {
            const nextStates = this.getTransitions(state, s.charAt(0));

            if (!nextStates.includes('-1')) {
                // handle regular transitions
                for (let element in nextStates) {
                    if (this.accepts(s.substr(1), nextStates[element])) {
                        return true;
                    }
                }
            }

            // check for lambda and handle lambda
            if (statesWithLambda.includes(state)) {
                return this.handleLambda(s, state);
            }
        }

        return false;
    }
}