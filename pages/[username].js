import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { parseCookies } from "nookies";
import { Grid } from "semantic-ui-react";
import { NoProfilePosts, NoProfile } from "../components/Layout/NoData";
import CardPost from "../components/Post/CardPost";
import { PlaceHolderPosts } from "../components/Layout/PlaceHolderGroup";
import ProfileMenuTabs from "../components/Profile/ProfileMenuTabs";
import ProfileHeader from "../components/Profile/ProfileHeader";
import Followers from "../components/Profile/Followers";
import Following from "../components/Profile/Following";
import UpdateProfile from "../components/Profile/UpdateProfile";
import Settings from "../components/Profile/Settings";
import SocketHoc from "../components/SocketHoc";
import { Axios } from "../utils/profileActions";

function ProfilePage({
  errorLoading,
  profile,
  followersLength,
  followingLength,
  user,
  userFollowStats
}) {
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeItem, setActiveItem] = useState("profile");
  const handleItemClick = clickedTab => setActiveItem(clickedTab);

  const [loggedUserFollowStats, setUserFollowStats] = useState(userFollowStats);

  const ownAccount = profile.user._id === user._id;

  if (errorLoading) return <NoProfile />;

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const { username } = router.query;
        const res = await Axios.get(`/posts/${username}`);

        setPosts(res.data);
      } catch (error) {
        alert("Error Loading Posts");
      }

      setLoading(false);
    })();
  }, [router.query.username]);

  const socket = useRef();

  return (
    <SocketHoc user={user} socket={socket}>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column>
            <ProfileMenuTabs
              activeItem={activeItem}
              handleItemClick={handleItemClick}
              followersLength={followersLength}
              followingLength={followingLength}
              ownAccount={ownAccount}
              loggedUserFollowStats={loggedUserFollowStats}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            {activeItem === "profile" && (
              <>
                <ProfileHeader
                  profile={profile}
                  ownAccount={ownAccount}
                  loggedUserFollowStats={loggedUserFollowStats}
                  setUserFollowStats={setUserFollowStats}
                />

                {loading ? (
                  <PlaceHolderPosts />
                ) : posts.length > 0 ? (
                  posts.map(post => (
                    <CardPost
                      socket={socket}
                      key={post._id}
                      post={post}
                      user={user}
                      setPosts={setPosts}
                    />
                  ))
                ) : (
                  <NoProfilePosts />
                )}
              </>
            )}

            {activeItem === "followers" && (
              <Followers
                user={user}
                loggedUserFollowStats={loggedUserFollowStats}
                setUserFollowStats={setUserFollowStats}
                profileUserId={profile.user._id}
              />
            )}

            {activeItem === "following" && (
              <Following
                user={user}
                loggedUserFollowStats={loggedUserFollowStats}
                setUserFollowStats={setUserFollowStats}
                profileUserId={profile.user._id}
              />
            )}

            {activeItem === "updateProfile" && <UpdateProfile Profile={profile} />}

            {activeItem === "settings" && (
              <Settings newMessagePopup={user.newMessagePopup} />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </SocketHoc>
  );
}

export const getServerSideProps = async ctx => {
  try {
    const { username } = ctx.query;
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/profile/${username}`, {
      headers: { Authorization: token }
    });

    const { profile, followersLength, followingLength } = res.data;

    return { props: { profile, followersLength, followingLength } };
  } catch (error) {
    return { props: { errorLoading: true } };
  }
};

export default ProfilePage;
