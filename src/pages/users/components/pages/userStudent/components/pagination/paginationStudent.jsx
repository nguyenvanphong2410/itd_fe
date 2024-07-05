import React from 'react';
import styles from './style.module.scss';
import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setDataFilterStudent } from '../../../../../../../states/modules/user';
import { requestGetAllStudent } from '../../../../../../../api/user';

function PaginationStudent({ usersList }) {
    const filter = useSelector(state => state.user.dataFilterStudent)
    const dispatch = useDispatch();
    const handleChangePage = (e) => {
        dispatch(setDataFilterStudent({ ...filter, page: e }))
        dispatch(requestGetAllStudent());
    }
    return (
        <div className={styles.paginationWrap}>
            <Pagination
                responsive
                onChange={handleChangePage}
                current={usersList?.page}
                pageSize={usersList?.page_size || 6}
                total={usersList?.total}
                showSizeChanger={false}
            />

        </div>
    )
}

export default PaginationStudent;