import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { UncreatedCandidateSchema } from 'types/types';
import { createCandidate } from 'services/prisma';
import { z } from 'zod';

const candidates = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const parsedCandidate = UncreatedCandidateSchema.safeParse(req.body);
      const parsedQuery = z
        .object({
          positionId: z.string()
        })
        .safeParse(req.query);

      if (!parsedCandidate.success || !parsedQuery.success) {
        console.log(parsedCandidate);
        console.log(parsedQuery);
        res.status(400).end('Candidate data malformed');
        resolve('');
      } else {
        createCandidate(prismaContext, {
          ...parsedCandidate.data,
          positionId: parsedQuery.data.positionId
        })
          .then((candidate) => {
            res.status(200).json(candidate);
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

export default candidates;
