import { IconButton } from "@mui/material";
import SearchField from "./SearchField";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import "./Info.css";
import InfoFilter from "./InfoFilter";
import { useState } from "react";
import { SearchNodeName } from "../../../actions/dataAction";
import { useDispatch } from "react-redux";
export default function Info() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  //TODO
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleSearch = () => {
    setLoading(true);
    dispatch(SearchNodeName(inputValue));
    setLoading(false);
  };
  return (
    <div className="infoContainer">
      <div className="statistic"></div>
      <div className="detailInfo"> </div>
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
