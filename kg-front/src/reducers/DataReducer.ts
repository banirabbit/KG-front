import * as actions from "../actions/dataAction";

const initState = {
  node: [],
  edge: [],
};

export default function DataReducer(state = initState, action: any) {
  const { type, data } = action;
  switch (type) {
    case actions.GET_NODE:
      return {
        ...state,
        node: data,
      };
    case actions.GET_EDGE:
      return {
        ...state,
        edge: data,
      };
    default:
      return state;
  }
}
