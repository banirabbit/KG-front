import * as React from "react";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../store";
import { useState } from "react";
import { setRelationships } from "../../../actions/dataAction";

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
  const rela = useSelector((state:AppState) => state.GraphData.relationships)
  const [value, setValue] = useState(rela);
  const dispatch = useDispatch();
  let timer:any;
  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number)
    clearTimeout(timer);
    // 设置一个新的定时器，在用户停止滑动后0.5秒执行
  timer = setTimeout(function() {
    dispatch(setRelationships(value));
    console.log(rela)
  }, 3000);
  }
  return (
    <PrettoSlider
      valueLabelDisplay="auto"
      aria-label="pretto slider"
      defaultValue={rela}
      value={value}
      onChange={handleChange}
      min={5}
      max={1000}
    />
  );
}
