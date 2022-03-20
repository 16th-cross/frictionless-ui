import Header from "./components/Header";
import { BrowserRouter as Router, Route } from "react-router-dom";
import HomePage from "./pages";
import UploadVideoPage from "./pages/UploadVideo";
import initOnboard from "./initOnboard";
import ViewAllPage from "./pages/ViewAll";
import WatchPage from "./pages/Watch";
import AllVideosPage from "./pages/AllVideos";
import TopupPage from "./pages/Topup";

initOnboard();
const App = () => {
  return (
    <Router>
      <Header />
      <Route path="/" exact>
        <HomePage />
      </Route>
      <Route path="/admin" exact>
        <AllVideosPage />
      </Route>
      <Route path="/admin/upload" exact>
        <UploadVideoPage />
      </Route>
      <Route path="/watch" exact>
        <ViewAllPage />
      </Route>
      <Route path="/watch/:id" exact>
        <WatchPage />
      </Route>
      <Route path="/topup" exact>
        <TopupPage />
      </Route>
    </Router>
  );
};

export default App;
