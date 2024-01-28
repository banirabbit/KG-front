import * as actions from "../actions/dataAction";

const initState = {
  data: {}
};

export default function DataReducer(state = initState, action: any) {
  const { type, data } = action;
  switch (type) {
    case actions.GET_GRAPHDATA:
      return {
        ...state,
        data: data,
      };
    
    default:
      return state;
  }
}
