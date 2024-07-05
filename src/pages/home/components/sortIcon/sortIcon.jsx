import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.scss";
import { useState } from "react";
import { setDataFilter } from "../../../../states/modules/document";
import { requestGetAllDocument } from "../../../../api/documents";

const SortIconDocument = ({ type }) => {

    const dispatch = useDispatch();
    const filter = useSelector(state => state.document.dataFilter)
    const [sortOrder, setSortOrder] = useState('asc'); // Sắp xếp tăng dần (asc) là mặc định
    const handleSort = () => {
        const newSortOrder = (sortOrder === 'asc') ? 'desc' : 'asc'; // Đảo ngược thứ tự sắp xếp
        if (type === 'name') {
            setSortOrder(newSortOrder);
            dispatch(setDataFilter({ ...filter, sort_by: 'name', sort_order: newSortOrder }))
            dispatch(requestGetAllDocument());
        } else if (type === 'date') {
            setSortOrder(newSortOrder);
            dispatch(setDataFilter({ ...filter, sort_by: 'year_creation', sort_order: newSortOrder }))
            dispatch(requestGetAllDocument());
        } else if (type === 'view') {
            setSortOrder(newSortOrder);
            dispatch(setDataFilter({ ...filter, sort_by: 'view', sort_order: newSortOrder }))
            dispatch(requestGetAllDocument());
        }
    }

    const handleType = (type) => {
        switch (type) {
            case 'name':
                return 'Tên tài liệu';
            case 'date':
                return 'Thời gian';
            case 'view':
                return 'Lượt xem';
            default:
                return '';
        }
    }

    return (
        <span onClick={handleSort} className={styles.textSort}>{handleType(type)}</span>
    )
}

export default SortIconDocument;