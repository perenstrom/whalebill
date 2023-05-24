import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { AppProps } from 'next/dist/shared/lib/router/router';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Catamaran:wght@500&family=Merriweather+Sans:ital,wght@0,300;0,700;1,300;1,700&display=swap');

  // RESET
  *, *::before, *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }
  
  html, body {
    height: 100%;
  }
  
  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
  
  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }
  
  input, button, textarea, select {
    font: inherit;
  }
  
  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }
  
  #root, #__next {
    isolation: isolate;
    height: 100%;
  }
  // END RESET

  // GLOBAL STYLES
  body {
    --color-text-primary: hsla(216, 8%, 75%, 1);
    --color-text-secondary: hsla(200, 6%, 47%, 1);
    --color-gray-1: hsla(222, 18%, 14%, 1);
    --color-gray-2: hsla(221, 17%, 18%, 1);
    --color-gray-3: hsla(214, 19%, 22%, 1);
    --color-gray-4: hsla(213, 20%, 24%, 1);
    --color-accent-green: hsla(111, 34%, 44%, 1);
    --color-accent-green-light: hsla(112, 30%, 58%, 1);
    --color-accent-green-dark: hsla(112, 45%, 33%, 1);
    --color-accent-blue: hsla(182, 43%, 33%, 1);
    --color-accent-red: hsla(355, 50%, 53%, 1);
    --color-accent-yellow: hsla(29, 80%, 57%, 1);

    font-family: 'Merriweather Sans', sans-serif;
    font-weight: 300;
    line-height: 1.75;
    color: var(--color-text-primary);
    background-color: var(--color-gray-2);
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 3rem 0 1.38rem -0.4rem;
    font-family: 'Catamaran', serif;
    font-weight: 500;
    line-height: 1.3;

    @media (max-width: 768px) {
      margin: 1rem 0 1.38rem -0.4rem;
    }
  }
  
  h1 {
    margin-top: 0;
    font-size: 4.209rem;
  }

  h2 { font-size: 3.157rem; }

  h3 { font-size: 2.369rem; }

  h4 { font-size: 1.777rem; }

  h5 { font-size: 1.333rem; }

  small { font-size: 0.75rem; }

  p {
    margin-bottom: 1rem;
    b {
      font-weight: 500;
    }
  }

  a {
    color: hsl(0 0% 15%);
  }

  a:hover {
    color: hsl(320 70% 35%);
  }

  @media (max-width: 768px) {
    h1 {
      margin-top: 0;
      font-size: 1.802rem;
    }

    h2 {font-size: 1.602rem;}

    h3 {font-size: 1.424rem;}

    h4 {font-size: 1.266rem;}

    h5 {font-size: 1.125rem;}

    small {font-size: 0.889rem;}
  }
`;

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
      <GlobalStyle />
      <Component {...pageProps} key={router.asPath} />
    </>
  );
}

export default MyApp;
