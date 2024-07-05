import { Link, useLocation } from "react-router-dom";
import useSWR from "swr";
import Loading from "../../components/loading/Loading";
import Pagination from "../../components/pagination/Pagination";
import EmptyResults from "../../components/emptyResults/EmptyResults";
import { domainApi } from "../../requestMethods";
import { Context } from "../../context/Context";
import { useContext, useEffect, useState } from "react";
import { userRequest } from "../../requestMethods";
import ImgPlaceholder from "../../assets/images/placeholder.jpg";
import { Button, Card, Col, Image, Row, Tag, Tooltip } from "antd";
import styles from "./style.module.scss"
import { CheckCircleOutlined, CheckOutlined, ClockCircleOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined, FieldTimeOutlined, ProfileOutlined, UserOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import { dayjsFormatFromNow, dayjsFormatSort } from "../../utils/dayjsFormat";
import NoData from "../../components/notData";
import NoImage from "../../components/notImage";
import ModalDeleteArticles from "./components/modalDeleteArtiles/ModalDeleteArticles";
import { setOpenModalDelete } from "../../states/modules/document";
import { useDispatch } from "react-redux";
import SpinComponent from "../../components/spin";
import { Slide, ToastContainer, toast } from "react-toastify";
import { requestUpdateViewPost } from "../../api/documents";


const Articles = () => {
  const dispatch = useDispatch();
  // const [nameCategory, setNameDelete] = useState('');
  const { user } = useContext(Context);
  const { search, pathname } = useLocation();
  const cat = pathname.split("/")[3];
  const subCat = pathname.split("/")[4];
  const pagePath = search.split("=")[1] || 1;
  const [gutter, setGutter] = useState([30, 30]);
  const [idDelete, setIdDelete] = useState('');
  const [nameDelete, setNameDelete] = useState('');
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
    if (window.innerWidth < 576) {
      setGutter([20, 20])
    }
  }, [])
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(
    subCat
      ? `${domainApi}/post/all?cat=${subCat}&page=${pagePath}&num_results_on_page=3`
      : cat
        ? `${domainApi}/post/all?cat=${cat}&page=${pagePath}&num_results_on_page=3`
        : search
          ? `${domainApi}/post/all${search}&num_results_on_page=3`
          : `${domainApi}/post/all?num_results_on_page=3`,
    fetcher
  );
  if (error) return <div className="error">Failed to load</div>;

  const posts = data?.posts;

  const page = data?.page;
  const totalPages = data?.total_pages;
  const handleDelete = async (id) => {
    try {
      await userRequest.delete(`/post/${id}`, {
        data: { username: user.username },
      });
      window.location.replace("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await userRequest.put(`/post/updatedStatus/${id}`, {
        status: true,
      });
      // alert("Đã xác nhận");
      toast.success('Duyệt thành công ');
    } catch (err) {
      console.log(err);
    }
  };
  const onClickDelete = async (id, name) => {
    setIdDelete(id);
    setNameDelete(name)
    dispatch(setOpenModalDelete(true));
  }

  //handleUpdateView
  const handleUpdateView = (id) => {
    dispatch(requestUpdateViewPost(id))
    return 0
  }

  return (
    <>
      <ToastContainer
        transition={Slide}
        autoClose={2500}
        hideProgressBar={false}
      />
      <Row className={styles.rowContainer} style={{ backgroundColor: '' }}>
        {
          user?.isAdmin ? <></> : <Col span={window.innerWidth <= 1440 ? 1 : 3} ></Col>
        }

        <Col span={user.isAdmin ? 24 : window.innerWidth <= 1440 ? 18 : 20}>
          {data ? (
            posts.length > 0 ? (
              <>
                <div className="content read">
                  {
                    user?.isAdmin ?
                      <>

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
                            <span className={styles.title}>Thông tin tài liệu thuộc thể loại
                              <span className={styles.nameCategory}>
                                {posts[0].category.replace(/-/g, ' ')}
                              </span>
                            </span>
                          </div>

                          <div className={styles.headingOpption}>
                            <span variant="success"
                            // onClick={() => dispatch(setOpenModalAddCategory(true))}
                            >
                              <Link to="/write" className={styles.addText}>+ Tạo mới tài liệu</Link>
                            </span>
                            {/* <Select
                        className={styles.headingSelectSort}
                        defaultValue="Sắp xếp ..."
                        options={[{ label: <SortIcon type="fullName" /> }]}
                      />
                      <InputSearchCategory 
                      // listCategory={listCategory} 
                      /> */}
                          </div>
                        </div>
                        {/* <h2>Tài liệu thuộc thể loại {posts[0].category.replace(/-/g, ' ')} </h2> */}
                        {/* {showSpin && <SpinComponentDelayed />}
                        {showSpin && ( */}
                        <table>
                          <thead>
                            <tr>
                              <td>STT</td>
                              <td>Hình ảnh</td>
                              <td>Tên bài viết</td>
                              <td>Đăng bởi</td>
                              <td>Tác giả</td>
                              <td style={{ textAlign: 'center' }}>Lượt xem</td>
                              <td>Thể loại</td>
                              <td>Nhà xuất bản</td>
                              <td>Thời gian đăng</td>
                              <td>Năm xuất bản</td>
                              <td>Trạng thái</td>
                              <td colspan="2" style={{ textAlign: 'center' }}> Hành động</td>

                            </tr>
                          </thead>
                          <tbody>
                            {posts.map((post, index) => (
                              <tr key={post._id}>
                                <td data-label="STT">
                                  <span>{index + 1}</span>
                                </td>
                                <td data-label="Hình ảnh">
                                  <span>
                                    <img
                                      style={{
                                        width: "100px", height: "50px",
                                        objectFit: "cover"
                                      }}
                                      src={post.photos[0]?.src || ImgPlaceholder}
                                      alt="alt"
                                    />
                                  </span>
                                </td>
                                <td data-label="Tên bài viết">
                                  <span>{post.name}</span>
                                </td>
                                <td data-label="Đăng bởi">
                                  <span>
                                    {/* <Link
                                      className="linkTable"
                                      to={`/?user=${post.username}`}
                                    > */}
                                    {post.username}
                                    {/* </Link> */}
                                  </span>
                                </td>
                                <td data-label="Tác giả" ><span>{post?.author ? post?.author : <span className={styles.textUpdating}>- Đang cập nhật -</span>} </span> </td >
                                <td data-label="Lượt xem" style={{ textAlign: 'center' }}><span >{post.view}</span> </td >
                                {/* <td data-label="Năm xuất bản" style={{ textAlign: 'center' }}> <span>{post.year}</span> </td > */}

                                <td data-label="Thể loại"> {post?.category?.replace(/-/g, ' ')} </td>

                                <td data-label="Nhà xuất bản"><span>{post?.publisher ? post?.publisher : <span className={styles.textUpdating}>- Đang cập nhật -</span>} </span> </td >
                                <td data-label="Thời gian đăng" ><span>{dayjsFormatSort(post?.createdAt)}</span></td >

                                <td data-label="Năm sáng tác">
                                  <span>{post.year}</span>
                                </td>
                                {user.isAdmin && post.status === false && (
                                  <td>
                                    <Tag className={styles.tagStatusPending} icon={<ClockCircleOutlined />} color="warning">
                                      Chờ duyệt
                                    </Tag>
                                  </td>
                                )}

                                {user.isAdmin && post.status === true && (
                                  <td >
                                    <Tag icon={<CheckCircleOutlined />} color="success">
                                      Đã duyệt
                                    </Tag>
                                  </td>
                                )}
                                <td data-label="">
                                  <span>
                                    {post.status === false && user.isAdmin === true ? (
                                      <Link to={`/post/${post._id}`}>
                                        <Link to={`/post/${post._id}`}>
                                          <Tag color="#8904B1" icon={<CheckOutlined />} onClick={() => handleUpdate(post._id)}>Duyệt và xem</Tag>
                                        </Link>
                                      </Link>
                                    ) : (
                                      <Link to={`/post/${post._id}`}>
                                        <Link to={`/post/${post._id}`}>
                                          <Tag color="#2db7f5" icon={<EyeOutlined />}> Xem tài liệu</Tag>
                                        </Link>
                                      </Link>
                                    )}
                                  </span>
                                </td>

                                {(user?.isAdmin || post.username === user?.username) && (
                                  <td className={styles.actionWrap}>
                                    <Link to={`/post/edit/${post._id}`} className="edit">
                                      <EditOutlined className={styles.actionIconEdit} />
                                    </Link>
                                    <div
                                      onClick={() => onClickDelete(post._id, post.name)}
                                    >
                                      <DeleteOutlined className={styles.actionIconDelete}
                                      // onClick={() => handleDelete(post._id)}
                                      />
                                    </div>
                                  </td>
                                )}
                                {!(user?.isAdmin || post.username === user?.username) && (
                                  <td></td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {/* )} */}
                      </>
                      :
                      <div>
                        <div className={styles.container}>
                          <div className={styles.newDocumentWrap}>
                            <span className={styles.titleNewDocument}>Tài liệu thuộc thể loại {posts[0].category.replace(/-/g, ' ')}

                            </span>
                          </div>
                          {showSpin && <SpinComponentDelayed />}
                          {!showSpin && (
                            <Row gutter={gutter}>
                              {
                                posts?.length ?
                                  posts?.filter((post) => post.status === true)
                                    .map((item, index) => {
                                      return (

                                        <Col key={index} xs={24} sm={12} md={8} lg={6}>

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
                                                <Link to={`/post/${item._id}`} onClick={() => handleUpdateView(item._id)} >

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
                                                  // onClick={() => handleShowModalDelete(item)} 
                                                  onClick={() => onClickDelete(item._id, item.name)}
                                                /></Tooltip>
                                              ,
                                              <Tooltip title="Tải xuống tài liệu" color="green">
                                                <a
                                                  href={`http://localhost:5000/files/${item.pdf}`}
                                                  download
                                                  target="_blank"
                                                // onClick={(e) => e.stopPropagation()}
                                                >
                                                  {/* Sử dụng thuộc tính download của thẻ <a> */}
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
                                                      className={styles.nameDocumentCard}
                                                    >{item?.name}
                                                    </Link>
                                                  </Tooltip>
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
                                                    <ProfileOutlined className={styles.iconOriginCard} />
                                                    <span className={styles.textOriginCard}> Thể loại: </span>
                                                    <span className={styles.infoOriginCard}> {item?.category.replace(/-/g, ' ')}</span>

                                                  </div>

                                                </div>
                                              }
                                            />
                                          </Card>
                                        </Col>
                                      )
                                    }) : <NoData />
                              }
                            </Row>
                          )}
                        </div>
                      </div>
                  }


                </div>
              </>
            ) : (
              <EmptyResults />
            )
          ) : (
            <Loading />
          )}
          <Pagination page={page} total_pages={totalPages} />

        </Col>
        {
          user?.isAdmin ? <></> : <Col span={window.innerWidth <= 1440 ? 3 : 3}></Col>
        }
      </Row>
      <ModalDeleteArticles
        // nameCategory = {posts[0]?.category.replace(/-/g, ' ')}
        idDelete={idDelete}
        nameDelete={nameDelete}
      ></ModalDeleteArticles>
    </>
  );
};

export default Articles;
