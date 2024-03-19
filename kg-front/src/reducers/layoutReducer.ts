import * as actions from "../actions/layoutAction";
const from = window.innerWidth / 2;
const to = window.innerHeight / 2;
const initState = {
  layoutInfo: {
    
  },
  isBigModel: false,
  focusNode: "",
};

export default function LayoutReducer(state = initState, action: any) {
  switch (action.type) {
    case actions.SET_LAYOUTINFO:
      return {
        ...state,
        layoutInfo: action.data,
      };
    case actions.SET_BIGMODEL:
      return {
        ...state,
        isBigModel: action.data,
      }
    case actions.SET_FOCUS:
      return {
        ...state,
        focusNode: action.data,
      }
    default:
      return state;
  }
}
