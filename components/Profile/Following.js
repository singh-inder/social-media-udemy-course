import React, { useState, useEffect } from "react";
import { Button, Image, List } from "semantic-ui-react";
import Spinner from "../Layout/Spinner";
import { NoFollowData } from "../Layout/NoData";
import { followUser, unfollowUser } from "../../utils/profileActions";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import cookie from "js-cookie";

const Following = ({
  user,
  loggedUserFollowStats,
  setUserFollowStats,
  profileUserId
}) => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const getFollowing = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${baseUrl}/api/profile/following/${profileUserId}`,
          {
            headers: { Authorization: cookie.get("token") }
          }
        );

        setFollowing(res.data);
      } catch (error) {
        alert("Error Loading Followers");
      }
      setLoading(false);
    };

    getFollowing();
  }, []);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : following.length > 0 ? (
        following.map(profileFollowing => {
          /*  */

          const isFollowing =
            loggedUserFollowStats.following.length > 0 &&
            loggedUserFollowStats.following.some(
              following => following.user === profileFollowing.user._id
            );

          return (
            <List key={profileFollowing.user._id} divided verticalAlign="middle">
              <List.Item>
                <List.Content floated="right">
                  {profileFollowing.user._id !== user._id && (
                    <Button
                      color={isFollowing ? "instagram" : "twitter"}
                      icon={isFollowing ? "check" : "add user"}
                      content={isFollowing ? "Following" : "Follow"}
                      disabled={followLoading}
                      onClick={() => {
                        setFollowLoading(true);

                        isFollowing
                          ? unfollowUser(profileFollowing.user._id, setUserFollowStats)
                          : followUser(profileFollowing.user._id, setUserFollowStats);

                        setFollowLoading(false);
                      }}
                    />
                  )}
                </List.Content>
                <Image avatar src={profileFollowing.user.profilePicUrl} />
                <List.Content as="a" href={`/${profileFollowing.user.username}`}>
                  {profileFollowing.user.name}
                </List.Content>
              </List.Item>
            </List>
          );
        })
      ) : (
        <NoFollowData followingComponent={true} />
      )}
    </>
  );
};

export default Following;
