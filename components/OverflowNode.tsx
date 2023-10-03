import { Handle, Position } from 'reactflow';
import styled from 'styled-components';

export const NODE_TYPE_OVERFLOW_NODE = 'overflowNode';

const Wrapper = styled.div`
  --border-radius: 5px;
  padding: 0.6rem;
  width: 14rem;
  line-height: 1.3;
  text-align: center;
  border: 1px solid black;
  border-radius: var(--border-radius);
  overflow: hidden;

  background-color: black;
  box-shadow: var(--shadow-elevation-medium);

  :focus {
    background-color: red;
  }

  & p {
    margin: 0;
    padding: 0;
  }

  & p:first-child {
    margin-bottom: 0.5rem;
  }
`;

export function OverflowNode() {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Wrapper>
        <p>This tree has too many nodes to render.</p>
        <p>All possible outcomes listed to the right.</p>
      </Wrapper>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
