import Head from "next/head";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { parseCookies, destroyCookie } from "nookies";
import baseUrl from "../utils/baseUrl";
import { redirectUser } from "../utils/authUser";
import Layout from "../components/Layout/Layout";
import "semantic-ui-css/semantic.min.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta charSet="UTF-8" />
        <title>Mini Social Media</title>
      </Head>

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        pauseOnFocusLoss
        pauseOnHover={false}
      />

      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
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
    protectedRoutes && redirectUser(ctx, "/login");
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

      const { user, userFollowStats } = res.data;

      if (user) !protectedRoutes && redirectUser(ctx, "/");

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
