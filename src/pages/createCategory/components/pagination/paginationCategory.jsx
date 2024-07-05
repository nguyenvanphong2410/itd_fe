import React from 'react';
import styles from './style.module.scss';
import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { requestGetAllCategory } from '../../../../api/category';
import { setCategoriesDataFilter } from '../../../../states/modules/category';


function PaginationCategory({ listCategory }) {
    const filter = useSelector(state => state.category.dataFilter)
    const dispatch = useDispatch();
    const handleChangePage = (e) => {
        dispatch(setCategoriesDataFilter({ ...filter, page: e }))
        dispatch(requestGetAllCategory());
    }
    return (
        <div className={styles.paginationWrap}>
            <Pagination
                responsive
                onChange={handleChangePage}
                current={listCategory?.page}
                pageSize={listCategory?.page_size || 5}
                total={listCategory?.total}
                showSizeChanger={false}
            />

        </div>
    )
}

export default PaginationCategory;