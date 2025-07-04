'use client';

import { useMemo } from 'react';
import {
  UrqlProvider,
  ssrExchange,
  cacheExchange,
  fetchExchange,
  createClient,
} from '@urql/next';

import { createUrqlClient } from './lib';

import { pipe, delay, tap } from 'wonka';

export const logExchange = ({ forward }) => (ops$) => {
  return pipe(
    ops$,

    tap(operation => {
      if (typeof window === 'undefined') {
        console.log('🛰️ Sending server operation:', operation);
      } else {
        console.log('🛰️ Sending client operation:', operation);
      }
    }),

    forward,
  );
};

const delayExchange: Exchange = ({ forward }) => ops$ => {
  return forward(
    pipe(
      ops$,
      delay(5000)           // <-- hold each Server operation for 5000 ms
    )
  );
};


const Providers = ({ children }) => {
  const [client, ssr] = useMemo(() => {
    return createUrqlClient()
  }, []);

  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  );
};

export default Providers;
