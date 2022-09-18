<br />

## [Click to view the Udemy Course](https://www.udemy.com/course/mernstack-nextjs-withsocketio/?referralCode=A31CAC3FD91000489D0A)

---

## Updates made since the course published:

<br>

## Nextjs version update

- Nextjs version updated to 12.2.5

---

<br>

## socket.io version update

- Updated socket io version to 4.4.1 (Latest one at the time of commit). Now io is not a default export from socket.io-client package.

```javascript
// Previously
import io from "socket.io-client";

// Version 4.4.1
import { io } from "socket.io-client";
```

---

<br />

## Important changes inside signup page.

- I've removed all the states for username input field on signup page. Now, we're using vanilla js alongwith useRef hooks inside signup page for making updates to username field. The changes made are inside pages/signup.js

- Debounce added for api requests made for username input. Also added for components/Layout/Search.js

---

<br />

## axios cancelToken deprecated

- Starting from v0.22.0 Axios supports AbortController to cancel requests and cancelToken method is deprecated.

- I've replaced cancelToken with AbortController inside the project. Changes made are inside pages/signup.js and components/Layout/Search.js

---

<br />

## components/HeadTags.js removed

- With the latest version (12.1.0), nextjs recommends to link stylesheets inside pages/\_document.js. And the tags like `<title>, <meta>` to be moved inside next/head.

- Thats why the stylesheets link tags have been moved to pages/\_document.js. And the meta tags are inside pages/\_app.js.

- Visit [NextJs Docs](https://nextjs.org/docs/messages/no-stylesheets-in-head-component) for more info.
  <br />
  <br />
  <img src='https://raw.githubusercontent.com/inderrr/imagesForRepos/main/Screenshot%202022-02-26%20221457.png' />

---

  <br />

## A new SocketHoc component

- Explanation about this [Here](https://www.udemy.com/course/mernstack-nextjs-withsocketio/learn/#questions/15297138/).

---

<br />

## getInitialProps replaced with getServerSideProps

- Explanation about this [Here](https://www.udemy.com/course/mernstack-nextjs-withsocketio/learn/lecture/28229950#overview)

---

<br />

## moment.js replaced with dayjs

- The main reason behind this is that moment.js is in maintenance mode. Also, moment is a huge library.

- Comparatively, dayjs is only 2kb in size. The changes made are inside utils/calculateTime.js

---

<br />

## Some other bug fixes..

<br />

#### Note: The vulnerabilities warning which appears while installing node_modules is because of nodemailer-sendgrid-transport dependency. You can remove this dependency if you aren't going to use it for emails.
