// import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import '../public/css/styles.css';
import { Provider, Context } from '../context';
import TopNav from '../components/TopNav';

function App({ Component, pageProps }) {
  return (
    <Provider>
      <TopNav />
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;