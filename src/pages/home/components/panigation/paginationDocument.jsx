import React from 'react';
import styles from './style.module.scss';
import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { requestGetAllDocument } from '../../../../api/documents';
import { setDataFilter } from '../../../../states/modules/document';


function PaginationDocument({ listDocuments }) {
    const filter = useSelector(state => state.document.dataFilter)
    const dispatch = useDispatch();
    const handleChangePage = (e) => {
        dispatch(setDataFilter({ ...filter, page: e }))
        dispatch(requestGetAllDocument());
    }
    return (
        <div className={styles.paginationWrap}>
            <Pagination
                responsive
                onChange={handleChangePage}
                current={listDocuments?.page}
                pageSize={listDocuments?.page_size || 12}
                total={listDocuments?.total}
                showSizeChanger={false}
            />

        </div>
    )
}

export default PaginationDocument;