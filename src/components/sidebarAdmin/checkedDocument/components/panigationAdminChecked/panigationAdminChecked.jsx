import React from 'react';
import styles from './style.module.scss';
import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setDataDocumentsCheckedFilter } from '../../../../../states/modules/document';
import { requestGetDocumentsChecked } from '../../../../../api/documents';


function PanigationAdminChecked({ listDocuments }) {
    const filter = useSelector(state => state.document.dataDocumentsCheckedFilter)
    const dispatch = useDispatch();
    const handleChangePage = (e) => {
        dispatch(setDataDocumentsCheckedFilter({ ...filter, page: e }))
        dispatch(requestGetDocumentsChecked());
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

export default PanigationAdminChecked;