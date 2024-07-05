import axios from "axios";
import "./editPost.scss";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { publicRequest, userRequest } from "../../requestMethods";
import { FileUploader } from "react-drag-drop-files";
import { SvgDelete } from "../../components/svgs/SvgDelete";
import Spinner from "../../components/spinner/Spinner";
import { useLocation } from "react-router-dom";
import styles from './style.module.scss'
import { EditOutlined } from "@ant-design/icons";
import { Col, DatePicker, Input, Row, Typography } from "antd";
import SpinComponent from "../../components/spin";
import { Slide, ToastContainer, toast } from "react-toastify";
import dayjs from "dayjs";
import { useFormik } from "formik";
import * as Yup from "yup";

const EditPost = () => {
  useEffect(() => {
    document.title = "Chỉnh sửa ";
  }, []);
  const location = useLocation();
  const path = location.pathname.split("/")[3];
  const [post, setPost] = useState([]);
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photosDelete, setPhotosDelete] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState([]);
  const [thumbs, setThumbs] = useState([]);
  const { user } = useContext(Context);
  const [year, setYear] = useState("");

  // Upload Pdf
  const [file, setFile] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(false);
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
  const navigate = useNavigate();


  useEffect(() => {
    const getPost = async () => {
      const res = await publicRequest.get(`/post/details/${path}`);
      document.title = `${res.data?.name}`;
      setPost(res.data);
      setName(res.data?.name);
      setAuthor(res.data?.author);
      setPhotos(res.data?.photos);
      setPublisher(res.data?.publisher);
      setDesc(res.data?.desc);
      setYear(res.data?.year);
      setCategory(res.data?.category);
    };
    getPost();
  }, [path]);

  const formik = useFormik({
    initialValues: {
      name: name,
      author: author,
      publisher: publisher,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(/^[a-zA-ZÀ-ỹ ]/, "Tên tài liệu không hợp lệ")
        .max(255, "Tên phải ngắn hơn 255 ký tự"),
      author: Yup.string()
        .matches(/^[a-zA-ZÀ-ỹ ]+$/, "Tên tác giả không hợp lệ")
        .max(35, "Tên tác giả phải ngắn hơn 35 ký tự"),
      publisher: Yup.string()
        .matches(/^[a-zA-ZÀ-ỹ ]+$/, "Tên nhà xuất bản không hợp lệ")
        .max(50, "Tên nhà xuất bản phải ngắn hơn 50 ký tự"),
    }),

  });

  const fileTypes = ["JPG", "JPEG", "PNG", "GIF", "jfif"];

  // CKEditor
  const editorConfiguration = {
    mediaEmbed: { previewsInData: true },
  };

  //setCategories
  useEffect(() => {
    const getCats = async () => {
      const res = await publicRequest.get("/category/all");
      setCategories(res.data.data.categories);
    };
    getCats();
  }, []);

  // blob images selected
  const handleFiles = (e) => {
    setFiles([...files, ...e]);
    const blob = [...e].map((file) => URL.createObjectURL(file));
    setThumbs([...thumbs, ...blob]);
  };

  // delete selected image
  const handleDeleteSelectedImage = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setThumbs(thumbs.filter((_, i) => i !== index));
    URL.revokeObjectURL(thumbs[index]);
  };

  // delete photos
  const handleDeletePhotos = (img) => {
    setPhotos(photos.filter((photo) => photo !== img));
    // setPhotosDelete((prev) => prev.concat(photos.filter((photo) => photo === img)))
    setPhotosDelete([
      ...photosDelete,
      ...photos.filter((photo) => photo === img),
    ]);
  };



  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    if (files) {
      try {
        const list = await Promise.all(
          Object.values(files).map(async (file) => {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "folder_posts");
            const uploadRes = await axios.post(
              "https://api.cloudinary.com/v1_1/dp5a2zjnz/image/upload",
              data
            );
            const { secure_url, public_id } = uploadRes.data;
            // newPost.photo = secure_url;
            return {
              src: secure_url,
              public_id: public_id,
            };
          })
        );

        try {
          // newPost.photos = list;
          const formData = new FormData();
          formData.append("file", file);
          const newPost = {
            username: user.username,
            name: name,
            desc,
            category,
            year,
            author: author,
            publisher: publisher,
            photos: [...photos, ...list],
            photosDelete,
          };

          formData.append("newPost", JSON.stringify(newPost));
          // await userRequest.put(`/posts/${post._id}`, newPost);
          await userRequest.put(`/post/${post._id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setIsUploading(false);

          toast.success('Cập nhật thành công')
          setTimeout(() => {
            navigate(user?.isAdmin ? '/documents' : `/post/${post._id}`);
          }, 2000);
          // navigate(user?.isAdmin ? '/documents' : '/');
        } catch (err) {
          toast.error('Cập nhật thất bại')
          setError(true);
          setIsUploading(false);
          setTimeout(() => {
            setError(false);
          }, 2000);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  //handleDate
  const handleDate = (date, dateString) => {
    setYear(dateString);
  };
  return (
    <>
      <ToastContainer
        transition={Slide}
        autoClose={2500}
      />
      <div className="write">
        {showSpin && <SpinComponentDelayed />}
        {!showSpin && (
          <>

            <h3 className={styles.titleCreateDocument}><EditOutlined /> Chỉnh sửa thông tin tài liệu </h3>
            <div className="write__wrapper">
              <span className={styles.suggest}>Chú thích:</span>
              <span className={styles.Obligatory}>* ( bắt buộc )</span>
              <form className="write__form" onSubmit={handleUpdate}>
                <div className="write__formGroup">
                  <div className="write__formWrapper">
                    <div className="write__imageWrapper">
                      {thumbs &&
                        thumbs.map((thumb, index) => (
                          <figure key={index} className="write__thumb">
                            <img src={thumb} alt="" />
                            <span
                              className="write__iconDelete"
                              onClick={() => handleDeleteSelectedImage(index)}
                            >
                              <SvgDelete color="#d63232" />
                            </span>
                          </figure>
                        ))}
                    </div>
                    {photos && (
                      <div className={styles.figureImageHistoryWrap}>
                        {photos.map((img, index) => {
                          return (
                            <figure key={index} className={styles.figureImageHistory}>
                              <img src={img.src} alt={"alt"} />

                              <span
                                className="singlePost__iconDelete"
                                style={{ width: "40px", height: "40px" }}
                                onClick={() => handleDeletePhotos(img)}
                              >
                                <SvgDelete color="#d63232" />
                              </span>
                            </figure>
                          );
                        })}
                      </div>
                    )}
                    <FileUploader
                      id="fileInput" classes="drop_area" type="file"
                      label="Tải lên ảnh tại đây" name="file"
                      multiple hoverTitle="Thả ở đây"
                      types={fileTypes} handleChange={(e) => handleFiles(e)}
                    />
                    <div className="pdfFileWrapper">
                      <label className="pdfFile" htmlFor="pdfFile">
                        Tải lên tệp PDF <span>+</span>
                      </label>
                      <span style={{ color: "#46c046" }}>{file?.name}</span>
                      <input
                        id="pdfFile" type="file" className="form-control" accept="application/pdf"
                        onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="write__formGroup" style={{ marginBottom: "24px" }}>
                  <Row>
                    <Col xs={24} sm={24} md={11} lg={11}>
                      <Typography.Title level={5} style={{ color: '#213ea7' }}>Tên tài liệu<span className={styles.Obligatory}> *</span></Typography.Title>

                      <Input
                        required
                        placeholder="Nhập tên tài liệu"
                        value={name} onChange={(e) => setName(e.target.value)}
                      // name="name"
                      // id="name"
                      // value={formik.values.name}
                      // onChange={formik.handleChange}
                      />
                      {formik.errors.name && (
                        <p style={{ color: 'red' }}> {formik.errors.name} </p>
                      )}
                    </Col>
                    <Col md={2} lg={2}></Col>
                    <Col xs={24} sm={24} md={11} lg={11}>
                      <Typography.Title level={5} style={{ color: '#213ea7' }}>Tác giả <span className={styles.ifExists}>(nếu có)</span>:</Typography.Title>
                      <Input
                        placeholder="Nhập tên tác giả nếu có"
                        value={author} onChange={(e) => setAuthor(e.target.value)} 
                        // name="author"
                        // id="author"
                        // value={formik.values.author}
                        // onChange={formik.handleChange}
                      />
                      {formik.errors.author && (
                        <p style={{ color: 'red' }}> {formik.errors.author} </p>
                      )}
                    </Col>
                  </Row>

                  <Row className={styles.rowMarginTop}>
                    <Col xs={24} sm={24} md={11} lg={11}>
                      <Row>
                        <Col xs={24} sm={24} md={11} lg={10}>
                          <Typography.Title level={5} style={{ color: '#213ea7' }}>Năm xuất bản<span className={styles.Obligatory}> *</span></Typography.Title>
                          <DatePicker defaultValue={dayjs(year?.toString(), 'YYYY')} placeholder="Nhập năm" onChange={handleDate} picker="year" />
                          {/* <Input type="number" value={year} placeholder="Nhập năm xuất bản" onChange={(e) => setYear(e.target.value)} /> */}

                        </Col>
                        <Col md={2} lg={2}></Col>
                        <Col xs={24} sm={24} md={11} lg={12}>
                          <div className={styles.selectCategory}>
                            <select
                              onChange={(e) => {
                                setCategory(e.target.value);
                              }}
                            >
                              <option style={{ display: "none" }}>{category}</option>
                              {categories &&
                                categories.map((category) => (
                                  <option key={category._id} value={category.slug}>
                                    {category.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={2} lg={2}></Col>
                    <Col xs={24} sm={24} md={11} lg={11}>
                      <Typography.Title level={5} style={{ color: '#213ea7' }}>Nhà xuất bản <span className={styles.ifExists}>(nếu có)</span>:</Typography.Title>
                      <Input
                        placeholder="Nhập nhà xuất bản nếu có"
                        value={publisher} onChange={(e) => setPublisher(e.target.value)}
                      // name="publisher"
                      // id="publisher"
                      // value={formik.values.publisher}
                      // onChange={formik.handleChange}
                      />
                      {formik.errors.publisher && (
                        <p style={{ color: 'red' }}> {formik.errors.publisher} </p>
                      )}
                    </Col>
                  </Row>
                </div>

                <div className="write__formGroup">
                  <Typography.Title level={5} style={{ color: '#213ea7' }}>Mô tả tài liệu <span className={styles.ifExists}>(nếu có)</span>:</Typography.Title>
                  <CKEditor
                    editor={ClassicEditor}
                    config={editorConfiguration}
                    className="write__textarea"
                    data={desc}
                    onChange={(event, editor) => {
                      setDesc(editor.getData());
                    }}
                  />
                </div>
                <button className="write__submit" type="submit">
                  {isUploading ? <Spinner color="white" /> : "Cập nhật"}
                </button>
                {error && (
                  <div style={{ color: "red" }}>Vui lòng đổi tiêu đề khác</div>
                )}
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default EditPost;
