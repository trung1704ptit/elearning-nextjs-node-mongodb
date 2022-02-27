import { Spin } from "antd";


export const LoadingFullScreen = () => {
  return (
    <div className="loading-full-screen">
      <Spin size="large"/>
    </div>
  );
}

export const LoadingFullBlock = ({ padding = '20px'}) => {
  return (
    <div className="loading-full-block" style={{ padding }}>
      <Spin size="medium" />
    </div>
  );
}