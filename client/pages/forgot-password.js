import { useContext, useEffect, useState } from "react";
import { message } from "antd";
import axios from "axios";
import { LoginOutlined } from "@ant-design/icons";
import { Context } from "../context";
import { Form, Input, Button, Alert, Result } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const router = useRouter();
  const {
    state: { user },
  } = useContext(Context);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  });

  const [form] = Form.useForm();

  const onForgotPassword = async (values) => {
    try {
      setLoading(true);
      setForgotSuccess(false);
      const { data } = await axios.post("/api/forgot-password", {
        email: values.email,
      });
      setForgotSuccess(true);
      setLoading(false);
    } catch (error) {
      message.error(error.response.data);
      setLoading(false);
      setForgotSuccess(false);
    }
  };

  const onResetPassword = async (values) => {
    try {
      setLoading(true);
      setResetSuccess(false);
      const { email, code, password } = values;
      const { data } = await axios.post("/api/reset-password", {
        email,
        password,
        code,
      });

      form.resetFields();
      setLoading(false);
      setResetSuccess(true);
    } catch (error) {
      console.log(error);
      message.error(error.response.data);
      setLoading(false);
      setResetSuccess(false);
    }
  };

  if (resetSuccess) {
    return (
      <Result
        status="success"
        title="Reset your password successful."
        subTitle="Now you can start your dream!"
        extra={[
          <Button type="primary" key="console">
            <Link href="/login">Login</Link>
          </Button>,
          <Button key="buy">
            <Link href="/">Home</Link>
          </Button>,
        ]}
      />
    );
  }

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">
        Forgot password
      </h1>
      <div className="auth-form">
        <Form
          name="basic"
          form={form}
          initialValues={{
            remember: true,
          }}
          onFinish={forgotSuccess ? onResetPassword : onForgotPassword}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            validateTrigger="onSubmit"
            disabled={forgotSuccess}
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          {forgotSuccess && (
            <>
              <Form.Item
                label="Secret code"
                name="code"
                validateTrigger="onSubmit"
                rules={[
                  {
                    required: true,
                    message: "Please input your secret code.",
                  },
                  {
                    min: 6,
                    max: 6,
                    message: "Secret code length must be 6 character",
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="New password"
                name="password"
                validateTrigger="onSubmit"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                  {
                    min: 6,
                    max: 64,
                    message: "Password length must be at least 6 characters.",
                  },
                ]}
              >
                <Input.Password size="large" />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                validateTrigger="onSubmit"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        "The two passwords that you entered do not match!"
                      );
                    },
                  }),
                ]}
              >
                <Input.Password size="large" />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button
              block
              disabled={loading}
              type="primary"
              htmlType="submit"
              size="large"
              icon={<LoginOutlined />}
            >
              {forgotSuccess ? "Reset password" : "Submit"}
            </Button>
          </Form.Item>
        </Form>

        {forgotSuccess && (
          <Alert
            message="Send request successfully."
            description="Please check your email and use the secret code that we sent to reset your password."
            type="success"
            showIcon
          />
        )}
      </div>
    </>
  );
};

export default ForgotPassword;
