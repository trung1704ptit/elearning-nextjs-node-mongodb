import { useState, useEffect, useContext } from "react";
import { Menu, message } from "antd";
import Link from "next/link";
import {
  LoginOutlined,
  UserAddOutlined,
  AppstoreOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import axios from 'axios';
import { Context } from '../context'
import { useRouter } from "next/router";

const { Item } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState("");
  const { state, dispatch } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    typeof window === 'object' && setCurrent(window.location.pathname);
  }, [typeof window === 'object' && window.location.pathname]);

  const logout = async () => {
    dispatch({
      type: "LOGOUT",
    });

    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/logout");
    message.success(data.message)
    router.push('/login');
  }

  return (
    <Menu mode="horizontal" selectedKeys={[current]}>
      <Item
        key="/"
        onClick={(e) => setCurrent(e.key)}
        icon={<AppstoreOutlined />}
      >
        <Link href="/">
          <a>App</a>
        </Link>
      </Item>
      <Item
        key="/login"
        onClick={(e) => setCurrent(e.key)}
        icon={<LoginOutlined />}
      >
        <Link href="/login">
          <a>Login</a>
        </Link>
      </Item>
      <Item
        key="/register"
        onClick={(e) => setCurrent(e.key)}
        icon={<UserAddOutlined />}
      >
        <Link href="/register">
          <a>Register</a>
        </Link>
      </Item>

      <Item onClick={logout} icon={<LogoutOutlined />}>
        Logout
      </Item>
    </Menu>
  );
};

export default TopNav;
