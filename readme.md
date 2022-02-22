### [Udemy Course](https://www.udemy.com/course/mernstack-nextjs-withsocketio/?referralCode=A31CAC3FD91000489D0A)

---

### Changes made since the course published:

<br>

1. Nextjs version updated to 12.1.0 (Latest one at the time of commit).

2. Updated socket io version to 4.4.1 (Latest one at the time of commit). Now io is not a default export from socket.io-client package.

```javascript
// Previously
import io from "socket.io-client";

// Version 4.4.1
import { io } from "socket.io-client";
```

3. Created a new SocketHoc component. Explanation about this is [Here](https://www.udemy.com/course/mernstack-nextjs-withsocketio/learn/#questions/15297138/).

4. Replaced getInitialProps with getServerSideProps. Explanation [Here](https://www.udemy.com/course/mernstack-nextjs-withsocketio/learn/lecture/28229950#overview)

5. Replaced momentjs with dayjs. dayjs is only 2kb in size. The changes made are inside utils/calculateTime.js

6. Some minor bug fixes.

---

Note: The vulnerabilities warning which appears while installing node_modules is because of nodemailer-sendgrid-transport dependency. You can remove this dependency if you aren't going to use it for emails.
