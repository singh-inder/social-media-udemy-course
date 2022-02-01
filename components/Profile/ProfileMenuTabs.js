import React from "react";
import { Menu } from "semantic-ui-react";

function ProfileMenuTabs({
  activeItem,
  handleItemClick,
  followersLength,
  followingLength,
  ownAccount,
  loggedUserFollowStats
}) {
  return (
    <>
      <Menu pointing secondary>
        <Menu.Item
          name="profile"
          active={activeItem === "profile"}
          onClick={() => handleItemClick("profile")}
        />

        <Menu.Item
          name={`${followersLength} followers`}
          active={activeItem === "followers"}
          onClick={() => handleItemClick("followers")}
        />

        {ownAccount ? (
          <>
            <Menu.Item
              name={`${
                loggedUserFollowStats.following.length > 0
                  ? loggedUserFollowStats.following.length
                  : 0
              } following`}
              active={activeItem === "following"}
              onClick={() => handleItemClick("following")}
            />

            <Menu.Item
              name="Update Profile"
              active={activeItem === "updateProfile"}
              onClick={() => handleItemClick("updateProfile")}
            />

            <Menu.Item
              name="settings"
              active={activeItem === "settings"}
              onClick={() => handleItemClick("settings")}
            />
          </>
        ) : (
          <Menu.Item
            name={`${followingLength} following`}
            active={activeItem === "following"}
            onClick={() => handleItemClick("following")}
          />
        )}
      </Menu>
    </>
  );
}

export default ProfileMenuTabs;
