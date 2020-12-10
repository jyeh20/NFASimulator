import test from 'ava';

import NFA, { NFADescription } from './NFA';

const machineTests: {
    [name: string]: {
        description: NFADescription,
        accepted: string[],
        rejected: string[],
    }
} = {
    startsWith0: {
        accepted: [
            '0',
            '01',
            '000000',
            '00001111111',
        ],
        rejected: [
            '10',
            '',
            '101',
            '1000000',
            '101111',
        ],
        description: {
            transitions: {
                r0: {
                    0: 'r1',
                    1: 'r2',
                },
                r1: {
                    0: 'r1',
                    1: 'r1',
                },
                r2: {
                    0: 'r2',
                    1: 'r2',
                },
            },
            start: 'r0',
            acceptStates: ['r1'],
        }
    }
}

for (const [name, testDescription] of Object.entries(machineTests)) {
    test(`${name}/constructor`, (t) => {
        const nfa = new NFA(testDescription.description);
        t.truthy(nfa);
    });

    test(`${name}/transition`, (t) => {
        const nfa = new NFA(testDescription.description);
        const { transitions } = testDescription.description;

        for (const [state, stateTransition] of Object.entries(transitions)) {
            for (const [symbol, nextState] of Object.entries(stateTransition)) {
                t.assert(nextState === nfa.transition(state, symbol));
            }
        }
    });

    test(`${name}/accept`, (t) => {
        const nfa = new NFA(testDescription.description);
        const { accepted, rejected } = testDescription;

        for (const s of accepted) {
            t.assert(nfa.accepts(s));
        }

        for (const s of rejected) {
            t.assert(!nfa.accepts(s));
        }
    });
}
