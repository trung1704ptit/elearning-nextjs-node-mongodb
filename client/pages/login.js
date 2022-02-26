import { useState } from "react";
import { message } from "antd";
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import TopNav from "../components/TopNav";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/login", {
        email,
        password,
      });
      message.success(
        "Login successful."
      );
      setLoading(false);
      setEmail("");
      setPassword("");
    } catch (error) {
      message.error(error.response.data);
      setLoading(false);
    }
  };

  return (
    <>
      <TopNav />
      <h1 className="jumbotron text-center bg-primary square">Login</h1>
      <div className="container col-md-4 offset-md-4 pd-5">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />

          <input
            type="password"
            className="form-control mb-4 p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />

          <br />

          <button
            className="btn btn-block btn-primary p-2"
            disabled={!email || !password || loading}
            type="submit"
          >
            {loading ? <SyncOutlined spin /> : "Login"}
          </button>
        </form>
        <p className="text-center p-3">
          Don't have an account?{" "}
          <Link href="/register">
            <a>Register</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
