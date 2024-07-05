import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./singlePost.scss";
import { Context } from "../../context/Context";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Loading from "../loading/Loading";
import { publicRequest } from "../../requestMethods";
import LazyLoad from "react-lazyload";
import Tabs from "../../components/tabs/Tabs";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import PdfComp from "../PdfComp/PdfComp";
import { pdfjs } from "react-pdf";
import styles from './style.module.scss'
import { CalendarOutlined, CommentOutlined, DownloadOutlined, EyeOutlined, FieldTimeOutlined, HighlightOutlined, PicLeftOutlined, SolutionOutlined, UserOutlined } from "@ant-design/icons";
import { Slide, ToastContainer, toast } from "react-toastify";
import { dayjsFormatFromNow } from "../../utils/dayjsFormat";
import { Col, List, Row } from "antd";

dayjs.locale("vi");
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function SinglePost() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const [suggestCategory, setSuggestCategory] = useState(null);
  const [post, setPost] = useState(false);
  const { user } = useContext(Context);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState("");
  const [photos, setPhotos] = useState([]);

  // cats lấy từ mongodb cho select option
  const [loading, setLoading] = useState(true);

  // comments
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isComment, setIsComment] = useState(false);

  const newComment = {
    username: user.username,
    documentId: post._id,
    desc: comment,
  };
  // handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await publicRequest.post("/comments", newComment);
      toast.success('Bình luận thành công');
      setComment(" ")
      setIsComment(!isComment);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      const res = await publicRequest.get(`/comments/${path}`);
      setComments(res.data);
    };
    getComments();
  }, [path, isComment]);

  useEffect(() => {
    const getPost = async () => {
      setLoading(true);
      const res = await publicRequest.get(`/post/details/${path}`);
      setPost(res.data);
      setName(res.data.name);
      setPhotos(res.data.photos);
      setDesc(res.data.desc);
      setPhotos(res.data.photos);
      setLoading(false);
      setPhoto(null);
      setSuggestCategory(res?.data?.category);
      const timer = setTimeout(() => {
        setPhoto(res.data.photo);
      }, 200);
      return () => clearTimeout(timer);
    };
    getPost();
  }, [path]);

  const shimmer = (w, h) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#ebebeb" offset="20%" />
          <stop stop-color="#f5f5f5" offset="50%" />
          <stop stop-color="#ebebeb" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#ebebeb" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>`;
  const toBase64 = (str) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return (
    <>
      <ToastContainer transition={Slide} autoClose={1500} />
      {loading ? (
        <Loading />
      ) : (
        <div className="singlePost">
          <div className="singlePost__wrapper">
            <div className="singlePost__heading">
              <h1 className="singlePost__mainTitle">{name} </h1>


              <Row>
                <Col xs={24} sm={24} md={8} lg={8}>
                  <div className={styles.infoItem}>
                    <span className={styles.titleOrigin}><PicLeftOutlined /> Thể loại: </span>
                    <Link to={`/articles/category/${post.category}`}>
                      <span className={styles.info}>
                        {post.category.replace(/-/g, ' ')}
                      </span>
                    </Link>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} className={styles.colRight}>
                  <div className={styles.infoItem}>
                    <span className={styles.titleOrigin}><FieldTimeOutlined /> Thời gian đăng: </span>
                    <span className={styles.info}>
                      {dayjs(post.createdAt).format("LL")}

                    </span>
                  </div>
                </Col>
                <Col md={8} lg={8}></Col>
              </Row>

              <Row>
                <Col xs={24} sm={24} md={8} lg={8}>
                  <div className={styles.infoItem}>
                    <span className={styles.titleOrigin}><UserOutlined /> Người đăng: </span>
                    <span className={styles.info}>
                      {post.username}
                    </span>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} className={styles.colRight}>
                  <div className={styles.infoItem}>
                    <span className={styles.titleOrigin}><SolutionOutlined /> Nhà xuất bản: </span>
                    {post?.publisher ?
                      <span className={styles.info}>
                        {post?.publisher}

                      </span>
                      :
                      <span className={styles.textUpdating}>Đang cập nhật</span>}

                  </div>
                </Col>
                <Col md={8} lg={8}></Col>
              </Row>


              <Row>
                <Col xs={24} sm={24} md={8} lg={8}>
                  <div className={styles.infoItem}>
                    <span className={styles.titleOrigin}><HighlightOutlined /> Tác giả: </span>
                    {
                      post?.author ?
                        <span className={styles.info}> {post.author} </span>
                        :
                        <span className={styles.textUpdating}>Đang cập nhật</span>

                    }
                  </div>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} className={styles.colRight}>
                  <div className={styles.infoItem}>
                    <span className={styles.titleOrigin}><CalendarOutlined /> Năm xuất bản: </span>
                    {
                      post?.year ?
                        <span className={styles.info}> {post.year} </span>
                        :
                        <span className={styles.textUpdating}>Đang cập nhật</span>
                    }
                  </div>
                </Col>
                <Col md={8} lg={8}></Col>
              </Row>
              <Row>
                <Col xs={24} sm={24} md={8} lg={8}>
                  <div className={styles.infoItem}>
                    <a
                      // style={{ marginLeft: '10px' }}
                      href={`http://localhost:5000/files/${post.pdf}`}
                      download
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className={styles.titleDown}><DownloadOutlined /> Tải xuống tại đây </span>
                    </a>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} className={styles.colRight}>
                  <div className={styles.infoItem}>
                    <span className={styles.titleOrigin}>
                      <EyeOutlined /> Lượt xem: {post.view} lượt
                    </span>
                  </div>
                </Col>
                <Col md={8} lg={8}></Col>
              </Row>

            </div>
            <div className="singlePost__container">
              <div className="singlePost__leftContent">
                {photos.map((img) => {
                  return (
                    <LazyLoad
                      key={img._id}
                      placeholder={
                        <div
                          className="placeholder"
                          style={{ backgroundImage: `url(${img.base64})` }}
                        ></div>
                      }
                      once={true}
                      height={500}
                      offset={-100}
                      debounce={150}
                    >
                      <figure className="singlePost__image">
                        <LazyLoadImage
                          src={img.src || photo}
                          alt={post.title}
                          effect="blur"
                          placeholderSrc={
                            img.base64 ||
                            post.base64 ||
                            `data:image/svg+xml;base64,${toBase64(
                              shimmer(32, 32)
                            )}`
                          }
                        />
                      </figure>
                    </LazyLoad>
                  );
                })}
                <div className="singlePost__text">
                  <span className={styles.titleOriginDescription}>Mô tả của tài liệu </span>
                  <span
                    className={styles.textDescription}
                    dangerouslySetInnerHTML={{ __html: desc }}
                  ></span>
                  <span className={styles.titleOriginContent}>Nội dung</span>
                  <canvas
                    style={{ display: "none" }}
                    id="canvas"
                    width="32"
                    height="32"
                  ></canvas>
                </div>
                <div className="singlePost__pdf">
                  <PdfComp
                    pdfFile={`http://localhost:5000/files/${post.pdf}`}
                  />
                </div>
                <div className="singlePost__download">
                  <a
                    href={`http://localhost:5000/files/${post.pdf}`}
                    download
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className={styles.iconBtnDownload}> <DownloadOutlined />  </span>
                    <span className={styles.textBtnDownload}> Tải xuống</span>
                  </a>
                </div>

                <div className="comments">
                  <p className={styles.titleOriginComment}> <CommentOutlined /> Bình Luận:</p>
                  <form onSubmit={handleSubmit}>
                    <div className="comments__input">
                      <textarea
                        cols="30"
                        rows="10"
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Viết bình luận của bạn"
                        value={comment}
                      ></textarea>
                    </div>
                    <div className="comments__btn">
                      <button type="submit">
                        Bình luận
                      </button>
                    </div>
                  </form>
                  <div className="comments__posts">
                    <div className={styles.itemCommentWrap}>
                      {comments.map((item) => (
                        <div key={item._id} style={{ marginBottom: "8px" }}>
                          {/* <div className={styles.nameComment}>
                            {item.username}
                          </div>

                          <span className={styles.timeCommentComment}>
                            <span className={styles.iconTimeComment}><FieldTimeOutlined /></span>
                            <span className={styles.textTimeComment}>{dayjsFormatFromNow(item.createdAt)}</span>

                          </span>

                          <div className={styles.commentWrap}>
                            <span className={styles.iconTimeComment}><CommentOutlined /></span>
                            <span className={styles.textTimeComment}> {item.desc}</span>

                          </div> */}
                          <List.Item className={styles.commentWrap}>
                            <List.Item.Meta
                              title={
                                <>
                                  <span className={styles.name}><UserOutlined /> {item.username}</span>
                                  <span className={styles.timeCommentComment}>
                                    <span className={styles.iconTimeComment}><FieldTimeOutlined /></span>
                                    <span className={styles.textTimeComment}>{dayjsFormatFromNow(item.createdAt)}</span>
                                  </span>
                                </>}
                              description={<p className={styles.textComment}> {item.desc}</p>}
                            />
                          </List.Item>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="singlePost__rightContent">
                <Tabs 
                  suggestCategory = {suggestCategory}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
