import { Space } from "antd";
import Search from "antd/es/input/Search";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setDataDocumentsCheckedFilter } from "../../../../../states/modules/document";
import { requestGetDocumentsChecked } from "../../../../../api/documents";


const InputSearchAdmin = () => {
    const dispatch = useDispatch();
    const filter = useSelector(state => state.document.dataDocumentsCheckedFilter)
    const hanleClickSearch = (val) => {
        dispatch(setDataDocumentsCheckedFilter({ ...filter, search: val }))
        dispatch(requestGetDocumentsChecked());
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