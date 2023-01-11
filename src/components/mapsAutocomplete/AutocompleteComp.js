import Grid from "@mui/material/Grid";
import {Autocomplete} from "@react-google-maps/api";
import Typography from "@mui/material/Typography";
import {InputBase} from "@mui/material";
import React, {useState, useEffect} from 'react';
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Button from '@mui/material/Button';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginBottom: 15,
    color: theme.palette.text.secondary,
    background: '#fdfffc'
}));
export default function AutocompleteComp({setAddress, setDefaultCords, setCoords}) {
    const [autocomplete, setAutocomplete] = useState(null);
    const onLoad = (autoC) => setAutocomplete(autoC);

    const onPlaceChanged = () => {
        const lat = autocomplete.getPlace().geometry.location.lat();
        const lng = autocomplete.getPlace().geometry.location.lng();
        setAddress(autocomplete.getPlace().formatted_address)

        //TODO
        //get 41.90... from firebase/redux
        //get -87.6.... from firebase/redux
        let newLat = lat + (41.9064522 - lat) * 0.5
        let newLng = lng + (-87.66874949999999 - lng) * 0.5

        setDefaultCords({ lat: newLat, lng: newLng })
        setCoords({ lat, lng });

    };

    return (
            <Item elevation={4}>
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                    <div>
                        <div>
                            <Typography variant="h6" gutterBottom style={{color: 'gray', marginTop: 10}}>
                                Where is your car located?
                            </Typography>
                        </div>
                        <InputBase style={{width: '90%', margin: 'auto'}} placeholder="Enter here…"/>
                    </div>
                </Autocomplete>
            </Item>
        )

}