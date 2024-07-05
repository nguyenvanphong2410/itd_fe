import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./tabs.scss";
import useSWR from "swr";
import TabsSkeleton from "./tabsSkeleton/TabsSkeleton";
import cx from "classnames";
import { domainApi } from "../../requestMethods";
import { dayjsFormat } from "../../utils/dayjsFormat";
import { dayjsFormatFromNow } from "../../utils/dayjsFormat";
import styles from './style.module.scss'
import { CaretRightOutlined, EyeOutlined, FieldTimeOutlined, FileTextOutlined, FolderOpenFilled, FolderOpenOutlined, ProfileOutlined, RightOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { requestGetAllDocument, requestGetAllDocumentNew, requestGetAllDocumentView, requestGetDocumentsCategory, requestUpdateViewPost } from "../../api/documents";
import { setDataDocumentsCategoryFilter, setDataFilter } from "../../states/modules/document";
import NoData from "../notData";

const Tabs = ({ suggestCategory }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [active, setActive] = useState("tab1");
  const filter = useSelector(state => state.document.dataFilter)
  const listDocumentsCategory = useSelector(state => state.document.documentsCategory);
  const listDocumentsView = useSelector(state => state.document.listDocumentsView);
  
  const documentsCategory = listDocumentsCategory.documents
  const documentsView = listDocumentsView.documents

  useEffect(() => {
    dispatch(requestGetAllDocumentNew())
  }, [])

  useEffect(() => {
    dispatch(setDataDocumentsCategoryFilter({ name_category: suggestCategory }))
    dispatch(requestGetDocumentsCategory())
  }, [suggestCategory])

  useEffect(() => {
    dispatch(setDataFilter({ ...filter, sort_by: 'view', sort_order: 'desc' }))
    dispatch(requestGetAllDocument())
  }, [])

  useEffect(() => {
    dispatch(requestGetAllDocumentView())
  }, [])

  //handleClickItemTab
  const handleClickItemTab = (id) => {
    dispatch(requestUpdateViewPost(id))
    navigate(`/post/${id}`);
  }

  return (
    <>
      <div className="tabs">
        <div className="tabs__wrapper">
          <div className="tabs__heading">
            <div className="tabs__button">
              <h3 onClick={() => setActive("tab1")} className={cx("tabs__mainTitle", { active: active === "tab1" })}><span>Liên quan</span></h3>
              <h3 onClick={() => setActive("tab2")} className={cx("tabs__mainTitle", { active: active === "tab2" })}><span>Xem nhiều</span></h3>
            </div>
          </div>
          <div className={cx("tabs__list", { show: active === "tab1" })}>
            {documentsCategory?.length > 0 ?
              documentsCategory?.slice(0, 6).map((post) => (
                <div className="tabs__listItem" key={post?._id}>

                  <div onClick={() => handleClickItemTab(post._id)}>
                    <FolderOpenFilled className={styles.iconRecentDocuments} />
                    <span className={styles.nameRecentDocuments}>{post?.name}</span>
                  </div>

                  <div>
                    <span className={styles.tabItemTextOrigin}>
                      <FieldTimeOutlined /> Thời gian:
                    </span>
                    <span className={styles.tabItemText}>
                      {dayjsFormatFromNow(post?.createdAt)}
                    </span>
                  </div>

                  <div>
                    <span className={styles.tabItemTextOrigin}>
                      <ProfileOutlined /> Thể loại:
                    </span>
                    <span className={styles.tabItemText}>
                      {post?.category.replace(/-/g, ' ')}
                    </span>
                  </div>

                </div>
              ))
              : <><NoData/></>}
          </div>
          <div className={cx("tabs__list", { show: active === "tab2" })}>
            {documentsView?.slice(0, 6).map((post) => (
              <div className="tabs__listItem" key={post._id}>

                <div onClick={() => handleClickItemTab(post._id)}>
                  <FolderOpenFilled className={styles.iconRecentDocuments} />
                  <span className={styles.nameRecentDocuments}>{post.name}</span>
                </div>

                <div>
                  <span className={styles.tabItemTextOrigin}>
                    <EyeOutlined /> Lượt xem:
                  </span>
                  <span className={styles.tabItemText}>
                    {post.view} lượt xem
                  </span>
                </div>

                <div>
                  <span className={styles.tabItemTextOrigin}>
                    <ProfileOutlined /> Thể loại:
                  </span>
                  <span className={styles.tabItemText}>
                    {post?.category.replace(/-/g, ' ')}
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <div className="tabs">
          <div className="tabs__wrapper">
            <div className="tabs__heading">
              <div className="tabs__button">
                <h3 className="tabs__mainTitle active"><span>Gần đây nhất</span></h3>
                <h3 className="tabs__mainTitle"><span>Xem nhiều</span></h3>
              </div>
            </div>
            <div className="tabs__list show">
              <TabsSkeleton />
              <TabsSkeleton />
              <TabsSkeleton />
              <TabsSkeleton />
            </div>
          </div>
        </div> */}

    </>
  );
};

export default Tabs;
