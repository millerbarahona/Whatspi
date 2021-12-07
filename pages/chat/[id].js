import { collection, query, doc, orderBy, getDocs, getDoc } from "@firebase/firestore";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components"
import ChatScreen from "../../components/ChatScreen";
import SideBar from "../../components/SideBar";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../helpers/getRecipientEmail";

function Chat({ messages, chat }) {
  const msg = JSON.parse(messages);
  const [user] = useAuthState(auth);

  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <SideBar />
      <ChatContainer>
        <ChatScreen chat={chat}/>
      </ChatContainer>
    </Container>
  )
}

export default Chat

export async function getServerSideProps(context) {
  const ref = collection(db, `chats/${context.query.id}/messages`);
  const chatRef = doc(db, `chats/${context.query.id}`)

  const messagesRes = await getDocs(query(ref));
  const chatRes = await getDoc(query(chatRef));

  const messages = messagesRes.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp?.toDate().getTime()
    }))

  const chat = {
    id: chatRes.id,
    ...chatRes.data()
  }

  return {
    props: {
      messages: JSON.stringify(messages),
      chat
    }
  }
}

const Container = styled.div`
  display: flex;

`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  overflow-x: hidden;
  ::-webkit-scrollbar {
    display: none;
  }
  height: 100vh;
`;
