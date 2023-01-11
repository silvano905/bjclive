import Grid from "@mui/material/Grid";
import {Autocomplete} from "@react-google-maps/api";
import Typography from "@mui/material/Typography";
import {InputBase} from "@mui/material";
import React, {useState, useEffect} from 'react';
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function PhoneNumberForm() {
    const [formData, setFormData] = useState({
        phone: null
    });
    const { phone } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });
    const requestJumpStart = (e) => {
        e.preventDefault()
    }

    return(
        <form onSubmit={requestJumpStart}>
            <FormControl style={{marginBottom: 10}}>
                <TextField
                    fullWidth
                    variant="outlined"
                    id="standard-basic2"
                    label="Phone Number"
                    name="phone"
                    type="number"
                    onInput={(e)=>{
                        e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,10)
                    }}
                    value={phone}
                    onChange={onChange}
                    required
                />
            </FormControl>

            <Typography variant="body1" gutterBottom style={{fontSize: 16}}>
                we need your phone number to contact you when the driver has arrived to your location
            </Typography>

            <Button type="submit" variant="contained">
                request jumpstart
            </Button>
        </form>
    )
}