import * as actions from "../actions/dataAction";

const initState = {
  data: {},
  searchNodes: [],
  appendData: {},
  citys: [],
  isMapModel: false,
  length: 0,
  relationships: 20,
  selectedNodes: 0,
  selectedInfo:{},
  loading: false,
  total:0,
};

export default function DataReducer(state = initState, action: any) {
  const { type, data } = action;
  switch (type) {
    case actions.GET_GRAPHDATA:
      return {
        ...state,
        data: data,
      };
    case actions.GET_APPENDNODE:
      return {
        ...state,
        appendData: data,
      };
    case actions.GET_SEARCH:
      return {
        ...state,
        searchNodes: data,
      };
    case actions.GET_CITYS:
      return {
        ...state,
        citys: data,
      };
    case actions.SET_MAPMODEL:
      return {
        ...state,
        isMapModel: data,
      };
    case actions.GET_LENGTH:
      return {
        ...state,
        length: data,
      };
    case actions.SET_RELA:
      return {
        ...state,
        relationships: data,
      };
    case actions.SET_SELECTNODE:
      return {
        ...state,
        selectedNodes: data,
      };
    case actions.SET_SELECTINFO:
      return {
        ...state,
        selectedInfo: data,
      }
    case actions.SET_LOADING:
      return {
        ...state,
        loading: data,
      }
    case actions.GET_TOTALNUM:
      return {
        ...state,
        total: data,
      }
    default:
      return state;
  }
}
