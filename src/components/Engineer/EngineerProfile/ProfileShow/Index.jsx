import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Grid, Paper, Button, Modal, Input, makeStyles } from '@material-ui/core';
import Swal from 'sweetalert2';
import MessageIcon from '@material-ui/icons/Message';
import Spinner from '../../../Spinner/Index';
import AvatarComponent from '../../../Avatar/Index';
import MessageList from './MessageList/Index';
import defaultImage from '../../../../images/default.png';
import { getProfileEngineerBySlug } from '../../../../actions/engineer';
import { 
    creatingConversations, 
    InsertIntoConversationReplies, 
    getConversationLists,
    getConversationsLastId, 
    checkConversations,
    getReplyConversationReplies
} from '../../../../actions/message';
const Profile = ({
    getProfileEngineerBySlug,
    getConversationLists,
    getReplyConversationReplies,
    getConversationsLastId,
    checkConversations,
    creatingConversations,
    InsertIntoConversationReplies,
    message: { conversations_id, replies, check_conversations, conversation_lists },
    user: { user },
    engineer: { engineer, loading }, match }) => {
    const useStyles = makeStyles(theme => ({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2)
        }
    }));
    const classes = useStyles();
    const [messageMask, setMessageMask] = useState([]);
    const [inputMessage, setInputMessage] = useState(null);
    const [open, setOpen] = useState(false);
    let user_two = engineer.user_id;
    let name = engineer.name;
    let email = engineer.email;
    let description = engineer.description;
    let skills = engineer.skills;
    let location = engineer.location;
    let showcase = engineer.showcase;
    let birthdate = engineer.birthdate;
    let telephone = engineer.telephone;
    
    useEffect(() => {
        const fetchData = async () => {
            await getProfileEngineerBySlug(match.params.slug);
            if(false === user_two === null || typeof user_two === "undefined") {
                return false;
            } 
            await creatingConversations(user_two);
            await checkConversations(user_two);
            await getConversationLists(user_two);
            setTimeout( async () => {
                await getConversationsLastId(user_two);
            }, 800);
        }
        fetchData();
    }, [getProfileEngineerBySlug, getConversationsLastId, creatingConversations, user_two, match.params.slug]);
    const handleOpen = async () => {
        await getReplyConversationReplies(conversations_id);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleMessage = (event) => {
        setInputMessage(event.target.value);
    }
    const loadDirectMessage = () => {
      
    }
    const handleEnterMessage = (event) => {
        let obj = {
            id: new Date(),
            reply: inputMessage,
            name: user && user.data && user.data.name
        }
        if(event.which === 13) {
            InsertIntoConversationReplies(conversations_id, inputMessage);
            setMessageMask(state => [...state, obj]);
            setInputMessage('');
        }
    }
    let n = new Date(birthdate);
    let y = n.getFullYear();
    let d = n.getDate();
    let m = n.getMonth()+1;
    let months = ["January","February","March","April","May","June",'July',"August","September","October","November","December"];
    let thisMonth  = months[m-1];
    if(isNaN(y) || isNaN(d) || typeof y === "undefined") {
        y = '';
        d = '';
        thisMonth = '';
    }
    let displayDate = d +' '+ thisMonth +' '+ y ;    
    return loading ? ( <Spinner /> ) : (
        <>
            <div style={{
                background: '#ea80fc',
                position:"absolute",
                zIndex: -1,
                width:'100%',
                top: "0px",
                left: "0px",
                right: "0px",
                height: "300px" }}>
            </div>
            <Container className="mt-64" fixed>
                <div className={classes.root}>
                    <Grid container spacing={4}>
                        <Grid item md={4} xs={12}>
                            <Paper className={classes.paper}>
                                <Grid container>
                                    <Grid item xs={6} md={6}>
                                        <AvatarComponent 
                                            imageSource={engineer.avatar} 
                                            altName={engineer.name}
                                            type="avatar" 
                                            width="100"
                                            height="100"
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={4}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleOpen}
                                            startIcon={<MessageIcon />}>
                                            Message
                                        </Button>
                                        <Modal open={open} onClose={handleClose}>
                                           <Paper className="p-5 conversation-lists">
                                               { conversation_lists && conversation_lists.map(conversation_list => {
                                                    return loading ? ( <Spinner /> ) : (
                                                        <Grid 
                                                            key={conversation_list.id}
                                                            className="p-3 my-5 cursor-pointer rounded conversations-item"
                                                            container
                                                            direction="row"
                                                            justify="center"
                                                            alignItems="center"
                                                            onClick={loadDirectMessage}
                                                        > 
                                                            <Grid item xs={2}>
                                                                <AvatarComponent 
                                                                    imageSource={conversation_list.avatar} 
                                                                    altName={conversation_list.name}
                                                                    type="avatar" 
                                                                    width="60"
                                                                    height="60"
                                                                />                                                
                                                            </Grid>
                                                            <Grid item xs={10}>
                                                                <Grid 
                                                                    container
                                                                    direction="column"
                                                                    justify="start"
                                                                    alignItems="start"
                                                                >
                                                                    <Grid item>
                                                                         <p className="my-1"> {conversation_list.name} </p>
                                                                    </Grid>
                                                                    <Grid item>
                                                                         <p className="mx-3"> {conversation_list.reply} </p>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    )
                                               })}
                                            </Paper>
                                            {/* <div className="p-5 container-direct-message">
                                                <MessageList
                                                    replies={replies}
                                                    messageMask={messageMask}
                                                    setMessageMask={setMessageMask}
                                                />
                                                <Input
                                                    name="message"
                                                    value={inputMessage}
                                                    onChange={handleMessage}
                                                    onKeyPress={handleEnterMessage}
                                                />
                                            </div> */}
                                        </Modal>
                                    </Grid>
                                </Grid>
                                <p className="my-2"> {name} </p>
                                <p className="my-2"> {email} </p>
                                <p className="my-2"> {telephone} </p>
                                <p className="my-2"> {showcase} </p>
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    component={ Link } to="/engineers">
                                    Back
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <Paper className={classes.paper}>
                                <p> {description} </p>
                            </Paper>
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <Paper className={classes.paper}>
                                <p className="mb-2">Skills</p>
                                <p>{skills}</p>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </>
    )
}
const mapStateToProps = state => ({
    engineer: state.engineer,
    user: state.auth,
    message: state.message
});
export default connect(
    mapStateToProps,
    {
        getProfileEngineerBySlug,
        getConversationLists,
        getReplyConversationReplies,
        getConversationsLastId,
        InsertIntoConversationReplies,
        checkConversations,
        creatingConversations, 
    }
)(Profile);
