import { Handle, Position } from 'reactflow';
import styled, { css } from 'styled-components';
import { CandidateMap, SimpleCandidateMap, SimpleGraphNode } from 'types/graph';

export const NODE_TYPE_GRAPH_NODE = 'graphNode';

const Wrapper = styled.div`
  --border-radius: 5px;
  --padding: 0.6rem;
  border: 1px solid black;
  border-radius: var(--border-radius);
  overflow: hidden;

  background-color: var(--color-gray-4);
  box-shadow: var(--shadow-elevation-medium);

  :focus {
    background-color: red;
  }
`;

const Reset = css`
  list-style: none;
  margin: 0;
  padding: 0;
  line-height: 1.1;
`;

const ResetUl = styled.ul`
  ${Reset}
`;

const Winners = styled(ResetUl)`
  padding: var(--padding);
  border-bottom: 1px solid black;
  color: white;
  background-color: green;
  border-top-left-radius: calc(var(--border-radius) - 1px);
  border-top-right-radius: calc(var(--border-radius) - 1px);
`;

const Results = styled.ol`
  ${Reset}
  padding: var(--padding);
`;

const ResultItem = styled.li`
  display: flex;
  justify-content: space-between;
  gap: 0.7rem;
`;

const FlexGrow = styled.span`
  flex-grow: 1;
`;

const Losers = styled(ResetUl)`
  padding: var(--padding);
  border-top: 1px solid black;
  color: hsl(0, 0%, 75%);
  text-decoration: line-through 2px;
`;

interface PercentageProps {
  $isLeaf: boolean;
}
const Percentage = styled.div<PercentageProps>`
  font-size: 0.7rem;
  text-align: center;
  padding: 0.4rem var(--padding);
  border-top: 1px solid black;
  line-height: 1;
  background: var(--color-gray-1);
  color: ${({ $isLeaf }) =>
    $isLeaf ? 'inherit' : 'var(--color-text-secondary)'};
  font-weight: ${({ $isLeaf }) => ($isLeaf ? 'bold' : 'inherit')};
`;

interface Props {
  node: SimpleGraphNode;
  candidates: SimpleCandidateMap;
}

export const GraphNode: React.FC<Props> = ({ node, candidates }) => {
  const candidateMap: CandidateMap = new Map(candidates);

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Wrapper>
        {node.winners.length > 0 && (
          <Winners>
            {node.winners.map((winner) => (
              <li key={winner}>{candidateMap.get(winner)?.name}</li>
            ))}
          </Winners>
        )}

        {node.results.length > 0 && (
          <Results type="1">
            {node.results.map(([candidateId, numberOfVotes], index) => (
              <ResultItem key={candidateId}>
                <span>{index + 1}.</span>
                <FlexGrow>{candidateMap.get(candidateId)?.name}</FlexGrow>
                <span>{numberOfVotes}</span>
              </ResultItem>
            ))}
          </Results>
        )}

        {node.losers.length > 0 && (
          <Losers>
            {node.losers.map((loser) => (
              <li key={loser}>{candidateMap.get(loser)?.name}</li>
            ))}
          </Losers>
        )}
        <Percentage $isLeaf={node.isLeaf || false}>
          {node.percentageOutcome.toFixed(2)} %
        </Percentage>
      </Wrapper>
      <Handle type="source" position={Position.Right} />
    </>
  );
};
