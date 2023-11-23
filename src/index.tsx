import ReactDOM from "react-dom/client";
import "./index.scss";
import "antd/dist/antd.min.css";
import App from "./App";
import { ConfigProvider } from "antd";
import thTH from "antd/lib/locale-provider/th_TH";
import "moment/locale/th";
import reportWebVitals from "./reportWebVitals";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";

dayjs.extend(buddhistEra);

const app = async () => {
  const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

  root.render(
    <ConfigProvider locale={thTH}>
      <App />
    </ConfigProvider>,
  );
  reportWebVitals();
};

app();
