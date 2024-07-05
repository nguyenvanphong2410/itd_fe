import React from 'react';
import styles from './style.module.scss';
import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setDataFilterOther } from '../../../../../../../states/modules/user';
import { requestGetAllOther } from '../../../../../../../api/user';

function PaginationOther({ usersList }) {
    const filter = useSelector(state => state.user.dataFilterOther)
    const dispatch = useDispatch();
    const handleChangePage = (e) => {
        dispatch(setDataFilterOther({ ...filter, page: e }))
        dispatch(requestGetAllOther());
    }
    return (
        <div className={styles.paginationWrap}>
            <Pagination
                responsive
                onChange={handleChangePage}
                current={usersList?.page}
                pageSize={usersList?.page_size || 5}
                total={usersList?.total}
                showSizeChanger={false}
            />

        </div>
    )
}

export default PaginationOther;