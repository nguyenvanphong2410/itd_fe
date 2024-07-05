import React, { useEffect, useState } from "react";
import "./createCategory.scss";
import { useDispatch, useSelector } from "react-redux";
import { setCategoriesDataFilter, setCategoryActive, setOpenModalAddCategory, setOpenModalDelete, setOpenModalUpdateCategory } from "../../states/modules/category";
import styles from './style.module.scss';
import ModalAddCategory from "./components/modal/modalAdd";
import { Container } from "react-bootstrap";
import { Image, Select, Space, Table, Tooltip } from 'antd';
import { requestGetAllCategory } from "../../api/category";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import PaginationCategory from "./components/pagination/paginationCategory";
import InputSearchCategory from "./components/inputSearch/inputSearchCategory";
import SortIcon from "./components/sortIcon/sortIcon";
import SpinComponent from "../../components/spin";
import ModalDeleteCategory from "./components/modal/modalDelete";
import ModalUpdateCategory from "./components/modal/modalUpdateCategory";
const CreateCategory = () => {
  useEffect(() => {
    document.title = "Thể loại tài liệu";
  }, []);
  const dispatch = useDispatch();
  const listCategory = useSelector(state => state.category.listCategories);
  const isLoading = useSelector(state => state.category.isLoadingGetAllCategory);
  const filter = useSelector(state => state.category.dataFilter)
  const [idDelete, setIdDelete] = useState('');
  const [idEdit, setIdEdit] = useState('');
  const [nameDelete, setNameDelete] = useState('');
  const categories = listCategory.categories;

  useEffect(() => {
    dispatch(requestGetAllCategory())
  }, [])

  //onClickDelete
  const onClickDelete = async (id, name) => {
    setIdDelete(id);
    setNameDelete(name)
    dispatch(setOpenModalDelete(true));
  }

  //onClickEdit
  const onClickEdit = async (id, item) => {
    setIdEdit(id);
    dispatch(setCategoryActive(item))
    dispatch(setOpenModalUpdateCategory(true));
  }

  ///ant 
  const columns = [
    {
      title: 'STT',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Ảnh mô tả',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (text, record) =>
        <Image
          className={styles.imgThumbnail}
          src={record.thumbnail} alt="thumbnail"
          width={80} height={50}
        />
    },
    {
      title: 'Tên thể loại',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },

    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" className={styles.action}>
          <Tooltip title="Chỉnh sửa thông tin" >
            <EditOutlined className={styles.actionIconEdit} onClick={() => onClickEdit(record._id, record)} />
          </Tooltip>
          <Tooltip title="Xóa tài liệu" >
            <DeleteOutlined className={styles.actionIconDelete} onClick={() => onClickDelete(record._id, record.name)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const SpinComponentDelayed = () => (
    <div className="spin-container">
      <SpinComponent />
    </div>
  );

  const [showSpin, setShowSpin] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowSpin(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  const hanleClickTitleHeading = () => {
    dispatch(setCategoriesDataFilter({ ...filter, search: null }))
    dispatch(requestGetAllCategory())
  }
  return (
    <Container>
      <div className="createCategory">
        <div className={styles.headingWrapper}>
          <div className={styles.headingTitle}>
            <span >
              <svg className={styles.headingIcon} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                <g fill="currentColor">
                  <path d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z" />
                </g>
              </svg>
            </span>
            <span className={styles.title} onClick={hanleClickTitleHeading}>Thông tin thể loại tài liệu</span>
          </div>

          <div className={styles.headingOpption}>
            <span variant="success" onClick={() => dispatch(setOpenModalAddCategory(true))}>
              <a className={styles.addText}>+ Thêm mới</a>
            </span>
            <Select
              className={styles.headingSelectSort}
              defaultValue="Sắp xếp ..."
              options={[{ label: <SortIcon type="fullName" /> }]}
            />
            <InputSearchCategory listCategory={listCategory} />
          </div>
        </div>
        {showSpin && <SpinComponentDelayed />}
        {!isLoading && !showSpin && (
          <>
            <Table
              className={styles.tableWrap}
              columns={columns}
              dataSource={categories}
              pagination={false}
            />
            <PaginationCategory listCategory={listCategory} />
          </>
        )}
      </div>
      <ModalAddCategory />
      <ModalDeleteCategory
        idDelete={idDelete}
        name={nameDelete}
      />
      <ModalUpdateCategory
        idEdit={idEdit}
      />
    </Container>
  );
};

export default CreateCategory;
