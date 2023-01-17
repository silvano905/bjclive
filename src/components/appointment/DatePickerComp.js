import DatePicker from "react-datepicker";
import { v4 as uuidv4 } from 'uuid';
import Moment from 'react-moment';
import "react-datepicker/dist/react-datepicker.css";
import {useDispatch, useSelector} from "react-redux";
import {db} from '../../config-firebase/firebase'
import {collection, onSnapshot, query, orderBy, limit, doc, addDoc, serverTimestamp, where, getDocs, updateDoc} from 'firebase/firestore'
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {buttonClasses, InputBase} from "@mui/material";
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
import {getAppointments, selectAppointments} from "../../redux/appointments/appointmentsSlice";
import {setAlert, removeAlert} from "../../redux/alerts/alertsSlice";
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import ButtonGroup from "@mui/material/ButtonGroup";


export default function DatePickerComp({setSelectedHour, appointmentsFilter}) {
    const dispatch = useDispatch()

    const appointments = useSelector(selectAppointments)

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
    const[appointmentFilter, setAppointmentFilter] = useState('today')

    useEffect(() => {
        // const unsubToday = onSnapshot(doc(db, "appointments", 'vRDaxyIRohFyDLEigl5o'), (doc) => {
        //     dispatch(
        //         getAppointments(
        //             doc.data().times
        //         )
        //     )
        // });

        let p = collection(db, 'appointments')
        let order = query(p, orderBy('timestamp', 'desc'), limit(1), where("day", "==", appointmentFilter))
        // const querySnapshot = getDocs(order).then(x=>{
        //     x.forEach((doc) => {
        //             dispatch(
        //                 getAppointments(
        //                     {data: doc.data().times, id: doc.id}
        //                 )
        //             )
        //     });
        // })
        onSnapshot(order, (snapshot) => {
            snapshot.forEach((doc) => {
                dispatch(
                    getAppointments(
                        {data: doc.data().times, id: doc.id, day: doc.data().day}
                    )
                )
            });
        })



    }, [appointmentFilter,]);


    let timesList;
    if(appointments&&appointments.data&&appointments.data.length>0){
        timesList = appointments.data.map((item, index)=>{
            let dd = new Date(item.time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
            let hour = new Date(item.time).getHours()
            console.log(appointments.day)
            return(
                <Grid item sm={2} lg={3} xs={4}>
                    <Card sx={{ minWidth: 20 }} style={{margin: 5}}>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                {dd}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            {appointments.day==='today'&&item.reserved||appointments.day==='today'&&hour<=new Date().getHours()?
                                <Button variant="contained" style={{margin: '5px auto 5px auto'}} disabled>
                                    <DoNotDisturbIcon/>
                                </Button>
                                :
                                appointments.day==='today'&&!item.reserved&&hour>=new Date().getHours()?
                                    <Button onClick={()=>{
                                        setSelectedHour({
                                            time: dd,
                                            uid: item.uid,
                                            timestamp: item.time
                                        })
                                    }} variant="contained" style={{margin: '5px auto 5px auto'}}>
                                        add
                                    </Button>
                                    :
                                    appointments.day==='tomorrow'&&item.reserved?
                                        <Button variant="contained" style={{margin: '5px auto 5px auto'}} disabled>
                                            <DoNotDisturbIcon/>
                                        </Button>
                                        :
                                        <Button onClick={()=>{
                                            setSelectedHour({
                                                time: dd,
                                                uid: item.uid,
                                                timestamp: item.time
                                            })
                                        }} variant="contained" style={{margin: '5px auto 5px auto'}}>
                                            add
                                        </Button>
                            }


                        </CardActions>
                    </Card>

                </Grid>
            )
        })


    }

    return(
        <div style={{margin: '2px auto 20px 5px', textAlign: "center"}}>
            <div style={{textAlign: "center", margin: '20px auto 10px auto'}}>
                <ButtonGroup size='medium'>
                    <Button variant={appointmentFilter==='today'?'contained':'outlined'} onClick={()=>setAppointmentFilter('today')}>Today</Button>
                    <Button variant={appointmentFilter==='tomorrow'?'contained':'outlined'} onClick={()=>setAppointmentFilter('tomorrow')}>Tomorrow</Button>
                </ButtonGroup>
            </div>

            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                {timesList}
            </Grid>

            <Button variant="outlined" size="medium" onClick={createAppointment}>
                create
            </Button>

        </div>
    )
}