import React from "react";
import "./peopleGrid.scss";
import vnua from './images/vnua.jpg';
import phong from './images/phong.jpg'
import fita from './images/fita.png'

const PeopleGrid = () => {
  return (
    <section className="peopleGrid neu-01 line" data-items="3">
      <div className="peopleGrid__wrapper">
        <div className="peopleGrid__heading">
          <h2 className="peopleGrid__title">
            <span>Kho tài liệu cho sinh viên khoa CNTT</span>
          </h2>
        </div>
        <div className="peopleGrid__container">
          <article className="peopleGrid__item">
            <figure>
              <img
                src= {fita}
                alt=""
              />
            </figure>
            <h3 className="peopleGrid__name">
            Khoa công nghệ thông tin - FITA
            </h3>
            {/* <p className="peopleGrid__description">Luôn cập nhật</p> */}
          </article>

          <article className="peopleGrid__item">
            {/* <figure> */}
              <img style={{borderRadius: '50%', border: 'solid 1px blue' }}
              width={140} height={140} src= {phong} alt=""/>
            {/* </figure> */}
            <h3 className="peopleGrid__name">
              Nguyễn Văn Phong
            </h3>
            <p className="peopleGrid__description">K64ATTT - 646502</p>
          </article>

          <article className="peopleGrid__item">
            <figure>
              <img src={vnua} alt= 'vnua'
              />
            </figure>
            <h3 className="peopleGrid__name">
              Học viện nông nghiệp Việt Nam 
            </h3>
            {/* <p className="peopleGrid__description">Vnua</p> */}
          </article>
        </div>
      </div>
    </section>
  );
};

export default PeopleGrid;
