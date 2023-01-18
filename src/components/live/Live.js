import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {db} from '../../config-firebase/firebase'
import {collection, onSnapshot, query, orderBy, limit, doc, addDoc, serverTimestamp, where, getDocs} from 'firebase/firestore'
import Button from "@mui/material/Button";
import {getMessages, selectMessages, selectChatId, getChatId} from "../../redux/liveChat/liveChatSlice";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import List from '@mui/material/List';
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin: '15px auto 15px auto'
}));
function Live({currentUser}) {
    const dummy = useRef();

    const myChatId = useSelector(selectChatId)
    const dispatch = useDispatch()
    const [filterMessages, setFilterMessages] = useState('timestamp');
    const messages = useSelector(selectMessages)

    const [formData, setFormData] = useState({
        reply: ''
    });


    const postReply = async (e) => {
        e.preventDefault()

        let commentRef = collection(db, 'liveChat')
        await addDoc(collection(commentRef, myChatId.toString(), 'replies'), {
            message: formData.reply,
            user: currentUser,
            timestamp: serverTimestamp()
        })
        setFormData({...formData, reply: ''})
        dummy.current.scrollIntoView({ behavior: 'smooth' });

    }

    useEffect(()=>{
        // let p = collection(db, 'liveChat')
        // let order = query(p, orderBy('timestamp', 'desc'), limit(1), where('user', '==', currentUser))
        // const querySnapshot = getDocs(order).then(x=> {
        //     x.forEach((doc) => {
        //         dispatch(getChatId(doc.id))
        //     });
        // })

        if(currentUser&&myChatId){
            let repliesRef = query(collection(db, 'liveChat', myChatId.toString(), 'replies'), orderBy('timestamp', "asc"))
            onSnapshot(repliesRef, (snapshot) => {
                dispatch(
                    getMessages(
                        snapshot.docs.map(doc => ({
                            data: doc.data(), id: doc.id
                        }))
                    )
                )
            })
        }

        // }
    }, [currentUser, myChatId])

    let list;
    if(messages){
        list = messages.map(item =>{
            return(
                <div style={{textAlign: item.data.user===currentUser?"right":'left',
                    marginBottom: 15, paddingRight: item.data.user===currentUser?0:15,
                    paddingLeft: item.data.user===currentUser?15:0}}>
                    <Typography style={{color: item.data.user===currentUser?"blue":'gray'}} variant="h6" color="text.secondary" gutterBottom>
                        {item.data.message}
                    </Typography>
                </div>

            )
        })
    }

    const createRoomChat = (e) => {
        e.preventDefault()
        let p = collection(db, 'liveChat')
        addDoc(p, {
            user: currentUser,
            timestamp: serverTimestamp()
        }).then((docRef) => {
            dispatch(getChatId(docRef.id))
        }).catch(err=>{
            console.log(err.message)
        })
    }

    return (
        <>
            {myChatId?
                <Item elevation={4}>
                    <Typography variant="h6" gutterBottom
                                style={{color: "black"}}
                    >
                        Messaging
                    </Typography>
                        <List       sx={{
                            width: '100%',
                            maxWidth: 460,
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'auto',
                            maxHeight: 300,
                            '& ul': { padding: 0 },
                        }}>
                            <li>
                                {list}
                                <span ref={dummy}></span>
                            </li>
                        </List>
                        <div style={{flexBasis: '100%'}}>
                            <form onSubmit={postReply} style={{margin: 8}}>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Type.."
                                        name='reply'
                                        multiline
                                        value={formData.reply}
                                        onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                    />
                                </FormControl>
                                <Button size='small' style={{margin: 8}} type='submit' variant="contained" color="primary">
                                    Send
                                </Button>
                            </form>
                        </div>

                </Item>
                :
                <form onSubmit={createRoomChat}>
                    <FormControl sx={{ m: 1, width: '20ch'}}>
                        <Button size='small' style={{marginBottom: 5}} type='submit' variant="contained" color="primary">
                            message driver
                        </Button>
                    </FormControl>
                </form>
            }
        </>

    );
}

export default Live;