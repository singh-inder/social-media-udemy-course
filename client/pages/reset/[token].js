import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { Form, Button, Message, Segment, Divider } from "semantic-ui-react";
import axios from "axios";

import catchErrors from "@/utils/catchErrors";
import baseUrl from "@/utils/baseUrl";

function TokenPage() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState({ field1: "", field2: "" });

  const { field1, field2 } = newPassword;

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;

    setNewPassword(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    errorMsg !== null && setTimeout(() => setErrorMsg(null), 5000);
  }, [errorMsg]);

  // prettier-ignore
  const resetPassword = useCallback(async e => {
    e.preventDefault();

    setLoading(true);
    try {
      if (field1 !== field2) {
        return setErrorMsg("Passwords do not match");
      }

      await axios.post(`${baseUrl}/api/reset/token`, {
        password: field1,
        token: router.query.token
      });

      setSuccess(true);
    } catch (error) {
      setErrorMsg(catchErrors(error));
    }

    setLoading(false);
  }, [field1, field2, router.query.token]);

  return (
    <>
      {success ? (
        <Message
          attached
          success
          size="large"
          header="Password reset successfull"
          icon="check"
          content="Login Again"
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/login")}
        />
      ) : (
        <Message attached icon="settings" header="Reset Password" color="teal" />
      )}

      {!success && (
        <Form loading={loading} onSubmit={resetPassword} error={errorMsg !== null}>
          <Message error header="Oops!" content={errorMsg} />

          <Segment>
            <Form.Input
              fluid
              icon="eye"
              type="password"
              iconPosition="left"
              label="New Password"
              placeholder="Enter new Password"
              name="field1"
              onChange={handleChange}
              value={field1}
              required
            />
            <Form.Input
              fluid
              icon="eye"
              type="password"
              iconPosition="left"
              label="Confirm Password"
              placeholder="Confirm new Password"
              name="field2"
              onChange={handleChange}
              value={field2}
              required
            />

            <Divider hidden />

            <Button
              disabled={field1 === "" || field2 === "" || loading}
              icon="configure"
              type="submit"
              color="orange"
              content="Reset"
            />
          </Segment>
        </Form>
      )}
    </>
  );
}

export default TokenPage;
