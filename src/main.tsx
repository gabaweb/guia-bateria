import { useRef } from "react";
import ReactDOM from "react-dom/client";
import Framework7 from "framework7/lite";
import Framework7React, { App, View } from "framework7-react";
import Dialog from "framework7/components/dialog";
import Progressbar from "framework7/components/progressbar";
import Tabs from "framework7/components/tabs";
import Gauge from "framework7/components/gauge";
import Radio from "framework7/components/radio";
import "framework7/css";
import "framework7/components/dialog/css";
import "framework7/components/radio/css";
import "framework7/components/progressbar/css";
import "framework7/components/tabs/css";
import "framework7/components/gauge/css";
import "framework7/components/grid/css";
import "framework7/components/typography/css";
import "framework7-icons/css/framework7-icons.css";
import "./styles.css";
import { MainTabs } from "./MainTabs";
import { GuideProvider, useGuide } from "./state";
import { PwaProvider } from "./pwa";
import { Home } from "./Home";
import { HashNavigation } from "./components/HashNavigation";
import { ModelPicker } from "./ModelPicker";
import { Detail } from "./Detail";
import { Progress } from "./Progress";
import { About } from "./About";
Framework7.use([Dialog, Radio, Progressbar, Tabs, Gauge, Framework7React]);
const routes = [
  {
    path: "/",
    component: MainTabs,
    tabs: [
      { path: "/", id: "home", component: Home },
      { path: "/progresso/", id: "progress", component: Progress },
      { path: "/sobre/", id: "about", component: About },
    ],
  },
  { path: "/aparelho/", component: ModelPicker },
  { path: "/dica/:id/", component: Detail },
  { path: "(.*)", redirect: "/" },
];
const setupRoutes = [{ path: "(.*)", component: ModelPicker }];
function GuideView() {
  const { saved } = useGuide();
  const entryUrl = useRef(
    saved.selected && window.location.hash.startsWith("#!/")
      ? window.location.hash.slice(2)
      : "/",
  );
  return (
    <View
      key={saved.selected ? "guide" : "setup"}
      routes={saved.selected ? routes : setupRoutes}
      className="safe-areas"
      main
      url={saved.selected ? entryUrl.current : "/aparelho/"}
      browserHistory={saved.selected}
      unloadTabContent={false}
      browserHistorySeparator="#!"
      browserHistoryRoot="/"
      browserHistoryInitialMatch
      browserHistoryAnimate={false}
      iosSwipeBack
    />
  );
}
ReactDOM.createRoot(document.getElementById("app")!).render(
  <GuideProvider>
    <App
      name="Guia Bateria"
      theme="ios"
      dark
      routes={routes}
      colors={{
        primary: "#30d158",
        blue: "#0a84ff",
        green: "#30d158",
        gray: "#8e8e93",
        red: "#ff453a",
        orange: "#ff9f0a",
        pink: "#ff375f",
        purple: "#bf5af2",
        yellow: "#ffd60a",
      }}
      navbar={{ iosCenterTitle: true, snapPageScrollToLargeTitle: true }}
      dialog={{ buttonOk: "Limpar", buttonCancel: "Cancelar" }}
    >
      <PwaProvider>
        <GuideView />
        <HashNavigation />
      </PwaProvider>
    </App>
  </GuideProvider>,
);
