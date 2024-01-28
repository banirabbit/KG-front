import { combineReducers } from "redux";
import LayoutReducer from "./layoutReducer";
import DataReducer from "./DataReducer";

const rootReducer = combineReducers({
    Layout: LayoutReducer,
    GraphData: DataReducer,
  });
export default rootReducer;
