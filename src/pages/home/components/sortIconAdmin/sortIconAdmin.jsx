import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.scss";
import { useState } from "react";
import { setDataDocumentsFilter } from "../../../../states/modules/document";
import { requestGetDocuments } from "../../../../api/documents";

const SortIconDocumentAdmin = ({ type }) => {

    const dispatch = useDispatch();
    const filter = useSelector(state => state.document.dataDocumentsFilter)
    const [sortOrder, setSortOrder] = useState('asc'); // Sắp xếp tăng dần (asc) là mặc định
    const handleSort = () => {
        const newSortOrder = (sortOrder === 'asc') ? 'desc' : 'asc'; // Đảo ngược thứ tự sắp xếp
        if (type === 'name') {
            setSortOrder(newSortOrder);
            dispatch(setDataDocumentsFilter({ ...filter, sort_by: 'name', sort_order: newSortOrder }))
            dispatch(requestGetDocuments());
        } else if (type === 'date') {
            setSortOrder(newSortOrder);
            dispatch(setDataDocumentsFilter({ ...filter, sort_by: 'year_creation', sort_order: newSortOrder }))
            dispatch(requestGetDocuments());
        } else if (type === 'view') {
            setSortOrder(newSortOrder);
            dispatch(setDataDocumentsFilter({ ...filter, sort_by: 'view', sort_order: newSortOrder }))
            dispatch(requestGetDocuments());
        }
        console.log('type', type);
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

export default SortIconDocumentAdmin;