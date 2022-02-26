import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import '../public/css/styles.css';
import { Provider, Context } from '../context';

function App({ Component, pageProps }) {
  return (
    <Provider><Component {...pageProps} /></Provider>
  )
}

export default App;