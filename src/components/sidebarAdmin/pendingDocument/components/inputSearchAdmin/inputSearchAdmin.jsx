import { Space } from "antd";
import Search from "antd/es/input/Search";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setDataPendingOverFilter } from "../../../../../states/modules/document";
import { requestGetAllPendingDocumentOver } from "../../../../../api/documents";


const InputSearchAdmin = () => {
    const dispatch = useDispatch();
    const filter = useSelector(state => state.document.dataPendingOverFilter)
    const hanleClickSearch = (val) => {
        dispatch(setDataPendingOverFilter({ ...filter, search: val }))
        dispatch(requestGetAllPendingDocumentOver());
    }

    return (
        <div className={styles.inputSearchWrapper}>
            <Space.Compact>
                <Search
                    placeholder="Tìm kiếm tài liệu"
                    allowClear size='large'
                    onSearch={hanleClickSearch}
                />
            </Space.Compact>
        </div >
    )
}

export default InputSearchAdmin;