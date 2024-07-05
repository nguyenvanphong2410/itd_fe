import "./login.scss";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/Context";
import { userRequest } from "../../requestMethods";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from './style.module.scss'
import { Input } from "antd";
const Login = () => {
  useEffect(() => {
    document.title = "Đăng nhập.";
  }, []);

  const { dispatch, isFetching } = useContext(Context);
  const [error, setError] = useState(false);
  const [messageError, setMessageError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().matches(
        /^[a-zA-Z0-9]{4,}@([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}$/,
        "Kiểm tra lại email !"
      ),
      password: Yup.string().matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*()-_+=])[a-zA-Z0-9!@#$%^&*()-_+=]{4,}$/,
        "Kiểm tra lại mật khẩu !"
      ),
    }),
    onSubmit: async (values) => {
      dispatch({ type: "LOGIN_START" });
      try {
        const res = await userRequest.post("/auth/login", {
          email: values.email,
          password: values.password,
        });
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      } catch (err) {
        setMessageError(err?.response?.data?.message)
        dispatch({ type: "LOGIN_FAILURE" });
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 8000);
      }
    },
  });

  return (

    <div className="login">
      <div className={styles.loginWrap}>
        <h2 className={styles.headingTextlogin}>Đăng nhập</h2>
        {error && (
          <span className={styles.messageError}>
            {messageError}
          </span>
        )}
        <form className="login__form" onSubmit={formik.handleSubmit}>
          <label htmlFor="" className={styles.headingTextOriginInput}>Email của bạn<span style={{ color: 'red' }}>*</span></label>
          <input
            className="register__input"
            type="email"
            placeholder="Nhập mail của bạn"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            required
            autoComplete="off"
          />
          {formik.errors.email && (
            <p style={{ color: 'red' }}> {formik.errors.email} </p>
          )}
          <label htmlFor="" className={styles.headingTextOriginInput}>Mật khẩu<span style={{ color: 'red' }}>*</span></label>
          <input
            className="register__input"
            type="password"
            placeholder="Nhập mật khẩu "
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            required
            autoComplete="off"
          />
          {/* <Input.Password placeholder="Nhập mật khẩu"
            value={formik.values.password}
            onChange={formik.handleChange}
          /> */}
          {formik.errors.password && (
            <p style={{ color: 'red' }}> {formik.errors.password} </p>
          )}
          <button className="login__button" type="submit" disabled={isFetching}>
            Đăng nhập
          </button>
        </form>
        <div className={styles.noAccountText}>
          Chưa có tài khoản?
          <Link to="/register" className={styles.switchText}> Đăng ký</Link>
        </div>
        
      </div>
    </div>

  );
};

export default Login;
