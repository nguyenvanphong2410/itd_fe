import documentReducer from './modules/document';
import categoryReducer from './modules/category';
import userReducer from './modules/user';

const rootReducer = {
  document: documentReducer,
  category: categoryReducer,
  user: userReducer,
}

export default rootReducer
