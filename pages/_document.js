import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.png" sizes="16*16" type="image/png" />

        <link rel="stylesheet" type="text/css" href="/listMessages.css" />

        <link rel="stylesheet" type="text/css" href="/styles.css" />
        <link rel="stylesheet" type="text/css" href="/nprogress.css" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/react-toastify@9.0.8/dist/ReactToastify.min.css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
