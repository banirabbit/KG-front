import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import "./LayoutDialog.css";
import { setLayoutInfo, setLayoutType } from "../../actions/layoutAction";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../store";
import { useState } from "react";
import {
  FormControl,
  Grid,
  InputLabel,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import { NumberInput } from "../NumberInput";
import Radial from "./Radial";

interface ChildProps {
  open: any;
  setOpen: any;
}

export default function LayoutDialog({ open, setOpen }: Readonly<ChildProps>) {
  const [type, setType] = useState("dagre");
  const layoutLabel = [
    {
      value: "random",
      label: "随机布局",
    },
    {
      value: "force",
      label: "力导向布局",
    },
    {
      value: "circular",
      label: "环形布局",
    },
    {
      value: "radial",
      label: "辐射布局",
    },
    {
      value: "dagre",
      label: "层次布局",
    },
  ];
  const dispatch = useDispatch();
  const [param, setParam] = useState(false);
  const [centerNumber, setCenterNumber] = useState({
    from: 500,
    to: 300,
  });
  const [radius, setRadius] = useState(200);
  const [check, setCheck] = useState(false);
  const [divisions, setDivisions] = useState(5);
  const [order, setOrder] = useState("degree");
  const [angle, setAngle] = useState(1);
  const [linkDis, setLinkDis] = useState(200);
  const [maxIter, setMaxIter] = useState(1000);
  const [focusNode, setFocusNode] = useState("node11");
  const [unitRadius, setUnitRadius] = useState(100);
  const [prevOverlap, setPrevOverlap] = useState(true); // 可选，必须配合 nodeSize
  const [strict, setStrict] = useState(false); // 可选
  const [worker, setWorker] = useState(true); // 可选，开启 web-worker
  const handleSet = async () => {
    if (type === "circular") {
      dispatch(
        setLayoutInfo({
          type: type,
          center: [centerNumber.from, centerNumber.to],
          radius: radius,
          divisions: divisions,
          ordering: order,
          clockwise: check,
          angleRatio: angle,
        })
      );
    } else if (type === "random") {
      dispatch(
        setLayoutInfo({
          type: type,
          center: [centerNumber.from, centerNumber.to],
        })
      );
    }
    setOpen(false);
    setParam(false);
  };
  const handleClose = () => {
    setOpen(false);
    setParam(false);
  };
  const handleparamOpen = () => {
    if (param === true) {
      setParam(false);
    } else {
      setParam(true);
    }
  };
  return (
    <Dialog open={open}>
      <DialogTitle>选择布局</DialogTitle>

      <DialogContent>
        <TextField
          id="standard-select-layout"
          select
          label="Select Layout"
          value={type}
          variant="standard"
        >
          {layoutLabel.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              onClick={() => setType(option.value)}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogContent>
        <Button
          id="settingButton"
          onClick={handleparamOpen}
          variant="outlined"
          startIcon={<SettingsOutlinedIcon />}
        >
          修改参数
        </Button>
      </DialogContent>
      <DialogContent>
        {param && (
          <div>
            {type === "circular" ? (
              <Grid
                container
                direction="column"
                spacing={2}
                sx={{ fontSize: 17, color: "#434D5B" }}
              >
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    spacing={3}
                    alignItems="center"
                  >
                    <Grid item>Center: [</Grid>
                    <Grid item>
                      <NumberInput
                        value={centerNumber.from}
                        onChange={(event, val: number | undefined) => {
                          if (val !== undefined) {
                            setCenterNumber((pre) => ({
                              ...pre,
                              from: val,
                            }));
                          }
                        }}
                      />
                    </Grid>
                    <Grid item>,</Grid>
                    <Grid item>
                      <NumberInput
                        value={centerNumber.to}
                        onChange={(event, val: number | undefined) => {
                          if (val !== undefined) {
                            setCenterNumber((pre) => ({
                              ...pre,
                              to: val,
                            }));
                          }
                        }}
                      />
                    </Grid>
                    <Grid item>]</Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    spacing={4}
                    alignItems="center"
                  >
                    <Grid item>Radius:</Grid>
                    <Grid item>
                      <NumberInput
                        value={radius}
                        onChange={(event, val: number | undefined) => {
                          if (val !== undefined) {
                            setRadius(val);
                          }
                        }}
                      />
                    </Grid>
                    <Grid item>Clockwise:</Grid>
                    <Grid item>
                      False
                      <Switch
                        checked={check}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setCheck(event.target.checked);
                        }}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                      True
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    spacing={3}
                    alignItems="center"
                  >
                    <Grid item>Divisions: </Grid>
                    <Grid item>
                      <NumberInput
                        value={divisions}
                        onChange={(event, val: number | undefined) => {
                          if (val !== undefined) {
                            setDivisions(val);
                          }
                        }}
                      />
                    </Grid>
                    <Grid item>Ordering: </Grid>
                    <Grid item>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 90 }}
                      >
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={order}
                          label="Order"
                        >
                          <MenuItem
                            value={"degree"}
                            onClick={() => setOrder("degree")}
                          >
                            按度数大小排序
                          </MenuItem>
                          <MenuItem
                            value={"null"}
                            onClick={() => setOrder("null")}
                          >
                            按数据顺序排序
                          </MenuItem>
                          <MenuItem
                            value={"topology"}
                            onClick={() => setOrder("topology")}
                          >
                            拓扑排序
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Grid item>AngleRatio: </Grid>
                    <Grid item>
                      <NumberInput
                        value={angle}
                        onChange={(event, val: number | undefined) => {
                          if (val !== undefined) {
                            setAngle(val);
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : type === "random" ? (
              // Render content for "random"
              <Grid
                container
                direction="row"
                spacing={3}
                alignItems="center"
                sx={{ fontSize: 17, color: "#434D5B" }}
              >
                <Grid item>Center: [</Grid>
                <Grid item>
                  <NumberInput
                    value={centerNumber.from}
                    onChange={(event, val: number | undefined) => {
                      if (val !== undefined) {
                        setCenterNumber((pre) => ({
                          ...pre,
                          from: val,
                        }));
                      }
                    }}
                  />
                </Grid>
                <Grid item>,</Grid>
                <Grid item>
                  <NumberInput
                    value={centerNumber.to}
                    onChange={(event, val: number | undefined) => {
                      if (val !== undefined) {
                        setCenterNumber((pre) => ({
                          ...pre,
                          to: val,
                        }));
                      }
                    }}
                  />
                </Grid>
                <Grid item>]</Grid>
              </Grid>
            ) : type === "radial" ? (
              // Render  content for radial
              <Radial
                centerNumber={centerNumber}
                setCenterNumber={setCenterNumber}
                linkDis={linkDis}
                setLinkDis={setLinkDis}
                maxIter={maxIter}
                setMaxIter={setMaxIter}
                focusNode={focusNode}
                setFocusNode={setFocusNode}
                unitRadius={unitRadius}
                setUnitRadius={setUnitRadius}
                prevOverlap={prevOverlap}
                setPrevOverlap={setPrevOverlap}
                strict={strict}
                setStrict={setStrict}
                worker={worker}
                setWorker={setWorker}
              ></Radial>
            ) : (
              <></>
            )}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleSet}>确认</Button>
      </DialogActions>
    </Dialog>
  );
}
