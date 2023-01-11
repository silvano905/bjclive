
import {Autocomplete, DistanceMatrixService} from "@react-google-maps/api";
import React, {useState, useEffect} from 'react';

export default function CalculateDistance({setTime, coords, driverLocation}) {
    return(
        <DistanceMatrixService
            options={{
                destinations: [{lat:coords.lat, lng:coords.lng}],
                origins: [{lng:driverLocation.lng, lat:driverLocation.lat}],
                travelMode: "DRIVING",
            }}
            callback = {(res) => {
                setTime(res.rows[0].elements[0].duration.text)
            }}
        />
    )

}