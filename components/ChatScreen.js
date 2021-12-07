import { addDoc, collection, doc, getDoc, limit, orderBy, query, setDoc, Timestamp, where } from "@firebase/firestore";
import { Avatar } from "@material-ui/core";
import { AttachFile, InsertEmoticon, Mic, MoreVertOutlined } from "@material-ui/icons";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components"
import { auth, db } from "../firebase";
import getRecipientEmail from "../helpers/getRecipientEmail";
import Message from "./Message";
import TimeAgo from 'timeago-react';

function ChatScreen({ chat, messages }) {

  const [user] = useAuthState(auth);
  const [input, setInput] = useState('');
  const router = useRouter();
  const endOfMessageRef = useRef(null);
  const messagesRef = collection(db, `chats/${router.query.id}/messages`);
  const messageQuery = query(messagesRef, orderBy('timestamp'));
  const [messagesSnapshot] = useCollection(messageQuery);
  const recipientEmail = getRecipientEmail(chat.users, user);
  const userRef = collection(db, 'users');
  const userQuery = query(userRef, where('email', '==', recipientEmail))
  const [recipientSnapshot] = useCollection(userQuery);
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const sendMessage = (e) => {
    e.preventDefault();
    const ref = doc(db, 'users', user.uid);

    setDoc(ref, {
      lastSeen: Timestamp.now()
    })

    addDoc(messagesRef, {
      timestamp: Timestamp.now(),
      msg: input,
      user: user.email,
      photoUrl: user.photoURL
    });
    setInput('');
    scrollToBottom();
  }

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    })
  }

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map(
        (message) => (
          <Message
            key={message.id}
            user={message.data().user}
            message={{
              ...message.data(),
              timestamp: message.data().timestamp?.toDate().getTime()
            }}
          />
        )
      )
    }
  }

  return (
    <Container style={{ overflow: 'hidden' }}>
      <Header>
        {recipient
          ? (
            <Avatar src={recipient?.photoUrl} onClick={() => auth.signOut()} />
          )
          : (
            <Avatar>{recipientEmail[0]}</Avatar>
          )}

        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {
            recipient ? (
              <p>
                {recipient?.lastSeen?.toDate() ? (
                  <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                ) : (
                  "Loading Last active..."
                )}
              </p>
            ) : (
              <p>Unavaliable</p>
            )
          }
        </HeaderInformation>
        <HeaderIcon>
          <Button>
            <AttachFile />
          </Button>
          <Button>
            <MoreVertOutlined />
          </Button>
        </HeaderIcon>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={ endOfMessageRef}/>
      </MessageContainer>

      <InputContainer onSubmit={sendMessage}>
        <InsertEmoticon />
        <Input value={input} onChange={e => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</button>
        <Mic />
      </InputContainer>

    </Container>
  )
}

export default ChatScreen

const Container = styled.div`
  overflow: hidden;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 5px;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: whitesmoke;
`;

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 10vh;
  min-height: 10vh;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
  border-left: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  >p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcon = styled.div`
  display: flex;
`;

const Button = styled.div`
  cursor: pointer;
  margin-left: 10px;
  border-radius: 5px;
  padding: 5px;
  :hover{
    background-color: whitesmoke;
  }
`;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #DEDEDE;
  min-height: 80vh;
  overflow-y: scroll;
  max-height: 80vh;
  ::-webkit-scrollbar {
    display: none;
  }
  overflow-x: hidden;
`;

const EndOfMessage = styled.div``;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  height: 10vh;
  background-color: white;
  z-index: 100;
  overflow-x: hidden;
  overflow-y: hidden;
`;