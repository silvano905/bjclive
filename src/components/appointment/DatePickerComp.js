import DatePicker from "react-datepicker";
import { v4 as uuidv4 } from 'uuid';
import Moment from 'react-moment';
import "react-datepicker/dist/react-datepicker.css";
import {useDispatch, useSelector} from "react-redux";
import {db} from '../../config-firebase/firebase'
import {collection, onSnapshot, query, orderBy, limit, doc, addDoc, serverTimestamp, where, getDocs, updateDoc} from 'firebase/firestore'
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {InputBase} from "@mui/material";
import React, {useState, useEffect} from 'react';
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import {getAppointmentsToday, selectAppointmentsToday, getAppointmentsTomorrow, selectAppointmentsTomorrow} from "../../redux/appointments/appointmentsSlice";
import {setAlert, removeAlert} from "../../redux/alerts/alertsSlice";


export default function DatePickerComp({setSelectedHour}) {
    const dispatch = useDispatch()

    const appointmentsToday = useSelector(selectAppointmentsToday)
    const appointmentsTomorrow = useSelector(selectAppointmentsTomorrow)

    let availableHours = [

        new Date().setHours(8,0),
        new Date().setHours(8,30),
        new Date().setHours(9,0),
        new Date().setHours(9,30),
        new Date().setHours(10,0),
        new Date().setHours(10,30),
        new Date().setHours(11,0),
        new Date().setHours(11,30),
        new Date().setHours(12,0),
        new Date().setHours(12,30),
        new Date().setHours(13,0),
        new Date().setHours(13,30),
        new Date().setHours(14,0),
        new Date().setHours(14,30),
        new Date().setHours(15,0),
        new Date().setHours(15,30),
        new Date().setHours(16,0)
    ]
    const createAppointment = (e) => {
        e.preventDefault()
        let t = []
        for (let i = 0; i < availableHours.length; i++) {
            t.push({
                time: availableHours[i],
                uid: uuidv4(),
                reserved: false,
                available: true,
                user: null
            })
        }
        let p = collection(db, 'appointments')
        addDoc(p, {
            user: 'admin',
            times: t,
            timestamp: serverTimestamp()
        }).then(() => {
            // setTime({...formData, message: ''})
        }).catch(err=>{
            console.log(err.message)
        })
    }

    useEffect(() => {
        const unsubToday = onSnapshot(doc(db, "appointments", "vRDaxyIRohFyDLEigl5o"), (doc) => {
            dispatch(
                getAppointmentsToday(
                    doc.data().times
                )
            )
        });

        const unsubTomorrow = onSnapshot(doc(db, "appointments", "vRDaxyIRohFyDLEigl5o"), (doc) => {
            dispatch(
                getAppointmentsTomorrow(
                    doc.data().times
                )
            )
        });

    }, []);


    let timesList;
    if(appointmentsToday&&appointmentsToday.length>0){
        timesList = appointmentsToday.map((item, index)=>{
            let dd = new Date(item.time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
            return(
                <Grid item sm={2} lg={3} xs={4}>
                    <Card sx={{ minWidth: 20 }} style={{margin: 5}}>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                {dd}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={()=>{
                                // let updatedList = []
                                // for (let i = 0; i < appointmentsToday.length; i++) {
                                //     if(appointmentsToday[i].uid===item.uid){
                                //         updatedList.push({
                                //             available: true,
                                //             reserved: true,
                                //             uid: item.uid,
                                //             time: item.time,
                                //             user: 'silvano'
                                //         })
                                //     }else {
                                //         updatedList.push(appointmentsToday[i])
                                //     }
                                // }
                                // updateDoc(doc(db, 'appointments', 'vRDaxyIRohFyDLEigl5o'),{
                                //     times: updatedList
                                // }).then(()=>{
                                //     console.log('updated list')
                                // })
                                setSelectedHour({
                                    time: dd,
                                    uid: item.uid,
                                    timestamp: item.time
                                })
                            }} variant="contained" style={{margin: 5}} disabled={!!item.reserved}>
                                add
                            </Button>

                        </CardActions>
                    </Card>

                </Grid>
            )
        })
    }

    return(
        <div style={{margin: '2px auto 20px 5px', textAlign: "center"}}>
            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                {timesList}
            </Grid>

            <Button variant="outlined" size="medium" onClick={createAppointment}>
                create
            </Button>

        </div>
    )
}