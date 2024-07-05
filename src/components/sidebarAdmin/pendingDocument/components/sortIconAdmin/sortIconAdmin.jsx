import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.scss";
import { useState } from "react";
import { setDataPendingOverFilter } from "../../../../../states/modules/document";
import { requestGetAllPendingDocumentOver } from "../../../../../api/documents";

const SortIconDocumentAdmin = ({ type }) => {

    const dispatch = useDispatch();
    const filter = useSelector(state => state.document.dataDocumentsCheckedFilter)
    const [sortOrder, setSortOrder] = useState('asc'); // Sắp xếp tăng dần (asc) là mặc định
    const handleSort = () => {
        const newSortOrder = (sortOrder === 'asc') ? 'desc' : 'asc'; // Đảo ngược thứ tự sắp xếp
        if (type === 'name') {
            setSortOrder(newSortOrder);
            dispatch(setDataPendingOverFilter({ ...filter, sort_by: 'name', sort_order: newSortOrder }))
            dispatch(requestGetAllPendingDocumentOver());
        } else if (type === 'date') {
            setSortOrder(newSortOrder);
            dispatch(setDataPendingOverFilter({ ...filter, sort_by: 'createdAt', sort_order: newSortOrder }))
            dispatch(requestGetAllPendingDocumentOver());
        } 
    }

    const handleType = (type) => {
        switch (type) {
            case 'name':
                return 'Tên tài liệu';
            case 'date':
                return 'Thời gian';
            default:
                return '';
        }
    }

    return (
        <span onClick={handleSort} className={styles.textSort}>{handleType(type)}</span>
    )
}

export default SortIconDocumentAdmin;