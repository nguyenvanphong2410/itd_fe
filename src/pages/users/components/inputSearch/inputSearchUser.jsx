import { Space } from "antd";
import Search from "antd/es/input/Search";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { requestGetAllUser } from "../../../../api/user";
import { setDataFilterUser } from "../../../../states/modules/user";

const InputSearchUser = () => {
    const dispatch = useDispatch();
    const filter = useSelector(state => state.user.dataFilterUser)
    const hanleClickSearch = (val) => {
        dispatch(setDataFilterUser({ ...filter, search: val }))
        dispatch(requestGetAllUser());
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

export default InputSearchUser;