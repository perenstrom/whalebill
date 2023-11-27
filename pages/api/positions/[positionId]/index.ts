import { prismaContext } from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { updatePosition } from 'services/prisma';
import { PositionSchema } from 'types/types';
import { z } from 'zod';

const position = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PATCH') {
    return new Promise((resolve) => {
      const parsedBody = PositionSchema.safeParse(req.body);
      const parsedQuery = z
        .object({
          positionId: z.string()
        })
        .safeParse(req.query);

      if (!parsedBody.success || !parsedQuery.success) {
        console.log(parsedBody);
        console.log(parsedQuery);
        res.status(400).end('Position data malformed');
        resolve('');
      } else {
        updatePosition(prismaContext, {
          ...parsedBody.data,
          id: parsedQuery.data.positionId
        })
          .then(async (position) => {
            res.status(200).json(position);
            resolve('');
          })
          .catch((error) => {
            console.log(error);
            res.status(500).end('Unexpected internal server error');
            resolve('');
          });
      }
    });
  } else {
    res.status(404).end();
  }
};

export default position;
