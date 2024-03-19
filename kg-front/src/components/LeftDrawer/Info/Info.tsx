import { IconButton } from "@mui/material";
import SearchField from "./SearchField";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import "./Info.css";
import InfoFilter from "./InfoFilter";
import { useEffect, useState } from "react";
import { SearchNodeName, setLoading } from "../../../actions/dataAction";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../store";
import DetailInfo from "./DetailInfo";
export default function Info() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const loading = useSelector((state:AppState) => state.GraphData.loading)
  const dispatch = useDispatch();
  const handleSearch = () => {
    // dispatch(setLoading(false));
    dispatch(SearchNodeName(inputValue));
  };
  const selectedInfo = useSelector(
    (state: AppState) => state.GraphData.selectedInfo
  );
  useEffect(() => {
    console.log(selectedInfo);
  }, [selectedInfo]);
  return (
    <div className="infoContainer">
      
      <div className="detailInfo">
      <div className="divider"></div>
        {Object.keys(selectedInfo).length === 0 ? (
          <div className="notice">Select a node to show information</div>
        ) : (
          <DetailInfo></DetailInfo>
        )}
      </div>

      <div className="searchfield">
        <IconButton
          sx={{ p: "10px 10px 0 10px", color: "#E0E3E7" }}
          aria-label="menu"
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <SearchField
          inputValue={inputValue}
          setInputValue={setInputValue}
        ></SearchField>
        <IconButton
          type="button"
          sx={{ p: "10px 10px 0 10px", color: "#E0E3E7" }}
          aria-label="search"
          onClick={() => {
            handleSearch();
          }}
        >
          <SearchIcon />
        </IconButton>
      </div>
      <InfoFilter open={open} setOpen={setOpen}></InfoFilter>
    </div>
  );
}
