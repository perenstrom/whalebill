import { GraphNodeProps } from 'components/GraphNode';
import { generateTree } from 'helpers/generateTree';
import { prismaContext } from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { Node } from 'reactflow';
import { getAdminPosition } from 'services/prisma';
import { z } from 'zod';

const selectWinner = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise(async (resolve) => {
      const parsedQuery = z
        .object({
          positionId: z.string()
        })
        .safeParse(req.query);

      if (!parsedQuery.success) {
        console.log(parsedQuery);
        res.status(400).end('Position data malformed');
        resolve('');
        return;
      }

      const position = await getAdminPosition(
        prismaContext,
        parsedQuery.data.positionId
      );

      if (!position) {
        res.status(404).end();
        resolve('');
        return;
      }

      const { nodes } = generateTree(position);

      let currentNode: Node<GraphNodeProps> | null = nodes[0];
      const winnerPath: string[] = [];
      while (currentNode) {
        const multipleChildren = currentNode.data.node.children.length > 1;
        const isLeaf = currentNode.data.node.children.length === 0;

        // Last node, winner!
        if (isLeaf) {
          currentNode = null;
          continue;
        }

        // Single child, no need to randomize
        if (!multipleChildren) {
          winnerPath.push(currentNode.data.node.children[0]);
          const newNode = nodes.find(
            (node) => node.id === currentNode?.data.node.children[0]
          );
          if (!newNode) throw new Error('No node found from child');
          continue;
        }

        // Multiple children, randomize
        const numberOfChildren = currentNode.data.node.children.length;
        const randomIndex = Math.floor(Math.random() * numberOfChildren);
        winnerPath.push(currentNode.data.node.children[randomIndex]);
        const newNode = nodes.find(
          (node) => node.id === currentNode?.data.node.children[randomIndex]
        );
        if (!newNode) throw new Error('No node found from child');
        currentNode = newNode;
      }

      res.json(winnerPath);
      resolve('');
    });
  } else {
    res.status(404).end();
  }
};

export default selectWinner;
