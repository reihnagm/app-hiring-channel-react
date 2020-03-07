import React, { useState, useEffect } from 'react';
import { Grid, Input } from '@material-ui/core';
import { connect } from 'react-redux';
import moment from 'moment';
import { 
    getReplyConversationReplies, 
    getUserTwo,
    InsertIntoConversationReplies
} from '../../../../../actions/message';
import MessageLists from '../MessageLists/Index';
import AvatarComponent from '../../../../Avatar/Index';
const ReplyLists = ({ 
    conversation_id, 
    getReplyConversationReplies,
    InsertIntoConversationReplies,
    getUserTwo,
    replies,
    messageMask,
    setMessageMask,
    inputMessage,   
    setInputMessage, 
    user,
    user_two,
    set_confirm_conversation_id,
    set_hide_conversation_lists, 
    hide_conversation_lists  }) => {
    const back = () => {
        set_confirm_conversation_id(null);
        set_hide_conversation_lists(!hide_conversation_lists);
    }
    const handleMessage = (event) => {
        setInputMessage(event.target.value);
    }
    const handleEnterMessage = (event) => {
        let obj = {
            id: new Date(),
            reply: inputMessage,
            name: user && user.data && user.data.name
        }
        if(event.which === 13) {
            InsertIntoConversationReplies(user_two, inputMessage);
            setMessageMask(state => [...state, obj]);
            setInputMessage('');
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            await getReplyConversationReplies(conversation_id);
            await getUserTwo(conversation_id);
        }
        fetchData();
    },[getReplyConversationReplies, getUserTwo, conversation_id]);
    return (
        <>
        	<div className="p-5 relative rounded container-direct-message">
                <MessageLists
                    replies={replies}
                    messageMask={messageMask}
                    setMessageMask={setMessageMask}
                /> 
				<div className="bar-bottom-message p-2">
					<Input
						fullWidth="true"
						name="message"
						value={inputMessage}
						onChange={handleMessage}
						onKeyPress={handleEnterMessage}
					/>
				</div>
            </div>
            <button type="submit" onClick={back}>Back</button>
        </>
    )
}
const ConversationLists = ({ 
    conversation_lists, 
    getReplyConversationReplies,
    InsertIntoConversationReplies,
    getUserTwo,
    replies,
    user_two,
    user
    }) => {
    const [hide, setHide] = useState(true);
    const [hide_conversation_lists, set_hide_conversation_lists] = useState(true);
    const [confirm_conversation_id, set_confirm_conversation_id] = useState(null);
    const [messageMask, setMessageMask] = useState([]);
    const [inputMessage, setInputMessage] = useState(null);
    const loadDm = conversation_id => {
        set_confirm_conversation_id(conversation_id);
        set_hide_conversation_lists(false)
    }
    return  (
        <>
            { confirm_conversation_id !== null && 
                <ReplyLists 
                    set_hide_conversation_lists={set_hide_conversation_lists}
                    setHide={setHide}
                    hide_conversation_lists={hide_conversation_lists}
                    hide={hide}
                    conversation_id={confirm_conversation_id} 
                    set_confirm_conversation_id={set_confirm_conversation_id}
                    getReplyConversationReplies={getReplyConversationReplies}   
                    getUserTwo={getUserTwo}
                    InsertIntoConversationReplies={InsertIntoConversationReplies}
                    replies={replies}
                    user={user}
                    user_two={user_two}
                    messageMask={messageMask}
                    setMessageMask={setMessageMask}
                    setInputMessage={setInputMessage}
                    inputMessage={inputMessage}
                /> 
            }
            { hide_conversation_lists && conversation_lists && conversation_lists.map(conversation_list => {
                return (
                    <Grid 
                        key={conversation_list.id}
                        onClick={() => loadDm(conversation_list.id)}
                        className="p-3 my-5 cursor-pointer rounded conversations-item"
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
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
                                justify="flex-start"
                                alignItems="flex-start"
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
        </>
    )
}
const mapStateToProps = state => ({
    replies: state.message.replies,
    user_two: state.message.user_two,
    user: state.auth.user
});
export default connect(
    mapStateToProps,
    {  getReplyConversationReplies, getUserTwo, InsertIntoConversationReplies } 
)(ConversationLists);