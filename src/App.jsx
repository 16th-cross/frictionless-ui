import Header from "./components/Header";
import { BrowserRouter as Router, Route } from "react-router-dom";
import HomePage from "./pages";
import UploadVideoPage from "./pages/UploadVideo";
import initOnboard from "./initOnboard";

initOnboard();
const App = () => {
  return (
    <Router>
      <Header />
      <Route path="/" exact>
        <HomePage />
      </Route>
      <Route path="/admin" exact>
        <HomePage />
      </Route>
      <Route path="/admin/upload" exact>
        <UploadVideoPage />
      </Route>
      <Route path="/watch" exact>
        <h2>Watch</h2>
      </Route>
    </Router>
  );
};

export default App;
