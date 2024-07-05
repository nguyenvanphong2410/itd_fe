import "./mainHeading.scss";
import bgImg1 from "../../assets/images/slide-4.jpg";
import bgImg2 from "../../assets/images/slide-2.png";
import bgImg3 from "../../assets/images/slide-5.jpg";
import bgImg4 from "../../assets/images/slide-1.jpg";
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useContext } from "react";
import { Context } from "../../context/Context";
import styles from './styles.module.scss'
const MainHeading = () => {
  const { user } = useContext(Context);
  return (
    <header className="sliderHeading">
      {
        user?.isAdmin ?
          <></>
          :
          <div className={styles.swiperWrap}>

            <div className="sliderHeading__slider">
              <Swiper
                // install Swiper modules
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                spaceBetween={50}
                slidesPerView={1}
                navigation
                autoplay={{
                  delay: 2000,
                  disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
              >
                <SwiperSlide style={{ backgroundImage: `url(${bgImg1})` }}>
                  <div className="slide-text">
                   
                  </div>
                </SwiperSlide>
                <SwiperSlide style={{ backgroundImage: `url(${bgImg2})` }}>
                  <div className="slide-text">
                    
                  </div>
                </SwiperSlide>
                <SwiperSlide style={{ backgroundImage: `url(${bgImg3})` }}>
                  <div className="slide-text">
                   
                  </div>
                </SwiperSlide>
                <SwiperSlide style={{ backgroundImage: `url(${bgImg4})` }}>
                  <div className="slide-text">
                    
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>

      }

    </header>
  );
};

export default MainHeading;
