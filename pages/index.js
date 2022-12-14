import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const defaultEndpoint = "https://rickandmortyapi.com/api/character/";

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint);
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

export default function Home({ data }) {
  console.log("data", data);
  const { info, results: defaultResults = [] } = data;
  const [results, updateResults] = useState(defaultResults);
  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint,
  });
  const { current } = page;

  useEffect(() => {
    if (current === defaultEndpoint) return;

    async function request() {
      const res = await fetch(current);
      const nextData = await res.json();

      updatePage({
        current,
        ...nextData.info,
      });

      if (!nextData.info?.prev) {
        updateResults(nextData.results);
        return;
      }

      updateResults((prev) => {
        return [...prev, ...nextData.results];
      });
    }

    request();
  }, [current]);

  function handleLoadMore() {
    updatePage((prev) => {
      return {
        ...prev,
        current: page?.next,
      };
    });
  }

  function handleOnSubmitSearch(e) {
    e.preventDefault();

    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find((field) => field.name === "query");

    const value = fieldQuery.value || "";
    const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;

    updatePage({
      current: endpoint,
    });
  }

  return (
    <div className="bg-gray-100 grid place-items-center">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <h1 className="text-sm uppercase text-center">Next-Test</h1>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {
              scale: 0.8,
              opacity: 0,
            },
            visible: {
              scale: 1,
              opacity: 1,
              transition: {
                delay: 0.4,
              },
            },
          }}
        >
          <h2 className="lg:text-8xl my-20 font-bold">Rick and Morty</h2>
        </motion.div>
        <div className="my-4 grid place-items-center w-full">
          <form
            className="flex items-center space-x-2"
            onSubmit={handleOnSubmitSearch}
          >
            <input
              name="query"
              type="search"
              className="p-4 border rounded bg-gray-800 text-white"
              placeholder="search..."
            />
            <button className="border p-4 px-4 bg-blue-600 text-white hover:bg-slate-800 duration-300 rounded">
              Search
            </button>
          </form>
        </div>
      </main>
      <div>
        <ul className="grid lg:grid-cols-3 md:grid-cols-2 border border-black/20 p-4 rounded gap-4">
          {results.map((result) => {
            const { id, name, image } = result;
            return (
              <motion.li
                key={id}
                className="bg-white card font-bold border p-4 rounded hover:border-black duration-300 hover:shadow-md"
                whileHover={{
                  position: "relative",
                  zIndex: 1,
                  scale: [1, 2, 1.2],
                  rotate: [0, 20, -10, 0],
                  filter: [
                    "hue-rotate(0) contrast(100%)",
                    "hue-rotate(360deg) contrast(200%)",
                    "hue-rotate(45deg) contrast(300%)",
                    "hue-rotate(0) contrast(100%)",
                  ],
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                <Link href="/character/[id]" as={`/character/${id}`}>
                  <Image
                    src={image}
                    alt={`${name} Thumbnail`}
                    width={300}
                    height={300}
                  />

                  <h3>{name}</h3>
                </Link>
              </motion.li>
            );
          })}
        </ul>
        <p className="my-8 p-4 text-center border rounded bg-blue-200 hover:bg-blue-300 duration-300">
          <button onClick={handleLoadMore}>Load More</button>
        </p>
      </div>
    </div>
  );
}
