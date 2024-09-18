import { useSelector } from "react-redux";
import { AppState } from "../../store";
import "./index.css";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { IconButton } from "@mui/material";
interface props {
  viewDetail: boolean;
  viewClick: boolean;
  setViewClick: any;
}
export default function RightTopStatistic({
  viewDetail,
  viewClick,
  setViewClick,
}: props) {
  const { length, selectedNodes, total } = useSelector(
    (state: AppState) => state.GraphData
  );

  return (
    <div className="RightTop">
      <ul>
        <li>
          <div>
            {length === undefined ? 0 : length}:
            {total === undefined ? 0 : total}
          </div>
          <div>Nodes</div>
        </li>
        <li>
          <div>{selectedNodes === undefined ? 0 : selectedNodes}</div>
          <div>Selected Nodes</div>
        </li>
        {viewDetail ? (
          <IconButton
            size="large"
            onClick={() => {
              if (viewClick) setViewClick(false);
              else setViewClick(true);
            }}
          >
            <VisibilityOutlinedIcon
              style={{ color: "#ffffffde", fontSize: "inherit" }}
            ></VisibilityOutlinedIcon>
          </IconButton>
        ) : (
          <></>
        )}
      </ul>
    </div>
  );
}
