import * as actions from "../actions/layoutAction";
const initState = {
  layoutInfo: {
    type: "dagre",
  },
};

export default function LayoutReducer(state = initState, action: any) {
  switch (action.type) {
    case actions.SET_LAYOUTINFO:
      return {
        ...state,
        layoutInfo: action.data,
      };
    default:
      return state;
  }
}
