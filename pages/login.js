import { useState, useEffect } from "react";
import { Form, Button, Message, Segment, Divider } from "semantic-ui-react";
import cookie from "js-cookie";
import { HeaderMessage, FooterMessage } from "../components/Common/WelcomeMessage";
import useFormInput from "../components/hooks/useFormInput";
import { loginUser } from "../utils/authUser";

function Login() {
  const { state: user, handleChange } = useFormInput({
    email: "",
    password: ""
  });

  const { email, password } = user;
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  useEffect(() => {
    const isUser = Object.values({ email, password }).every(item => Boolean(item));
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [email, password]);

  const handleSubmit = async e => {
    e.preventDefault();

    await loginUser(user, setErrorMsg, setFormLoading);
  };

  useEffect(() => {
    document.title = "Welcome Back";
    const userEmail = cookie.get("userEmail");
    if (userEmail) handleChange({ target: { name: "email", value: userEmail } });
  }, [handleChange]);

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

          <Divider hidden />
          <Button
            icon="signup"
            content="Login"
            type="submit"
            color="orange"
            disabled={submitDisabled}
          />
        </Segment>
      </Form>

      <FooterMessage />
    </>
  );
}

export default Login;
