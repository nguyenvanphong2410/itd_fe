import React from 'react';
import { Avatar, Button, Col, Collapse, Modal, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.scss'
import { Slide, ToastContainer, toast } from 'react-toastify';
import { setOpenModalDocumentOfName, setOpenModalDocumentOfNameAdmin } from '../../../../../states/modules/document';
import NoData from '../../../../../components/notData';
import { FieldTimeOutlined, FolderOpenFilled } from '@ant-design/icons';
import { dayjsFormatFromNow } from '../../../../../utils/dayjsFormat';
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';



const ModalDocumentOfNameAdmin = ({ nameClickAdmin, listDocumentOfNameAdmin }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isShowModalDocumentOfName = useSelector(state => state.document.modalDocumentOfNameAdmin.isShowModalDocumentOfNameAdmin);
  const documents = listDocumentOfNameAdmin?.documents

  const handleCLoseModal = () => {
    dispatch(setOpenModalDocumentOfNameAdmin(false));

  }
  const handleClickView = (id) => {
    navigate(`/post/${id}`);
  }
  return (
    <>

      <Modal
        title={
          <span className={styles.titleModal}>Tài liệu của <span className={styles.name}> {nameClickAdmin}</span> </span>
        }
        open={isShowModalDocumentOfName}
        onCancel={handleCLoseModal}
        footer={false}
        width={800}
      >
        <div className={styles.appointmentsWrapper}>
          <span className={styles.totalDocument}>Tổng số tài liệu của {nameClickAdmin} là {documents?.length} tài liệu</span>
          {
            documents?.length > 0 ?
              documents.map((item, index) =>
                <div key={index} className={styles.appointmentsList}>
                  <Collapse className={styles.appointmentCollapse} size="large"
                    items={[
                      {
                        label: <Row>
                          <Col span={20}>
                            <div className={styles.appointmentTimeWrapper}>
                              <FolderOpenFilled className={styles.iconRecentDocuments} />
                              <span className={styles.nameDocument}>{item.name}</span>
                            </div>
                            <div className={styles.appointmentUserCountWrapper}>

                              <span className={styles.info}>
                                <span className={styles.infoTimeWrap}>
                                  <span className={styles.infoTimeIcon}><FieldTimeOutlined /></span>
                                  <span className={styles.infoTimeText}>{dayjsFormatFromNow(item?.createdAt)}</span>
                                </span>
                                <span> / </span>
                                <span className={styles.infoViewWrap}>
                                  <span className={styles.infoViewIcon}><EyeOutlined /></span>
                                  <span className={styles.infoViewText}>{item?.view ? item?.view : 0} lượt xem</span>
                                </span>
                              </span>
                            </div>
                          </Col>
                          <Col span={4}>
                            <button className={styles.appointmentsBooking} >
                              <a className={styles.appointmentsBookingText}
                                onClick={() => handleClickView(item._id)}
                              >Xem</a>
                            </button>
                          </Col>

                        </Row>,
                        children:
                          <div className={styles.user_list} >
                            <span>Mô tả</span>
                            <p dangerouslySetInnerHTML={{ __html: item?.desc.replace(/<[^>]+>/g, ""), }} ></p>
                          </div>
                        ,
                      },
                    ]}
                  />
                </div>
              ) : <div className={styles.notDataSuggest}><NoData /></div>
          }
        </div>
      </Modal>
    </>
  );
};
export default ModalDocumentOfNameAdmin;