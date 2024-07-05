import React from 'react';
import styles from './style.module.scss';
import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setDataDocumentsCheckedFilter, setDataPendingOverFilter } from '../../../../../states/modules/document';
import { requestGetAllPendingDocumentOver, requestGetDocumentsChecked } from '../../../../../api/documents';


function PanigationAdminPending({ listDocuments }) {
    const filter = useSelector(state => state.document.dataDocumentsCheckedFilter)
    const dispatch = useDispatch();
    const handleChangePage = (e) => {
        dispatch(setDataPendingOverFilter({ ...filter, page: e }))
        dispatch(requestGetAllPendingDocumentOver());
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

export default PanigationAdminPending;