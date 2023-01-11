import React from 'react';
import Live from "../components/live/Live";
import Grid from "@mui/material/Grid";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
function LiveChat(props) {
    return (
        <Grid container direction="row" justifyContent="space-evenly" alignItems="center">

            <Grid item xs={11} sm={11} lg={7}>
                <Live/>
            </Grid>
        </Grid>
    );
}

export default LiveChat;