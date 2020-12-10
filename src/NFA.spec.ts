import test from 'ava';

import NFA, { NFADescription } from './NFA';

const machineTests: {
    [name: string]: {
        description: NFADescription,
        accepted: string[],
        rejected: string[],
    }
} = {
    accept_10_or_01: {
        // Add your accepted strings here
        accepted: [
            '10',
            '01',
        ],
        // Add any rejected strings you want checked here
        rejected: [
            '101',
            '1000000',
            '101111',
        ],
        // Build your NFA here; for a lambda move, use "lambda"
        description: {
            transitions: {
                S: {
                    lambda: ['A', 'B']
                },
                A: {
                    1: 'C',
                },
                C: {
                    0: 'D',
                },
                B: {
                    0: 'E',
                },
                E: {
                    1: 'F',
                },
            },
            acceptStates: ['D', 'F'],
            statesWithLambda: ['S'],
        }
    },
    acceptRegex: {
        // Add your accepted strings here
        accepted: [
            '1101010101010',
            ' ',
            '11111111111111110',
            '100000000',
            '10'
        ],
        // Add any rejected strings you want checked here
        rejected: [
            '1',
            '0',
            '11',
            '10000000000000000000000001',
            '000000010'
        ],
        // Build your NFA here; for a lambda move, use "lambda"
        description: {
            transitions: {
                S: {
                    lambda: ['A', 'B']
                },
                A: {
                    1: 'C',
                },
                C: {
                    0: ['C', 'D'],
                    1: 'C',
                },
            },
            acceptStates: ['B', 'D'],
            statesWithLambda: ['S'],
        }
    },
}

for (const [name, testDescription] of Object.entries(machineTests)) {
    // test(`${name}/constructor`, (t) => {
    //     const nfa = new NFA(testDescription.description);
    //     t.truthy(nfa);
    // });

    // test(`${name}/transition`, (t) => {
    //     const nfa = new NFA(testDescription.description);
    //     const { transitions } = testDescription.description;

    //     for (const [state, stateTransition] of Object.entries(transitions)) {
    //         for (const [symbol, nextState] of Object.entries(stateTransition)) {
    //             t.assert(nextState === nfa.getTransitions(state, symbol));
    //         }
    //     }
    // });

    test(`${name}/accept`, (t) => {
        const nfa = new NFA(testDescription.description);
        const { accepted, rejected } = testDescription;

        for (const s of accepted) {
            console.log("Testing String: " + s);
            console.log("-------------------------");
            t.assert(nfa.accepts(s, 'S'));
            console.log("   PASS    ");
            console.log(" ");
        }

        for (const s of rejected) {
            console.log("Testing String: " + s);
            console.log("-------------------------");
            t.assert(!nfa.accepts(s, 'S'));
            console.log("   PASS    ");
            console.log(" ");
        }
    });
}
