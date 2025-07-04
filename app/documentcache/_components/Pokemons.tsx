'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { PokemonsQuery, PokemonQuery, testCache } from './lib';
import { useQuery } from '@urql/next';

function PokemonsLoader() {
  const [result] = useQuery({ query: PokemonsQuery });

  if (result.error) {
    throw result.error;
  }

  return (
    <main>
      <h1>This is rendered as part of SSR</h1>
      <ul>
        {result.data.pokemons.results.map((x: any) => (
          <li key={x.id}>{x.name}</li>
        ))}
      </ul>

      <Suspense fallback={<div>Loading Bulbasaur...</div>}>
        <PokemonLoader name="bulbasaur" />
      </Suspense>
      <Link href="/">RSC</Link>
    </main>
  );
}

function PokemonLoader(props: any) {
  const [result] = useQuery({
    query: PokemonQuery,
    variables: { name: props.name },
  });

  if (result.error) {
    throw result.error;
  }

  return (
    <div>
      <h1>{result.data.pokemon.name}</h1>
    </div>
  );
}

const Pokemons = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading Pokemons...</div>}>
        <PokemonsLoader />
      </Suspense>

      <Link href="/graphcache"> -> GraphCache</Link>
    </div>
  );
}

export default Pokemons;
