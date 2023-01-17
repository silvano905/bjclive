import React, {useState, useEffect} from 'react';
import {Navigate, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import LiveChat from "./LiveChat";
import {parse, stringify, toJSON, fromJSON} from 'flatted';
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
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import {isVisible} from "@testing-library/user-event/dist/utils";
import {wrapMapToPropsConstant} from "react-redux/lib/connect/wrapMapToProps";
import {selectAppointments} from "../redux/appointments/appointmentsSlice";
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginBottom: 15,
    color: theme.palette.text.secondary,
    background: '#fdfffc',
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
}));

const ItemThree = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    background: "linear-gradient(45deg, #4ea8de 8%, #5e60ce 80%)",
    height: 110,
    color: 'white',
    lineHeight: '60px',
    margin: '6px 50px 20px 59px',
    paddingTop: 8
}));

function Home() {
    const dispatch = useDispatch()
    // const currentMap = useSelector(selectRDM)
    const driverLiveLocation = useSelector(selectDriverLocation)
    // const map = useSelector(selectRDMMap)
    // const maps = useSelector(selectRDMMaps)
    const appointments = useSelector(selectAppointments)

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

    const[apiData, setApiData] = useState()

    useEffect(()=>{
        if(apiData){
            apiIsLoaded(apiData.map, apiData.maps)
        }
    }, [address])


    // let directionsRenderer;
    // if(address&&!currentMap){
    //     directionsRenderer = new maps.DirectionsRenderer({markerOptions: {visible: false}, polylineOptions: {strokeColor: '#003248'}});
    //     dispatch(setRDM(directionsRenderer))
    // }
    const[xx, setXx] = useState()

    if(address&&!xx){
        setXx(new apiData.maps.DirectionsRenderer({markerOptions: {visible: false}, polylineOptions: {strokeColor: '#003248'}}))
    }

    const apiIsLoaded = () => {
        // if(address) {
        //     const directionsService = new maps.DirectionsService();
        //     const origin = { lat: driverLiveLocation.lat, lng: driverLiveLocation.lng };
        //     const destination = { lat: coords.lat, lng: coords.lng };
        //     directionsService.route(
        //         {
        //             origin: origin,
        //             destination: destination,
        //             travelMode: maps.TravelMode.DRIVING,
        //             avoidHighways: true
        //         },
        //         (result, status) => {
        //             if (status === maps.DirectionsStatus.OK) {
        //                 currentMap.setMap(map)
        //                 currentMap.setDirections(result);
        //             } else {
        //                 console.error(`error fetching directions ${result}`);
        //             }
        //         }
        //     );
        //
        // }

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
                        xx.setMap(apiData.map)
                        xx.setDirections(result);
                    } else {
                        console.error(`error fetching directions ${result}`);
                    }
                }
            );

        }
    }

    const[requestAppointment, setRequestAppointment] = useState(false)
    const[appointmentFilter, setAppointmentFilter] = useState('today')

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
            if(doc.data().available){
                setRequestAppointment(false)
            }else {
                setRequestAppointment(true)
            }
            setDefaultCords({lat: doc.data().lat, lng: doc.data().lng})
        });

    }, []);

    const[selectedDay, setSelectedDay] = useState('today')

    const AnyReactComponent = ({ text }) => <div style={{position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: 1, '&:hover': { zIndex: 2 }}}>
        <ElectricRickshawIcon color="primary" fontSize="large"/>
    </div>;

    const AnyReactComponentTwo = ({ text }) => <div style={{position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: 1, '&:hover': { zIndex: 2 }}}>
        <EmojiPeopleIcon color="primary" fontSize="large"/>
    </div>;

    const [selectedHour, setSelectedHour] = useState({})


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
                            <Typography variant="h4" gutterBottom style={{color: '#3f4238'}}>
                                Closest Driver
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                                <span style={{color: 'blue', fontSize: 30}}>{time}</span> away from
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                                <span style={{color: '#023047'}}>{address}</span>
                            </Typography>
                            <Divider>
                                <BoltIcon />
                            </Divider>
                            <ItemThree elevation={6}>
                                <Typography variant="h4" gutterBottom style={{color: '#2a2a2a'}}>
                                    Final Price
                                </Typography>
                                <Typography variant="h4" gutterBottom style={{color: '#fdfdfd', marginBottom: 20}}>
                                    $39.00
                                </Typography>
                            </ItemThree>


                            <PhoneNumberForm needsAppointment={requestAppointment}
                                             address={address} setSelectedHour={setSelectedHour}
                                             driver={driverLiveLocation} hour={selectedHour}
                                             appointments={appointments}/>

                            {requestAppointment?
                                <>
                                    <DatePickerComp setSelectedHour={setSelectedHour}/>

                                    <Button style={{margin: '20px auto 10px auto'}} type="submit" variant="outlined" onClick={()=>setRequestAppointment(false)}>
                                        close
                                    </Button>
                                </>
                                :
                                <Button style={{margin: '20px auto 10px auto'}} type="submit" variant="outlined" onClick={()=>setRequestAppointment(true)}>
                                    make appointment
                                </Button>
                            }

                        </Item>
                    </Grid>
                }

                {/*<LiveChat/>*/}

                {/*<Grid item sm={11} lg={10} xs={11}>*/}
                {/*    <DatePickerComp/>*/}
                {/*</Grid>*/}

                </Grid>
        );
    }else {
        return (
            <div>loading</div>
        )
    }



}

export default Home;