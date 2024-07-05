import './intro.scss';
import React, { useEffect, useState } from 'react';
import PeopleGrid from '../../components/peopleGrid/PeopleGrid';
import SpinComponent from '../../components/spin';

const Intro = () => {
  useEffect(() => {
    document.title = "Giới thiệu - IT Documents.";
  }, []);

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

  return (
    <>
      {showSpin && <SpinComponentDelayed />}
      {!showSpin && (
        <>
          <PeopleGrid />
          <section className="wot neu-01 noSpacingTop">
            <div className="wot__wrapper">
              <div className="wot__heading">
                <h2 className="wot__title">Mục đích </h2>
                <h3 className="wot__subtitle" style={{ textAlign: 'justify' }}>
                  {/* <p > */}
                  Xây dựng kho tài liệu cho sinh viên khoa Công nghệ thông tin nhằm hỗ trợ đắc lực trong công tác quản lí và thống kê các tài liệu liên quan đến lĩnh vực Công nghệ thông tin và đặc biệt là hỗ trợ cho sinh viên khoa công nghệ thông tin có một nguồn thông tin hữu ích để học tập và trao đổi.
                  {/* </p> */}
                  <br />Từ đó nâng cao khả năng dạy và học của cán bộ viên chức và sinh viên của khoa.            </h3>
              </div>
              <div className="wot__text">

                <h2 className="wot__title">Chức năng chính</h2>
                <h3 className="wot__subtitle noSpacingBottom">
                  - Quản lí tài liệu <br />
                  - Quản lí thể loại tài liệu<br />
                  - Quản lí người dùng <br />
                </h3>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  )
}

export default Intro