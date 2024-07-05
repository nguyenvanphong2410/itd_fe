import { Space } from "antd";
import Search from "antd/es/input/Search";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setDataPendingFilter } from "../../../../states/modules/document";
import { requestGetAllPendingDocument } from "../../../../api/documents";

const InputSearchPendingPost = () => {
    const dispatch = useDispatch();
    const filter = useSelector(state => state.document.dataPendingFilter)
    const hanleClickSearch = (val) => {
        dispatch(setDataPendingFilter({ ...filter, search: val }))
        dispatch(requestGetAllPendingDocument());
    }

    return (
        <div className={styles.inputSearchWrapper}>
            <Space.Compact>
                <Search
                    placeholder="Tìm kiếm tài liệu chờ"
                    allowClear size='large'
                    onSearch={hanleClickSearch}
                />
            </Space.Compact>
            
        </div >
    )
}

export default InputSearchPendingPost;