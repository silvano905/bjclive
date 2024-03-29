import Grid from "@mui/material/Grid";
import {Autocomplete} from "@react-google-maps/api";
import Typography from "@mui/material/Typography";
import {InputBase} from "@mui/material";
import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";

import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import {addDoc, collection, doc, serverTimestamp, updateDoc} from "firebase/firestore";
import {db} from "../../config-firebase/firebase";
import {setUser} from "../../redux/user/userSlice";
import {useDispatch} from "react-redux";
export default function PhoneNumberForm({driver, hour, setSelectedHour,
                                            appointments, address, needsAppointment, defaultCords, coords}) {
    const [formData, setFormData] = useState({
        phone: ''
    });
    const navigate = useNavigate()
    const { phone } = formData;
    const dispatch = useDispatch()

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const requestJumpNow = (e) => {
        e.preventDefault()
        let p = collection(db, 'jumps')
        addDoc(p, {
            user: phone,
            time: 'now',
            completed: false,
            defaultCords: defaultCords,
            coords: coords,
            canceled: false,
            address: address,
            timestamp: serverTimestamp()
        }).then(async (res) => {
            await updateDoc(doc(db, 'driverLocation', 'aUzONUhgWy71y2RqIeBW'), {
                available: false
            })

            dispatch(setUser(phone))
            setFormData({phone: ''})
            return navigate(`/jump/${res.id}`)
        })
    }

    const makeAppointment = (e) => {
        e.preventDefault()
        if(address&&hour.time){
            let updatedList = []
            for (let i = 0; i < appointments.data.length; i++) {
                if(appointments.data[i].uid===hour.uid){
                    updatedList.push({
                        available: true,
                        reserved: true,
                        uid: hour.uid,
                        time: hour.timestamp,
                        user: phone
                    })
                }else {
                    updatedList.push(appointments.data[i])
                }
            }
            updateDoc(doc(db, 'appointments', appointments.id),{
                times: updatedList
            }).then(()=>{

            })

        }else {

        }
    }

    return(
        <form>
            {hour&&hour.time?
                <div>
                    <FormControl style={{marginBottom: 20}}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {hour.time}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button onClick={()=>{setSelectedHour({})}} size='small' variant="outlined" color="error" style={{margin: "auto"}}>
                                    remove
                                </Button>
                            </CardActions>
                        </Card>
                    </FormControl>
                </div>

                :
                needsAppointment&&!hour.time?
                <FormControl style={{margin: '10px auto 20px auto'}}>
                    <Typography variant="h6" style={{color: "red"}}>
                        Please select a time from below
                    </Typography>
                </FormControl>
                    :
                    null
            }


            <FormControl style={{marginBottom: 10}}>
                <TextField
                    fullWidth
                    variant="outlined"
                    id="standard-basic2"
                    label="Phone Number"
                    name="phone"
                    // onInput={(e)=>{
                    //     e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,10)
                    // }}
                    value={phone}
                    onChange={onChange}
                    required
                />
            </FormControl>

            {/*<Typography variant="body1" gutterBottom style={{fontSize: 16}}>*/}
            {/*    we need your phone number to contact you when the driver has arrived to your location*/}
            {/*</Typography>*/}

            {driver.available&&!needsAppointment?
                <Button type="submit" variant="contained" onClick={requestJumpNow} style={{margin: 10}}>
                    request jumpstart
                </Button>
                :
                <Button type="submit" variant="contained" onClick={makeAppointment} disabled={!hour.time}>
                    make appointment
                </Button>
            }

        </form>
    )
}

