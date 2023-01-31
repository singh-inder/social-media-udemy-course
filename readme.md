## [Click to view the Udemy Course](https://www.udemy.com/course/mernstack-nextjs-withsocketio/?referralCode=A31CAC3FD91000489D0A)

---

## Updates made since the course published:

### BREAKING CHANGE:

- `@artsy/fresnel` dependency removed.
- Responsive Layout using semantic ui responsive classes.

---

### Nextjs version update

- Nextjs @13.1.6
- React,React-Dom @18.2.0

---

### socket.io version update

- socket io @ 4.5.4

```javascript
// Previously
import io from "socket.io-client";

// Version 4.x.x
import { io } from "socket.io-client";
```

---

### Important changes inside signup page.

- Removed all the states for username input field on signup page. Now, we're using vanilla js alongwith useRef hooks inside signup page for making updates to username field. The changes made are inside pages/signup.js

- Debounce added for api requests made for username input. Also added for components/Layout/Search.js

---

### axios cancelToken deprecated

- Debounce api requests for user search

- Starting from v0.22.0 Axios supports AbortController to cancel requests and cancelToken method is deprecated.

- I've replaced cancelToken with AbortController inside the project. Changes made are inside pages/signup.js and components/Layout/Search.js

---

### components/HeadTags.js removed

- With the latest version (12.1.0), nextjs recommends to link stylesheets inside pages/\_document.js. And the tags like `<title>, <meta>` to be moved inside next/head.

- Thats why the stylesheets link tags have been moved to pages/\_document.js. And the meta tags are inside pages/\_app.js.

- Visit [NextJs Docs](https://nextjs.org/docs/messages/no-stylesheets-in-head-component) for more info.

  <img src='https://raw.githubusercontent.com/inderrr/imagesForRepos/main/Screenshot%202022-02-26%20221457.png' />

---

### A new SocketHoc component

- Explanation about this [Here](https://www.udemy.com/course/mernstack-nextjs-withsocketio/learn/#questions/15297138/).

---

### getInitialProps replaced with getServerSideProps

- Explanation about this [Here](https://www.udemy.com/course/mernstack-nextjs-withsocketio/learn/lecture/28229950#overview)

---

### moment.js replaced with dayjs

- The main reason behind this is that moment.js is in maintenance mode. Also, moment is a huge library.

- Comparatively, dayjs is only 2kb in size. The changes made are inside utils/calculateTime.js

---

### Some other bug fixes..

---

#### Note: The vulnerabilities warning which appears while installing node_modules is because of nodemailer-sendgrid-transport dependency. You can remove this dependency if you aren't going to use it for emails.
