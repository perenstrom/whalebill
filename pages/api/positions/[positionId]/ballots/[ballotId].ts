import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { deleteBallot } from 'services/prisma';
import { z } from 'zod';

const ballots = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    return new Promise((resolve) => {
      const parsedQuery = z
        .object({
          positionId: z.string(),
          ballotId: z.string()
        })
        .safeParse(req.query);

      if (!parsedQuery.success) {
        console.log(parsedQuery);
        res.status(400).end('Request malformed');
        resolve('');
      } else {
        deleteBallot(prismaContext, parsedQuery.data.ballotId)
          .then((ballot) => {
            res.status(200).json(ballot);
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

export default ballots;
