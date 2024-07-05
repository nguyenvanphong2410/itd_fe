import React from 'react';
import styles from './style.module.scss';
import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { requestGetAllPendingDocument } from '../../../../api/documents';
import { setDataPendingFilter } from '../../../../states/modules/document';


function PaginationPending({ listDocuments }) {
    const filter = useSelector(state => state.document.dataPendingFilter)
    const dispatch = useDispatch();
    const handleChangePage = (e) => {
        dispatch(setDataPendingFilter({ ...filter, page: e }))
        dispatch(requestGetAllPendingDocument());
    }
    return (
        <div className={styles.paginationWrap}>
            <Pagination
                responsive
                onChange={handleChangePage}
                current={listDocuments?.page}
                pageSize={listDocuments?.page_size || 8}
                total={listDocuments?.total}
                showSizeChanger={false}
            />
        </div>
    )
}

export default PaginationPending;