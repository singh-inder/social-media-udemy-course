import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import "../public/nprogress.css";
import "../public/styles.css";
import Head from "next/head";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";
import { destroyCookie, parseCookies } from "nookies";
import axios from "axios";
import Layout from "@/components/Layout/Layout";
import baseUrl from "@/utils/baseUrl";
import { redirectUser } from "@/utils/authUser";

const SocketHoc = dynamic(() => import("../components/SocketHoc"));

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="UTF-8" />
        <title>Mini Social Media</title>
      </Head>

      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>

      {pageProps.user && <SocketHoc user={pageProps.user} />}

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        pauseOnFocusLoss
        pauseOnHover={false}
      />
    </>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  const { token } = parseCookies(ctx);
  let pageProps = {};

  const protectedRoutes =
    ctx.pathname === "/" ||
    ctx.pathname === "/[username]" ||
    ctx.pathname === "/notifications" ||
    ctx.pathname === "/post/[postId]" ||
    ctx.pathname === "/messages" ||
    ctx.pathname === "/search";

  if (!token) {
    if (protectedRoutes) redirectUser(ctx, "/login");
  }
  //
  else {
    try {
      const getFollowingData =
        ctx.pathname === "/notifications" || ctx.pathname === "/[username]";

      const res = await axios.get(`${baseUrl}/api/auth`, {
        headers: { Authorization: token },
        params: { getFollowingData }
      });

      const user = res.data.user;
      const userFollowStats = res.data.userFollowStats;

      if (user && !protectedRoutes) redirectUser(ctx, "/");

      pageProps.user = user;
      pageProps.userFollowStats = userFollowStats;
    } catch (error) {
      destroyCookie(ctx, "token");
      redirectUser(ctx, "/login");
    }
  }

  return { pageProps };
};

export default MyApp;
