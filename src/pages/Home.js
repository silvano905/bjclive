import React, {useState, useEffect} from 'react';
import {Navigate, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import LiveChat from "./LiveChat";
import GoogleMapReact from 'google-map-react';
import {
    collection, addDoc,
    query, orderBy, serverTimestamp, limit,
    onSnapshot, getDocs, where, doc
} from "firebase/firestore";
import {db} from '../config-firebase/firebase';
import DatePickerComp from "../components/appointment/DatePickerComp";
import AutocompleteComp from "../components/mapsAutocomplete/AutocompleteComp";
import PhoneNumberForm from "../components/formRequest/PhoneNumberForm";
import CalculateDistance from "../components/calculateDistance/CalculateDistance";
import {getLocation, setLocation, selectDriverLocation, selectRDM, setRDM, selectRDMMap, selectRDMMaps, setRDMMap, setRDMMaps} from "../redux/driverLocation/driverLocationSlice";
import mapStyles from './mapStyles';
import Grid from "@mui/material/Grid";
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw';
import {styled} from "@mui/material/styles";
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import Divider from '@mui/material/Divider';
import BoltIcon from '@mui/icons-material/Bolt';
import Paper from "@mui/material/Paper";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {isVisible} from "@testing-library/user-event/dist/utils";
import {wrapMapToPropsConstant} from "react-redux/lib/connect/wrapMapToProps";
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginBottom: 15,
    color: theme.palette.text.secondary,
    background: '#fdfffc',
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
}));

function Home() {
    const dispatch = useDispatch()
    const currentMap = useSelector(selectRDM)
    const driverLiveLocation = useSelector(selectDriverLocation)
    const map = useSelector(selectRDMMap)
    const maps = useSelector(selectRDMMaps)

    let location = useLocation()

    //googleMapReact section
    const [coords, setCoords] = useState({});
    //defaultCords are for the driver
    const [defaultCords, setDefaultCords] = useState({
        lat: null,
        lng: null
    }
    );

    const [address, setAddress] = useState(null)

    const [time, setTime] = useState()


    useEffect(()=>{
        apiIsLoaded(map, maps)
    }, [address])


    let directionsRenderer;
    if(address&&!currentMap){
        console.log('i ran here')
        directionsRenderer = new maps.DirectionsRenderer({markerOptions: {visible: false}, polylineOptions: {strokeColor: '#003248'}});
        dispatch(setRDM(directionsRenderer))
    }

    const apiIsLoaded = () => {
        if(address) {
            const directionsService = new maps.DirectionsService();
            const origin = { lat: driverLiveLocation.lat, lng: driverLiveLocation.lng };
            const destination = { lat: coords.lat, lng: coords.lng };
            directionsService.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: maps.TravelMode.DRIVING,
                    avoidHighways: true
                },
                (result, status) => {
                    if (status === maps.DirectionsStatus.OK) {
                        currentMap.setMap(map)
                        currentMap.setDirections(result);
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            );

        }

    }


    useEffect(() => {
        // let driverLocationRef = collection(db, 'driverLocation');
        // let driverQuery = query(driverLocationRef, orderBy('timestamp', 'desc'), limit(1), where("available", "==", true))
        // onSnapshot(driverQuery, (snapshot) => {
        //     // dispatch(
        //     //     getLocation(
        //     //         snapshot.docs.map(doc => ({data: doc.data(), id: doc.id}))
        //     //     )
        //     // )
        // })
        const unsub = onSnapshot(doc(db, "driverLocation", "aUzONUhgWy71y2RqIeBW"), (doc) => {
            dispatch(
                getLocation(
                    doc.data()
                )
            )
            setDefaultCords({lat: doc.data().lat, lng: doc.data().lng})
        });

    }, []);


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

        //end googleMapReact section


        return (
            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">

                {coords.lat&&
                    <CalculateDistance
                        setTime={setTime}
                        coords={coords}
                        driverLocation={driverLiveLocation}
                    />
                }

                <Grid item xs={11} sm={11} lg={7}>
                    <div style={{ height: '100vh', width: '100%' }}>
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: "AIzaSyBdAwVeblMeVBwNcdOCCqWwoPkeHDziBdY" }}
                            defaultCenter={defaultProps.center}
                            defaultZoom={13}
                            center={defaultCords}
                            yesIWantToUseGoogleMapApiInternals
                            margin={[50, 50, 50, 50]}
                            onGoogleApiLoaded={({ map, maps }) => {
                                dispatch(setRDMMaps(maps))
                                dispatch(setRDMMap(map))
                                // setApiData({map: map, maps: maps})
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
                </Grid>

                <Grid item sm={11} lg={10} xs={11}>
                    <AutocompleteComp
                        setAddress={setAddress}
                        setDefaultCords={setDefaultCords}
                        setCoords={setCoords}
                    />
                </Grid>

                {address&&
                    <Grid item sm={11} lg={10} xs={11}>
                        <Item elevation={4}>
                            <Typography variant="h6" gutterBottom style={{color: '#3f4238'}}>
                                Closest Driver
                            </Typography>
                            <Typography variant="h6" gutterBottom style={{fontSize: 19}}>
                                <span style={{color: 'blue'}}>{time}</span> away from
                            </Typography>
                            <Typography variant="body1" gutterBottom style={{fontSize: 19}}>
                                <span style={{color: 'blue'}}>{address}</span>
                            </Typography>
                            <Divider>
                                <BoltIcon />
                            </Divider>
                            <Typography variant="body1" gutterBottom style={{fontSize: 16}}>
                                final price
                            </Typography>
                            <Typography variant="h5" gutterBottom style={{color: '#16db93'}}>
                                $39.00
                            </Typography>

                            <PhoneNumberForm/>

                        </Item>
                    </Grid>
                }

                <LiveChat/>

                <Grid item sm={11} lg={10} xs={11}>
                    <DatePickerComp/>
                </Grid>

                </Grid>
        );
    }else {
        return (
            <div>loading</div>
        )
    }



}

export default Home;