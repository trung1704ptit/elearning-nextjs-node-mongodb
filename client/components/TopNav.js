import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
  LoginOutlined,
  UserAddOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import axios from 'axios';
import { Context } from '../context'

const { Item } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState("");
  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    typeof window === 'object' && setCurrent(window.location.pathname);
  }, [typeof window === 'object' && window.location.pathname]);

  const logout = async () => {
    dispatch({
      type: 'LOGOUT'
    })

    window.localStorage.removeItem('user');
    const { data} = await axios.get('/api/logout');
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
    </Menu>
  );
};

export default TopNav;
