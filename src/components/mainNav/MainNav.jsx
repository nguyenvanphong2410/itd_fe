import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { SvgMenu } from "../svgs/SvgMenu";
import ImgDefault from "../../assets/images/img_default.jpg";
import { Context } from "../../context/Context";
import logo from "../../assets/images/logo/logormbg.png"
import styles from './style.module.scss';
import { Input, List, Select } from 'antd';
import { Popover } from 'antd';
import "./mainNav.scss";
import { CheckCircleOutlined, FieldTimeOutlined, FilterOutlined, FunnelPlotOutlined, InfoCircleOutlined, LogoutOutlined, PicCenterOutlined } from "@ant-design/icons";
import InputSearch from "../../pages/home/components/inputSearch/inputSearch";
import { useDispatch, useSelector } from "react-redux";
import { requestGetAllDocument } from "../../api/documents";
import SortIconDocument from "../../pages/home/components/sortIcon/sortIcon";
import { Button, Card, Col, Empty, Image, Radio, Row, Tooltip } from 'antd';
import { setDataFilter } from "../../states/modules/document";
import { name } from "dayjs/locale/vi";
const { Search } = Input;

const MainNav = () => {
  const dispatchDocument = useDispatch();
  const listDocuments = useSelector(state => state.document.listDocuments);
  const [comPareValue, setComPareValue] = useState('$gt');
  const filter = useSelector(state => state.document.dataFilter)

  const documents = listDocuments.documents
  useEffect(() => {
    dispatchDocument(requestGetAllDocument())
  }, [])

  const { user, dispatch } = useContext(Context);
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const [keyword, setKeyword] = useState();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${keyword.trim().toLowerCase().replace(/\s/g, "+")}`);
  };

  const onSearch = (value, _e, info) => {
    dispatchDocument(setDataFilter({ ...filter, number_view: value, compare_view: comPareValue }))
    dispatchDocument(requestGetAllDocument());
  };

  //handleClickLogo
  const handleClickLogo = async () => {
    // window.scrollTo({ top: 0, behavior: "smooth" })
    dispatchDocument(setDataFilter())
    dispatchDocument(requestGetAllDocument());
  }
  const data = [
    'Racing car sprays burning ',
    'Racing car sprays burning ',
    'Japanese princess t',
    'Australian walks ',
  ];
  return (
    <nav className="mainNav">
      <div className="mainNav__sticky">
        {/* Top Bar */}
        <section className="mainNav__topBar" >
          <div className="mainNav__wrapper">
            <div className="mainNav__linksLeft">
              <NavLink to="/" className="mainNav__logo" onClick={handleClickLogo} >
                <span>
                  {/* {user?.isAdmin ? 'Admin' : "FITA Documents."} */}
                  {user?.isAdmin ? <h2>Admin</h2> : <img className={styles.logo} src={logo} alt="" />}
                </span>
              </NavLink>
              {user?.isAdmin && (
                <NavLink to="/overview" className="mainNav__linkAlt"> Tổng quan </NavLink>
              )}
              <Link to="/" className="mainNav__linkAlt"> Tài liệu </Link>
              {user?.isAdmin && (
                <NavLink to="/createCategory" className="mainNav__linkAlt"> Thể loại </NavLink>
              )}

              <NavLink to="/write" className="mainNav__linkAlt"> Tạo tài liệu </NavLink>

              {
                user?.isAdmin ? '' : <NavLink to="/intro" className="mainNav__linkAlt">Giới thiệu </NavLink>
              }


            </div>

            <div className={styles.mainNavRightOption}>
              {/* <form onSubmit={handleSubmit}>
                <div className="mainNav__search">
                  <Search placeholder="Tìm kiếm tài liệu" allowClear size="large" onChange={(e) => setKeyword(e.target.value)} />
                </div>
              </form> */}
              <div className={styles.optionRight}>
                <Popover placement="bottom" title={'Lọc theo lượt xem :'}
                  trigger='click'
                  content={
                    <>
                      <div style={{ marginBottom: '12px' }}>
                        <Radio.Group
                          defaultValue="$gt"
                          buttonStyle="solid"
                          value={comPareValue}
                          onChange={(e) => setComPareValue(e.target.value)}
                        >
                          <Radio.Button value="$eq">Bằng</Radio.Button>
                          <Radio.Button value="$gt">Lớn hơn</Radio.Button>
                          <Radio.Button value="$gte">Lớn hơn bằng</Radio.Button>
                          <Radio.Button value="$lt">Nhỏ hơn</Radio.Button>
                          <Radio.Button value="$lte">Nhỏ hơn bằng</Radio.Button>
                        </Radio.Group>
                      </div>
                      <Search
                        className={styles.headingInputFilter}
                        placeholder="Nhập số lượng sách cần lọc"
                        allowClear
                        enterButton="Lọc"
                        style={{
                          width: 470,
                        }}
                        onSearch={onSearch}
                      />
                    </>
                  }
                >
                  <Button className={styles.headingFilter}>
                    <span style={{ marginRight: '5px' }}>
                      <FunnelPlotOutlined className={styles.iconViewFilter} />
                    </span>
                    <span className={styles.textViewFilter}>Lượt xem</span>
                  </Button>
                </Popover>

                <Select
                  className={styles.headingSelectSort}
                  placeholder={
                    <span className={styles.placeholderSort}>
                      <PicCenterOutlined /> <span className={styles.textSort}> Sắp xếp tài liệu</span>
                    </span>}
                  options={[
                    {
                      label:
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512" style={{ marginTop: '-5px', marginRight: '10px', color: '#0f2f7f' }}>
                            <path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" />
                          </svg>
                          <SortIconDocument type="name" />
                        </>
                    },
                    {
                      label:
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512" style={{ marginTop: '-5px', marginRight: '10px', color: '#0f2f7f' }}>
                            <path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" />
                          </svg>
                          <SortIconDocument type="date" />
                        </>
                    },
                    {
                      label:
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512" style={{ marginTop: '-5px', marginRight: '10px', color: '#0f2f7f' }}>
                            <path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" />
                          </svg>
                          <SortIconDocument type="view" />
                        </>
                    },
                  ]}
                />

                <InputSearch />
              </div>
              {user ? (
                <>
                  <NavLink to="/settings" className="mainNav__profile">
                    <img src={user.profilePic ? user.profilePic : ImgDefault} alt="" />
                  </NavLink>
                  <Popover style={{ width: '50px' }} title={
                    // <div className={styles.popoverMainNavWrap}>
                    //   <div>
                    //     <Link to="/settings" className={styles.textMyInfo}>
                    //       <InfoCircleOutlined className={styles.iconInfo} /> Tài liệu chờ duyệt
                    //     </Link>
                    //   </div>
                    //   <div>
                    //     <Link to="/settings" className={styles.textMyInfo}>
                    //       <InfoCircleOutlined className={styles.iconInfo} /> Hồ sơ của bạn
                    //     </Link>
                    //   </div>

                    //   {/* <span className={styles.line}></span> */}
                    //   <div onClick={handleLogout} className={styles.textLogout}>
                    //     <LogoutOutlined className={styles.iconLogout} />
                    //     Đăng xuất
                    //   </div>
                    // </div>
                    <List
                      size="small"
                      children={
                        <div className={styles.popoverMainNavWrap}>
                          <List.Item>
                            <Link to="/pendingPost" className={styles.textMyInfo}>
                              <FieldTimeOutlined className={styles.iconPending} /> Tài liệu chờ duyệt
                            </Link>
                          </List.Item>
                          <List.Item>
                            <Link to="/checkedPost" className={styles.textMyInfo}>
                              <CheckCircleOutlined className={styles.iconChecked} /> Tài liệu đã duyệt
                            </Link>
                          </List.Item>
                          <List.Item>
                            <Link to="/settings" className={styles.textMyInfo}>
                              <InfoCircleOutlined className={styles.iconInfo} /> Hồ sơ của bạn
                            </Link>
                          </List.Item>
                          <List.Item>
                            <div onClick={handleLogout} className={styles.textLogout}>
                              <LogoutOutlined className={styles.iconLogout} />
                              Đăng xuất
                            </div>
                          </List.Item>
                        </div>
                      }
                    />
                  }>
                    <p className={styles.nameLogin}>
                      {user.username}
                    </p>
                  </Popover>

                </>
              ) : (
                <div className="mainNav__linksRight">
                  <NavLink to="/login" className="mainNav__linkAlt">Đăng nhập</NavLink>
                  <span>/</span>
                  <NavLink to="/register" className="mainNav__linkAlt">Đăng ký</NavLink>
                </div>
              )}
              {/* <NavLink to="/language" className="mainNav__language">EN</NavLink> */}
              {/* <div className="mainNav__icon mainNav__icon--menuMobile">
                <SvgMenu />
              </div> */}
            </div>
          </div>

          {/* Top BarMobile */}
          <div className="mainNav__topBarMobile">
            <div className="mainNav__wrapper">
              <div className="mainNav__linksCenter">
                <NavLink to="/" className="mainNav__linkAlt"> Trang chủ </NavLink>
                {/* <NavLink to="/write" className="mainNav__linkAlt"> Tạo tài liệu </NavLink> */}
                {user && (
                  <div className="mainNav__linkAlt" >
                    <NavLink to={`/users/`} > Người đăng </NavLink>
                  </div>
                )}
                <NavLink to="/pendingPost" className="mainNav__linkAlt"> Tài liệu đang chờ </NavLink>
                <NavLink to="/intro" className="mainNav__linkAlt"> Giới thiệu </NavLink>
              </div>
            </div>
          </div>
        </section>
        {/* Menu Bar */}
        <section className="mainNav__menuBar">
          <ul className="mainNav__mainLinks">
            <li className="mainNav__menuItem">
              <NavLink to={`/settings`} className="mainNav__link"> Hồ sơ của bạn </NavLink>
            </li>
            <li className="mainNav__menuItem">
              <NavLink to={`/users/`} className="mainNav__link"> Người đăng tài liệu</NavLink>
            </li>
            <li className="mainNav__menuItem">
              <NavLink to="/pendingPost" className="mainNav__link"> Tài liệu đang chờ của bạn</NavLink>
            </li>
            <li className="mainNav__menuItem">
              <NavLink to="/checkedPost" className="mainNav__link"> Tài liệu đã duyệt của bạn</NavLink>
            </li>
          </ul>
        </section>
      </div>
    </nav>
  );
};

export default MainNav;
