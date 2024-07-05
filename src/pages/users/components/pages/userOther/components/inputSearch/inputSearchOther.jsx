import { Space } from "antd";
import Search from "antd/es/input/Search";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setDataFilterOther } from "../../../../../../../states/modules/user";
import { requestGetAllOther } from "../../../../../../../api/user";

const InputSearchOther = () => {
    const dispatch = useDispatch();
    const filter = useSelector(state => state.user.dataFilterOther)
    const hanleClickSearch = (val) => {
        dispatch(setDataFilterOther({ ...filter, search: val }))
        dispatch(requestGetAllOther());
    }

    return (
        <div className={styles.inputSearchWrapper}>
            <Space.Compact>
                <Search
                    placeholder="Tìm kiếm người dùng"
                    allowClear size='large'
                    onSearch={hanleClickSearch}
                />
            </Space.Compact>
            
        </div >
    )
}

export default InputSearchOther;