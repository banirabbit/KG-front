import { combineReducers } from "redux";
import LayoutReducer from "./layoutReducer";

const rootReducer = combineReducers({
    Layout: LayoutReducer,
  });
export default rootReducer;
