import React from 'react';
import styles from './style.module.scss';
import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { requestGetAllCategory } from '../../../../api/category';
import { setCategoriesDataFilter } from '../../../../states/modules/category';
import { setDataFilterUser } from '../../../../states/modules/user';
import { requestGetAllUser } from '../../../../api/user';


function PaginationUser({ usersList }) {
    const filter = useSelector(state => state.user.dataFilterUser)
    const dispatch = useDispatch();
    const handleChangePage = (e) => {
        dispatch(setDataFilterUser({ ...filter, page: e }))
        dispatch(requestGetAllUser());
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

export default PaginationUser;