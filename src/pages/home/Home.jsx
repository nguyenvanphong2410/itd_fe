import { Link, useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";
import Pagination from "../../components/pagination/Pagination";
import { domainApi } from "../../requestMethods";
import { Context } from "../../context/Context";
import { useContext, useEffect, useState } from "react";
import { userRequest, publicRequest } from "../../requestMethods";
import ImgPlaceholder from "../../assets/images/placeholder.jpg";
import MainHeading from "../../components/MainHeading/MainHeading";
import { dayjsFormat, dayjsFormatFromNow, dayjsFormatSort } from "../../utils/dayjsFormat";
import styles from './style.module.scss';
import { requestGetAllDocument, requestGetAllDocumentNew, requestGetAllDocumentView, requestGetDocuments, requestUpdateViewPost } from "../../api/documents";
import { useDispatch, useSelector } from "react-redux";
import { setDataDocumentsFilter, setDataFilter, setOpenModalDelete } from "../../states/modules/document";
import ModalDelete from "./components/modalDelete/ModalDelete";
import { Button, Card, Col, FloatButton, Image, Popover, Radio, Row, Select, Tag, Tooltip } from "antd";
import {
  CheckCircleOutlined, CheckOutlined, ClockCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined, DownloadOutlined, EditOutlined,
  EyeOutlined, FieldTimeOutlined, FileDoneOutlined, FunnelPlotOutlined,
  PicCenterOutlined, PlusOutlined, ProfileOutlined, QuestionCircleOutlined,
  UserOutlined
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import SpinComponent from "../../components/spin";
import NoImage from "../../components/notImage";
import PaginationDocument from "./components/panigation/paginationDocument";
import InputSearch from "./components/inputSearch/inputSearch";
import NoData from "../../components/notData";
import SortIconDocument from "./components/sortIcon/sortIcon";
import { Slide, ToastContainer, toast } from "react-toastify";
import PaginationDocumentAdmin from "./components/panigationAdmin/paginationDocumentAdmin";
import InputSearchAdmin from "./components/inputSearchAdmin/inputSearchAdmin";
import SortIconDocumentAdmin from "./components/sortIconAdmin/sortIconAdmin";
const { Meta } = Card;

//Phong ưi
const Home = () => {
  const { user } = useContext(Context);

  const dispatch = useDispatch();

  const isLoading = useSelector(state => state.document.isLoadingGetAll);

  const filterDocuments = useSelector(state => state.document.dataDocumentsFilter)
  const filter = useSelector(state => state.document.dataFilter)

  const documentAll = useSelector(state => state.document.documents)
  const listDocuments = useSelector(state => state.document.listDocuments);
  const listDocumentsNew = useSelector(state => state.document.listDocumentsNew);
  const listDocumentsView = useSelector(state => state.document.listDocumentsView);

  const allDocuments = documentAll.documents
  const documents = listDocuments.documents
  const documentsNew = listDocumentsNew.documents
  const documentsView = listDocumentsView.documents

  useEffect(() => {
    dispatch(requestGetDocuments())
  }, [])

  useEffect(() => {
    dispatch(setDataFilter({ status_document: false }))
    dispatch(requestGetAllDocument())
  }, [])

  //Lấy ra tài liệu theo lượt xem status true
  useEffect(() => {
    dispatch(requestGetAllDocumentView())
  }, [])

  //Lấy ra tài liệu mới status true
  useEffect(() => {
    dispatch(setDataFilter({ ...filter, sort_by: 'view', sort_order: 'desc' }))
    dispatch(requestGetAllDocumentNew())
  }, [])

  const navigate = useNavigate();
  const [idDelete, setIdDelete] = useState('');
  const [nameDelete, setNameDelete] = useState('');
  const [keyword, setKeyword] = useState();

  const [categories, setCategories] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [gutter, setGutter] = useState([30, 30]);
  const [comPareValue, setComPareValue] = useState('$gt');
  const [comPareValueAdmin, setComPareValueAdmin] = useState('$gt');

  useEffect(() => {
    if (window.innerWidth < 576) {
      setGutter([20, 20])
    }
  }, [])

  useEffect(() => {
    document.title = user?.isAdmin ? "Tài liệu" : "IT Documents";
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowTable(true);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const getCats = async () => {
      const res = await publicRequest.get("/category/all");
      setCategories(res.data.data.categories);
    };
    getCats();
  }, []);

  const onClickDelete = async (id, name) => {
    setIdDelete(id);
    setNameDelete(name)
    dispatch(setOpenModalDelete(true));
  }

  const handleUpdateChecked = async (id) => {
    try {
      await userRequest.put(`/post/updatedStatus/${id}`, {
        status: true,
      });
      toast.success('Duyệt thành công ');
      dispatch(requestGetDocuments())

    } catch (err) {
      toast.error('Duyệt thất bại !');
    }
  };

  //Bỏ duyệt tài liệu
  const handleUpdatePending = async (id) => {
    try {
      await userRequest.put(`/post/updatedStatus/${id}`, {
        status: false,
      });
      toast.success('Bỏ duyệt thành công ');
      dispatch(requestGetDocuments())
    } catch (err) {
      toast.error('Bỏ duyệt thất bại !');
    }
  };


  //handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${keyword.trim().toLowerCase().replace(/\s/g, "+")}`);
  };

  //handleUpdateView
  const handleUpdateView = (id) => {
    dispatch(requestUpdateViewPost(id))
    return 0
  }

  const onSearch = (value, _e, info) => {
    dispatch(setDataFilter({ ...filter, number_view: value, compare_view: comPareValue }))
    dispatch(requestGetAllDocument());
  };

  const onSearchAdmin = (value, _e, info) => {
    dispatch(setDataDocumentsFilter({ ...filter, number_view: value, compare_view: comPareValueAdmin }))
    dispatch(requestGetDocuments());
  };

  //hanleClickTitleHeading
  const hanleClickTitleHeading = () => {
    dispatch(setDataDocumentsFilter({}))
    dispatch(requestGetDocuments())
  }
  return (
    <>
      <ToastContainer
        transition={Slide}
        autoClose={2500}
        hideProgressBar={false}
      />
      <MainHeading />
      {
        user.isAdmin ? <></> :
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
                      <Radio.Button value="$lt">Nhỏ hơn</Radio.Button>
                      <br />
                      <Radio.Button value="$gte">Lớn -& bằng </Radio.Button>
                      <Radio.Button value="$lte">Nhỏ -&- bằng </Radio.Button>
                    </Radio.Group>
                  </div>
                  <Search
                    className={styles.headingInputFilter}
                    placeholder="Nhập số lượng tài liệu cần lọc"
                    allowClear
                    enterButton="Lọc"
                    style={{ width: 200 }}
                    onSearch={onSearch}
                  />
                </>
              }
            >
              <Button className={styles.headingFilter}>
                <span style={{ marginRight: '5px' }}>
                  <FunnelPlotOutlined className={styles.iconViewFilter} />
                </span>
                <span className={styles.textViewFilter}></span>
              </Button>
            </Popover>
            <InputSearch />

            <Popover placement="bottom" title={''}
              trigger='click'

              content={
                <>
                  <Select
                    className={styles.headingSelectSort}
                    placeholder={
                      <span className={styles.placeholderSort}>
                        {/* <PicCenterOutlined />  */}
                        <span className={styles.textSort}>Sắp xếp tài liệu</span>
                      </span>}
                    options={[
                      {
                        label: <><SortIconDocument type="name" /> </>
                      },
                      {
                        label: <><SortIconDocument type="date" /> </>
                      },
                      {
                        label: <> <SortIconDocument type="view" /> </>
                      },
                    ]}
                  />
                </>
              }
            >
              <Button className={styles.headingFilter}>
                <span style={{ marginRight: '5px' }}>
                  <PicCenterOutlined className={styles.iconViewFilter} />
                </span>
                <span className={styles.textViewFilter}></span>
              </Button>
            </Popover>


          </div>
      }

      <Row className={styles.rowContainer} style={{ backgroundColor: '' }}>
        {
          user?.isAdmin ? <></> : <Col span={window.innerWidth <= 1440 ? 1 : 3} ></Col>
        }

        <Col span={user.isAdmin ? 24 : window.innerWidth <= 1440 ? 18 : 19}>

          <>
            {window.innerWidth <= 1440 &&

              <>
                <FloatButton.Group shape="circle" style={{ right: 24 }}>
                  {/* <FloatButton icon={<QuestionCircleOutlined />} /> */}

                  <Link to="/write"> <FloatButton icon={<PlusOutlined />} /> </Link>
                </FloatButton.Group>
              </>
            }

            <div className="content read">
              {
                user?.isAdmin ? <></> : <h2 className={styles.titleHome}>Tài liệu luôn cập nhật</h2>
              }
              {
                user?.isAdmin ?
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
                        <span className={styles.titleLink} onClick={hanleClickTitleHeading}>Thông tin tất cả tài liệu</span>
                      </span>
                    </div>

                    <span variant="success">
                      <Link to="/write" className={styles.addText}>+ Tạo mới tài liệu</Link>
                    </span>

                    <div className={styles.l}>
                      <Popover placement="bottom" title={'Lọc theo lượt xem :'}
                        trigger='click'

                        content={
                          <>
                            <div style={{ marginBottom: '12px' }}>
                              <Radio.Group
                                defaultValue="$gt"
                                buttonStyle="solid"
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
                              placeholder="Nhập số lượng sách cần lọc"
                              allowClear
                              enterButton="Lọc"
                              style={{ width: 470 }}
                              onSearch={onSearchAdmin}
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
                        <span className={styles.placeholderSort}>
                          {/* <PicCenterOutlined />  */}
                          <span className={styles.textSort}>Sắp xếp tài liệu</span>
                        </span>
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
                        <span className={styles.placeholderSort}>
                          {/* <PicCenterOutlined />  */}
                          <span className={styles.textSort}>Chọn thể loại tài liệu</span>
                        </span>
                      }
                      style={{ width: 180 }}
                      options={categories?.map((cat) => ({
                        value: cat.name,
                        label:
                          <Link to={`/articles/category/${cat.slug}`}>
                            {cat.name}
                          </Link>

                      }))}
                    />

                    <InputSearchAdmin />
                  </div>
                  :
                  <div className={styles.btnBigCreate}>
                    <Link to="/write" className="create-contact">
                      Tạo Tài Liệu
                    </Link>
                  </div>
              }

              {
                user?.isAdmin ? <></> :
                  <div className={styles.listCategory}>
                    <div className="categories">
                      {categories?.map((cat) => (
                        <span key={cat._id}>
                          <Link className="categories__link" to={`/articles/category/${cat.slug}`}>
                            {cat.name}
                          </Link>
                        </span>
                      ))}
                    </div>
                  </div>
              }
              <section className="contentProducts">
                <div className="k">
                  {!showTable && user?.isAdmin && <SpinComponent />}
                  {
                    user?.isAdmin ? (

                      showTable && (
                        <table className={styles.tableDocumentWrap}>
                          <thead>
                            <tr>
                              <td>STT</td>
                              <td>Hình ảnh</td>
                              <td>Tên tài liệu</td>
                              <td>Đăng bởi</td>
                              <td>Thể loại</td>
                              <td>Tác giả</td>
                              <td style={{ textAlign: 'center' }}>Lượt xem</td>
                              <td style={{ textAlign: 'center' }}>Năm sáng tác</td>
                              <td>Nhà xuất bản</td>
                              <td>Thời gian đăng</td>
                              <td style={{ textAlign: 'center' }}>Trạng thái</td>
                              <td colspan="2" style={{ textAlign: 'center' }}> Hành động</td>

                            </tr>
                          </thead>
                          <tbody>
                            {allDocuments.map((post, index) => (
                              <tr key={post._id}>
                                <td data-label="STT">
                                  <span>{index + 1}</span>
                                </td>
                                <td data-label="Hình ảnh">
                                  <span>
                                    <img
                                      style={{
                                        width: "60px",
                                        height: "30px",
                                        objectFit: "cover",
                                      }}
                                      src={post.photos[0]?.src || ImgPlaceholder}
                                      alt="alt"
                                    />
                                  </span>
                                </td>
                                <td data-label="Tên tài liệu">
                                  <span>
                                    <Link className="linkTable" to={`/post/${post._id}`}>
                                      {post.name}
                                    </Link>
                                  </span>
                                </td>
                                <td data-label="Đăng bởi">
                                  <span>
                                    <Link className="linkTable" to={`/?user=${post.username}`}>
                                      {post.username}
                                    </Link>
                                  </span>
                                </td>
                                <td data-label="Thể loại">
                                  <span>
                                    <Link className="linkTable" to={`/articles/category/${post.category}`} >
                                      {post.category.replace(/-/g, ' ')}
                                    </Link>
                                  </span>
                                </td>
                                <td data-label="Tác giả" >
                                  <span>{post?.author ? post?.author : <span className={styles.textUpdating}>- Đang cập nhật -</span>} </span>
                                </td >
                                <td data-label="Lượt xem" style={{ textAlign: 'center' }}>
                                  <span >{post.view}</span>
                                </td >
                                <td data-label="Năm sáng tác" style={{ textAlign: 'center' }}>
                                  <span>{post.year}</span>
                                </td >
                                <td data-label="Nhà xuất bản">
                                  <span>{post?.publisher ? post?.publisher : <span className={styles.textUpdating}>- Đang cập nhật -</span>} </span>
                                </td >
                                <td data-label="Thời gian đăng" >
                                  <span>{dayjsFormatSort(post?.createdAt)}</span>
                                </td >
                                {user.isAdmin && post.status === false && (
                                  <td style={{ textAlign: 'center' }}>
                                    <Tooltip title="Tài liệu này đang trong trạng thái chờ phê duyệt" color="#d49219">
                                      <Tag className={styles.tagStatusPending} icon={<ClockCircleOutlined />} color="warning">
                                        Chờ duyệt
                                      </Tag>
                                    </Tooltip>
                                  </td>
                                )}

                                {user.isAdmin && post.status === true && (
                                  <td style={{ textAlign: 'center' }}>
                                    <Tooltip title="Tài liệu này đang trong trạng thái đã phê duyệt" color="green">
                                      <Tag icon={<CheckCircleOutlined />} color="success">
                                        Đã duyệt
                                      </Tag>
                                    </Tooltip>
                                  </td>
                                )}
                                <td>
                                  <span>
                                    {post.status === false && user.isAdmin === true ? (
                                      <Tooltip title="Duyệt và xem tài liệu này" color="#8904B1">
                                        <Link to={`/post/${post._id}`}>
                                          <Tag className={styles.tagHandle} color="#8904B1" icon={<CheckOutlined />} onClick={
                                            () => handleUpdateChecked(post._id)
                                          }>Duyệt và xem</Tag>
                                        </Link>
                                      </Tooltip>
                                    ) : post.status === false ? (<Tag color="gold">gold</Tag>) :
                                      (
                                        <Tooltip title="Nhấn để bỏ duyệt tài liệu" color="#grey">
                                          <Tag className={styles.tagHandle} color="grey" icon={<CloseCircleOutlined />}
                                            onClick={() => handleUpdatePending(post._id)}
                                          >Bỏ phê duyệt</Tag>
                                        </Tooltip>
                                      )}
                                  </span>
                                </td>
                                {(user?.isAdmin || post.username === user?.username) && (
                                  <td className={styles.actionWrap}>
                                    {post.status === false && user.isAdmin === true ?
                                      <Tooltip title="Duyệt" color='#8904B1'>
                                        <FileDoneOutlined className={styles.actionIconHandleCheck} onClick={() => handleUpdateChecked(post._id)} />
                                      </Tooltip>
                                      :
                                      ''}

                                    <Tooltip title="Chỉnh sửa thông tin" color='#2646ba'>
                                      <Link to={`/post/edit/${post._id}`} >
                                        <EditOutlined className={styles.actionIconEdit} />
                                      </Link>
                                    </Tooltip>
                                    <Tooltip title="Xóa tài liệu" color='red'>
                                      <DeleteOutlined className={styles.actionIconDelete}
                                        onClick={() => onClickDelete(post._id, post.name)}
                                      />
                                    </Tooltip>

                                  </td>
                                )}
                                {!(user?.isAdmin || post.username === user?.username) && (
                                  <td></td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )
                    )
                      :
                      <div>
                        <div className="contentProducts__cards" >
                          {!isLoading ?
                            <div className={styles.container}>
                              <div className={styles.newDocumentWrap}>
                                <span className={styles.titleNewDocument}>Tài liệu mới </span>
                              </div>
                              <Row gutter={gutter}>
                                {
                                  documents?.length > 0 ?
                                    documents?.map((item, index) => {
                                      return (

                                        <Col key={index} xs={24} sm={24} md={12} lg={6}>
                                          <div>
                                            <Card
                                              className={item?.status === true ? styles.cardItem : styles.cardItemPending} style={{ width: window.innerWidth < 576 ? 300 : 250 }}
                                              cover={
                                                item?.photos[0]?.src ?
                                                  <Link to={item?.status === true ? `/post/${item._id}` : ''}>
                                                    <Image
                                                      onClick={() => handleUpdateView(item._id)}
                                                      className={item?.status === true ? '' : styles.itemCardPending}
                                                      height={170} width={window.innerWidth < 576 ? 300 : 250} src={item?.photos[0]?.src} preview={false} />
                                                  </Link>
                                                  : <NoImage />
                                              }
                                              actions={[
                                                <Tooltip title={`Tài liệu này có ${item.view} lượt xem`} color="purple">
                                                  <Link to={`/post/${item._id}`} onClick={() => handleUpdateView(item._id)}>
                                                    <EyeOutlined style={{ color: 'purple', fontSize: '18px' }} key="view" />
                                                    <span style={{ color: 'purple', fontSize: '18px', marginLeft: '2px' }}>
                                                      {item.view}
                                                    </span>
                                                  </Link>
                                                </Tooltip>,
                                                user?.isAdmin || item.username === user?.username &&
                                                <Tooltip title="Chỉnh sửa thông tin tài liệu" color="#2646ba">
                                                  <Link to={`/post/edit/${item._id}`} >
                                                    <EditOutlined style={{ color: 'blue', fontSize: '20px' }} key="edit" />
                                                  </Link>
                                                </Tooltip>,

                                                user?.isAdmin || item.username === user?.username &&
                                                <Tooltip title="Xóa tài liệu" color="red">
                                                  <DeleteOutlined theme="outlined" style={{ color: 'red', fontSize: '20px' }} key="delete"
                                                    onClick={() => onClickDelete(item._id, item.name)}
                                                  /></Tooltip>
                                                ,
                                                <Tooltip title="Tải xuống tài liệu" color="green">
                                                  <a
                                                    href={`http://localhost:5000/files/${item.pdf}`}
                                                    download
                                                    target="_blank"
                                                  >
                                                    <DownloadOutlined style={{ color: 'green', fontSize: '20px' }} />
                                                  </a>
                                                </Tooltip>,


                                              ]}
                                            >
                                              <Meta
                                                title={
                                                  <div>
                                                    <Tooltip title={item?.name} color="#2646ba" >
                                                      <Link to={item?.status === true ? `/post/${item._id}` : ''}
                                                        onClick={() => handleUpdateView(item._id)}
                                                        className={styles.nameDocumentCard}
                                                      >{item?.name}
                                                      </Link>
                                                    </Tooltip>
                                                    <div className={styles.itemCard} >
                                                      <ProfileOutlined className={styles.iconOriginCard} />
                                                      <span className={styles.textOriginCard}> Thể loại: </span>
                                                      <span className={styles.infoOriginCard}> {item?.category.replace(/-/g, ' ')}</span>
                                                    </div>
                                                    <div className={styles.itemCard}>
                                                      <span >
                                                        <FieldTimeOutlined className={styles.iconOriginCard} />
                                                        <span className={styles.textOriginCard}> Thời gian: </span>
                                                        <span className={styles.infoOriginCard}> {dayjsFormatFromNow(item?.createdAt)}</span>
                                                      </span>
                                                    </div>

                                                    <div className={styles.itemCard} >
                                                      <UserOutlined className={styles.iconOriginCard} />
                                                      <span className={styles.textOriginCard}> Người đăng: </span>
                                                      <span className={styles.infoOriginCard}> {item?.username}</span>

                                                    </div>
                                                    <div className={styles.itemCard} >
                                                      {/* <FieldTimeOutlined className={styles.iconOriginCard} /> */}
                                                      {/* <span className={styles.textOriginCard}> Trạng thái: </span> */}
                                                      {/* <span className={styles.infoOriginCard}> {item?.username}</span> */}
                                                      <Tag icon={<CheckCircleOutlined />} style={{ marginLeft: '30px', marginTop: '16px' }} color="success">Đã được kiểm duyệt</Tag>
                                                    </div>
                                                    {/* <Tooltip title={<>Mô tả tài liệu: <p dangerouslySetInnerHTML={{ __html: item?.desc.replace(/<[^>]+>/g, ""), }}></p> </>} color="#2646ba">
                                                  <div className={styles.itemCard}>
                                                    <p dangerouslySetInnerHTML={{ __html: item?.desc.replace(/<[^>]+>/g, ""), }} ></p>
                                                  </div>
                                                </Tooltip> */}
                                                  </div>
                                                }
                                              />
                                            </Card>
                                          </div >
                                        </Col>
                                      )
                                    }) : <NoData />
                                }
                              </Row>
                            </div> :
                            <SpinComponent />

                          }

                          {
                            user.isAdmin ? <></> :
                              <PaginationDocument listDocuments={listDocuments} />
                          }
                        </div>

                        <div className="contentProducts__cards" >
                          {!isLoading ?
                            <div className={styles.container}>
                              <div className={styles.newDocumentWrap}>
                                <span className={styles.titleHotDocument}>Tài liệu nổi bật </span>
                              </div>
                              <Row gutter={gutter}>
                                {
                                  documentsView?.length > 0 ?
                                    documentsView?.map((item, index) => {
                                      return (

                                        <Col key={index} xs={24} sm={24} md={12} lg={6}>

                                          <Card
                                            className={item?.status === true ? styles.cardItemNew : styles.cardItemPending} style={{ width: window.innerWidth < 576 ? 300 : 250 }}
                                            cover={
                                              item?.photos[0]?.src ?
                                                <Link to={item?.status === true ? `/post/${item._id}` : ''}>
                                                  <Image
                                                    onClick={() => handleUpdateView(item._id)}
                                                    className={item?.status === true ? '' : styles.itemCardPending}
                                                    height={170} width={window.innerWidth < 576 ? 300 : 250} src={item?.photos[0]?.src} preview={false} />
                                                </Link>
                                                : <NoImage />
                                            }
                                            actions={[
                                              <Tooltip title={`Tài liệu này có ${item.view} lượt xem`} color="purple">
                                                <Link to={`/post/${item._id}`} onClick={() => handleUpdateView(item._id)}>

                                                  <EyeOutlined style={{ color: 'purple', fontSize: '18px' }} key="view" />
                                                  <span style={{ color: 'purple', fontSize: '18px', marginLeft: '2px' }}>
                                                    {item.view}

                                                  </span>
                                                </Link>
                                              </Tooltip>,
                                              user?.isAdmin || item.username === user?.username &&
                                              <Tooltip title="Chỉnh sửa thông tin tài liệu" color="#2646ba">
                                                <Link to={`/post/edit/${item._id}`} >
                                                  <EditOutlined style={{ color: 'blue', fontSize: '20px' }} key="edit" />
                                                </Link>
                                              </Tooltip>,

                                              user?.isAdmin || item.username === user?.username &&
                                              <Tooltip title="Xóa tài liệu" color="red">
                                                <DeleteOutlined theme="outlined" style={{ color: 'red', fontSize: '20px' }} key="delete"
                                                  onClick={() => onClickDelete(item._id, item.name)}
                                                /></Tooltip>
                                              ,
                                              <Tooltip title="Tải xuống tài liệu" color="green">
                                                <a
                                                  href={`http://localhost:5000/files/${item.pdf}`}
                                                  download
                                                  target="_blank"
                                                >
                                                  <DownloadOutlined style={{ color: 'green', fontSize: '20px' }} />
                                                </a>
                                              </Tooltip>,


                                            ]}
                                          >
                                            <Meta
                                              title={
                                                <div>
                                                  <Tooltip title={item?.name} color="#2646ba" >
                                                    <Link to={item?.status === true ? `/post/${item._id}` : ''}
                                                      onClick={() => handleUpdateView(item._id)}
                                                      className={styles.nameDocumentCard}
                                                    >{item?.name}
                                                    </Link>
                                                  </Tooltip>
                                                  <div className={styles.itemCard} >
                                                    <ProfileOutlined className={styles.iconOriginCard} />
                                                    <span className={styles.textOriginCard}> Thể loại: </span>
                                                    <span className={styles.infoOriginCard}> {item?.category.replace(/-/g, ' ')}</span>
                                                  </div>
                                                  <div className={styles.itemCard}>
                                                    <span >
                                                      <FieldTimeOutlined className={styles.iconOriginCard} />
                                                      <span className={styles.textOriginCard}> Thời gian: </span>
                                                      <span className={styles.infoOriginCard}> {dayjsFormatFromNow(item?.createdAt)}</span>
                                                    </span>
                                                  </div>

                                                  <div className={styles.itemCard} >
                                                    <UserOutlined className={styles.iconOriginCard} />
                                                    <span className={styles.textOriginCard}> Người đăng: </span>
                                                    <span className={styles.infoOriginCard}> {item?.username}</span>

                                                  </div>
                                                  <div className={styles.itemCard} >
                                                    {/* <FieldTimeOutlined className={styles.iconOriginCard} /> */}
                                                    {/* <span className={styles.textOriginCard}> Trạng thái: </span> */}
                                                    {/* <span className={styles.infoOriginCard}> {item?.username}</span> */}
                                                    <Tag icon={<CheckCircleOutlined />} style={{ marginLeft: '30px', marginTop: '16px' }} color="success">Đã được kiểm duyệt</Tag>
                                                  </div>
                                                  {/* <Tooltip title={<>Mô tả tài liệu: <p dangerouslySetInnerHTML={{ __html: item?.desc.replace(/<[^>]+>/g, ""), }}></p> </>} color="#2646ba">
                                                  <div className={styles.itemCard}>
                                                    <p dangerouslySetInnerHTML={{ __html: item?.desc.replace(/<[^>]+>/g, ""), }} ></p>
                                                  </div>
                                                </Tooltip> */}
                                                </div>
                                              }
                                            />
                                          </Card>
                                        </Col>
                                      )
                                    }) : <NoData />

                                }
                              </Row>
                            </div> :
                            <SpinComponent />
                          }

                        </div>
                      </div>

                  }

                </div>
                {showTable && user.isAdmin && (
                  <PaginationDocumentAdmin listDocuments={documentAll} />
                )
                }
              </section>
            </div >

          </>

          <ModalDelete
            idDelete={idDelete}
            name={nameDelete}
          />
        </Col>
        {
          user?.isAdmin ? <></> : <Col span={window.innerWidth <= 1440 ? 3 : 3}></Col>
        }

      </Row>
    </>
  );
};

export default Home;
