import { FormControlLabel } from "@mui/material";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../store";
import { setMapModel } from "../../../actions/dataAction";
import CustomizedSlider from "./CustomizedSlider";

interface ChildProps {
  contentOpen: any;
}
export default function Actions({ contentOpen }: ChildProps) {
  const isMapModel = useSelector((state: AppState) => state.GraphData.isMapModel);
  const dispatch = useDispatch();
  const IOSSwitch = styled((props: SwitchProps) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 38,
    height: 20,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#D1A9B5",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 16,
      height: 16,
    },
    "& .MuiSwitch-track": {
      borderRadius: 20 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));
  const handleMapOpen = () => {
    if (isMapModel) {
      dispatch(setMapModel(false));     
    } else {
      dispatch(setMapModel(true))     
    }
  };

  return (
    <div
      className={`nodestyleContainer ${contentOpen.actions ? "" : "closed"}`}
    >
      <ul className="nodestyle">
        {/* <li>
          <div style={{ lineHeight: "20px" }}>MapModel </div>
          <IOSSwitch sx={{ m: 1 }} checked={isMapModel} onClick={handleMapOpen} />
        </li> */}
        <li><div style={{ lineHeight: "20px" }}>关系数量</div></li>
        <li className="nodeNumber">
        <CustomizedSlider></CustomizedSlider>
        </li>
      </ul>
    </div>
  );
}
