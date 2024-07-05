import React from 'react';
import styles from './style.module.scss';
import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { requestGetAllCheckedDocument  } from '../../../../api/documents';
import { setDataCheckedFilter  } from '../../../../states/modules/document';


function PaginationChecked({ listDocuments }) {
    const filter = useSelector(state => state.document.dataCheckedFilter)
    const dispatch = useDispatch();
    const handleChangePage = (e) => {
        dispatch(setDataCheckedFilter({ ...filter, page: e }))
        dispatch(requestGetAllCheckedDocument());
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

export default PaginationChecked;