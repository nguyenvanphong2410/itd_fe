import { Link } from "react-router-dom";
import useSWR from "swr";
// import { domainApi } from "../../requestMethods";
// import { userRequest } from "../../requestMethods";
// import { Context } from "../../context/Context";
import { useContext, useEffect, useState } from "react";
import styles from './style.module.scss'
import { useDispatch, useSelector } from "react-redux";
import { requestGetAllDocumentOfName, requestGetAllDocumentOfNameAdmin } from "../../../../../api/documents";
import { Slide, ToastContainer, toast } from "react-toastify";
import { domainApi, userRequest } from "../../../../../requestMethods";
import { Context } from "../../../../../context/Context";
import { setDataFilterOfficer, setDataFilterUser } from "../../../../../states/modules/user";
import { requestGetAllOfficer, requestGetAllUser } from "../../../../../api/user";
import SpinComponent from "../../../../../components/spin";
import { Modal, Switch, Tag, Tooltip } from "antd";
import ImgDefault from "../../../../../assets/images/img_default.jpg";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import InputSearchOfficer from "./components/inputSearch/inputSearchOfficer";
import PaginationOfficer from "./components/pagination/paginationOfficer";
import { setDataDocumentOfNameAdminFilter, setOpenModalDocumentOfNameAdmin } from "../../../../../states/modules/document";
import ModalDocumentOfNameAdmin from "../../modal/modalDocumentOfNameAdmin/modalDocumentOfNameAdmin";

const UserOfficer = () => {

  const dispatch = useDispatch();
  const filter = useSelector(state => state.user.setDataFilterOfficer)
  const officers = useSelector(state => state.user.listOfficer);
  const listDocumentOfNameAdmin = useSelector(state => state.document.listDocumentsDocumentOfNameAdmin);
  const listOfficer = officers.users;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idDelete, setIdDelete] = useState(null);
  const [nameDelete, setNameDelete] = useState(null);
  const [nameClickAdmin, setNameClickAdmin] = useState(null);
  const [showSpin, setShowSpin] = useState(true);

  const SpinComponentDelayed = () => (
    <div className="spin-container">
      <SpinComponent />
    </div>
  );
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSpin(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    dispatch(requestGetAllOfficer())
  }, [])
  
  useEffect(() => {
    dispatch(setDataDocumentOfNameAdminFilter({ name_user: nameClickAdmin }))
    dispatch(requestGetAllDocumentOfNameAdmin())
  }, [nameClickAdmin])

  useEffect(() => {
    document.title = "Cán bộ";
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
      dispatch(requestGetAllOfficer())
    } catch (err) {
      console.log(err);
    }
  };
  //showModal
  const showModal = (idDelete, name) => {
    setIdDelete(idDelete)
    setNameDelete(name)
    setIsModalOpen(true);
  };

  //handleOk
  const handleOk = () => {

    if (idDelete !== null) {
      handleDelete(idDelete)
    }
    setIsModalOpen(false);
    dispatch(requestGetAllOfficer())
  };

  //handleCancel
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //hanleClickTitleHeading
  const hanleClickTitleHeading = () => {
    dispatch(setDataFilterOfficer({ ...filter, search: null }))
    dispatch(requestGetAllOfficer())
  }

  //onClickNameAdmin
  const onClickNameAdmin = async (nameOnClickAdmin) => {
    setNameClickAdmin(nameOnClickAdmin)
    dispatch(setOpenModalDocumentOfNameAdmin(true));
  }

  //Thay đổi trạng thái
  const handleChangeChecked = async (id, statusUser) => {
    try {
      await userRequest.put(`/user/updatedStatusUser/${id}`, {
        status: !statusUser,
      });
      toast.success('Thay đổi trạng thái thành công');
      dispatch(requestGetAllOfficer())
    } catch (err) {
      toast.error('Thay đổi trạng thái thất bại!');
    }
  };

  return (
    <>
      <div className="content read">
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
              <p className={styles.titleLink} to="/users" onClick={hanleClickTitleHeading}>Thông tin cán bộ</p>
            </span>
          </div>

          <div className={styles.headingOpption}>

            <InputSearchOfficer usersList={officers} />
          </div>
        </div>
        {showSpin && <SpinComponentDelayed />}
        {!showSpin && (
          <table style={{ marginBottom: "32px" }}>
            <thead>
              <tr>
                <td>STT</td>
                <td>Hình ảnh</td>
                <td>Tên hiển thị</td>
                <td>Họ tên đầy đủ</td>
                <td>Mã số cán bộ</td>
                <td>Email</td>
                <td>Địa chỉ</td>
                <td>Vai trò</td>
                <td>Tài liệu</td>
                <td colspan="2" style={{ textAlign: 'center' }}> Hành động</td>

              </tr>
            </thead>
            <tbody>
              {
                listOfficer?.map((userData, index) => (
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
                    <td data-label="Email"><span className={styles.textEmail}>{userData.email}</span></td>
                    <td>{userData?.address ? userData?.address : <span className={styles.textUpdating}>- Đang cập nhật -</span>}</td>
                    <td data-label="Vai trò"> <span> <Tag color="orange">Cán bộ</Tag></span> </td>
                    <td data-label="Tài liệu">
                      <span className={styles.btnWrapView}>
                        <Tooltip title={`Xem tài liệu của ${userData.username} `} color="#2646ba">
                          <Tag color="#2646ba" icon={<EyeOutlined />}
                            onClick={() => onClickNameAdmin(userData.username)}
                          >Xem</Tag>
                        </Tooltip>
                      </span>
                    </td>
                    <td>
                      {
                        userData?.isAdmin ? <></>
                          :
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
                      }
                    </td>
                    {(user?.isAdmin) ? (
                      <td className={userData?.isAdmin === true ? "hide" : "actions"}>
                        <div className={styles.actionWrap}  >
                          <Tooltip title={`Xóa người dùng ${userData.username} `} color="red">
                            <DeleteOutlined className={styles.actionIconDelete}
                              onClick={() => showModal(userData._id, userData.username)}
                            />
                          </Tooltip>
                        </div>
                      </td>
                    ) : (
                      <td></td>
                    )}
                  </tr>
                ))
              }
            </tbody>
          </table>
        )}
      </div>
      <PaginationOfficer usersList={officers} />
      <ToastContainer transition={Slide} autoClose={2500} hideProgressBar={false} />
      <ModalDocumentOfNameAdmin
        nameClickAdmin={nameClickAdmin}
        listDocumentOfNameAdmin={listDocumentOfNameAdmin}

      />
      <Modal
        title="Xóa người dùng ?" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
        footer={
          <>
            <button className={styles.btnDelete} onClick={handleOk}>Xóa</button>
            <button className={styles.btnCancelDelete} onClick={handleCancel}>Hủy</button>
          </>
        }
      >
        <p>Bạn có chắc chắn muốn xóa người dùng
          <span className={styles.nameDelete}> {nameDelete}</span>
          <span className={styles.iconDelete}> ? </span>
        </p>
      </Modal>
    </>
  );
};

export default UserOfficer;
