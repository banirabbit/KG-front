import * as React from "react";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../store";
import { useState } from "react";
import { setLoading, setRelationships } from "../../../actions/dataAction";

const PrettoSlider = styled(Slider)({
  color: "#D1A9B5",
  height: 4,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 15,
    width: 15,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1,
    fontSize: 10,
    background: "unset",
    padding: 0,
    width: 20,
    height: 20,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#D1A9B5",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&::before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

export default function CustomizedSlider() {
  const {relationships:rela, total:total} = useSelector((state:AppState) => state.GraphData)
  const [value, setValue] = useState(rela);
  const dispatch = useDispatch();
  const [timer, setTimer] = useState<NodeJS.Timeout|null>(null); // 声明定时器的变量
  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number)

     // 清除旧的定时器
  if (timer !== null) {
    clearTimeout(timer);
  }
  
    // 设置一个新的定时器，在用户停止滑动后1秒执行
  setTimer(setTimeout(function() {
    console.log(newValue)
    dispatch(setLoading(false));
    dispatch(setRelationships(value));
 
  }, 300));
  }
  return (
    <PrettoSlider
      valueLabelDisplay="auto"
      aria-label="pretto slider"
      defaultValue={rela}
      value={value}
      onChange={handleChange}
      min={5}
      max={total !== 0 ? total:10000}
    />
  );
}
