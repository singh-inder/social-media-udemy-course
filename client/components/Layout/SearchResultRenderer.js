import { List } from "semantic-ui-react";
import Avatar from "../Post/Avatar";

const ResultRenderer = ({ image, title }) => (
  <List>
    <List.Item className="relative flex items-center" style={{ margin: "5px 0" }}>
      <List.Content header={title} />

      <Avatar
        styles={{ position: "absolute", right: "10px" }}
        src={image}
        alt={title}
      />
    </List.Item>
  </List>
);

export default ResultRenderer;
