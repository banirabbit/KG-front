export const SET_LAYOUT = "SET_LAYOUT";
export const SET_LAYOUTINFO = "SET_LAYOUTINFO";
export const SET_MAPMODEL = "SET_MAPMODEL";
export const setLayoutType = (data: string) => async (dispatch: Function) => {
  dispatch({
    type: SET_LAYOUT,
    data: data,
  }
  )
}

export const setLayoutInfo = (data: any) => async (dispatch: Function) => {
  dispatch({
    type: SET_LAYOUTINFO,
    data: data,
  }
  )
}
