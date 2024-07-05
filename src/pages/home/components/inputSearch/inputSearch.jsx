import { Space } from "antd";
import Search from "antd/es/input/Search";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setDataFilter } from "../../../../states/modules/document";
import { requestGetAllDocument } from "../../../../api/documents";


const InputSearch = () => {
    const dispatch = useDispatch();
    const filter = useSelector(state => state.document.dataFilter)
    const hanleClickSearch = (val) => {
        dispatch(setDataFilter({ ...filter, search: val }))
        dispatch(requestGetAllDocument());
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

export default InputSearch;