import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import AutoComplete from "./AutoComplete";
import { Stack } from "@mui/material";
import { Graph } from "@antv/g6";
import { useSelector } from "react-redux";
import { AppState } from "../../../store";
import { useEffect, useState } from "react";
interface ChildProps {
  open: any;
  setOpen: any;
}
interface autoItem {
  title: string;
}
export default function InfoFilter({ open, setOpen }: ChildProps) {
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState<DialogProps["maxWidth"]>("sm");
  const [nodeLabel, setNodeLabel] = useState<autoItem[]>([]);
  const handleClose = () => {
    setOpen(false);
  };
  const handleSet = () => {
    setOpen(false);
  };

  const graphdata = useSelector((state: AppState) => state.GraphData.data);
  const nodes = graphdata.nodes;
  const edges = graphdata.edges;
  let labels: autoItem[] = [];
  let nodetype = [];
  useEffect(() => {
    if (nodes !== undefined && nodes.length > 0) {
      nodes.forEach((item: any) => {
        labels.push({ title: item.name });
      });
      setNodeLabel(labels);
    } else {
      console.log("nodes undefined!");
    }
  }, [graphdata]);

  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>搜索设置</DialogTitle>
        <DialogContent>
          <Stack
            noValidate
            component="form"
            spacing={3}
            sx={{
              m: 3,
              width: "fit-content",
            }}
          >
            <AutoComplete
              id={"node-label"}
              options={nodeLabel}
              label={"Node Label"}
              placeholder={"Choose Node label"}
            ></AutoComplete>
            <AutoComplete
              id={"node-type"}
              options={[]}
              label={"Node Type"}
              placeholder={"Choose Node Type"}
            ></AutoComplete>
            <AutoComplete
              id={"relationship-type"}
              options={[]}
              label={"Relationship Type"}
              placeholder={"Choose RelationShip Type"}
            ></AutoComplete>
            <AutoComplete
              id={"key"}
              options={[]}
              label={"Property keys"}
              placeholder={"Choose Property keys"}
            ></AutoComplete>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSet}>确认</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
