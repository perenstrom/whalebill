import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { createPosition } from 'services/prisma';
import { UncreatedPositionSchema } from 'types/types';

const positions = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const parsedPosition = UncreatedPositionSchema.safeParse(req.body);

      if (!parsedPosition.success) {
        console.log(JSON.stringify(parsedPosition.error, null, 2));
        res.status(400).end('Position data malformed');
        resolve('');
      } else {
        createPosition(prismaContext, parsedPosition.data)
          .then((position) => {
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

export default positions;
