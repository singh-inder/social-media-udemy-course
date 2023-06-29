import { useCallback, useState } from "react";
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
import { Axios } from "../utils/profileActions";
import useApiRequest from "@/components/hooks/useApiRequest";

function ProfilePage({
  errorLoading,
  profile,
  followersLength,
  followingLength,
  user,
  userFollowStats
}) {
  const router = useRouter();

  const fetchPosts = useCallback(() => {
    return Axios.get(`/posts/${router.query.username}`);
  }, [router.query]);

  const {
    data: posts,
    setData: setPosts,
    loading,
    error
  } = useApiRequest([], fetchPosts);

  const [activeItem, setActiveItem] = useState("profile");

  const handleItemClick = useCallback(clickedTab => setActiveItem(clickedTab), []);

  const [loggedUserFollowStats, setUserFollowStats] = useState(userFollowStats);

  const ownAccount = profile?.user?._id === user?._id;

  if (errorLoading) return <NoProfile />;

  return (
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
              ) : error || posts.length === 0 ? (
                <NoProfilePosts />
              ) : (
                posts.map(post => (
                  <CardPost
                    key={post._id}
                    post={post}
                    user={user}
                    setPosts={setPosts}
                  />
                ))
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
  );
}

export const getServerSideProps = async ctx => {
  try {
    const { username } = ctx.query;
    const { token } = parseCookies(ctx);

    if (!token) throw new Error();

    const { data } = await axios.get(`${baseUrl}/api/profile/${username}`, {
      headers: { Authorization: token }
    });

    return { props: data };
  } catch (error) {
    return { props: { errorLoading: true } };
  }
};

export default ProfilePage;
