import React, { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";
import Spinner from "../Layout/Spinner";
import { NoFollowData } from "../Layout/NoData";
import Avatar from "../Post/Avatar";
import { followUser, unfollowUser } from "../../utils/profileActions";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import cookie from "js-cookie";

const Followers = ({
  user,
  loggedUserFollowStats,
  setUserFollowStats,
  profileUserId
}) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const getFollowers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${baseUrl}/api/profile/followers/${profileUserId}`,
          {
            headers: { Authorization: cookie.get("token") }
          }
        );

        setFollowers(res.data);
      } catch (error) {
        alert("Error Loading Followers");
      }
      setLoading(false);
    };

    getFollowers();
  }, [profileUserId]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        followers.map(profileFollower => {
          const isFollowing = loggedUserFollowStats.following?.some(
            following => following.user === profileFollower.user._id
          );

          return (
            <div
              className="flex items-center relative"
              style={{ gap: "10px", marginBottom: "1.2rem" }}
              key={profileFollower.user._id}
            >
              <Avatar
                alt={profileFollower.user.name}
                src={profileFollower.user.profilePicUrl}
              />

              <a href={`/${profileFollower.user.username}`}>
                {profileFollower.user.name}
              </a>

              <div className="absolute" style={{ right: "10px" }}>
                {profileFollower.user._id !== user._id && (
                  <Button
                    color={isFollowing ? "instagram" : "twitter"}
                    icon={isFollowing ? "check" : "add user"}
                    content={isFollowing ? "Following" : "Follow"}
                    disabled={followLoading}
                    onClick={() => {
                      setFollowLoading(true);

                      isFollowing
                        ? unfollowUser(profileFollower.user._id, setUserFollowStats)
                        : followUser(profileFollower.user._id, setUserFollowStats);

                      setFollowLoading(false);
                    }}
                  />
                )}
              </div>
            </div>
          );
        })
      )}

      {followers.length === 0 && <NoFollowData followersComponent={true} />}
    </>
  );
};

export default Followers;
