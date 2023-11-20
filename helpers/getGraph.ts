import { Prisma } from '@prisma/client';
import { createGraph, getAdminPosition } from 'services/prisma';
import { generateTree } from './generateTree';
import { prismaContext } from 'lib/prisma';

export const getGraph = async (
  position: Awaited<ReturnType<typeof getAdminPosition>>
) => {
  if (!position) throw new Error('No position');

  if (position.graph) {
    const storedGraph = position.graph?.graph as Prisma.JsonObject;
    const parsedGraph = JSON.parse(storedGraph as unknown as string);
    const nodes = parsedGraph['nodes'] as ReturnType<
      typeof generateTree
    >['nodes'];
    const edges = parsedGraph['edges'] as ReturnType<
      typeof generateTree
    >['edges'];

    return { nodes, edges };
  } else {
    const { nodes, edges } = generateTree(position);
    await createGraph(
      prismaContext,
      position.id,
      JSON.stringify({ nodes, edges })
    );

    return { nodes, edges };
  }
};
