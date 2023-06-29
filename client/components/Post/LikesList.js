import { useState, useCallback } from "react";
import { List, Popup } from "semantic-ui-react";
import catchErrors from "../../utils/catchErrors";
import Router from "next/router";
import { LikesPlaceHolder } from "../Layout/PlaceHolderGroup";
import Avatar from "./Avatar";
import { Axios } from "../../utils/postActions";

function LikesList({ postId, trigger }) {
  const [likesList, setLikesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLikesList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Axios.get(`/like/${postId}`);
      setLikesList(res.data);
    } catch (error) {
      alert(catchErrors(error));
    }
    setLoading(false);
  }, [postId]);

  return (
    <Popup
      on="click"
      onClose={() => setLikesList([])}
      onOpen={getLikesList}
      popperDependencies={[likesList]}
      trigger={trigger}
      wide
    >
      {loading ? (
        <LikesPlaceHolder />
      ) : (
        <>
          {likesList.length > 0 && (
            <div
              style={{
                overflow: "auto",
                maxHeight: "15rem",
                height: "15rem",
                minWidth: "210px"
              }}
            >
              <List selection size="large">
                {likesList.map(like => (
                  <List.Item
                    key={like._id}
                    className="flex items-center"
                    style={{ gap: "10px" }}
                  >
                    <Avatar
                      size={30}
                      alt={like.user.name}
                      src={like.user.profilePicUrl}
                    />

                    <List.Content>
                      <List.Header
                        onClick={() => Router.push(`/${like.user.username}`)}
                        as="a"
                        content={like.user.name}
                      />
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </div>
          )}
        </>
      )}
    </Popup>
  );
}

export default LikesList;
