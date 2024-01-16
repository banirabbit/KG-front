import { Grid } from "@mui/material";
import { NumberInput } from "../NumberInput";
interface ChildProps {
    centerNumber: any,
    setCenterNumber: any,
    linkDis: any,
    setLinkDis: any,
}
export default function Force({
    centerNumber,
    setCenterNumber,
    linkDis,
    setLinkDis, }: ChildProps) {
    return (
        <Grid
            container
            direction="column"
            spacing={2}
            sx={{ fontSize: 17, color: "#434D5B" }}>
            {/* center */}
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
            {/* linkDistance */}
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
                </Grid>
            </Grid>
        </Grid>
    )
}