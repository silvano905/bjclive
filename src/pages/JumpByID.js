import React, {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    where,
    doc,
    getDoc,
    onSnapshot,
    updateDoc
} from "firebase/firestore";
import {db} from "../config-firebase/firebase";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CardMedia from '@mui/material/CardMedia';
import Select from "@mui/material/Select";
import {useParams} from "react-router-dom";
import RenderGoogleMaps from "../components/googleMaps/RenderGoogleMaps";
import {getLocation, selectDriverLocation} from "../redux/driverLocation/driverLocationSlice";
import CalculateDistance from "../components/calculateDistance/CalculateDistance";
import {clearUser, selectJumpStart, selectUser, setJumpStart, setUser} from "../redux/user/userSlice";
import Divider from "@mui/material/Divider";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import Live from "../components/live/Live";


//end material ui

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin:5
}));

const StyledText = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'linear-gradient(45deg, #02CC92 8%, #1283C9 80%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center'
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

const StyledTextTwo = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'black',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center'
}));

const StyledTextThree = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    background: 'linear-gradient(45deg, #80ed99 30%, #57cc99 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(11, 82, 91, .5)',
    color: 'white',
    padding: 5,
    fontSize: 18,
    textAlign: 'center'
}));

const JumpByID = () => {
    const params = useParams();
    const dispatch = useDispatch()
    const[item, setItem] = useState()
    const driverLiveLocation = useSelector(selectDriverLocation)
    const user = useSelector(selectUser)
    const jumpStart = useSelector(selectJumpStart)
    //what the user submitted as their location
    const [address, setAddress] = useState(null)

    //the time it takes the driver to get to the location
    const [time, setTime] = useState()

    //googleMapReact section
    const [coords, setCoords] = useState({});
    //defaultCords are for the driver
    const [defaultCords, setDefaultCords] = useState({
            lat: null,
            lng: null
        }
    );

    const[message, setMessage] = useState()

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "driverLocation", "aUzONUhgWy71y2RqIeBW"), (doc) => {
            dispatch(
                getLocation(
                    doc.data()
                )
            )
            setDefaultCords({lat: doc.data().lat, lng: doc.data().lng})
        });

        const cv = onSnapshot(doc(db, "jumps", params.id), (doc) => {
            if(doc.data().canceled){
                setMessage(`Jump start service at: ${doc.data().address} was cancelled. `)
            }
            if(doc.data().completed){
                setMessage(`Jump start service at: ${doc.data().address} was completed. `)
            }
            if(!doc.data().canceled&&!doc.data().completed){
                dispatch(
                    setJumpStart(
                        {data: doc.data(), id: doc.id}
                    )
                )
                dispatch(setUser(doc.data().user))
                setDefaultCords(doc.data().defaultCords)
                setCoords(doc.data().coords)
                setAddress(doc.data().address)
            }


        });
    }, [params.id]);

    const cancelJumpStart = (e) => {
        e.preventDefault()
        updateDoc(doc(db, 'driverLocation', 'aUzONUhgWy71y2RqIeBW'), {
            available: true
        }).then(async () => {
            await updateDoc(doc(db, 'jumps', jumpStart.id), {
                canceled: true,
                completed: false
            })
            dispatch(clearUser())
            setAddress(null)
            setCoords({})
            setDefaultCords({lat: null, lng: null})
        })
    }
    if(driverLiveLocation&&driverLiveLocation.lat){
        return (
            <Box sx={{ flexGrow: 1 }}>
                {!message?
                    <Grid  container spacing={1} justifyContent="center">
                        {coords&&coords.lat&&
                            <CalculateDistance
                                setTime={setTime}
                                coords={coords}
                                driverLocation={driverLiveLocation}
                            />
                        }

                        <Grid item sm={11} lg={6} xs={11}>
                            <RenderGoogleMaps coords={coords} address={address} defaultCords={defaultCords} driverLiveLocation={driverLiveLocation}/>
                        </Grid>

                        {jumpStart&&
                            <Grid item sm={11} lg={10} xs={11}>
                                <Item elevation={4}>
                                    <Typography variant="h5" gutterBottom>
                                        Live Tracking
                                    </Typography>
                                    <Divider>
                                        <LocationOnIcon />
                                    </Divider>
                                    <ItemFour elevation={6}>
                                        <Typography variant="h5" gutterBottom>
                                            Driver is <span style={{color: '#9ef01a', fontSize: 30}}>{time}</span> away from your location
                                        </Typography>
                                    </ItemFour>

                                    <KeyboardDoubleArrowDownIcon fontSize='large'/>
                                    <Typography variant="h5" gutterBottom>
                                        <span style={{color: '#023047'}}>{address}</span>
                                    </Typography>
                                    <Button style={{margin: '20px auto 10px auto'}} variant="contained" color="warning" onClick={cancelJumpStart}>
                                        cancel jumpstart
                                    </Button>
                                    <Divider>
                                        <LocationOnIcon />
                                    </Divider>
                                    <Live currentUser={user}/>
                                </Item>
                            </Grid>
                        }

                    </Grid>
                    :
                    <Grid  container spacing={1} justifyContent="center">
                        <Grid item sm={11} lg={10} xs={11}>
                            <Item elevation={4}>
                                <Typography variant="h5" gutterBottom >
                                    {message}
                                </Typography>
                            </Item>
                        </Grid>
                    </Grid>
                }
            </Box>
        );
    }else {
        return (
            <div>loading</div>
        )
    }




};

export default JumpByID;