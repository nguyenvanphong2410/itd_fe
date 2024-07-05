import axios from "axios";
import "./write.scss";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/Context";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { publicRequest, userRequest } from "../../requestMethods";
import { FileUploader } from "react-drag-drop-files";
import { SvgDelete } from "../../components/svgs/SvgDelete";
import Spinner from "../../components/spinner/Spinner";
import { Col, DatePicker, Input, Row, Typography } from "antd";
import styles from './style.module.scss'
import { FileTextOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { Slide, ToastContainer, toast } from "react-toastify";
import SpinComponent from "../../components/spin";
import { useFormik } from "formik";
import * as Yup from "yup";

const Write = () => {
  useEffect(() => {
    document.title = "Tạo tài liệu";
  }, []);

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState([]);
  const [thumbs, setThumbs] = useState([]);
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const fileTypes = ["JPG", "JPEG", "PNG", "GIF", "jfif"];
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

  // Upload Pdf
  const [file, setFile] = useState(null);

  // CKEditor
  const editorConfiguration = {
    mediaEmbed: { previewsInData: true },
  };

  useEffect(() => {
    const getCats = async () => {
      const res = await publicRequest.get("/category/all");
      setCategories(res.data.data.categories);
    };
    getCats();
  }, []);

  // images selected
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

  const formik = useFormik({
    initialValues: {
      name: "",
      author: "",
      desc: "",
      year: "",
      publisher: "",
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

  const handleSubmit = async (e) => {
    setIsUploading(true);
    e.preventDefault();

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
            name: formik.values.name,
            author: formik.values.author,
            desc,
            category,
            year,
            publisher: formik.values.publisher,
            photos: list,
          };
          formData.append("newPost", JSON.stringify(newPost));
          await userRequest.post("/post", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          setIsUploading(true);
          thumbs.map((thumb) => URL.revokeObjectURL(thumb));
          setTimeout(() => {
            toast.success('Tạo mới tài liệu thành công')
          }, 1000);
          navigate("/pendingPost");
        } catch (err) {
          console.log(err);
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

    <div className="write">
      {showSpin && <SpinComponentDelayed />}
      {!showSpin && (
        <>
          <ToastContainer transition={Slide} autoClose={1000} />
          <h3 className={styles.titleCreateDocument}> <FolderOpenOutlined /> Tạo mới tài liệu </h3>
          <div className="write__wrapper">
            <span className={styles.suggest}>Chú thích:</span>
            <span className={styles.Obligatory}>* ( bắt buộc )</span>
            <form className="write__form" onSubmit={handleSubmit}>
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
                  <FileUploader
                    id="fileInput"
                    classes="drop_area"
                    type="file"
                    label="Tải lên ảnh tại đây"
                    name="file"
                    multiple
                    hoverTitle="Thả ở đây"
                    types={fileTypes}
                    handleChange={(e) => handleFiles(e)}
                  />
                  <div className="pdfFileWrapper">
                    <label className="pdfFile" htmlFor="pdfFile">
                      <Row>
                        <span className={styles.textUploadFile}> <FileTextOutlined className={styles.iconUploadFile} />Tải lên tệp PDF + <span className={styles.Obligatory}>*</span></span>
                        <Col span={1}></Col>
                        <Col span={18}>
                          <div className={file?.name ? styles.nameFileWrap : ''} >
                            <span>
                              {file?.name}
                            </span>
                          </div>

                        </Col>
                      </Row>

                    </label>

                    <input id="pdfFile" type="file" className="form-control" accept="application/pdf" required
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
                      placeholder="Nhập tên tài liệu"
                      name="name"
                      id="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      required
                    // onChange={(e) => setName(e.target.value)} 
                    />
                    {formik.errors.name && (
                      <p style={{ color: 'red' }}> {formik.errors.name} </p>
                    )}
                  </Col>
                  <Col md={2} lg={2}></Col>
                  <Col xs={24} sm={24} md={11} lg={11}>
                    <Typography.Title level={5} style={{ color: '#213ea7' }}>Tác giả <span className={styles.ifExists}>(nếu có)</span>:</Typography.Title>
                    <Input
                      placeholder="Nhập tên tác giả"
                      name="author"
                      id="author"
                      value={formik.values.author}
                      onChange={formik.handleChange}
                    // onChange={(e) => setAuthor(e.target.value)}
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
                        <DatePicker required placeholder="Nhập năm" onChange={handleDate} picker="year" />
                      </Col>
                      <Col md={2} lg={2}></Col>
                      <Col xs={24} sm={24} md={11} lg={12}>
                        <div className={styles.selectCategory}>
                          <select onChange={(e) => { setCategory(e.target.value); }}>
                            <option style={{ display: "none" }}>Thể loại</option>
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
                      placeholder="Nhập nhà xuất bản"
                      name="publisher"
                      id="publisher"
                      value={formik.values.publisher}
                      onChange={formik.handleChange}
                    // onChange={(e) => setPublisher(e.target.value)}
                    />
                    {formik.errors.publisher && (
                      <p style={{ color: 'red' }}> {formik.errors.publisher} </p>
                    )}
                  </Col>
                </Row>

              </div>
              <div >
                <Typography.Title level={5} style={{ color: '#213ea7' }}>Mô tả</Typography.Title>
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfiguration}
                  className="write__textarea"
                  onChange={(event, editor) => {
                    setDesc(editor.getData());
                  }}
                />
              </div>

              <button className="write__submit" type="submit">
                {isUploading ? <Spinner color="white" /> : "Tạo tài liệu"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Write;
