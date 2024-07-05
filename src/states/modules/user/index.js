import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
  name: "user",
  initialState: {
    isLoadingGetAllUser: false,
    isLoadingGetAllOfficer: false,
    isLoadingGetAllStudent: false,
    isLoadingGetAllOther: false,

    listUsers: [],
    listOfficer: [],
    listStudent: [],
    listOther: [],

    dataFilterUser: {
      search: "",
      sort_by: "",
      sort_order: "",
      page: 1,
      page_size: 8,
    },

    dataFilterOfficer: {
      search: "",
      sort_by: "",
      sort_order: "",
      page: 1,
      page_size: 6,
    },

    dataFilterStudent: {
      search: "",
      sort_by: "",
      sort_order: "",
      page: 1,
      page_size: 6,
    },

    dataFilterOther: {
      search: "",
      sort_by: "",
      sort_order: "",
      page: 1,
      page_size: 6,
    },

    modalDeleteUser: {
      isShowModalDeleteUser: false,
    },

  },
  reducers: {

    //MODAL DELETE
    setOpenModalDeleteUser: (state, actions) => ({
      ...state,
      modalDeleteUser: {
        ...state.modalDeleteUser,
        isShowModalDeleteUser: actions.payload,
      },
    }),

    //GET ALL 
    getAllUser: (state) => ({
      ...state,
      isLoadingGetAllUser: true
    }),
    getAllUserSuccess: (state, action) => ({
      ...state,
      listUsers: action.payload,
      isLoadingGetAllUser: false
    }),
    getAllUserFail: (state) => ({
      ...state,
      isLoadingGetAllUser: false
    }),

    //GET ALL Student
    getAllStudent: (state) => ({
      ...state,
      isLoadingGetAllStudent: true
    }),
    getAllStudentSuccess: (state, action) => ({
      ...state,
      listStudent: action.payload,
      isLoadingGetAllStudent: false
    }),
    getAllStudentFail: (state) => ({
      ...state,
      isLoadingGetAllStudent: false
    }),

    //GET ALL Officer
    getAllOfficer: (state) => ({
      ...state,
      isLoadingGetAllOfficer: true
    }),
    getAllOfficerSuccess: (state, action) => ({
      ...state,
      listOfficer: action.payload,
      isLoadingGetAllOfficer: false
    }),
    getAllOfficerFail: (state) => ({
      ...state,
      isLoadingGetAllOfficer: false
    }),

    //GET ALL Other
    getAllOther: (state) => ({
      ...state,
      isLoadingGetAllOther: true
    }),
    getAllOtherSuccess: (state, action) => ({
      ...state,
      listOther: action.payload,
      isLoadingGetAllOther: false
    }),
    getAllOtherFail: (state) => ({
      ...state,
      isLoadingGetAllOther: false
    }),

    //Active
    setActiveUser: (state, action) => ({
      ...state,
      categoryActiveUser: { ...action.payload }
    }),

    //Filter
    setDataFilterUser: (state, action) => ({
      ...state,
      dataFilterUser: { ...action.payload }
    }),

    //Filter
    setDataFilterOfficer: (state, action) => ({
      ...state,
      dataFilterOfficer: { ...action.payload }
    }),

    //Filter
    setDataFilterStudent: (state, action) => ({
      ...state,
      dataFilterStudent: { ...action.payload }
    }),

    //Filter
    setDataFilterOther: (state, action) => ({
      ...state,
      dataFilterOther: { ...action.payload }
    }),

  },
});

export const {
  setOpenModalDeleteUser,
  setActiveUser,
  setDataFilterUser,
  setDataFilterOfficer,
  setDataFilterStudent,
  setDataFilterOther,
  getAllUser, getAllUserSuccess, getAllUserFail,
  getAllOfficer, getAllOfficerSuccess, getAllOfficerFail,
  getAllStudent, getAllStudentSuccess, getAllStudentFail,
  getAllOther, getAllOtherSuccess, getAllOtherFail,
} = user.actions

export default user.reducer;
