// import "./styles/globals.scss";
import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// components
import MainNav from "./components/mainNav/MainNav";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";
import PageNotFound from "./components/pageNotFound/PageNotFound";
import Footer from "./components/footer/Footer";
import Intro from "./pages/intro/Intro";

// pages
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Settings from "./pages/settings/Settings";
import Write from "./pages/write/Write";
import EditPost from "./pages/editPost/EditPost";
import Contacts from "./pages/contacts/Contacts";
import Articles from "./pages/articles/Articles";
import CreateCategory from "./pages/createCategory/CreateCategory";

import { Context } from "./context/Context";
import Post from "./pages/post/Post";
import PendingPost from "./pages/pendingPost/PendingPost";
import Users from "./pages/users/Users";
import OverView from "./pages/overview/OverView";
import SidebarAdmin from "./components/sidebarAdmin/SidebarAdmin";
import { Col, Row } from "antd";
import styles from './styles/styleApp/styles.modules.scss'
import CheckedPost from "./pages/checkedPost/CheckedPost";

function App() {
  const { user } = useContext(Context);
  // Trong component AuthorPage
  const [scrollPosition, setScrollPosition] = useState(0);

  // Sử dụng useEffect để theo dõi vị trí cuộn
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  // Trong component AuthorPage
  const showBackToTopButton = scrollPosition > 250; // Hiển thị nút khi cuộn xuống 300px
  return (
    <BrowserRouter>
      <div style={{ overflow: 'hidden' }}>
        {
          user?.isAdmin ?
            <SidebarAdmin />
            :
            <>
              <ScrollToTop />

              <MainNav />
              {/* <Row className={styles.rowContainerGeneral} style={{backgroundColor: ''}}>
              <Col span={3}></Col>
              <Col span={18}> */}
              <Routes>
                <Route path="*" element={<PageNotFound />} />
                <Route path="/" element={user ? <Home /> : <Login />} />
                <Route path="/search" element={<Home />} />
                <Route path="/intro" element={<Intro />} />
                <Route path="/contacts" element={user ? <Contacts /> : <Login />} />
                <Route path="/register" element={user ? <Home /> : <Register />} />
                <Route path="/login" element={user ? <Home /> : <Login />} />
                <Route path="/write" element={user ? <Write /> : <Login />} />
                <Route
                  path="/post/edit/:id"
                  element={user ? <EditPost /> : <Login />}
                />
                <Route path="/post/:id" element={user ? <Post /> : <Login />} />
                <Route path="/settings" element={user ? <Settings /> : <Login />} />
                <Route path="/overview" element={user ? <OverView /> : <Login />} />
                <Route
                  path="/articles/category/:slug"
                  element={user ? <Articles /> : <Login />}
                />
                <Route
                  path="/pendingPost"
                  element={user ? <PendingPost /> : <Login />}
                />
                <Route
                  path="/checkedPost"
                  element={user ? <CheckedPost /> : <Login />}
                />
                <Route path="/users" element={user ? <Users /> : <Login />} />
                <Route
                  path="/createCategory"
                  element={user?.isAdmin ? <CreateCategory /> : <PageNotFound />}
                />
              </Routes>
              {/* </Col>
              <Col span={3}></Col>
            </Row> */}
              {showBackToTopButton && (
                <div style={{
                  position: 'fixed',
                  bottom: '130px',
                  height: '60px',
                  width: '60px',
                  right: '30px',
                  background: '#104c91',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  borderRadius: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  boxShadow: 'rgba(0, 0, 0, 0.3) 0px 7px 29px 0px',
                  zIndex: 11111,
                }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <svg style={{
                    color: '#ffffff',
                    fontWeight: '600',
                    width: '30px',
                    height: '3em',
                  }} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                    <g fill="currentColor">
                      <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
                    </g>
                  </svg>
                </div>
              )}

            </>
        }

        {
          user?.isAdmin ?
            <></>
            :
            <Footer />

        }
      </div>

    </BrowserRouter>
  );
}

export default App;
