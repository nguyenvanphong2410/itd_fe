import React from 'react';
import { Button, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenModalDelete } from '../../../../../states/modules/document';
// import { Context } from '../../../../context/Context';
import styles from './style.module.scss'
import { Slide, ToastContainer, toast } from 'react-toastify';
import { userRequest } from '../../../../../requestMethods';
const ModalDelete = ({ idDelete, name }) => {
  const isShowModal = useSelector(state => state.document.modalDocumentDelete.isShowModalDelete);

  const dispatch = useDispatch();
  const handleCLoseModal = () => {
    dispatch(setOpenModalDelete(false));
  };

  const handleOkModal = async () => {
    try {
      userRequest.delete(`/post/${idDelete}`);
      handleCLoseModal();
      
      // Hiện toast message
      toast.success('Xóa thành công tài liệu ', name);
  
      // Đặt thời gian chờ 2 giây trước khi tải lại trang
      setTimeout(() => {
        // Tải lại trang sau 2 giây
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <>
      <ToastContainer
        transition={Slide}
        autoClose={2500}
        hideProgressBar={false}
      />
      <Modal
        title="Xóa tài liệu"
        open={isShowModal}
        onCancel={handleCLoseModal}
        footer={
          <>
          <button className={styles.btnDelete} onClick={handleOkModal}>Xóa</button>
          <button className={styles.btnCancelDelete} onClick={handleCLoseModal}>Hủy</button>
          </>
        }
      >
        <p>Bạn có chắc chắn muốn xóa tài liệu
          <span className={styles.nameDelete}>
            {name}
          </span>
          <span className={styles.iconDelete}>
            ?
          </span>
        </p>
      </Modal>
    </>
  );
};
export default ModalDelete;