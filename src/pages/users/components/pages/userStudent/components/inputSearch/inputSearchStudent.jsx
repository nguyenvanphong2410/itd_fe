import { Space } from "antd";
import Search from "antd/es/input/Search";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setDataFilterStudent } from "../../../../../../../states/modules/user";
import { requestGetAllStudent } from "../../../../../../../api/user";


const InputSearchStudent = () => {
    const dispatch = useDispatch();
    const filter = useSelector(state => state.user.dataFilterStudent)
    const hanleClickSearch = (val) => {
        dispatch(setDataFilterStudent({ ...filter, search: val }))
        dispatch(requestGetAllStudent());
    }

    return (
        <div className={styles.inputSearchWrapper}>
            <Space.Compact>
                <Search
                    placeholder="Tìm kiếm sinh viên"
                    allowClear size='large'
                    onSearch={hanleClickSearch}
                />
            </Space.Compact>
            
        </div >
    )
}

export default InputSearchStudent;