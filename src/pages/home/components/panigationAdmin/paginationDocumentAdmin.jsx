import React from 'react';
import styles from './style.module.scss';
import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { requestGetAllDocument, requestGetDocuments } from '../../../../api/documents';
import { setDataDocumentsFilter, setDataFilter } from '../../../../states/modules/document';


function PaginationDocumentAdmin({ listDocuments }) {
    const filter = useSelector(state => state.document.dataDocumentsFilter)
    const dispatch = useDispatch();
    const handleChangePage = (e) => {
        dispatch(setDataDocumentsFilter({ ...filter, page: e }))
        dispatch(requestGetDocuments());
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

export default PaginationDocumentAdmin;