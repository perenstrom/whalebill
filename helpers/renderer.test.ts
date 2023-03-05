import { Ballot, ResultNode } from 'types/types';
import { renderResultNode } from './renderer';
import { shiftBallots } from './shiftBallots';

describe('renderer', () => {
  it('Renders single node correctly', async () => {
    const node: ResultNode = {
      hash: 'zxcv@2-qwer@1-asdf@1',
      results: new Map([
        ['zxcv', 2],
        ['qwer', 1],
        ['asdf', 1]
      ]),
      totalSiblings: 1,
      winners: ['tyui', 'ghjk'],
      losers: ['bnm'],
      children: []
    };

    const renderedText = renderResultNode(node);

    expect(renderedText).toEqual(
      `====================
WINNERS:
tyui
ghjk
--------------------
1. zxcv (2)
2. qwer (1)
3. asdf (1)
--------------------
LOSERS:
bnm
====================`
    );
  });

  it('Renders multiple nodes correctly', async () => {
    const node: ResultNode = {
      hash: 'zxcv@2-qwer@1-asdf@1',
      results: new Map([
        ['zxcv', 2],
        ['qwer', 1],
        ['asdf', 1]
      ]),
      totalSiblings: 1,
      winners: ['tyui', 'ghjk'],
      losers: ['bnm'],
      children: [
        {
          hash: 'qwer@3-asdf@1',
          results: new Map([
            ['qwer', 3],
            ['asdf', 1]
          ]),
          totalSiblings: 1,
          winners: ['tyui', 'ghjk', 'zxcv'],
          losers: [],
          children: []
        }
      ]
    };

    const renderedText = renderResultNode(node);

    expect(renderedText).toEqual(
      `====================
WINNERS:
tyui
ghjk
--------------------
1. zxcv (2)
2. qwer (1)
3. asdf (1)
--------------------
LOSERS:
bnm
====================
          |         
          |         
          |         
====================
WINNERS:
tyui
ghjk
zxcv
--------------------
1. qwer (3)
2. asdf (1)
--------------------
LOSERS:
====================`
    );
  });
});

export {};
