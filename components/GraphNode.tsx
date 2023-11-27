import clsx from 'clsx';
import { Handle, Position } from 'reactflow';
import { CandidateMap, SimpleCandidateMap, SimpleGraphNode } from 'types/graph';
import styles from './GraphNode.module.scss';

export const NODE_TYPE_GRAPH_NODE = 'graphNode';

interface Props {
  node: SimpleGraphNode;
  candidates: SimpleCandidateMap;
  winnerPath: string[];
}

export const GraphNode: React.FC<Props> = ({
  node,
  candidates,
  winnerPath
}) => {
  const candidateMap: CandidateMap = new Map(candidates);
  const isWinner = winnerPath.includes(node.hash);

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className={clsx([styles.wrapper, { [styles.winner]: isWinner }])}>
        {node.winners.length > 0 && (
          <ul className={clsx([styles.reset, styles.winners])}>
            {node.winners.map((winner) => (
              <li key={winner}>{candidateMap.get(winner)?.name}</li>
            ))}
          </ul>
        )}

        {node.results.length > 0 && (
          <ol className={clsx([styles.reset, styles.results])} type="1">
            {node.results.map(([candidateId, numberOfVotes], index) => (
              <li className={styles.resultItem} key={candidateId}>
                <span>{index + 1}.</span>
                <div className={styles.flexGrow}>
                  {candidateMap.get(candidateId)?.name}
                </div>
                <span>{numberOfVotes}</span>
              </li>
            ))}
          </ol>
        )}

        {node.losers.length > 0 && (
          <ul className={clsx([styles.reset, styles.losers])}>
            {node.losers.map((loser) => (
              <li key={loser}>{candidateMap.get(loser)?.name}</li>
            ))}
          </ul>
        )}
        <div
          className={clsx([
            styles.percentage,
            { [styles.leaf]: node.isLeaf || false }
          ])}
        >
          {+node.percentageOutcome.toFixed(2)} %
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};
