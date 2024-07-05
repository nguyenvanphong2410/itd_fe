import { Link } from "react-router-dom";
import useSWR from "swr";
import Loading from "../../components/loading/Loading";
import EmptyResults from "../../components/emptyResults/EmptyResults";
import { domainApi } from "../../requestMethods";
import ImgDefault from "../../assets/images/img_default.jpg";
import { userRequest } from "../../requestMethods";
import { Context } from "../../context/Context";
import { useContext, useEffect, useState } from "react";
import styles from './style.module.scss'
import { Avatar, Card, Col, Modal, Row, Switch, Tag, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, EllipsisOutlined, EyeOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { useDispatch, useSelector } from "react-redux";
import { setDataDocumentOfNameAdminFilter, setDataDocumentOfNameFilter, setOpenModalDocumentOfName, setOpenModalDocumentOfNameAdmin } from "../../states/modules/document";
import { requestGetAllDocumentOfName, requestGetAllDocumentOfNameAdmin } from "../../api/documents";
import ModalDocumentOfName from "./components/modal/modalDocumentOfName/modalDocumentOfName";
import ModalDocumentOfNameAdmin from "./components/modal/modalDocumentOfNameAdmin/modalDocumentOfNameAdmin";
import { requestGetAllUser } from "../../api/user";
import PaginationUser from "./components/pagination/paginationUser";
import InputSearchUser from "./components/inputSearch/inputSearchUser";
import NoData from "../../components/notData";
import SpinComponent from "../../components/spin";
import { Slide, ToastContainer, toast } from "react-toastify";
import { setDataFilterUser } from "../../states/modules/user";
const { Meta } = Card;
const Users = () => {

  const dispatch = useDispatch();
  const filter = useSelector(state => state.user.dataFilterUser)
  const isLoading = useSelector(state => state.document.isLoadingGetAllDocumentOfName);
  const isLoadingListUser = useSelector(state => state.user.isLoadingGetAllUser);
  const usersList = useSelector(state => state.user.listUsers);
  const listUsers = usersList.users
  const listDocumentOfName = useSelector(state => state.document.listDocumentsDocumentOfName);
  const listDocumentOfNameAdmin = useSelector(state => state.document.listDocumentsDocumentOfNameAdmin);
  const documents = listDocumentOfName.documents
  const [nameClick, setNameClick] = useState(null);
  const [nameClickAdmin, setNameClickAdmin] = useState(null);

  const SpinComponentDelayed = () => (
    <SpinComponent />
  );

  const [showSpin, setShowSpin] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSpin(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    dispatch(requestGetAllUser())
  }, [])

  useEffect(() => {
    dispatch(setDataDocumentOfNameFilter({ name_user: nameClick }))
    dispatch(requestGetAllDocumentOfName())
  }, [nameClick])

  useEffect(() => {
    dispatch(setDataDocumentOfNameAdminFilter({ name_user: nameClickAdmin }))
    dispatch(requestGetAllDocumentOfNameAdmin())
  }, [nameClickAdmin])

  const onClickName = async (nameOnClick) => {
    setNameClick(nameOnClick)
    dispatch(setOpenModalDocumentOfName(true));
  }

  //onClickNameAdmin
  const onClickNameAdmin = async (nameOnClickAdmin) => {
    setNameClickAdmin(nameOnClickAdmin)
    dispatch(setOpenModalDocumentOfNameAdmin(true));
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idDelete, setIdDelete] = useState(null);
  const [nameDelete, setNameDelete] = useState(null);

  useEffect(() => {
    document.title = "Tất cả người dùng";
  }, []);
  const { user } = useContext(Context);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(`${domainApi}/user/all`, fetcher);
  if (error) return <div className="error">Failed to load</div>;

  const users = data;

  const handleDelete = async (id) => {
    try {
      await userRequest.delete(`/user/deleteByAdmin/${id}`, {
        data: { _id: id },
      });
      toast.success('Xóa thành công người dùng');
      dispatch(requestGetAllUser())
    } catch (err) {
      console.log(err);
    }
  };

  const showModal = (idDelete, name) => {
    setIdDelete(idDelete)
    setNameDelete(name)
    setIsModalOpen(true);
  };
  const handleOk = () => {

    if (idDelete !== null) {
      handleDelete(idDelete)
    }
    setIsModalOpen(false);
    dispatch(requestGetAllUser())
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //hanleClickTitleHeading
  const hanleClickTitleHeading = () => {
    dispatch(setDataFilterUser({ ...filter, search: null }))
    dispatch(requestGetAllUser())
  }

  //Thay đổi trạng thái
  const handleChangeChecked = async (id, statusUser) => {
    try {

      await userRequest.put(`/user/updatedStatusUser/${id}`, {
        status: !statusUser,
      });

      toast.success('Thay đổi trạng thái thành công');
      dispatch(requestGetAllUser())

    } catch (err) {
      toast.error('Thay đổi trạng thái thất bại!');
    }
  };

  return (
    <>
      <Row className={styles.rowContainer} style={{ backgroundColor: '' }}>
        {
          user?.isAdmin ? <></> : <Col span={window.innerWidth <= 1440 ? 1 : 3} ></Col>
        }

        <Col span={user.isAdmin ? 24 : window.innerWidth <= 1440 ? 17 : 19}>
          {data ? (
            users.length > 0 ? (
              <>
                <div className="content read">
                  {
                    user.isAdmin ?
                      <div className={styles.headingWrapper}>
                        <div className={styles.headingTitle}>
                          <span >
                            <span >
                              <svg className={styles.headingIcon} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                <g fill="currentColor">
                                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                                </g>
                              </svg>
                            </span>
                          </span>
                          <span className={styles.title}>
                            <p className={styles.titleLink} to="/users" onClick={hanleClickTitleHeading}>Thông tin tất cả người dùng</p>
                          </span>
                        </div>
                        <div className={styles.headingOpption}>
                          <InputSearchUser usersList={usersList} />
                        </div>
                      </div>
                      :
                      <></>
                  }

                  {
                    user?.isAdmin ?
                      <>
                        <ModalDocumentOfNameAdmin
                          nameClickAdmin={nameClickAdmin}
                          listDocumentOfNameAdmin={listDocumentOfNameAdmin}

                        />
                        {
                          listUsers?.length > 0 ?
                            <>
                              {showSpin && <SpinComponentDelayed />}
                              {!isLoadingListUser && !showSpin && (
                                <table style={{ marginBottom: "32px" }}>
                                  <thead>
                                    <tr>
                                      <td>STT</td>
                                      <td>Hình ảnh</td>
                                      <td>Tên hiển thị</td>
                                      <td>Họ tên đầy đủ</td>
                                      <td>Mã số</td>
                                      <td>Tên lớp</td>
                                      <td>Email</td>
                                      <td>Địa chỉ</td>
                                      <td>Vai trò</td>
                                      <td>Tài liệu</td>
                                      <td colspan="2" style={{ textAlign: 'center' }}> Hành động</td>

                                    </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      listUsers.map((userData, index) => (
                                        <tr key={userData._id}>
                                          <td data-label="STT"><span>{index + 1}</span></td>
                                          <td data-label="Hình ảnh">
                                            <span>
                                              <img className={styles.avtUser} src={userData.profilePic ? userData.profilePic : ImgDefault} alt="alt" />
                                            </span>
                                          </td>
                                          <td data-label="Tên thành viên">
                                            <span>
                                              {userData.username}
                                            </span>
                                          </td>
                                          <td>{userData?.fullName ? userData?.fullName : <span className={styles.textUpdating}>- Đang cập nhật -</span>}</td>
                                          <td>{userData?.mssv ? userData?.mssv : <span className={styles.textUpdating}>- Không có -</span>}</td>
                                          <td>{userData?.class ? userData?.class : <span className={styles.textUpdating}>{userData?.option === '1' ? 'Đang cập nhật' : '- Không có -'}</span>}</td>
                                          <td data-label="Email"><span className={styles.textEmail}>{userData.email}</span></td>
                                          <td>{userData?.address ? userData?.address : <span className={styles.textUpdating}>- Đang cập nhật -</span>}</td>
                                          <td data-label="Vai trò">
                                            <span>
                                              {
                                                userData.isAdmin ? <Tag color="red">Admin</Tag> :
                                                  userData?.option === '1' ? <Tag color="blue">Sinh viên</Tag> :
                                                    userData?.option === '2' ? <Tag color="orange">Cán bộ</Tag> :
                                                      userData?.option === '3' ? <Tag color="green">Người dùng</Tag> : <Tag color="green">Người dùng</Tag>
                                              }
                                            </span>
                                          </td>

                                          <td data-label="Tài liệu">
                                            <span className={styles.btnWrapView}>
                                              <Tooltip title={`Xem tài liệu của ${userData.username} `} color="#2646ba">
                                                <Tag className={styles.btn}  color="#2646ba" icon={<EyeOutlined />}
                                                  onClick={() => onClickNameAdmin(userData.username)}
                                                >Xem</Tag>
                                              </Tooltip>
                                            </span>
                                          </td>
                                          <td>
                                            {
                                              userData?.isAdmin ? <></>
                                                :
                                                <>
                                                  <Tooltip
                                                    title={`Tài khoản của ${userData.fullName} đang ${Boolean(userData?.status) === true ? 'hoạt động' : 'khóa'} `}
                                                    color={`${Boolean(userData?.status) === true ? 'green' : 'orange'} `}
                                                  >
                                                    <Switch
                                                      checked={Boolean(userData?.status)}
                                                      className={styles.btnChangeStatus}
                                                      size="small"
                                                      onChange={() => handleChangeChecked(userData?._id, Boolean(userData?.status))}
                                                    />
                                                  </Tooltip>
                                                </>
                                            }
                                          </td>
                                          {(user?.isAdmin) ? (
                                            <>

                                              <td className={userData?.isAdmin === true ? "hide" : "actions"}>
                                                <div className={styles.actionWrap}  >
                                                  <Tooltip title={`Xóa người dùng ${userData.username} `} color="red">
                                                    <DeleteOutlined className={styles.actionIconDelete}
                                                      onClick={() => showModal(userData._id, userData.username)}
                                                    />
                                                  </Tooltip>
                                                </div>
                                              </td>
                                            </>
                                          ) : (
                                            <td></td>
                                          )}
                                        </tr>
                                      ))
                                    }


                                  </tbody>
                                </table>
                              )
                              }
                            </>
                            : <NoData />
                        }
                      </>

                      : <>

                        <div className={styles.container}>
                          <div className={styles.headingUserWrapper}>
                            <div className={styles.headingTitle}>
                              <span className={styles.titleNewDocument}><UserOutlined />
                                <span className={styles.textUser} onClick={hanleClickTitleHeading}>Người đăng tài liệu</span>
                              </span>
                            </div>
                            <div className={styles.headingOpption}>

                              <InputSearchUser usersList={usersList} />
                            </div>
                          </div>
                          {showSpin && <SpinComponentDelayed />}
                          {!isLoadingListUser && !showSpin && (
                            <Row gutter={[20, 7]}>

                              {
                                listUsers?.filter((item) => item.username !== 'admin')
                                  .map((item, index) => {
                                    return (
                                      <Col key={index} xs={24} sm={12} md={12} lg={6}>

                                        <Card
                                          className={styles.cardItem}
                                          key={index}
                                          style={{ width: 290, marginTop: 16 }}
                                          actions={[
                                            // <Link to={`/?user=${item.username}`}>

                                            <Tag color="#2646ba" icon={<EyeOutlined />}
                                              onClick={() => onClickName(item.username)}
                                            >Xem tài liệu của
                                              <span className={styles.userNameText}>{item.fullName}</span>
                                            </Tag>
                                            // </Link>

                                          ]}
                                        >

                                          <Meta
                                            avatar={<Avatar size="large" src={item?.profilePic} icon={<UserOutlined />} />}
                                            title={item.fullName}
                                            description={
                                              <div>
                                                {
                                                  item?.isAdmin ? <Tag color="red">Admin</Tag> :
                                                    item?.option === '1' ? <Tag color="blue">Sinh viên</Tag> :
                                                      item?.option === '2' ? <Tag color="orange">Cán bộ</Tag> :
                                                        item?.option === '3' ? <Tag color="green">Người dùng</Tag> : <Tag color="green">Người dùng</Tag>
                                                }
                                                <div>
                                                  <span style={{ fontSize: '14px', color: '#898989', fontWeight: 600 }}>Mã số: </span>
                                                  <span style={{ fontSize: '14px', color: '#2646ba' }}>{item.mssv ? item.mssv : <span style={{ fontSize: '14px', color: '#898989' }}>Không có</span>}</span>
                                                </div>
                                                <div>
                                                  <span style={{ fontSize: '14px', color: '#898989', fontWeight: 600 }}> </span>
                                                  <span style={{ fontSize: '14px', color: '#2646ba' }}>{item.email}</span>
                                                </div>
                                              </div>
                                            }
                                          />
                                        </Card>
                                      </Col>
                                    )
                                  })
                              }
                            </Row>
                          )}
                        </div>


                      </>
                  }
                </div>
                <ToastContainer
                  transition={Slide}
                  autoClose={2500}
                  hideProgressBar={false}
                />
                <Modal
                  title="Xóa người dùng ?" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                  footer={
                    <>
                      <button className={styles.btnDelete}
                        onClick={handleOk}
                      >Xóa</button>
                      <button className={styles.btnCancelDelete}
                        onClick={handleCancel}
                      >Hủy</button>
                    </>
                  }
                >
                  <p>Bạn có chắc chắn muốn xóa người dùng
                    <span className={styles.nameDelete}>
                      {nameDelete}
                    </span>
                    <span className={styles.iconDelete}>
                      ?
                    </span>
                  </p>
                </Modal>
              </>
            ) : (
              <EmptyResults />
            )
          ) : (
            <Loading />
          )}

          {
            user.isAdmin ?
              <></>
              :
              <ModalDocumentOfName
                nameClick={nameClick}
                listDocumentOfName={listDocumentOfName}
              />
          }
          <PaginationUser usersList={usersList} />
        </Col>
        {
          user?.isAdmin ? <></> : <Col span={window.innerWidth <= 1440 ? 4 : 3}></Col>
        }
      </Row>
    </>
  );
};

export default Users;
