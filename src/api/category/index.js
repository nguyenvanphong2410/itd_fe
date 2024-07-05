import { deleteCategory, deleteCategoryFail, deleteCategorySuccess, getAllCategory, getAllCategoryFail, getAllCategorySuccess, getDetailsCategory, getDetailsCategoryFail, getDetailsCategorySuccess, requestAddCategory, requestAddCategoryFail, requestAddCategorySuccess, requestUpdateCategory, requestUpdateCategoryFail, requestUpdateCategorySuccess } from "../../states/modules/category";
import callApi from "../../api/callApi";
// import store from "@/states/configureStore";
import store from "../../states/configureStore";

export const requestGetAllCategory = () => async (dispatch, getState) => {
    const filter = getState().category.dataFilter
    return callApi({
        method: 'get',
        apiPath: `api/category/all`,
        actionTypes: [getAllCategory, getAllCategorySuccess, getAllCategoryFail],
        variables: { ...filter },
        dispatch,
        getState
    })
}

export const requestGetDetailsCategory = (id) => async (dispatch, getState) => {
    return callApi({
        method: 'get',
        apiPath: `api/category/details/${id}`,
        actionTypes: [getDetailsCategory, getDetailsCategorySuccess, getDetailsCategoryFail],
        variables: {},
        dispatch,
        getState
    })
}

export const requestCreateCategory = (data) => {
    const dispatch = store.dispatch;
    const getState = store.getState;

    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }

    return callApi({
        method: 'post',
        apiPath: `api/category/create`,
        actionTypes: [requestAddCategory, requestAddCategorySuccess, requestAddCategoryFail],
        variables: formData,
        dispatch,
        getState,
    });
}

export const handleUpdateCategory = (data, id) => {
    const dispatch = store.dispatch;
    const getState = store.getState;

    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }

    return callApi({
        method: 'put',
        apiPath: `api/category/update/${id}`,
        actionTypes: [requestUpdateCategory, requestUpdateCategorySuccess, requestUpdateCategoryFail],
        variables: formData,
        dispatch,
        getState,
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}

export const handleDeleteCategory = (id) => async (dispatch, getState) => {
    return callApi({
        method: 'delete',
        apiPath: `api/category/delete/${id}`,
        actionTypes: [deleteCategory, deleteCategorySuccess, deleteCategoryFail],
        variables: {},
        dispatch,
        getState
    })
}
