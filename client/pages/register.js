import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoadingOutlined, UserAddOutlined } from "@ant-design/icons";
import Link from "next/link";
import TopNav from "../components/TopNav";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/router";
import { Context } from "../context";
import { routes } from "../utils/constants";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { state: { user }, dispatch } = useContext(Context);
  const router = useRouter();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/register", {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      message.success(
        "Registration successful. Please login to learn courses."
      );
      router.push(routes.LOGIN);
      setLoading(false);
    } catch (error) {
      message.error(error.response.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) { 
      router.push("/");
    }
  }, [user])


  return (
    <>
      <TopNav />
      <h1 className="jumbotron text-center bg-primary square">Register</h1>
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
            label="Name"
            name="name"
            validateTrigger="onSubmit"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

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

          <Form.Item>
            <div>
              Already have an account?{" "}
              <Link href="/login">
                <a>Login</a>
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              block
              disabled={loading}
              type="primary"
              htmlType="submit"
              size="large"
              icon={loading ? <LoadingOutlined spin /> : <UserAddOutlined />}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Register;
