

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

    handleLambda(s:string, state:string, checked:string[]): boolean {
        const { description: { statesWithLambda } } = this;
        const transitions = this.getTransitions(state, 'lambda');

        for (let element in transitions) {
            let currentState = transitions[element];
            if (checked.includes(currentState)) {
                continue;
            }
            else {
                if (this.accepts(s, currentState, checked)) {
                    return true;
                }
                if(statesWithLambda.includes(currentState)) {
                    checked.push(currentState);
                    this.handleLambda(s, currentState, checked);
                }
            }
        }

        return false;
    }

    accepts(s: string, state: string, checked: string[]): boolean {
        s = s.trim();
        const { description: { acceptStates, statesWithLambda } } = this;

        // Base case
        if(s.length == 0 && acceptStates.includes(state)) {
            console.log("String is accepted by the NFA!");
            console.log(" ");
            return true;
        }
        if(s.length == 0 && !acceptStates.includes(state) && !statesWithLambda.includes(state)) {
            console.log("String is rejected by the NFA!");
            console.log(" ");
            return false;
        }

        else {
            const nextStates = this.getTransitions(state, s.charAt(0));

            if (!nextStates.includes('-1')) {
                // handle regular transitions
                for (let element in nextStates) {
                    let currentState = nextStates[element]
                    if (this.accepts(s.substr(1), currentState, checked)) {
                        return true;
                    }
                }
            }

            // check for lambda and handle lambda
            if (statesWithLambda.includes(state)) {
                checked.push(state);
                return this.handleLambda(s, state, checked);
            }
        }

        return false;
    }
}