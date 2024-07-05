import React from 'react';
import { Button, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenModalDelete } from '../../../../states/modules/document';
import { userRequest } from '../../../../requestMethods';
import styles from './style.module.scss'
import { Slide, ToastContainer, toast } from 'react-toastify';
import { requestGetAllPendingDocument } from '../../../../api/documents';
const ModalDeletePending = ({ idDelete, nameDelete }) => {
  
  const dispatch = useDispatch();
  const isShowModal = useSelector(state => state.document.modalDocumentDelete.isShowModalDelete);
  const name = nameDelete
  const handleCLoseModal = () => {
    dispatch(setOpenModalDelete(false));
    // dispatch(requestGetAllPendingDocument())

  };

  const handleOkModal = async () => {
    try {
      userRequest.delete(`/post/${idDelete}`);
      handleCLoseModal();
      
      dispatch(requestGetAllPendingDocument())      
      toast.success('Xóa tài liệu thành công ');
      // // Đặt thời gian chờ 2 giây trước khi tải lại trang
      // setTimeout(() => {
      //   // Tải lại trang sau 2 giây
      //   window.location.reload();
      // }, 2000);
    } catch (err) {
      toast.error('Xóa thất bại !');
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
        title="Xóa tài liệu đang chờ phê duyệt"
        open={isShowModal}
        onCancel={handleCLoseModal}
        footer={
          <>
          <button className={styles.btnDelete} onClick={handleOkModal}>Xóa</button>
          <button className={styles.btnCancelDelete} onClick={handleCLoseModal}>Hủy</button>
          </>
        }
      >
        <p>Bạn có chắc chắn muốn xóa tài liệu chờ phê duyệt 
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
export default ModalDeletePending;