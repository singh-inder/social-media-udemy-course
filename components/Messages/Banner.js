import { Segment, Grid } from "semantic-ui-react";
import Avatar from "../Post/Avatar";

function Banner({ bannerData }) {
  const { name, profilePicUrl } = bannerData;

  return (
    <Segment color="teal" attached="top">
      <Grid>
        <Grid.Column floated="left" width={14}>
          <h4 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Avatar
              styles={{ height: "2.5rem", width: "2.5rem" }}
              alt={name}
              src={profilePicUrl}
            />

            {name}
          </h4>
        </Grid.Column>
      </Grid>
    </Segment>
  );
}

export default Banner;
