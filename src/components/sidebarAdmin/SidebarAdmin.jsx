import React, { useContext, useEffect, useState } from 'react';
import { BorderlessTableOutlined, CheckCircleOutlined, CheckSquareOutlined, CompressOutlined, FieldTimeOutlined, FileOutlined, FileTextOutlined, FullscreenOutlined, HolderOutlined, InfoCircleOutlined, LogoutOutlined, MehOutlined, PieChartOutlined, ProfileOutlined, SmileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Image, Layout, Menu, Popover, Tooltip, theme } from 'antd';
// import MainNav from '../mainNav/MainNav';
import styles from './style.module.scss'
import { Context } from '../../context/Context';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../assets/images/logo/logormbg.png"
import { Routes, Route } from "react-router-dom";
import PageNotFound from '../pageNotFound/PageNotFound';
import Home from '../../pages/home/Home';
import Intro from '../../pages/intro/Intro';
import Contacts from '../../pages/contacts/Contacts';
import Login from '../../pages/login/Login';
import Register from '../../pages/register/Register';
import Write from '../../pages/write/Write';
import EditPost from '../../pages/editPost/EditPost';
import Post from '../../pages/post/Post';
import Settings from '../../pages/settings/Settings';
import OverView from '../../pages/overview/OverView';
import Articles from '../../pages/articles/Articles';
import PendingPost from '../../pages/pendingPost/PendingPost';
import Users from '../../pages/users/Users';
import UserOfficer from '../../pages/users/components/pages/userOfficer/UserOfficer';
import CreateCategory from '../../pages/createCategory/CreateCategory';
import CheckedPost from '../../pages/checkedPost/CheckedPost';
import CheckedDocumentAdmin from './checkedDocument/CheckedDocuments'
import PendingDocumentAdmin from './pendingDocument/PendingDocuments';
import UserStudent from '../../pages/users/components/pages/userStudent/UserStudent';
import UserOther from '../../pages/users/components/pages/userOther/UserOther';


const SidebarAdmin = () => {
    const { Header, Content, Footer, Sider } = Layout;
    function getItem(label, key, icon, children) {
        return {
            key,
            icon,
            children,
            label,
        };
    }
    const navigate = useNavigate();

    const items = [
        // <Image />,
        getItem(<Link to="/" onClick={() => handleBreadcrumb('Tổng quan')}>Tổng quan</Link>, '1', <PieChartOutlined />),
        getItem('Quản lý người dùng', 'sub1', <UserOutlined />, [
            getItem(<Link to="/users" onClick={() => handleBreadcrumb('Tất cả người dùng')}>Tất cả</Link>, '3', <TeamOutlined />),
            getItem(<Link to="/officer" onClick={() => handleBreadcrumb('Cán bộ')}>Cán bộ</Link>, '4', <MehOutlined />),
            getItem(<Link to="/student" onClick={() => handleBreadcrumb('Sinh viên')}>Sinh viên</Link>, '5', <SmileOutlined />),
            getItem(<Link to="/other" onClick={() => handleBreadcrumb('Người dùng kháchác')}>Người dùng khác</Link>, '6', <BorderlessTableOutlined />),
        ]),
        getItem('Quản lý tài liệu', 'sub2', <FileTextOutlined />, [
            getItem(<Link to="/documents" onClick={() => handleBreadcrumb('Tất cả tài liệu')}>Tất cả tài liệu</Link>, '7', <HolderOutlined />),
            getItem(<Link to="/pendingPostAdmin" onClick={() => handleBreadcrumb('Tài liệu chờ')}>Tài liệu chờ</Link>, '8', <FieldTimeOutlined />),
            getItem(<Link to="/checkedPostAdmin" onClick={() => handleBreadcrumb('Tài liệu đã duyệt')}>Tài liệu đã duyệt</Link>, '9', <CheckCircleOutlined />),
        ]),
        getItem(<Link to="/createCategory" onClick={() => handleBreadcrumb('Quản lý thể loại')}>Quản lý thể loại</Link>, '10', <ProfileOutlined />),
    ];
    const [titleBreadcrumb, setTitleBreadcrumb] = useState('Tổng quan');

    const handleBreadcrumb = (name) => {
        setTitleBreadcrumb(name)
    }
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const { user, dispatch } = useContext(Context);
    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
    };

    const [fullscreen, setFullscreen] = useState(false);

    const handleToggleFullscreen = () => {
        const elem = document.documentElement; // Lấy thẻ gốc của trang (html)

        if (!fullscreen) {
            // Phóng to toàn bộ trang
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { // Firefox
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, and Opera
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { // IE/Edge
                elem.msRequestFullscreen();
            }
        } else {
            // Thoát chế độ fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
        }

        setFullscreen(!fullscreen);
    };


    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >

            <Sider width={220} className={styles.siderWrap} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <Image className={styles.logo} src={logo} preview={false} />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} >
                    <div className={styles.headerAdminWrap} >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginRight: '20px' }}>
                            <Tooltip title="Mở rộng màn hình">
                                <CompressOutlined className={styles.iconFullScreen} onClick={handleToggleFullscreen} />
                            </Tooltip>
                            <Avatar src={user.profilePic ? user.profilePic : <UserOutlined />} size="large" />
                            <div className={styles.nameAdminWrap}>
                                <Popover style={{ width: '50px' }} title={
                                    <div className={styles.popoverMainNavWrap}>
                                        <div> <Link to="/settings" className={styles.textMyInfo}>
                                            <InfoCircleOutlined className={styles.iconInfo} /> Xem hồ sơ
                                        </Link></div>
                                        <span className={styles.line}></span>
                                        <div onClick={handleLogout} className={styles.textLogout}>
                                            <LogoutOutlined className={styles.iconLogout} />
                                            Đăng xuất
                                        </div>
                                    </div>
                                }>
                                    <p style={{ color: "black", marginLeft: "8px" }}>
                                        {user.username}
                                    </p>
                                </Popover>
                            </div>
                        </div>

                    </div>

                </Header>
                <Content
                    style={{
                        margin: '0 16px',

                    }}
                >
                    <Breadcrumb style={{ margin: '16px 0', }}> Trang chủ / {titleBreadcrumb} </Breadcrumb>
                    <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG, }} >
                        <Routes>
                            <Route path="*" element={<PageNotFound />} />
                            <Route path="/documents" element={user ? <Home /> : <Login />} />

                            <Route path="/search" element={<Home />} />
                            <Route path="/intro" element={<Intro />} />
                            <Route path="/contacts" element={user ? <Contacts /> : <Login />} />
                            <Route path="/write" element={user ? <Write /> : <Register />} />
                            <Route path="/register" element={user ? <Home /> : <Register />} />
                            <Route path="/login" element={user ? <OverView /> : <Login />} />

                            <Route
                                path="/post/edit/:id"
                                element={user ? <EditPost /> : <Register />}
                            />
                            <Route path="/post/:id" element={user ? <Post /> : <Register />} />
                            <Route path="/settings" element={user ? <Settings /> : <Register />} />
                            <Route path="/" element={user ? <OverView /> : <Login />} />
                            <Route
                                path="/articles/category/:slug"
                                element={user ? <Articles /> : <Register />}
                            />
                            <Route
                                path="/pendingPost"
                                element={user ? <PendingPost /> : <Register />}
                            />
                            <Route
                                path="/checkedPostAdmin"
                                element={user ? <CheckedDocumentAdmin /> : <Register />}
                            />
                            <Route
                                path="/pendingPostAdmin"
                                element={user ? <PendingDocumentAdmin /> : <Register />}
                            />
                            <Route
                                path="/checkedPost"
                                element={user ? <CheckedPost /> : <Login />}
                            />
                            <Route path="/users" element={user ? <Users /> : <Register />} />
                            <Route path="/officer" element={user ? <UserOfficer /> : <Register />} />
                            <Route path="/student" element={user ? <UserStudent /> : <Register />} />
                            <Route path="/other" element={user ? <UserOther /> : <Register />} />

                            <Route
                                path="/createCategory"
                                element={user ? <CreateCategory /> : <Register />}
                            />
                        </Routes>

                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Kho tài liệu cho sinh viên khoa Công nghệ thông tin ©2023 - Nguyễn Văn Phong - 646502 - K64ATTT
                </Footer>
            </Layout>
        </Layout>
    );
};
export default SidebarAdmin;