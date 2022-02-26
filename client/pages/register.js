import { useState } from "react";
import { message } from "antd";
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const hangleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post('/api/register', {
        name,
        email,
        password,
      });
      message.success(
        "Registration successful. Please login to learn courses."
      );
      setLoading(false);
      setName('');
      setEmail('');
      setPassword('')
    } catch (error) {
      message.error(error.response.data);
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Register Page</h1>
      <div className="container col-md-4 offset-md-4 pd-5">
        <form onSubmit={hangleSubmit}>
          <input
            type="text"
            className="form-control mb-4 p-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />

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
            disabled={!name || !email || !password || loading}
            type="submit"
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
