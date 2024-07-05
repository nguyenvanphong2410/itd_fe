import { Space } from "antd";
import Search from "antd/es/input/Search";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setDataDocumentsFilter, setDataFilter } from "../../../../states/modules/document";
import { requestGetAllDocument, requestGetDocuments } from "../../../../api/documents";


const InputSearchAdmin = () => {
    const dispatch = useDispatch();
    const filter = useSelector(state => state.document.dataDocumentsFilter)
    const hanleClickSearch = (val) => {
        dispatch(setDataDocumentsFilter({ ...filter, search: val }))
        dispatch(requestGetDocuments());
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