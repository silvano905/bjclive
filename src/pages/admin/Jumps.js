import React, {useState, useEffect} from 'react';
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {parse, stringify, toJSON, fromJSON} from 'flatted';
import GoogleMapReact from 'google-map-react';
import {
    collection, addDoc,
    query, orderBy, serverTimestamp, limit,
    onSnapshot, getDocs, where, doc, updateDoc
} from "firebase/firestore";
import {db} from '../../config-firebase/firebase';

import {setUser, setJumpStart, selectUser, selectJumpStart, clearUser} from "../../redux/user/userSlice";
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

import CloseIcon from '@mui/icons-material/Close';
import {selectJumps, setJumps} from "../../redux/admin/jumpsSlice";
const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    margin: '15px auto 10px auto',
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

function Jumps() {
    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    const jumps = useSelector(selectJumps)


    useEffect(() => {
        let jumpsRef = collection(db, 'jumps')
        let jumpsQuery = query(jumpsRef, orderBy('timestamp', 'desc'),
            where("completed", "==", false), where("canceled", "==", false))
        onSnapshot(jumpsQuery, (snapshot) => {
            dispatch(
                setJumps(
                    snapshot.docs.map(doc => ({data: doc.data(), id: doc.id}))
                )
            )
        })

    }, []);


    let list;
    if(jumps&&jumps.length>0){
        list = jumps.map(item=>{
            return(
                <Grid item xs={6} sm={6} lg={7}>
                    <Item elevation={4}>
                        <Typography variant="h5" gutterBottom>
                            {item.data.address}
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            When: {item.data.time}
                        </Typography>
                        <Button style={{margin: '20px auto 10px auto'}} variant="contained" color="primary"
                                onClick={()=>{
                                    updateDoc(doc(db, 'driverLocation', 'aUzONUhgWy71y2RqIeBW'), {
                                        available: true
                                    }).then(async () => {
                                        await updateDoc(doc(db, 'jumps', item.id), {
                                            canceled: false,
                                            completed: true
                                        })
                                    })
                                }}>
                            mark as completed
                        </Button>
                        <Button style={{margin: '20px auto 10px auto'}} variant="contained" color="warning"
                                onClick={()=>{
                                    updateDoc(doc(db, 'driverLocation', 'aUzONUhgWy71y2RqIeBW'), {
                                        available: true
                                    }).then(async () => {
                                        await updateDoc(doc(db, 'jumps', item.id), {
                                            canceled: true,
                                            completed: false
                                        })
                                    })
                                }}>
                            cancel jumpstart
                        </Button>
                    </Item>
                </Grid>
            )
        })
    }

    if(jumps){
        return (
            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                {list}
            </Grid>
        );
    }else {
        return (
            <div>loading</div>
        )
    }



}

export default Jumps;