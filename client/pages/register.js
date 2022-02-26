import { useState } from "react";
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const hangleSubmit = async e => {
    e.preventDefault();
    console.table({ name, email, password })
    const { data } = await axios.post(`http://localhost:8000/api/register`)
    console.log(data)
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

          <button className="btn btn-block btn-primary p-2" type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default Register;
