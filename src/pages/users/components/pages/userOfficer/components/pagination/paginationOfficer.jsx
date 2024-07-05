import React from 'react';
import styles from './style.module.scss';
import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setDataFilterOfficer } from '../../../../../../../states/modules/user';
import { requestGetAllOfficer } from '../../../../../../../api/user';

function PaginationOfficer({ usersList }) {
    const filter = useSelector(state => state.user.dataFilterOfficer)
    const dispatch = useDispatch();
    const handleChangePage = (e) => {
        dispatch(setDataFilterOfficer({ ...filter, page: e }))
        dispatch(requestGetAllOfficer());
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

export default PaginationOfficer;