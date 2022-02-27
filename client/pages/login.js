import { useContext, useEffect, useState } from "react";
import { message } from "antd";
import axios from "axios";
import { LoginOutlined, SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import TopNav from "../components/TopNav";
import { Context } from "../context";
import { useRouter } from "next/router";
import { Form, Input, Button, Checkbox, Space } from "antd";
import { routes, types } from '../utils/constants'

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { state: { user }, dispatch } = useContext(Context);
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) { 
      router.push("/");
    }
  }, [user])

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/login", {
        email: values.email,
        password: values.password,
      });

      dispatch({
        type: types.LOGIN,
        payload: data,
      });

      // save user in localstorage
      window.localStorage.setItem("user", JSON.stringify(data));

      router.push("/");

      setLoading(false);
    } catch (error) {
      message.error(error.response.data);
      setLoading(false);
    }
  };

  return (
    <>
      <TopNav />
      <h1 className="jumbotron text-center bg-primary square">Login</h1>
      <div className="auth-form">
        <Form
          name="basic"
          form={form}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            validateTrigger="onSubmit"
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

          <Form.Item
            label="Password"
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

          <Form.Item name="remember" valuePropName="checked">
            <Space
              align="baseline"
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <Checkbox>Remember me</Checkbox>
              <p>
                Don't have an account?{" "}
                <Link href={routes.REGISTER}>
                  <a>Register</a>
                </Link>
              </p>
            </Space>
          </Form.Item>

          <Form.Item>
            <Button
              block
              disabled={loading}
              type="primary"
              htmlType="submit"
              size="large"
              icon={<LoginOutlined />}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Login;
