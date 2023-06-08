import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { UncreatedBallotItemsSchema } from 'types/types';
import { createBallot } from 'services/prisma';
import { z } from 'zod';

const ballots = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const parsedBallotItems = UncreatedBallotItemsSchema.safeParse(req.body);
      const parsedQuery = z
        .object({
          positionId: z.string()
        })
        .safeParse(req.query);

      if (!parsedBallotItems.success || !parsedQuery.success) {
        console.log(parsedBallotItems);
        console.log(parsedQuery);
        res.status(400).end('Candidate data malformed');
        resolve('');
      } else {
        createBallot(
          prismaContext,
          parsedQuery.data.positionId,
          parsedBallotItems.data
        )
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
