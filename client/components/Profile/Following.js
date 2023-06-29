import React, { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";
import Spinner from "../Layout/Spinner";
import { NoFollowData } from "../Layout/NoData";
import Avatar from "../Post/Avatar";
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
  }, [profileUserId]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        following.map(profileFollowing => {
          const isFollowing = loggedUserFollowStats.following?.some(
            following => following.user === profileFollowing.user._id
          );

          return (
            <div
              className="flex items-center relative"
              style={{ gap: "10px", marginBottom: "1.2rem" }}
              key={profileFollowing.user._id}
            >
              <Avatar
                alt={profileFollowing.user.name}
                src={profileFollowing.user.profilePicUrl}
              />

              <a href={`/${profileFollowing.user.username}`}>
                {profileFollowing.user.name}
              </a>

              <div className="absolute" style={{ right: "10px" }}>
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
              </div>
            </div>
          );
        })
      )}

      {following.length === 0 && <NoFollowData followingComponent={true} />}
    </>
  );
};

export default Following;
