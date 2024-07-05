import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Context } from '../../context/Context';
import './settings.scss';
import ImgDefault from '../../assets/images/img_default.jpg';
// import MostRead from '../../components/mostRead/MostRead';
import { userRequest } from '../../requestMethods';
import SpinComponent from '../../components/spin';
import { Col, Row, Tag } from 'antd';
import styles from './style.module.scss';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Slide, ToastContainer, toast } from 'react-toastify';

const Settings = () => {
  const { user, dispatch } = useContext(Context);
  const [file, setFile] = useState(null);
  const [fullName, setFullName] = useState(user?.fullName);
  const [mssv, setMssv] = useState(user?.mssv);
  const [address, setAddress] = useState(user?.address);
  const [classStudy, setClass] = useState(user?.class);
  const [email, setEmail] = useState(user?.email);
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitText, setSubmitText] = useState("Cập nhật");
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
    document.title = "Cập nhật Hồ sơ";
  }, []);

  const formik = useFormik({
    initialValues: {
      fullName: fullName,
      mssv: mssv,
      address: address,
      email: email,
      password: password,

    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9]{4,}@([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}$/,
          "Email không hợp lệ !"
        ),
      password: Yup.string()
        .matches(
          /^(?=.*[0-9])(?=.*[!@#$%^&*()-_+=])[a-zA-Z0-9!@#$%^&*()-_+=]{8,}$/,
          "Mật khẩu phải có số, lớn hơn 8 ký tự, có ký tự đặc biệt"
        ),
      fullName: Yup.string()
        .matches(/^[a-zA-ZÀ-ỹ ]+$/, "Tên tác giả không hợp lệ")
        .max(35, "Tên tác giả phải ngắn hơn 35 ký tự"),
      address: Yup.string().max(255, "Địa chỉ không được vượt quá 255 ký tự"),
      class: Yup.string().max(10, "Tên lớp phải ngắn hơn 10 ký tự"),
      mssv: Yup.string().max(10, "Mã số phải ngắn hơn 10 ký tự"),
    }),
  });

  const handleSubmit = async (e) => {
    setSubmitText("Cập nhật...");
    e.preventDefault();
    dispatch({ type: "UPDATE_START" })
    const updatedUser = {
      fullName: formik.values.fullName,
      mssv: formik.values.mssv,
      address: formik.values.address,
      userId: user._id,
      email: formik.values.email,
      class: formik.values.class,
    };

    if (password) {
      updatedUser.password = password;
    }

    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "folder_profiles");
      try {
        const uploadRes = await axios.post("https://api.cloudinary.com/v1_1/dp5a2zjnz/image/upload", data);
        const { secure_url, public_id } = uploadRes.data;
        updatedUser.profilePic = secure_url;
        updatedUser.public_id = public_id;
      } catch (err) {
        console.log(err);
      }
    }

    try {
      const res = await userRequest.put("/user/" + user._id, updatedUser);
      // setSuccess(true);
      setSubmitText("Cập nhật");
      dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
      toast.success('Cập nhật thành công')
      // setTimeout(() => {
      //   setSuccess(false);
      // }, 1000);
    } catch (err) {
      dispatch({ type: "UPDATE_FAILURE" })
    }
  };


  return (
    <>
      <ToastContainer
        transition={Slide}
        autoClose={2500}
      />
      <Row>
        <Col xs={24} sm={24} md={3} lg={3}></Col>
        <Col xs={24} sm={24} md={19} lg={19} className={styles.centerContent}>
          <div className="settings">
            {showSpin && <SpinComponentDelayed />}
            {!showSpin && (
              <>
                <div className="settings__wrapper">
                  <div className="settings__heading">
                    <span className="settings__mainTitle">Cập Nhật Hồ Sơ</span>
                  </div>
                  <div className="settings__container">
                    <div className="settings__left">
                      <form className="settings__form" onSubmit={handleSubmit}>

                        <div className="settings__profile">
                          <label htmlFor="fileInput" className="settings__profilePic">
                            <img src={file ? URL.createObjectURL(file) : user.profilePic ? user.profilePic : ImgDefault} alt="" />
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12.129 9.18701C11.0023 9.18701 10.0889 10.1004 10.0889 11.2271C10.0889 12.3538 11.0022 13.2672 12.129 13.2672C13.2557 13.2672 14.1691 12.3539 14.1691 11.2271C14.1691 10.1004 13.2557 9.18701 12.129 9.18701ZM12.129 12.2957C11.5388 12.2957 11.0604 11.8173 11.0604 11.2271C11.0604 10.6369 11.5388 10.1584 12.129 10.1584C12.7192 10.1584 13.1976 10.6369 13.1976 11.2271C13.1976 11.8173 12.7192 12.2957 12.129 12.2957Z" fill="white" /> <path d="M20.2644 4.52389L7.00379 3.01814C6.48913 2.94497 5.96769 3.09522 5.57088 3.43104C5.17412 3.73869 4.91979 4.19472 4.86656 4.69394L4.62371 6.68548H3.87077C2.80213 6.68548 2.00066 7.63265 2.00066 8.70129V18.6346C1.97374 19.6537 2.77801 20.5016 3.79709 20.5285C3.82163 20.5292 3.84622 20.5293 3.87077 20.529H17.2043C18.2729 20.529 19.2444 19.7033 19.2444 18.6346V18.246C19.5757 18.182 19.89 18.0497 20.1673 17.8575C20.5608 17.5261 20.8127 17.057 20.8716 16.546L21.9888 6.68548C22.1027 5.61438 21.3341 4.65085 20.2644 4.52389ZM18.2729 18.6346C18.2729 19.1689 17.7386 19.5575 17.2043 19.5575H3.87077C3.3881 19.5717 2.98534 19.1919 2.97116 18.7092C2.97042 18.6844 2.97074 18.6595 2.97214 18.6346V16.8374L6.73663 14.0687C7.18885 13.7215 7.82581 13.7524 8.24242 14.1415L10.8897 16.4731C11.2917 16.8106 11.7978 16.9993 12.3227 17.0074C12.733 17.0124 13.1367 16.9031 13.4884 16.6917L18.2729 13.923V18.6346H18.2729ZM18.2729 12.7815L12.9783 15.8659C12.5237 16.1353 11.9482 16.0865 11.5454 15.7445L8.87385 13.3886C8.10817 12.7307 6.98905 12.6904 6.178 13.2915L2.97214 15.623V8.70129C2.97214 8.16697 3.33645 7.65696 3.87077 7.65696H17.2043C17.7751 7.68062 18.2361 8.13117 18.2729 8.70129V12.7815ZM21.0183 6.55434C21.0179 6.55755 21.0177 6.5608 21.0173 6.56401L19.8758 16.4245C19.8778 16.6802 19.7612 16.9223 19.5601 17.0802C19.4629 17.1774 19.2443 17.226 19.2443 17.2746V8.70129C19.206 7.59486 18.311 6.71054 17.2042 6.68548H5.59515L5.81373 4.7911C5.86114 4.54579 5.9894 4.32349 6.17804 4.15962C6.39105 4.01235 6.64858 3.94369 6.90668 3.96531L20.1431 5.49537C20.6771 5.54609 21.069 6.02021 21.0183 6.55434Z" fill="#1C60BF" /> </svg>
                            <input id="fileInput" type="file" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
                          </label>
                          <div className={styles.wrapTagRole}>
                            {
                              user.isAdmin ? <Tag color="red">Admin</Tag> :
                                user?.option === '1' ? <Tag color="blue">Sinh viên</Tag> :
                                  user?.option === '2' ? <Tag color="orange">Cán bộ</Tag> :
                                    user?.option === '3' ? <Tag color="green">Người dùng</Tag> : <Tag color="green">Người dùng</Tag>
                            }
                          </div>
                        </div>
                        <label className={styles.textLabel} htmlFor="">Tên đầy đủ<span className={styles.Obligatory}> *</span></label>
                        <input
                          type="text" required
                          placeholder={user?.fullName}
                          // value={fullName}
                          // onChange={e => setFullName(e.target.value)} 
                          name="fullName"
                          id="fullName"
                          value={formik.values.fullName}
                          onChange={formik.handleChange}
                        />
                        {formik.errors.fullName && (
                          <p style={{ color: 'red' }}> {formik.errors.fullName} </p>
                        )}

                        {
                          user.isAdmin === true || user.option === '3' ? <></> : <>
                            <label className={styles.textLabel} htmlFor="">Mã số<span className={styles.Obligatory}> *</span></label>
                            <input
                              type="text" required placeholder={user?.mssv}
                              // value={mssv} onChange={e => setMssv(e.target.value)} 
                              name="mssv"
                              id="mssv"
                              value={formik.values.mssv}
                              onChange={formik.handleChange}
                            />
                            {formik.errors.mssv && (
                              <p style={{ color: 'red' }}> {formik.errors.mssv} </p>
                            )}
                          </>
                        }
                        {
                          user.isAdmin === true || user.option === '3' || user.option === '2' ? <></> : <>
                            <label className={styles.textLabel} htmlFor="">Lớp<span className={styles.Obligatory}> *</span></label>
                            <input
                              type="text" required placeholder={user?.class}
                              // value={classStudy} onChange={e => setClass(e.target.value)} 
                              name="class"
                              id="class"
                              value={formik.values.class}
                              onChange={formik.handleChange}
                            />
                            {formik.errors.class && (
                              <p style={{ color: 'red' }}> {formik.errors.class} </p>
                            )}
                          </>
                        }
                        <label className={styles.textLabel} htmlFor="">Địa chỉ</label>
                        <input
                          type="text" placeholder={user?.address}
                          // value={address} onChange={e => setAddress(e.target.value)}
                          name="address"
                          id="address"
                          value={formik.values.address}
                          onChange={formik.handleChange}
                        />
                        {formik.errors.address && (
                          <p style={{ color: 'red' }}> {formik.errors.address} </p>
                        )}
                        <label className={styles.textLabel} htmlFor="">Email<span className={styles.Obligatory}> *</span></label>
                        <input
                          type="email" required placeholder={user.email}
                          // value={email} onChange={e => setEmail(e.target.value)}
                          name="email"
                          id="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                        />
                        {formik.errors.email && (
                          <p style={{ color: 'red' }}> {formik.errors.email} </p>
                        )}
                        <label className={styles.textLabel} htmlFor="">Mật khẩu</label>
                        <input
                          type="password" placeholder="Mật khẩu"
                          // onChange={e => setPassword(e.target.value)}
                          name="password"
                          id="password"
                          // value={formik.values.password}
                          onChange={formik.handleChange}
                        />
                        {formik.errors.password && (
                          <p style={{ color: 'red' }}> {formik.errors.password} </p>
                        )}
                        <button className="settings__submit" type="submit">{submitText}</button>
                        {/* {success && <span style={{ color: "green", textAlign: "center" }}>Hồ sơ đã được cập nhật!</span>} */}
                      </form>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Col>
        <Col xs={24} sm={24} md={3} lg={3}></Col>
      </Row>

    </>

  );
}

export default Settings