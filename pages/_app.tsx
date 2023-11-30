import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import './global.scss';

import { AppProps } from 'next/dist/shared/lib/router/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <Component {...pageProps} key={router.asPath} />
    </>
  );
}

export default MyApp;
