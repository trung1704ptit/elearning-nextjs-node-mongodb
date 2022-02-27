import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { routes } from "../../utils/constants";
import { Spin } from "antd";
import { LoadingFullBlock } from "../Loading";

const UserRoute = ({ children }) => {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/current-user");
      if (data.success) setLoaded(true);
    } catch (err) {
      setLoaded(false);
      router.push(routes.LOGIN);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return <>{loaded ? <>{children}</> : <LoadingFullBlock padding="100px" />}</>;
};

export default UserRoute;
