import { Space } from "antd";
import Search from "antd/es/input/Search";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setDataCheckedFilter } from "../../../../states/modules/document";
import { requestGetAllCheckedDocument } from "../../../../api/documents";

const InputSearchCheckedPost = () => {
    const dispatch = useDispatch();
    const filter = useSelector(state => state.document.dataCheckedFilter)
    const hanleClickSearch = (val) => {
        dispatch(setDataCheckedFilter({ ...filter, search: val }))
        dispatch(requestGetAllCheckedDocument());
    }

    return (
        <div className={styles.inputSearchWrapper}>
            <Space.Compact>
                <Search
                    placeholder="Tìm kiếm tài liệu duyệt"
                    allowClear size='large'
                    onSearch={hanleClickSearch}
                />
            </Space.Compact>
            
        </div >
    )
}

export default InputSearchCheckedPost;