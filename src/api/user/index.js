import callApi from "../../api/callApi";
import { getAllOfficer, getAllOfficerFail, getAllOfficerSuccess, getAllOther, getAllOtherFail, getAllOtherSuccess, getAllStudent, getAllStudentFail, getAllStudentSuccess, getAllUser, getAllUserFail, getAllUserSuccess } from "../../states/modules/user";
// import store from "../../states/configureStore";

export const requestGetAllUser = () => async (dispatch, getState) => {
    const filterUser = getState().user.dataFilterUser
    return callApi({
        method: 'get',
        apiPath: `api/user/all_user`,
        actionTypes: [getAllUser, getAllUserSuccess, getAllUserFail],
        variables: { ...filterUser },
        dispatch,
        getState
    })
}

export const requestGetAllOfficer = () => async (dispatch, getState) => {
    const filterOfficer = getState().user.dataFilterOfficer
    return callApi({
        method: 'get',
        apiPath: `api/user/all_officer`,
        actionTypes: [getAllOfficer, getAllOfficerSuccess, getAllOfficerFail],
        variables: { ...filterOfficer },
        dispatch,
        getState
    })
}

export const requestGetAllStudent = () => async (dispatch, getState) => {
    const filterStudent = getState().user.dataFilterStudent
    return callApi({
        method: 'get',
        apiPath: `api/user/all_student`,
        actionTypes: [getAllStudent, getAllStudentSuccess, getAllStudentFail],
        variables: { ...filterStudent },
        dispatch,
        getState
    })
}

export const requestGetAllOther = () => async (dispatch, getState) => {
    const filterOther = getState().user.dataFilterOther
    return callApi({
        method: 'get',
        apiPath: `api/user/all_other`,
        actionTypes: [getAllOther, getAllOtherSuccess, getAllOtherFail],
        variables: { ...filterOther },
        dispatch,
        getState
    })
}