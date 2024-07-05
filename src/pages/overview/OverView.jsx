import React, { useEffect, useRef, useState } from 'react';
import styles from './style.module.scss'
import './styles.scss'
import { Card, Col, Row, Skeleton } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { requestGetAllCategory } from '../../api/category';
import { requestGetAllOfficer, requestGetAllOther, requestGetAllStudent, requestGetAllUser } from '../../api/user';
import { requestGetAllDocument, requestGetAllPendingDocumentOver } from '../../api/documents';
import { CheckCircleOutlined, FieldTimeOutlined, PieChartFilled, ProfileOutlined, UserOutlined } from '@ant-design/icons';
import SpinComponent from '../../components/spin';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const OverView = () => {

    const dispatch = useDispatch();
    const listUser = useSelector(state => state.user.listUsers);
    const isLoading = useSelector(state => state.category.isLoadingGetAllCategory);
    const listCategory = useSelector(state => state.category.listCategories);
    const listDocumentChecked = useSelector(state => state.document.listDocuments);
    const listDocumentPending = useSelector(state => state.document.listDocumentsPendingOver);

    const officers = useSelector(state => state.user.listOfficer);
    const others = useSelector(state => state.user.listOther);
    const students = useSelector(state => state.user.listStudent);

    const [showSpin, setShowSpin] = useState(true);

    const SpinComponentDelayed = () => (
        <div className="spin-container">
            <SpinComponent />
        </div>
    );
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowSpin(false);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, []);

    const colors = ['#8433e0', '#3bc0c3', '#23c023', '#eb906f'];

    const data = [
        {
            name: 'Người dùng',
            'Số lượng': listUser.total-2,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Thể loại',
            'Số lượng': listCategory.total,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Tài liệu duyệt',
            'Số lượng': listDocumentChecked.total,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Tài liệu chờ',
            'Số lượng': listDocumentPending.total,
            pv: 3908,
            amt: 2000,
        },

    ];

    //Tron User
    const dataPieUser = [
        { name: 'Cán bộ', value: officers.total },
        { name: 'Sinh viên', value: students.total },
        { name: 'Người dùng', value: others.total },

    ];

    const COLORSUSER = ['#f7d61c', '#34b5ff', '#e22dbb'];

    const RADIANUSER = Math.PI / 180;
    const renderCustomizedLabelUser = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIANUSER);
        const y = cy + radius * Math.sin(-midAngle * RADIANUSER);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    //Tron
    const dataPie = [
        { name: 'Tài liệu đã duyệt', value: listDocumentChecked.total },
        { name: 'Tài liệu chờ duyệt', value: listDocumentPending.total }
    ];

    const COLORS = ['#23c023', '#eb906f'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    useEffect(() => {
        dispatch(requestGetAllUser())
    }, [])

    useEffect(() => {
        dispatch(requestGetAllCategory())
    }, [])

    useEffect(() => {
        dispatch(requestGetAllDocument())
    }, [])

    useEffect(() => {
        dispatch(requestGetAllPendingDocumentOver())
    }, [])

    useEffect(() => {
        dispatch(requestGetAllOfficer())
    }, [])

    useEffect(() => {
        dispatch(requestGetAllOther())
    }, [])

    useEffect(() => {
        dispatch(requestGetAllStudent())
    }, [])



    useEffect(() => {
        document.title = "Tổng quan";
    }, []);


    return (
        <>
            {showSpin && <SpinComponentDelayed />}
            {!isLoading && !showSpin && (
                <div className={styles.overViewWrap}>
                    <div className={styles.totalWrap}>
                        <Row gutter={{
                            xs: [10, 10],
                            sm: 10,
                            md: 16,
                            lg: 20,
                        }}>
                            <Col xs={24} sm={6} md={6} lg={6} xl={6} >
                                <Link to='/users'>
                                    <Card className={`card-total ${styles.widgetFlat} ${styles.bgInfo}`}>
                                        <div className="card-body">
                                            <div className={`${styles.widgetIcon}`}>
                                                <UserOutlined />
                                            </div>
                                            <h6 className={styles.title}>Tổng người dùng</h6>
                                            <h2 className={styles.subTitle}>{listUser?.total-2}</h2>

                                        </div>
                                    </Card>
                                </Link>
                            </Col>
                            <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                <Link to='/createCategory'>
                                    <Card className={`card-total ${styles.widgetFlat} ${styles.bgPrimary}`}>
                                        <div className="card-body">
                                            <div className={`${styles.widgetIcon}`}>
                                                <ProfileOutlined />
                                            </div>
                                            <h6 className={styles.title}>Tổng số thể loại</h6>
                                            <h2 className={styles.subTitle}>{listCategory.total}</h2>

                                        </div>
                                    </Card>
                                </Link>
                            </Col>
                            <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                <Link to='/checkedPostAdmin'>
                                    <Card className={`card-total ${styles.widgetFlat} ${styles.bgSuccess}`}>
                                        <div className="card-body">
                                            <div className={`${styles.widgetIcon}`}>
                                                <CheckCircleOutlined />
                                            </div>
                                            <h6 className={styles.title}>Tổng tài liệu duyệt</h6>
                                            <h2 className={styles.subTitle}>{listDocumentChecked.total}</h2>
                                        </div>
                                    </Card>
                                </Link>
                            </Col>
                            <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                <Link to='/pendingPostAdmin'>
                                    <Card className={`card-total ${styles.widgetFlat} ${styles.bgPink}`}>
                                        <div className="card-body">
                                            <div className={`${styles.widgetIcon}`}>
                                                <FieldTimeOutlined />
                                            </div>
                                            <h6 className={styles.title}>Tổng tài liệu chờ</h6>
                                            <h2 className={styles.subTitle}>{listDocumentPending.total}</h2>
                                        </div>
                                    </Card>
                                </Link>
                            </Col>
                        </Row>
                    </div>

                    <div className={styles.charWrap}>

                        <Row>
                            <Col span={12}>
                                <div className={styles.barChartWrap}>
                                    <ResponsiveContainer width="95%" height={400}>
                                        <BarChart
                                            className={styles.barChart}
                                            data={data}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="Số lượng" fill="#8884d8" label={{ position: 'top' }}>
                                                {data.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <div className={styles.textName}>
                                        <span> Biều đồ thống kê tổng quan</span>
                                    </div>
                                </div>

                            </Col>
                            <Col span={1}></Col>
                            <Col span={5}>
                                <div className={styles.barChartPieUserWrap}>
                                    <div className={styles.pieChartCenter}>
                                        <PieChart width={400} height={400} >
                                            <Tooltip />
                                            <Pie
                                                data={dataPieUser}
                                                labelLine={false}
                                                label={renderCustomizedLabelUser}
                                                outerRadius={90}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {dataPieUser?.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORSUSER[index % COLORSUSER.length]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </div>
                                    <div className={styles.namePie}>
                                        <span className={styles.textName}> Biều đồ thống kế người dùng</span>
                                        <div className={styles.wrapNote}>
                                            <div className={styles.itemNote}>
                                                <span className={styles.circleOfficer}></span>
                                                <span className={styles.textPending}>Cán bộ</span>
                                            </div>
                                            <div className={styles.itemNote}>
                                                <span className={styles.circleStudent}></span>
                                                <span className={styles.textChecked}>Sinh viên</span>
                                            </div>
                                            <div className={styles.itemNote}>
                                                <span className={styles.circleOther}></span>
                                                <span className={styles.textChecked}>Người dùng</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col span={1}></Col>
                            <Col span={5}>
                                <div className={styles.barChartPieWrap}>
                                    <div className={styles.pieChartCenter}>
                                        <PieChart width={400} height={400} >
                                            <Tooltip />
                                            <Pie
                                                data={dataPie}
                                                labelLine={false}
                                                label={renderCustomizedLabel}
                                                outerRadius={90}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {dataPie.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </div>
                                    <div className={styles.namePie}>
                                        <span className={styles.textName}> Biều đồ thống kế tài liệu</span>
                                        <div className={styles.wrapNote}>
                                            <div className={styles.itemNote}>
                                                <span className={styles.circlePending}></span>
                                                <span className={styles.textPending}>Tài liệu chờ duyệt</span>
                                            </div>
                                            <div className={styles.itemNote}>
                                                <span className={styles.circleChecked}></span>
                                                <span className={styles.textChecked}>Tài liệu đã duyệt</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            )}
        </>
    );
};

export default OverView;
