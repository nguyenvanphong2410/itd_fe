import { Space } from "antd";
import Search from "antd/es/input/Search";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setCategoriesDataFilter } from "../../../../states/modules/category";
import { requestGetAllCategory } from "../../../../api/category";
// import { requestGetAllCategory } from "@/api/category";
// import { setCategoriesDataFilter } from "@/states/modules/category";


const InputSearchCategory = () => {
    const dispatch = useDispatch();
    const filter = useSelector(state => state.category.dataFilter)
    const hanleClickSearch = (val) => {
        dispatch(setCategoriesDataFilter({ ...filter, search: val }))
        dispatch(requestGetAllCategory());
    }

    return (
        <div className={styles.inputSearchWrapper}>
            <Space.Compact>
                <Search
                    placeholder="Tìm kiếm thể loại..."
                    allowClear size='large'
                    onSearch={hanleClickSearch}
                />
            </Space.Compact>
            
        </div >
    )
}

export default InputSearchCategory;