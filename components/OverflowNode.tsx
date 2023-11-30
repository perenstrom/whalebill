import { Handle, Position } from 'reactflow';
import styles from './OverflowNode.module.scss';

export const NODE_TYPE_OVERFLOW_NODE = 'overflowNode';

export function OverflowNode() {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className={styles.wrapper}>
        <p>This tree has too many nodes to render.</p>
        <p>All possible outcomes listed to the right.</p>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
