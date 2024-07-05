import React from 'react';
import { Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
// import { userRequest } from '../../../../requestMethods';
// import { Context } from '../../../../context/Context';
import styles from './styleModalDelete.module.scss'
import { Slide, ToastContainer, toast } from 'react-toastify';
import { setOpenModalDelete } from '../../../../states/modules/category';
import { handleDeleteCategory } from '../../../../api/category';

const ModalDeleteCategory = ({ idDelete, name }) => {
  const isShowModal = useSelector(state => state.category.modalCategoryDelete.isShowModalDelete);

  const dispatch = useDispatch();
  const handleCLoseModal = () => {
    dispatch(setOpenModalDelete(false));
  };

  const handleOkModal = async () => {
    try {
      await dispatch(handleDeleteCategory(idDelete));
      handleCLoseModal();
      
      // Hiện toast message
      toast.success('Xóa thành công  ', name);
  
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
        onOk={handleOkModal}
        onCancel={handleCLoseModal}
        footer={
          <>
          <button className={styles.btnDelete} onClick={handleOkModal}>Xóa</button>
          <button className={styles.btnCancelDelete} onClick={handleCLoseModal}>Hủy</button>
          </>
        }
      >
        <p>Bạn có muốn xóa thể loại tài liệu
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
export default ModalDeleteCategory;