import { Handle, NodeProps, Position } from 'reactflow';
import styled, { css } from 'styled-components';
import { CandidateMap, SimpleCandidateMap, SimpleGraphNode } from 'types/graph';

export const NODE_TYPE_GRAPH_NODE = 'graphNode';

const Wrapper = styled.div`
  --border-radius: 5px;
  --padding: 0.6rem;
  border: 1px solid black;
  border-radius: var(--border-radius);

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

export interface GraphNodeProps {
  node: SimpleGraphNode;
  candidates: SimpleCandidateMap;
}

export function GraphNode({ data }: NodeProps<GraphNodeProps>) {
  const candidateMap: CandidateMap = new Map(data.candidates);

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Wrapper>
        {data.node.winners.length > 0 && (
          <Winners>
            {data.node.winners.map((winner) => (
              <li key={winner}>{candidateMap.get(winner)?.name}</li>
            ))}
          </Winners>
        )}

        {data.node.results.length > 0 && (
          <Results type="1">
            {data.node.results.map(([candidateId, numberOfVotes], index) => (
              <ResultItem key={candidateId}>
                <span>{index + 1}.</span>
                <FlexGrow>{candidateMap.get(candidateId)?.name}</FlexGrow>
                <span>{numberOfVotes}</span>
              </ResultItem>
            ))}
          </Results>
        )}

        {data.node.losers.length > 0 && (
          <Losers>
            {data.node.losers.map((loser) => (
              <li key={loser}>{candidateMap.get(loser)?.name}</li>
            ))}
          </Losers>
        )}
      </Wrapper>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
