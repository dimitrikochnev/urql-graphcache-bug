import Pokemons  from "./_components/Pokemons";
import { PokemonsQuery, createUrqlClient, testCache } from "./_components/lib";

export const generateMetadata = async () => {
  const [client] = createUrqlClient();

  // const { data } = await client.query(PokemonsQuery).toPromise();

  return {
    title: 'Pokemons',
    description: 'A list of pokemons',
  };
}

export default function Page() {
  return (
    <Pokemons />
  );
}
