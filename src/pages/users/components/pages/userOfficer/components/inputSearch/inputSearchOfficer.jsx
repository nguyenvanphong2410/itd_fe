import { Space } from "antd";
import Search from "antd/es/input/Search";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setDataFilterOfficer } from "../../../../../../../states/modules/user";
import { requestGetAllOfficer } from "../../../../../../../api/user";


const InputSearchOfficer = () => {
    const dispatch = useDispatch();
    const filter = useSelector(state => state.user.dataFilterOfficer)
    const hanleClickSearch = (val) => {
        dispatch(setDataFilterOfficer({ ...filter, search: val }))
        dispatch(requestGetAllOfficer());
    }

    return (
        <div className={styles.inputSearchWrapper}>
            <Space.Compact>
                <Search
                    placeholder="Tìm kiếm cán bộ"
                    allowClear size='large'
                    onSearch={hanleClickSearch}
                />
            </Space.Compact>
            
        </div >
    )
}

export default InputSearchOfficer;