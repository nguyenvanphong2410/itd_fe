import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setOpenModalAddCategory } from '../../../../states/modules/category';
import { Image, Input, Modal } from 'antd';
// import getSlug from "speakingurl";
// import { publicRequest } from '../../../../requestMethods';
import { requestCreateCategory, requestGetAllCategory } from '../../../../api/category';
import styles from './style.module.scss'

import NoImage from '../../../../components/notImage';

function ModalAddCategory() {
    const isShowModal = useSelector(state => state.category.modalAddCategory.isShowModalAdd);

    const dispatch = useDispatch();

    const [inputData, setInputData] = useState({});
    const [errorMessages, setErrorMessages] = useState({});
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const MIN_NAME_LENGTH = 1;
    const MAX_NAME_LENGTH = 255;
    const hasNumber = /\d/;
    const specialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
    const specialCharsDescription = /[$%^&*_[\]{}|]+/;

    const handleCLoseModal = () => {
        dispatch(setOpenModalAddCategory(false));
        setInputData();
        setThumbnailPreview(null)
    };

    //onChangeInput
    const onChangeInput = (e) => {
        const { name, value } = e.target;
        if (e.target?.files?.[0] instanceof File) {
            const file = e.target.files[0];
            setInputData({ ...inputData, [name]: e.target.files[0] });
            setThumbnailPreview(URL.createObjectURL(file));
        } else {
            setInputData({ ...inputData, [name]: value });
            setErrorMessages({ ...errorMessages, [name]: "" });
        }
    }

    const onClickSubmit = async (e) => {
        e.preventDefault();
        const isTrueName = specialChars.test(inputData.name);
        const ishasNumberName = hasNumber.test(inputData.name);
        const isTrueDescription = specialCharsDescription.test(inputData.description)

        const errors = {};

        if (!inputData.name) {
            errors.name = "Vui lòng nhập tên sách !";
        } else if (isTrueName) {
            errors.name = "Tên thể loại sách không hợp lệ !";
        }
        else if (ishasNumberName) {
            errors.name = "Tên thể loại sách không thể có số !";
        } else if (inputData.name.length < MIN_NAME_LENGTH || inputData.name.length > MAX_NAME_LENGTH) {
            errors.name = `Tên thể loại sách phải có độ dài từ ${MIN_NAME_LENGTH} đến ${MAX_NAME_LENGTH} kí tự!`;
        }

        if (!inputData.description) {
            errors.description = "Vui lòng nhập tiểu sử !";
        } else if (isTrueDescription) {
            errors.description = "Mô tả không hợp lệ !";
        }

        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);
        } else {
            // const displayServerError = (errorType, errorMessage) => {
            //     const errors = { ...errorMessages };

            //     switch (errorType) {
            //         case 'name':
            //             errors.name = errorMessage;
            //             break;
            //         case 'description':
            //             errors.description = errorMessage;
            //             break;
            //         default:
            //             errors.serverError = errorMessage;
            //             break;
            //     }

            //     setErrorMessages(errors);
            // };

            requestCreateCategory(inputData)
                .then((response) => {
                    if (response.status < 300 && response.status >= 200) {
                        toast.success('Tạo mới thể loại thành công');
                        handleCLoseModal();
                        setTimeout(() => {
                            dispatch(requestGetAllCategory());
                        }, 1000);
                    }
                    else {
                        toast.error('Tạo mới thể loại thất bại!');
                    }
                })

        }
    }

    return (

        <>
            <ToastContainer transition={Slide} />
            <Modal
                title="Thêm mới thể loại tài liệu"
                open={isShowModal} onOk={onClickSubmit} onCancel={handleCLoseModal}
                cancelText='Hủy'
                okText={<span className={styles.btnCreate}>Tạo mới</span>}
                maskClosable={false}
            >
                <div className={styles.preview}>
                    <input
                        id="file-input"
                        className={styles.fileInput}
                        name="thumbnail" type="file" required
                        onChange={onChangeInput}
                    />
                    {
                        thumbnailPreview ?
                            <Image
                                preview={false}
                                htmlFor="file-input"
                                className={styles.img}
                                style={{ width: '300px', height: '150px' }}
                                src={thumbnailPreview} alt="thumbnail preview"
                            /> : <NoImage />
                    }
                    <label htmlFor="file-input" className={styles.labelUpload}>
                        Tải ảnh lên
                        <svg className={styles.uploadIcon} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                            <g fill="currentColor">
                                <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
                            </g>
                        </svg>
                    </label>
                </div>
                <div className={styles.inputItem}>
                    <label>Tên thể loại <span className={styles.requireRed}>*</span></label>
                    <Input
                        name='name'
                        onChange={onChangeInput}
                        placeholder="Nhập tên của thể loại "
                        value={inputData?.name || ""}
                    />
                    {errorMessages?.name ? <p className={styles.errorText}>{errorMessages?.name}</p> : " "}
                </div>
                <div className={styles.inputItem}>
                    <label>Mô tả thể loại <span className={styles.requireRed}>*</span></label>
                    <Input
                        name='description'
                        onChange={onChangeInput}
                        placeholder="Nhập mô tả của thể loại tài liệu"
                        value={inputData?.description || ""}
                    />
                    {errorMessages?.description ? <p className={styles.errorText}>{errorMessages?.description}</p> : " "}
                </div>
            </Modal>
        </>
    );
}

export default ModalAddCategory;