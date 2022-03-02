import { useState, useEffect, useContext } from "react";
import { Menu, message } from "antd";
import Link from "next/link";
import {
  LoginOutlined,
  UserAddOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  CoffeeOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { Context } from "../context";
import { useRouter } from "next/router";
import { routes, types } from "../utils/constants";

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState("");
  const { state, dispatch } = useContext(Context);
  const { user } = state;
  const router = useRouter();

  useEffect(() => {
    typeof window === "object" && setCurrent(window.location.pathname);
  }, [typeof window === "object" && window.location.pathname]);

  const logout = async () => {
    dispatch({
      type: types.LOGOUT,
    });

    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/logout");
    message.success(data.message);
    router.push("/login");
  };

  return (
    <div>
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

        {!user && (
          <>
            <Item
              key={routes.LOGIN}
              onClick={(e) => setCurrent(e.key)}
              icon={<LoginOutlined />}
            >
              <Link href={routes.LOGIN}>
                <a>Login</a>
              </Link>
            </Item>
            <Item
              key={routes.REGISTER}
              onClick={(e) => setCurrent(e.key)}
              icon={<UserAddOutlined />}
            >
              <Link href={routes.REGISTER}>
                <a>Register</a>
              </Link>
            </Item>
          </>
        )}

        {user && (
          <SubMenu
            icon={<UserOutlined />}
            style={{ marginLeft: "auto" }}
            title={user && user.name}
            key="submenu"
          >
            <ItemGroup>
              <Item icon={<SettingOutlined />}>
                <Link href={routes.USER}>
                  <a>Profile</a>
                </Link>
              </Item>
              <Item icon={<SettingOutlined />}>
                <Link href={routes.DASHBOARD}>
                  <a>Dashboard</a>
                </Link>
              </Item>
              <Item icon={<SettingOutlined />}>Setting</Item>
              <Item onClick={logout} icon={<LogoutOutlined />}>
                Logout
              </Item>
            </ItemGroup>
          </SubMenu>
        )}
      </Menu>
    </div>
  );
};

export default TopNav;
