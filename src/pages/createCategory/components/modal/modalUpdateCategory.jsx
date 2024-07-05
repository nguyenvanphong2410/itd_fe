import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setCategoryActive, setOpenModalUpdateCategory } from '../../../../states/modules/category';
import { Image, Input, Modal } from 'antd';
import { handleUpdateCategory, requestGetAllCategory } from '../../../../api/category';
import styles from './style.module.scss'
import NoImage from '../../../../components/notImage';

function ModalUpdateCategory({idEdit}) {
    const isShowModal = useSelector(state => state.category.modalUpdateCategory.isShowModalUpdate);
    const categoryDetails = useSelector(state => state.category.categoryActive);

    const dispatch = useDispatch();

    const [inputData, setInputData] = useState({});

    const [errorMessages, setErrorMessages] = useState({});
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const MIN_NAME_LENGTH = 1;
    const MAX_NAME_LENGTH = 255;
    const specialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
    const specialCharsDescription = /[$%^&*_[\]{}|]+/;

    const handleCLoseModal = () => {
        dispatch(setOpenModalUpdateCategory(false));
        setInputData();
        setThumbnailPreview(null)
    };

    //handleOnChangeInput
    const onChangeInput = (e) => {
        const { name, value } = e.target;
        if (e.target?.files?.[0] instanceof File) {
            const file = e.target.files[0];
            dispatch(setCategoryActive({
                ...categoryDetails,
                [name]: file
            }));

            setThumbnailPreview(URL.createObjectURL(file));
        } else {
            dispatch(setCategoryActive({
                ...categoryDetails,
                [name]: value
            }))
            setErrorMessages({ ...errorMessages, [name]: "" });
        }
    };

    const onClickSubmit = async (e) => {
        e.preventDefault();

        const isTrueName = specialChars.test(categoryDetails.name);
        const isTrueDescription = specialCharsDescription.test(categoryDetails.description)

        const errors = {};

        if (!categoryDetails.name) {
            errors.name = "Vui lòng nhập tên thể loại sách !";
        } else if (isTrueName) {
            errors.name = "Tên thể loại sách không hợp lệ !";
        }else if (categoryDetails.name.length < MIN_NAME_LENGTH || categoryDetails.name.length > MAX_NAME_LENGTH) {
            errors.name = `Tên thể loại sách phải có độ dài từ ${MIN_NAME_LENGTH} đến ${MAX_NAME_LENGTH} kí tự!`;
        }

        if (!categoryDetails.description) {
            errors.description = "Vui lòng điền mô tả !";
        } else if (isTrueDescription) {
            errors.description = "Mô tả không hợp lệ !";
        }

        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);
        } else {

            handleUpdateCategory(categoryDetails, categoryDetails._id)
                .then((response) => {
                    if (response.status < 300 && response.status >= 200) {
                        toast.success('Cập nhật thể loại sách thành công');
                        handleCLoseModal();
                        setTimeout(() => {
                            dispatch(requestGetAllCategory());
                        }, 1000);
                    }
                    else {
                        toast.error('Cập nhật thể loại sách thất bại!');
                    }
                })

        }
    }

    return (

        <>
            <ToastContainer transition={Slide} />
            <Modal
                title="Cập nhật thể loại tài liệu"
                open={isShowModal} onOk={onClickSubmit} onCancel={handleCLoseModal}
                cancelText='Hủy'
                okText={<span className={styles.btnCreate}>Cập nhật</span>}
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
                        (thumbnailPreview || categoryDetails.thumbnail) ? (
                            <Image
                                for="file-input"
                                className={styles.img}
                                style={{ width: '300px', height: '200px' }}
                                src={thumbnailPreview || categoryDetails.thumbnail}
                                alt="thumbnailPreview"
                            />
                        ) : (
                            <NoImage />
                        )
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
                        value={categoryDetails.name}
                    />
                    {errorMessages?.name ? <p className={styles.errorText}>{errorMessages?.name}</p> : " "}
                </div>
                <div className={styles.inputItem}>
                    <label>Mô tả thể loại <span className={styles.requireRed}>*</span></label>
                    <Input
                        name='description'
                        onChange={onChangeInput}
                        placeholder="Nhập mô tả của thể loại tài liệu"
                        value={categoryDetails.description}
                    />
                    {errorMessages?.description ? <p className={styles.errorText}>{errorMessages?.description}</p> : " "}
                </div>
            </Modal>
        </>
    );
}

export default ModalUpdateCategory;