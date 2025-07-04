import { cache } from 'react';

import {
  gql,
  ssrExchange,
  cacheExchange,
  fetchExchange,
  createClient,
} from '@urql/next';
import { cacheExchange as graphcacheExchange } from '@urql/exchange-graphcache';

import { pipe, delay, tap } from 'wonka';

export const PokemonsQuery = gql`
  query {
    pokemons(limit: 10) {
      results {
        id
        name
      }
    }
  }
`;

export const PokemonQuery = gql`
  query ($name: String!) {
    pokemon(name: $name) {
      id
      name
    }
  }
`;

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

export const createUrqlClient = () => {
  console.log('Create graphcache');

  const isClient = typeof window !== 'undefined';

  const ssr = ssrExchange({
    isClient,
  });

  const client = createClient({
    url: 'https://graphql-pokeapi.graphcdn.app/',

    exchanges: isClient ? [
      // cacheExchange,
      graphcacheExchange(),
      ssr,
      logExchange,
      fetchExchange,
    ] : [
      // cacheExchange,
      graphcacheExchange(),
      ssr,
      logExchange,
      delayExchange,
      fetchExchange,
    ],

    suspense: true,
  });

  return [client, ssr];
};
