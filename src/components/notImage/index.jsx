import React from 'react';
import { Empty } from 'antd';
import styles from './styleNoData.module.scss';

function NoImage() {
    return (
        <div className={styles.noDataWrapper}>
            <div className={styles.centered}>
                <Empty description="Không có ảnh !" />
            </div>
        </div>
    );
}

export default NoImage;