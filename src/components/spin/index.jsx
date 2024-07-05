import React from 'react';
import { Spin } from 'antd';
import styles from './styleSpin.module.scss';

function SpinComponent() {
    return (
        <div className={styles.noSpinWrapper}>
            <div className={styles.centered}>
            <Spin tip="Loading" size="large" />
            </div>
        </div>
    );
}

export default SpinComponent;