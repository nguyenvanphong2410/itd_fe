import { createSlice } from "@reduxjs/toolkit";

const category = createSlice({
  name: "category",
  initialState: {
    isLoadingGetAllCategory: false,
    isLoadingAddCategory: false,
    isLoadingDeleteCategory: false,
    isLoadingUpdateCategory: false,
    isLoadingGetDetailsCategory: false,
    listCategories: [],
    dataFilter: {
      search: "",
      sort_by: "",
      sort_order: "",
      page: 1,
      page_size: 4,
    },

    modalCategoryDelete: {
      isShowModalDelete: false,
    },

    modalAddCategory: {
      isShowModalAdd: false,
    },

    modalUpdateCategory: {
      isShowModalUpdate: false,
    },

    //Category Avtive
    categoryActive: {
      name: "",
      description: "",
    }
  },
  reducers: {

    //MODAL DELETE
    setOpenModalDelete: (state, actions) => ({
      ...state,
      modalCategoryDelete: {
        ...state.modalCategoryDelete,
        isShowModalDelete: actions.payload,
      },
    }),

    //MODAL ADD
    setOpenModalAddCategory: (state, actions) => ({
      ...state,
      modalAddCategory: {
        ...state.modalAddCategory,
        isShowModalAdd: actions.payload,
      },
    }),

    //MODAL ADD
    setOpenModalUpdateCategory: (state, actions) => ({
      ...state,
      modalUpdateCategory: {
        ...state.modalUpdateCategory,
        isShowModalUpdate: actions.payload,
      },
    }),

    //POST CATEGORY
    requestAddCategory: (state) => ({
      ...state,
      isLoadingAddCategory: true,
    }),
    requestAddCategorySuccess: (state, action) => ({
      ...state,
      isLoadingAddCategory: false,
      messageAddCategorySuccess: {
        message: action.payload.data,
      }
    }),
    requestAddCategoryFail: (state, action) => ({
      ...state,
      isLoadingAddCategory: false,

    }),

    //UPDATE EMPLOYEE
    requestUpdateCategory: (state) => ({
      ...state,
      isLoadingUpdateCategory: true,
    }),
    requestUpdateCategorySuccess: (state, action) => ({
      ...state,
      isLoadingUpdateCategory: false,

      messageUpdateCategorySuccess: {
        message: action.payload.data,
      }
    }),
    requestUpdateCategoryFail: (state, action) => ({
      ...state,
      isLoadingUpdateCategory: false,
      errorUpdate: {
        message: action.payload.data,
      }
    }),

    //GET ALL CATEGORY
    getAllCategory: (state) => ({
      ...state,
      isLoadingGetAllCategory: true
    }),

    getAllCategorySuccess: (state, action) => ({
      ...state,
      listCategories: action.payload.data,
      isLoadingGetAllCategory: false
    }),
    
    getAllCategoryFail: (state) => ({
      ...state,
      isLoadingGetAllCategory: false
    }),

    //DETAILS
    getDetailsCategory: (state) => ({
      ...state,
      isLoadingGetDetailsCategory: true
    }),
    getDetailsCategorySuccess: (state, action) => ({
      ...state,
      detailsCategory: action.payload,
      isLoadingGetDetailsCategory: false
    }),
    getDetailsCategoryFail: (state) => ({
      ...state,
      isLoadingGetDetailsCategory: false
    }),

    //GET DELETE CATEGORY
    deleteCategory: (state) => ({
      ...state,
      isLoadingGetAllCategory: true
    }),
    deleteCategorySuccess: (state, action) => ({
      ...state,
      isLoadingGetAllCategory: false
    }),
    deleteCategoryFail: (state) => ({
      ...state,
      isLoadingGetAllCategory: false
    }),

    //Category
    setCategoryActive: (state, action) => ({
      ...state,
      categoryActive: { ...action.payload }
    }),

    //Filter
    setCategoriesDataFilter: (state, action) => ({
      ...state,
      dataFilter: { ...action.payload }
    }),
  },
});

export const {
  setOpenModalDelete,
  setOpenModalAddCategory,
  setOpenModalUpdateCategory,
  getAllCategory, getAllCategorySuccess, getAllCategoryFail,
  getDetailsCategory, getDetailsCategorySuccess, getDetailsCategoryFail,
  setCategoriesDataFilter,
  requestAddCategory, requestAddCategorySuccess, requestAddCategoryFail,
  requestUpdateCategory, requestUpdateCategorySuccess, requestUpdateCategoryFail,
  deleteCategory, deleteCategorySuccess, deleteCategoryFail,
  setCategoryActive,

} = category.actions

export default category.reducer;
