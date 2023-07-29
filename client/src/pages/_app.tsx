import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";

import "../styles/global.css";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "light",
          colors: {
            gold: [
              "#F6F4F0",
              "#E8DFD2",
              "#DFCEB3",
              "#DCBE92",
              "#DFB26D",
              "#EAA844",
              "#D4973C",
              "#B9873C",
              "#9B7741",
              "#836A43",
            ],
          },
          primaryColor: "gold",
          primaryShade: { light: 6, dark: 6 },
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}
