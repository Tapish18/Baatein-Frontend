import Layout from "./components/Layout";
import ChatPlayGround from "./components/ChatPlayGround";
import Home from "./pages/Home";
import Info from "./pages/Info";
import NotFoundPage from "./pages/NotFoundPage";
import ChatingArea from "./pages/chats";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
function App() {
  return (
    <Layout>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/chatApp" element={<ChatPlayGround />}></Route>
            <Route path="/info" element={<Info />}></Route>
            <Route path="/chats" element={<ChatingArea />}></Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </Provider>
    </Layout>
  );
}

export default App;
