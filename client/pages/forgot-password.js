import { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { SyncOutlined } from "@ant-design/icons";
import { message } from 'antd';
import Link from 'next/link';
import { Context } from "../context";
import { useRouter } from 'next/router'

const ForgotPassword = () => {
  // state
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('')

  const { state: { user}} = useContext(Context);

  const router = useRouter();

  useEffect(() => {
    if (user !== null) router.push("/");
  }, [])

  const onFinish = () => {
    try {
      const { data } = await axios.post("/api/forgot-password", { email });
    } catch (err) {
      message.error(err.message.data)
    }
  }

  return <div>Forgost password</div>;
}