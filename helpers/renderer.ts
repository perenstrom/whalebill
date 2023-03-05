import { ResultNode } from 'types/types';

export const renderResultNode = (resultNode: ResultNode) => {
  const renderedLines: string[] = [];
  renderedLines.push('====================');

  renderedLines.push('WINNERS:');
  resultNode.winners.forEach((winner) => renderedLines.push(winner));

  renderedLines.push('--------------------');

  let index = 0;
  resultNode.results.forEach((votes, candidate) => {
    index += 1;
    renderedLines.push(`${index}. ${candidate} (${votes})`);
  });

  renderedLines.push('--------------------');

  renderedLines.push('LOSERS:');
  resultNode.losers.forEach((loser) => renderedLines.push(loser));

  renderedLines.push('====================');

  if (resultNode.children.length > 0) {
    renderedLines.push('          |         ');
    renderedLines.push('          |         ');
    renderedLines.push('          |         ');
    renderedLines.push(renderResultNode(resultNode.children[0]));
  }

  return renderedLines.join('\n');
};
