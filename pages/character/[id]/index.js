import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const defaultEndpoint = "https://rickandmortyapi.com/api/character/";

export async function getServerSideProps({ query }) {
  const { id } = query;
  const res = await fetch(`${defaultEndpoint}${id}`);
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

export default function Character({ data }) {
  console.log("data", data);
  const { name, image, gender, location, origin, species, status } = data;

  return (
    <div className="grid place-items-center center h-screen">
      <Head>
        <title>{name}</title>
        <link rel="icon" />
      </Head>

      <main>
        <h1 className="lg:text-6xl text-4xl font-bold text-center my-8 bg-blue-100 p-2 rounded shadow-md">
          {name}
        </h1>
        <div className="grid lg:grid-cols-2 md:grid-cols-2">
          <div>
            <Image src={image} alt={name} width={400} height={400} />
          </div>
          <div className="p-4">
            <h2 className="text-sm uppercase border-b my-4">
              Character Details
            </h2>
            <ul>
              <li className="">Status: {status}</li>
              <li className="">Gender: {gender}</li>
              <li className="">Species: {species}</li>
              <li className="">Location: {location?.name}</li>
              <li className="">Origin: {origin?.name}</li>
            </ul>
          </div>
        </div>
      </main>
      <div className="grid place-items-center p-4">
        <p className="p-2 px-4 border rounded bg-blue-600 text-white duration-300 hover:bg-slate-700">
          <Link href="/">Get Back!</Link>
        </p>
      </div>
    </div>
  );
}
