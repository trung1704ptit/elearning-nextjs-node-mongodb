import { useContext } from "react";
import { Context } from '../../context';
import UserRoute from '../../components/routes/UserRoute'

const UserIndex = () => {
  const {
    state: { user },
  } = useContext(Context);

  return (
    <UserRoute>
      <h1>
        <pre>user info</pre>
      </h1>
    </UserRoute>
  );
};

export default UserIndex;
