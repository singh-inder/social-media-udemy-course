import { Fragment, useCallback, useEffect, useState } from "react";
import { Feed, Segment, Divider, Container } from "semantic-ui-react";
import axios from "axios";
import cookie from "js-cookie";
import { NoNotifications } from "../components/Layout/NoData";
import baseUrl from "../utils/baseUrl";
import LikeNotification from "../components/Notifications/LikeNotification";
import CommentNotification from "../components/Notifications/CommentNotification";
import FollowerNotification from "../components/Notifications/FollowerNotification";
import Spinner from "@/components/Layout/Spinner";
import useApiRequest from "@/components/hooks/useApiRequest";

const Instance = axios.create({
  baseURL: `${baseUrl}/api/notifications`,
  headers: { Authorization: cookie.get("token") }
});

function Notifications({ userFollowStats }) {
  const fetchNotifications = useCallback(() => Instance.get("/"), []);

  const {
    data: notifications,
    error,
    loading
  } = useApiRequest([], fetchNotifications);

  const [loggedUserFollowStats, setUserFollowStats] = useState(userFollowStats);

  useEffect(() => {
    (async () => {
      try {
        Instance.post(`${baseUrl}/api/notifications`, {});
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <Container style={{ marginTop: "1.5rem" }}>
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
            {loading ? (
              <Spinner />
            ) : error ? (
              <NoNotifications />
            ) : (
              notifications.map(notification => (
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
              ))
            )}
          </Feed>
        </div>
      </Segment>

      <Divider hidden />
    </Container>
  );
}

export default Notifications;
