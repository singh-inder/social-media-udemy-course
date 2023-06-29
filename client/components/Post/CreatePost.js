import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { Form, Button, Divider, Icon } from "semantic-ui-react";
import uploadPic from "../../utils/uploadPicToCloudinary";
import { submitNewPost } from "../../utils/postActions";
import Avatar from "./Avatar";
import Spinner from "../Layout/Spinner";

const CropImageModal = dynamic(() => import("./CropImageModal"), {
  ssr: false,
  loading: () => <Spinner />
});

function CreatePost({ user, setPosts }) {
  const [newPost, setNewPost] = useState({ text: "", location: "" });
  const [loading, setLoading] = useState(false);
  /** @type {React.MutableRefObject<HTMLInputElement>} */
  const inputRef = useRef(null);

  const [highlighted, setHighlighted] = useState(false);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const handleChange = e => {
    const { name, value, files } = e.target;

    if (name === "media") {
      if (files && files.length > 0) {
        setMedia(files[0]);
        return setMediaPreview(URL.createObjectURL(files[0]));
      }
    }

    setNewPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    let picUrl;

    if (media) {
      picUrl = await uploadPic(media);
      if (!picUrl) {
        setLoading(false);
        return toast.error("Error Uploading Image");
      }
    }

    try {
      const { data } = await submitNewPost(newPost, picUrl);

      const createdPost = {
        ...data,
        user,
        likes: [],
        comments: []
      };

      setPosts(prev => [createdPost, ...prev]);

      setNewPost({ text: "", location: "" });

      if (media) {
        setMedia(null);
        setMediaPreview(null);
        URL.revokeObjectURL(mediaPreview);
      }
    } catch (error) {
      toast.error(error);
    }

    setLoading(false);
  };

  const dragEvent = (e, valueToSet) => {
    e.preventDefault();
    setHighlighted(valueToSet);
  };

  return (
    <>
      {showModal && (
        <CropImageModal
          mediaPreview={mediaPreview}
          setMediaPreview={setMediaPreview}
          setMedia={setMedia}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Avatar
            alt={user.name}
            src={user.profilePicUrl}
            styles={{ display: "inline-block" }}
          />
          <Form.TextArea
            placeholder="Whats Happening"
            name="text"
            value={newPost.text}
            onChange={handleChange}
            rows={4}
            width={14}
          />
        </Form.Group>

        <Form.Group>
          <Form.Input
            value={newPost.location}
            name="location"
            onChange={handleChange}
            label="Add Location"
            icon="map marker alternate"
            placeholder="Want to add Location?"
          />

          <input
            ref={inputRef}
            onChange={handleChange}
            name="media"
            style={{ display: "none" }}
            type="file"
            accept="image/*"
          />
        </Form.Group>

        <div
          onClick={() => inputRef.current.click()}
          style={{
            textAlign: "center",
            height: "150px",
            width: "150px",
            border: "dotted",
            paddingTop: media === null && "60px",
            cursor: "pointer",
            borderColor: highlighted ? "green" : "black"
          }}
          onDragOver={e => dragEvent(e, true)}
          onDragLeave={e => dragEvent(e, false)}
          onDrop={e => {
            dragEvent(e, true);

            const droppedFile = Array.from(e.dataTransfer.files);

            if (droppedFile?.length > 0) {
              setMedia(droppedFile[0]);
              setMediaPreview(URL.createObjectURL(droppedFile[0]));
            }
          }}
        >
          {media === null ? (
            <Icon name="plus" size="big" />
          ) : (
            <img
              loading="lazy"
              style={{ height: "150px", width: "150px" }}
              src={mediaPreview}
              alt="PostImage"
            />
          )}
        </div>

        {mediaPreview !== null && (
          <>
            <Divider hidden />

            <Button
              content="Crop Image"
              type="button"
              primary
              circular
              onClick={() => setShowModal(true)}
            />
          </>
        )}

        <Divider hidden />

        <Button
          circular
          disabled={newPost.text === "" || loading}
          content={<strong>Post</strong>}
          style={{ backgroundColor: "#1DA1F2", color: "white" }}
          icon="send"
          loading={loading}
        />
      </Form>
      <Divider />
    </>
  );
}

export default CreatePost;
