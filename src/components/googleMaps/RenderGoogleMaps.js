import React, {useState, useEffect} from 'react';
import GoogleMapReact from "google-map-react";
import mapStyles from "../../pages/mapStyles";
import ElectricRickshawIcon from "@mui/icons-material/ElectricRickshaw";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";

export default function RenderGoogleMaps({coords, driverLiveLocation, defaultCords, address}) {
    //GOOGLEMAPREACT Section start here
    //data passed from GoogleMapReact
    const[apiData, setApiData] = useState()

    useEffect(()=>{
        if(apiData){
            apiIsLoaded(apiData.map, apiData.maps)
        }
    }, [address])

    //render to GoogleMapReact
    const[mapRenderer, setMapRenderer] = useState()

    if(address&&!mapRenderer){
        setMapRenderer(new apiData.maps.DirectionsRenderer({markerOptions: {visible: false}, polylineOptions: {strokeColor: '#003248'}}))
    }

    const apiIsLoaded = () => {
        if(address) {

            const directionsService = new apiData.maps.DirectionsService();
            const origin = { lat: driverLiveLocation.lat, lng: driverLiveLocation.lng };
            const destination = { lat: coords.lat, lng: coords.lng };
            directionsService.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: apiData.maps.TravelMode.DRIVING,
                    avoidHighways: true
                },
                (result, status) => {
                    if (status === apiData.maps.DirectionsStatus.OK) {
                        mapRenderer.setMap(apiData.map)
                        mapRenderer.setDirections(result);
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            );

        }
    }
    //GOOGLEMAPREACT Section ends here
    const AnyReactComponent = ({ text }) => <div style={{position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: 1, '&:hover': { zIndex: 2 }}}>
        <ElectricRickshawIcon color="primary" fontSize="large"/>
    </div>;

    const AnyReactComponentTwo = ({ text }) => <div style={{position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: 1, '&:hover': { zIndex: 2 }}}>
        <EmojiPeopleIcon color="primary" fontSize="large"/>
    </div>;
    if(driverLiveLocation&&driverLiveLocation.lat){
        //defaultProps are for the driver
        const defaultProps = {
            center: {
                lat: driverLiveLocation.lat,
                lng: driverLiveLocation.lng
            },
            zoom: 11
        };

        return(
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: "AIzaSyBdAwVeblMeVBwNcdOCCqWwoPkeHDziBdY" }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={13}
                    center={defaultCords}
                    yesIWantToUseGoogleMapApiInternals
                    margin={[50, 50, 50, 50]}
                    onGoogleApiLoaded={({ map, maps }) => {
                        // dispatch(setRDMMaps(stringify(maps)))
                        // dispatch(setRDMMap(stringify(map)))
                        setApiData({map: map, maps: maps})
                        // apiIsLoaded(map, maps)
                    }}
                    options={{ disableDefaultUI: true, zoomControl: true, styles: mapStyles }}
                >
                    <AnyReactComponent
                        lat={driverLiveLocation.lat}
                        lng={driverLiveLocation.lng}
                        text="Closest driver"
                    />
                    {coords.lat&&
                        <AnyReactComponentTwo
                            lat={coords.lat}
                            lng={coords.lng}
                            text="Your location"
                        />
                    }

                </GoogleMapReact>
            </div>
        )
    }




}