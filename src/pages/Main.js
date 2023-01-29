import React, {useState, useEffect} from 'react';
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Live from "../components/live/Live";
import {parse, stringify, toJSON, fromJSON} from 'flatted';
import GoogleMapReact from 'google-map-react';
import {
    collection, addDoc,
    query, orderBy, serverTimestamp, limit,
    onSnapshot, getDocs, where, doc, updateDoc
} from "firebase/firestore";
import RenderGoogleMaps from "../components/googleMaps/RenderGoogleMaps";
import {db} from '../config-firebase/firebase';
import DatePickerComp from "../components/appointment/DatePickerComp";
import AutocompleteComp from "../components/mapsAutocomplete/AutocompleteComp";
import PhoneNumberForm from "../components/formRequest/PhoneNumberForm";
import CalculateDistance from "../components/calculateDistance/CalculateDistance";
import {getLocation, setLocation, selectDriverLocation} from "../redux/driverLocation/driverLocationSlice";
import {setUser, setJumpStart, selectUser, selectJumpStart, clearUser} from "../redux/user/userSlice";
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
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
    getAppointments,
    selectAppointments
} from "../redux/appointments/appointmentsSlice";
import CloseIcon from '@mui/icons-material/Close';
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
    height: 110,
    color: 'black',
    lineHeight: '60px',
    margin: '6px 50px 20px 59px',
    paddingTop: 8
}));

const ItemFour = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    background: "linear-gradient(45deg, #0077b6 8%, #023e8a 80%)",
    color: 'white',
    lineHeight: '60px',
    margin: '6px 50px 20px 59px',
    padding: 5
}));

function Main() {
    const dispatch = useDispatch()
    const driverLiveLocation = useSelector(selectDriverLocation)
    const appointments = useSelector(selectAppointments)

    const user = useSelector(selectUser)
    const jumpStart = useSelector(selectJumpStart)
    let location = useLocation()

    //googleMapReact section
    const [coords, setCoords] = useState({});
    //defaultCords are for the driver
    const [defaultCords, setDefaultCords] = useState({
            lat: null,
            lng: null
        }
    );
    const navigate = useNavigate()


    //what the user submitted as their location
    const [address, setAddress] = useState(null)

    //the time it takes the driver to get to the location
    const [time, setTime] = useState()

    const[requestAppointment, setRequestAppointment] = useState(false)

    useEffect(() => {
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

    const [selectedHour, setSelectedHour] = useState({})

    if(jumpStart&&!jumpStart.data.canceled&&!jumpStart.data.completed){
        return navigate(`/jump/${jumpStart.id}`)
    }

    if(driverLiveLocation&&driverLiveLocation.lat){
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
                    <RenderGoogleMaps coords={coords} address={address} defaultCords={defaultCords} driverLiveLocation={driverLiveLocation}/>
                </Grid>

                {user && jumpStart && !jumpStart.data.canceled ?
                    null
                    :
                    <Grid item sm={11} lg={10} xs={11}>
                        <AutocompleteComp
                            setAddress={setAddress}
                            setDefaultCords={setDefaultCords}
                            setCoords={setCoords}
                        />
                    </Grid>
                }


                {address&&
                    <Grid item sm={11} lg={10} xs={11}>
                        <Item elevation={4}>
                            <Typography variant="h4" gutterBottom style={{color: '#3f4238'}}>
                                Closest Driver
                            </Typography>
                            <ItemFour elevation={6}>
                                <Typography variant="h5" gutterBottom>
                                    <span style={{color: '#9ef01a', fontSize: 30}}>{time}</span> away from
                                </Typography>
                            </ItemFour>

                            <KeyboardDoubleArrowDownIcon fontSize='large'/>
                            <Typography variant="h5" gutterBottom>
                                <span style={{color: '#023047'}}>{address}</span>
                            </Typography>
                            <Divider>
                                <BoltIcon />
                            </Divider>
                            <ItemThree elevation={6}>
                                <Typography variant="h4" gutterBottom style={{color: '#5d5d5d'}}>
                                    Final Price
                                </Typography>
                                <Typography variant="h4" gutterBottom style={{color: '#171717', marginBottom: 20}}>
                                    $39.00
                                </Typography>
                            </ItemThree>


                            <PhoneNumberForm needsAppointment={requestAppointment}
                                             address={address} setSelectedHour={setSelectedHour}
                                             driver={driverLiveLocation} hour={selectedHour}
                                             appointments={appointments} defaultCords={defaultCords} coords={coords}/>

                            {requestAppointment?
                                <>
                                    <Button style={{margin: '20px auto 2px auto'}} type="submit" variant="outlined" onClick={()=>setRequestAppointment(false)}>
                                        <CloseIcon/>
                                    </Button>
                                    <DatePickerComp setSelectedHour={setSelectedHour}/>
                                </>
                                :
                                <>
                                    <Divider style={{margin: '12px auto -8px auto'}}>
                                        <AccessTimeIcon />
                                    </Divider>
                                    <Button style={{margin: '20px auto 10px auto'}} type="submit" variant="contained" color="success" onClick={()=>setRequestAppointment(true)}>
                                        make appointment
                                    </Button>
                                </>

                            }

                        </Item>
                    </Grid>
                }

            </Grid>
        );
    }else {
        return (
            <div>loading</div>
        )
    }



}

export default Main;