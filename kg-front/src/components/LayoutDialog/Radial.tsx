import { FormControl, Grid, MenuItem, Select } from "@mui/material";
import "./LayoutDialog.css";
import { NumberInput } from "../NumberInput";
interface ChildProps {
  centerNumber: any;
  setCenterNumber: any;
  linkDis: any;
  setLinkDis: any;
  maxIter: any;
  setMaxIter: any;
  focusNode: any;
  setFocusNode: any;
  unitRadius: any;
  setUnitRadius: any;
  prevOverlap: any;
  setPrevOverlap: any;
  strict: any;
  setStrict: any;
  worker: any;
  setWorker: any;
}
export default function Radial({
  centerNumber,
  setCenterNumber,
  linkDis,
  setLinkDis,
  maxIter,
  setMaxIter,
  focusNode,
  setFocusNode,
  unitRadius,
  setUnitRadius,
  prevOverlap,
  setPrevOverlap,
  strict,
  setStrict, // 可选
  worker,
  setWorker,
}: ChildProps) {
  return (
    <Grid
      container
      direction="column"
      spacing={2}
      sx={{ fontSize: 17, color: "#434D5B" }}
    >
      <Grid item>
        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item>Center: [</Grid>
          <Grid item>
            <NumberInput
              value={centerNumber.from}
              onChange={(event, val: number | undefined) => {
                if (val !== undefined) {
                  setCenterNumber((pre: any) => ({
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
                  setCenterNumber((pre: any) => ({
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
        <Grid container direction="row" spacing={3} alignItems="center">
          <Grid item>LinkDistance:</Grid>
          <Grid item>
            <NumberInput
              value={linkDis}
              onChange={(event, val: number | undefined) => {
                if (val !== undefined) {
                  setLinkDis(val);
                }
              }}
            />
          </Grid>
          <Grid item>MaxIteration:</Grid>
          <Grid item>
            <NumberInput
              value={maxIter}
              onChange={(event, val: number | undefined) => {
                if (val !== undefined) {
                  setMaxIter(val);
                }
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row" spacing={4} alignItems="center">
          <Grid item>UnitRadius: </Grid>
          <Grid item id="radialRadius">
            <NumberInput
              value={unitRadius}
              onChange={(event, val: number | undefined) => {
                if (val !== undefined) {
                  setUnitRadius(val);
                }
              }}
            />
          </Grid>
          <Grid item id="radialFocus">FocusNode: </Grid>
          <Grid item>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 90 }}>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={focusNode}
                label="FocusNode"
              >
                <MenuItem
                  value={"degree"}
                  onClick={() => setFocusNode("node11")}
                >
                  node1
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
