import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import styles from './style.module.scss';
import { requestGetAllDocument, requestGetDocuments, requestGetDocumentsChecked } from "../../../api/documents";
import { useDispatch, useSelector } from "react-redux";
import { setDataDocumentsCheckedFilter, setDataDocumentsFilter, setOpenModalDelete } from "../../../states/modules/document";
import ModalDelete from "./components/modalDelete/ModalDelete";
import { Button, Popover, Radio, Select, Tag, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined, FunnelPlotOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { Slide, ToastContainer, toast } from "react-toastify";
import InputSearchAdmin from "./components/inputSearchAdmin/inputSearchAdmin";
import SortIconDocumentAdmin from "./components/sortIconAdmin/sortIconAdmin";
import { Context } from "../../../context/Context";
import { publicRequest, userRequest } from "../../../requestMethods";
import MainHeading from "../../MainHeading/MainHeading";
import { dayjsFormatSort } from "../../../utils/dayjsFormat";
import PanigationAdminChecked from "./components/panigationAdminChecked/panigationAdminChecked";
import SpinComponent from "../../spin";

//Phong ưi
const CheckedDocumentAdmin = () => {
  const { user } = useContext(Context);

  const dispatch = useDispatch();
  const filter = useSelector(state => state.document.dataFilter)
  const isLoading = useSelector(state => state.document.isLoadingGetDocumentsChecked);
  const listDocumentChecked = useSelector(state => state.document.documentsChecked);
  const listDocument = listDocumentChecked.documents


  const [idDelete, setIdDelete] = useState('');
  const [nameDelete, setNameDelete] = useState('');
  const [categories, setCategories] = useState([]);
  const [comPareValueAdmin, setComPareValueAdmin] = useState('$gt');
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

  const onClickDelete = async (id, name) => {
    setIdDelete(id);
    setNameDelete(name)
    dispatch(setOpenModalDelete(true));
  }

  const onSearchAdmin = (value, _e, info) => {
    dispatch(setDataDocumentsCheckedFilter({ ...filter, number_view: value, compare_view: comPareValueAdmin }))
    dispatch(requestGetDocumentsChecked());
  };

  //hanleClickTitleHeading
  const hanleClickTitleHeading = () => {
    dispatch(setDataDocumentsCheckedFilter({}))
    dispatch(requestGetDocumentsChecked())
  }

  //Bỏ duyệt tài liệu
  const handleUpdatePending = async (id) => {
    try {
      await userRequest.put(`/post/updatedStatus/${id}`, {
        status: false,
      });
      toast.success('Bỏ duyệt thành công ');
      dispatch(requestGetDocumentsChecked())
    } catch (err) {
      toast.error('Bỏ duyệt thất bại !');
    }
  };

  useEffect(() => {
    document.title = user?.isAdmin ? "Tài liệu đã duyệt" : "IT Documents";
  }, []);

  useEffect(() => {
    dispatch(requestGetDocumentsChecked())
  }, [])

  useEffect(() => {
    const getCats = async () => {
      const res = await publicRequest.get("/category/all");
      setCategories(res.data.data.categories);
    };
    getCats();
  }, []);

  return (
    <>
      <ToastContainer
        transition={Slide}
        autoClose={2500}
        hideProgressBar={false}
      />
      <MainHeading />
      <div className="content read">
        <div className={styles.headingWrapper}>
          <div className={styles.headingTitle}>
            <span >
              <span >
                <svg className={styles.headingIcon} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 400 512">
                  <g fill="currentColor">
                    <path d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />                            </g>
                </svg>
              </span>
            </span>
            <span className={styles.title}>
              <span className={styles.titleLink} onClick={hanleClickTitleHeading}>Thông tin tài liệu đã duyệt</span>
            </span>
          </div>

          <span variant="success"> <Link to="/write" className={styles.addText}>+ Tạo mới tài liệu</Link> </span>

          <div className={styles.l}>
            <Popover placement="bottom" title={'Lọc theo lượt xem :'} trigger='click'
              content={
                <>
                  <div style={{ marginBottom: '12px' }}>
                    <Radio.Group
                      defaultValue="$gt" buttonStyle="solid"
                      value={comPareValueAdmin}
                      onChange={(e) => setComPareValueAdmin(e.target.value)}
                    >
                      <Radio.Button value="$eq">Bằng</Radio.Button>
                      <Radio.Button value="$gt">Lớn hơn</Radio.Button>
                      <Radio.Button value="$lt">Nhỏ hơn</Radio.Button>
                      <Radio.Button value="$gte">Lớn -& bằng </Radio.Button>
                      <Radio.Button value="$lte">Nhỏ -&- bằng </Radio.Button>
                    </Radio.Group>
                  </div>
                  <Search
                    className={styles.headingInputFilter}
                    allowClear enterButton="Lọc"
                    placeholder="Nhập số lượng sách cần lọc"
                    style={{ width: 470 }} onSearch={onSearchAdmin}
                  />
                </>
              }
            >
              <Button className={styles.headingFilter}>
                <span style={{ marginRight: '5px' }}>
                  <FunnelPlotOutlined className={styles.iconViewFilter} />
                </span>
                <span className={styles.textViewFilter}>Bộ lọc</span>
              </Button>
            </Popover>

          </div>


          <Select
            className={styles.headingSelectSort}
            placeholder={
              <span className={styles.placeholderSort}><span className={styles.textSort}>Sắp xếp tài liệu</span></span>
            }
            options={[
              {
                label: <><SortIconDocumentAdmin type="name" /> </>
              },
              {
                label: <><SortIconDocumentAdmin type="date" /> </>
              },
              {
                label: <> <SortIconDocumentAdmin type="view" /> </>
              },
            ]}
          />

          <Select
            className={styles.headingSelectSort}
            placeholder={
              <span className={styles.placeholderSort}> <span className={styles.textSort}>Chọn thể loại tài liệu</span></span>
            }
            style={{ width: 180 }}
            options={categories?.map((cat) => ({
              value: cat.name,
              label:
                <Link to={`/articles/category/${cat.slug}`}> {cat.name} </Link>
            }))}
          />

          <InputSearchAdmin />
        </div>
        {showSpin && <SpinComponentDelayed />}
        {!isLoading && !showSpin && (
          <table className={styles.tableDocumentWrap}>
            <thead>
              <tr >
                <td >STT</td>
                <td>Hình ảnh</td>
                <td>Tên tài liệu</td>
                <td>Đăng bởi</td>
                <td>Thể loại</td>
                <td>Tác giả</td>
                <td style={{ textAlign: 'center' }}>Lượt xem</td>
                <td style={{ textAlign: 'center' }}>Năm xuất bản</td>
                <td>Nhà xuất bản</td>
                <td>Thời gian đăng</td>
                <td style={{ textAlign: 'center' }}>Trạng thái</td>
                <td colspan="2" style={{ textAlign: 'center' }}> Hành động</td>
              </tr>
            </thead>
            <tbody>
              {listDocument?.map((post, index) => (
                <tr key={post._id}>
                  <td data-label="STT">{index + 1} </td>
                  <td data-label="Hình ảnh">
                    <img
                      style={{ width: "60px", height: "30px", objectFit: "cover" }}
                      src={post.photos[0]?.src || ''} alt="alt"
                    />
                  </td>
                  <td data-label="Tên tài liệu"> <Link className="linkTable" to={`/post/${post._id}`}> {post.name} </Link> </td>

                  <td data-label="Đăng bởi"> <Link className="linkTable" to={`/?user=${post.username}`}>{post.username} </Link> </td>

                  <td data-label="Thể loại"> <Link className="linkTable" to={`/articles/category/${post.category}`} >{post.category.replace(/-/g, ' ')} </Link>  </td>

                  <td data-label="Tác giả" ><span>{post?.author ? post?.author : <span className={styles.textUpdating}>- Đang cập nhật -</span>} </span> </td >

                  <td data-label="Lượt xem" style={{ textAlign: 'center' }}><span >{post.view}</span> </td >

                  <td data-label="Năm xuất bản" style={{ textAlign: 'center' }}> <span>{post.year}</span> </td >

                  <td data-label="Nhà xuất bản"><span>{post?.publisher ? post?.publisher : <span className={styles.textUpdating}>- Đang cập nhật -</span>} </span> </td >

                  <td data-label="Thời gian đăng" ><span>{dayjsFormatSort(post?.createdAt)}</span></td >
                  <Tooltip title="Tài liệu này đang trong trạng thái đã phê duyệt" color="green">
                    <Tag icon={<CheckCircleOutlined />} color="success"> Đã duyệt </Tag>
                  </Tooltip>
                  <td>
                    <div className={styles.btnApprove}>
                      <Tooltip title="Nhấn để bỏ duyệt tài liệu" color="#grey">
                        <Tag className={styles.tagHandle} color="grey" icon={<CloseCircleOutlined />}
                          onClick={() => handleUpdatePending(post._id)}
                        > Bỏ duyệt</Tag>
                      </Tooltip>
                    </div>
                  </td>

                  {(user?.isAdmin || post.username === user?.username) && (
                    <td className={styles.actionWrap}>
                      <Tooltip title="Chỉnh sửa thông tin" color='#2646ba'>
                        <Link to={`/post/edit/${post._id}`} > <EditOutlined className={styles.actionIconEdit} /> </Link>
                      </Tooltip>
                      <Tooltip title="Xóa tài liệu" color='red'>
                        <DeleteOutlined className={styles.actionIconDelete} onClick={() => onClickDelete(post._id, post.name)} />
                      </Tooltip>
                    </td>
                  )}

                </tr>
              ))}
            </tbody>
          </table>
        )}
        <PanigationAdminChecked listDocuments={listDocumentChecked} />
      </div>

      <ModalDelete
        idDelete={idDelete}
        name={nameDelete}
      />
    </>
  );
};

export default CheckedDocumentAdmin;
