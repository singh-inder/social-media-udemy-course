## [Click to view the Udemy Course](https://www.udemy.com/course/mernstack-nextjs-withsocketio/?referralCode=A31CAC3FD91000489D0A)

---

## Updates made since the course published:

### BREAKING CHANGE:

- **nextjs custom server pattern dropped.** Server and client run on PORT 5000 and 3000 respectively.

---

### CLIENT CHANGES

- Nextjs updated to `v13.4.7`. (Still using pages router). React,React-Dom updated to `v18.2.0`.

- `@artsy/fresnel` dependency removed.

- Responsive Layout using semantic ui responsive classes.

#### socket.io version update

- socket io @ 4.7.1

```javascript
// Previously
import io from "socket.io-client";

// Version 4.x.x
import { io } from "socket.io-client";
```

#### debounce api requests. axios cancelToken deprecated, now using abortController

- Debounce api requests made for username input, user search.

- Starting from v0.22.0 Axios supports AbortController to cancel requests and cancelToken method is deprecated.

- I've replaced cancelToken with AbortController inside the project. Changes made are inside pages/signup.js and components/Layout/Search.js

#### client/service/socket.js

- No need to use `useRef` hook for storing socket instance on every page. Simply use socket instance wherver needed.

  ```javascript
  import socket from "@/service/socket";
  ```

- Added authentication for socket

#### SocketHoc component

- Imported inside \_app.js, component emits join event (only when user is authenticated) to connect user to server.
- Also, handles logic for displaying NewNotification, NewMessage on all authenticated pages except `/messages`

#### jsconfig.json

- jsconfig.json added for path lookups and basic javscript type checking.

#### getInitialProps in pages replaced with getServerSideProps (except pages/\_app.js)

- Explanation about this [Here](https://www.udemy.com/course/mernstack-nextjs-withsocketio/learn/lecture/28229950#overview)

#### moment.js replaced with dayjs

- The main reason behind this is that moment.js is in maintenance mode. Also, moment is a huge library.

- Comparatively, dayjs is only `2kb(around 6kb with plugins used)`. The changes made are inside [utils/calculateTime.js](https://github.com/inderrr/social-media-udemy-course/tree/main/client/utils)

#### components/HeadTags.js removed

- With release of nextjs 12.1.0, nextjs recommends to link stylesheets inside pages/\_document.js. And the tags like `<title>, <meta>` to be moved inside next/head.

- Thats why the stylesheets link tags have been moved to [pages/\_document.js](https://github.com/inderrr/social-media-udemy-course/tree/main/client/pages/_document.js). And the meta tags are inside [pages/\_app.js](https://github.com/inderrr/social-media-udemy-course/tree/main/client/pages/_app.js).

- Visit [NextJs Docs](https://nextjs.org/docs/messages/no-stylesheets-in-head-component) for more info.

Some other bug fixes and refactors..

---

### SERVER

#### env vars needed on server

```
#MONGO_URI HERE
MONGO_URI=

# for signing jwt tokens
jwtSecret=

# sending reset password emails
sendGrid_api=

# url where your client app runs. Required to enable cors from this origin. Change it when client app deployed to production

FRONTEND_URL=http://localhost:3000
```

#### socket-io

- socket-io upgraded to `v4.7.1`

- cors package added as from now on server and client run on different ports.

- Previously users connected via sockets were stored in `Array` data structure. Now, users are stored in `Map`. [roomActions.js](https://github.com/inderrr/social-media-udemy-course/tree/main/server/utilsServer/roomActions.js)

#### Note: The vulnerabilities warning which appears while installing node_modules is because of nodemailer-sendgrid-transport dependency. You can remove this dependency as sendgrid now provided its own node package. Checkout this [QuickStart Guide](https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs)

---

#### Client Bundle Size

- The project was initially built in 2021, during which the focus was on utilizing popular and trending dependencies available at that time. The current build of the nextjs client is larger than anticipated because of dependencies like semantic-ui-react, socket.io-client and axios. The generated css of all components(even unused ones) is being included inside production css file.

- semantic-ui-react will be replaced with tailwindcss. axios will be replaced with native fetch or any fetch wrapper. socket-io will be replaced with native websockets.
