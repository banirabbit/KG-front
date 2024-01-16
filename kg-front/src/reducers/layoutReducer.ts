import * as actions from "../actions/layoutAction";
const from = window.innerWidth* 0.15;
const to = window.innerHeight / 2 - window.innerHeight* 0.15;
const initState = {
  layoutInfo: {
    type: "dagre",
    begin: [from, to],
    rankdir: 'LR', 
    align: 'DL', 
    nodesep: 20, 
    ranksep: 50, 
    controlPoints: true, 
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
