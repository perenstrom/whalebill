import { Position } from '@prisma/client';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getAdminPosition } from 'services/prisma';

interface Props {
  position: Position;
}

const PositionAdminPage: NextPage<Props> = ({ position }) => {
  return <pre>{JSON.stringify(position, null, 2)}</pre>;
};

interface Params extends ParsedUrlQuery {
  positionAdminId: string;
}
export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  if (!context?.params?.positionAdminId) {
    throw new Error('No team ID in params');
  }

  const position = await getAdminPosition(
    prismaContext,
    context?.params?.positionAdminId
  );

  if (!position) {
    return {
      redirect: {
        destination: '/create',
        permanent: false
      }
    };
  }

  return {
    props: {
      position
    }
  };
};

export default PositionAdminPage;
