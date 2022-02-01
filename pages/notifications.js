import { Fragment, useEffect, useState } from "react";
import { Feed, Segment, Divider, Container } from "semantic-ui-react";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { parseCookies } from "nookies";
import cookie from "js-cookie";
import { NoNotifications } from "../components/Layout/NoData";
import LikeNotification from "../components/Notifications/LikeNotification";
import CommentNotification from "../components/Notifications/CommentNotification";
import FollowerNotification from "../components/Notifications/FollowerNotification";

function Notifications({ notifications, errorLoading, user, userFollowStats }) {
  const [loggedUserFollowStats, setUserFollowStats] = useState(userFollowStats);

  useEffect(() => {
    (async () => {
      try {
        await axios.post(
          `${baseUrl}/api/notifications`,
          {},
          { headers: { Authorization: cookie.get("token") } }
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <Container style={{ marginTop: "1.5rem" }}>
      {notifications.length > 0 ? (
        <Segment color="teal" raised>
          <div
            style={{
              maxHeight: "40rem",
              overflow: "auto",
              height: "40rem",
              position: "relative",
              width: "100%"
            }}
          >
            <Feed size="small">
              {notifications.map(notification => (
                <Fragment key={notification._id}>
                  {notification.type === "newLike" && notification.post !== null && (
                    <LikeNotification notification={notification} />
                  )}

                  {notification.type === "newComment" &&
                    notification.post !== null && (
                      <CommentNotification notification={notification} />
                    )}

                  {notification.type === "newFollower" && (
                    <FollowerNotification
                      notification={notification}
                      loggedUserFollowStats={loggedUserFollowStats}
                      setUserFollowStats={setUserFollowStats}
                    />
                  )}
                </Fragment>
              ))}
            </Feed>
          </div>
        </Segment>
      ) : (
        <NoNotifications />
      )}
      <Divider hidden />
    </Container>
  );
}

export const getServerSideProps = async ctx => {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/notifications`, {
      headers: { Authorization: token }
    });

    return { props: { notifications: res.data } };
  } catch (error) {
    return { props: { errorLoading: true } };
  }
};

export default Notifications;
