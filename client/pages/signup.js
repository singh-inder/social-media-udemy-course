import { useState, useEffect, useRef, useCallback } from "react";
import { Form, Button, Message, Segment, Divider } from "semantic-ui-react";
import axios from "axios";
import { useDebounce } from "usehooks-ts";

import CommonInputs from "../components/Common/CommonInputs";
import ImageDropDiv from "../components/Common/ImageDropDiv";
import useFormInput from "../components/hooks/useFormInput";
import { HeaderMessage, FooterMessage } from "../components/Common/WelcomeMessage";
import baseUrl from "../utils/baseUrl";
import { registerUser } from "../utils/authUser";
import uploadPic from "../utils/uploadPicToCloudinary";

const initialState = {
  name: "",
  email: "",
  password: "",
  username: "",
  bio: "",
  facebook: "",
  youtube: "",
  twitter: "",
  instagram: ""
};

function Signup() {
  const {
    state: user,
    handleChange,
    media,
    setMedia,
    mediaPreview,
    setMediaPreview
  } = useFormInput(initialState);

  const { name, email, password, bio } = user;

  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const controllerRef = useRef(null);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(null);
  const debouncedUsername = useDebounce(username, 750);
  const [usernameLoading, setUsernameLoading] = useState(false);

  const [highlighted, setHighlighted] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    const isUser = Object.values({ name, email, password, bio }).every(item => !!item);
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [name, email, password, bio]);

  // Check username availability
  useEffect(() => {
    (async () => {
      if (debouncedUsername.length === 0) return;

      setUsernameLoading(true);

      try {
        if (controllerRef.current) controllerRef.current.abort();

        controllerRef.current = new AbortController();

        const value = debouncedUsername;

        await axios.get(`${baseUrl}/api/signup/${value}`, {
          signal: controllerRef.current.signal
        });

        setUsernameError(null);
        setErrorMsg(null);

        handleChange({ target: { name: "username", value } });
      } catch (error) {
        setErrorMsg("Username Not Available");
        setUsernameError(true);
      }

      setUsernameLoading(false);
    })();
  }, [debouncedUsername, handleChange]);

  // prettier-ignore
  const handleSubmit = useCallback(async e => {
    e.preventDefault();

    if (usernameError || usernameLoading) return;

    setFormLoading(true);

    let profilePicUrl;
    if (media !== null) {
      profilePicUrl = await uploadPic(media);

      if (!profilePicUrl) {
        setFormLoading(false);
        return setErrorMsg("Error Uploading Image");
      }
    }

    await registerUser(user, profilePicUrl, setErrorMsg, setFormLoading);
  }, [media, user, usernameError, usernameLoading]);

  return (
    <>
      <HeaderMessage />
      <Form loading={formLoading} error={errorMsg !== null} onSubmit={handleSubmit}>
        <Message
          error
          header="Oops!"
          content={errorMsg}
          onDismiss={() => setErrorMsg(null)}
        />

        <Segment>
          <ImageDropDiv
            mediaPreview={mediaPreview}
            setMediaPreview={setMediaPreview}
            setMedia={setMedia}
            inputRef={inputRef}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
            handleChange={handleChange}
          />
          <Form.Input
            required
            label="Name"
            placeholder="Name"
            name="name"
            value={name}
            onChange={handleChange}
            fluid
            icon="user"
            iconPosition="left"
          />

          <Form.Input
            required
            label="Email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            fluid
            icon="envelope"
            iconPosition="left"
            type="email"
          />

          <Form.Input
            label="Password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
            fluid
            icon={{
              name: "eye",
              circular: true,
              link: true,
              onClick: () => setShowPassword(!showPassword)
            }}
            iconPosition="left"
            type={showPassword ? "text" : "password"}
            required
          />

          <Form.Input
            loading={usernameLoading}
            error={usernameError}
            required
            label="Username"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fluid
            icon={!usernameError ? "check" : "close"}
            iconPosition="left"
          />

          <CommonInputs
            user={user}
            showSocialLinks={showSocialLinks}
            setShowSocialLinks={setShowSocialLinks}
            handleChange={handleChange}
          />

          <Divider hidden />
          <Button
            icon="signup"
            content="Signup"
            type="submit"
            color="orange"
            disabled={submitDisabled || usernameLoading || usernameError}
          />
        </Segment>
      </Form>

      <FooterMessage />
    </>
  );
}

export default Signup;
