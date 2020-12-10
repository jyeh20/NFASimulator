

type InputSymbol = string;


export interface NFADescription {
    transitions: {
        [key:string]: {

        }
    },
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
        console.log("lambda string: " + s + " lambda state: " + state);
        const transitions = this.getTransitions(state, 'lambda');
        console.log("Lambda transitions: " + transitions);

        for (let element in transitions) {
            console.log("lambda string: " + s + " lambda element: " + transitions[element]);
            if (this.accepts(s, transitions[element])) {
                return true;
            }
        }

        return false;
    }

    accepts(s: string, state: string): boolean {
        s = s.trim();
        console.log("this.accept string: " + s);
        console.log("this.accept state: " + state);
        const { description: { acceptStates, statesWithLambda } } = this;

        // Base case
        if(s.length == 0 && acceptStates.includes(state)) {
            return true;
        }

        console.log("this.accept state: " + state + " s.charAt(0): " + s.charAt(0));
        const nextStates = this.getTransitions(state, s.charAt(0));
        console.log("nextStates: " + nextStates);

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
            console.log("Handling Lambda: ---------------");
            return this.handleLambda(s, state);
        }


        return false;
    }
}