import { collection, query, where } from "@firebase/firestore"
import { Avatar } from "@material-ui/core"
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore"
import styled from "styled-components"
import { auth, db } from "../firebase"
import getRecipientEmail from "../helpers/getRecipientEmail"

function Chat({ id, users }) {

  const router = useRouter();
  const [user] = useAuthState(auth);
  const recipientEmail = getRecipientEmail(users, user);
  const userRef = collection(db, 'users');
  const userRefAvt = query(userRef, where('email', '==', recipientEmail))
  const [recipientSnapshot] = useCollection(userRefAvt);

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const enterChat = () => {
    router.push(`/chat/${id}`)
  }

  return (
    <Container onClick={enterChat}>
      {
        recipient 
        ?(
          <UserAvatar src={recipient?.photoUrl} onClick={() => auth.signOut()} />
        )
        :(
          <UserAvatar>{recipientEmail[0]}</UserAvatar>
        )
      }

      <p> {recipientEmail} </p>
    </Container>
  )
}

export default Chat

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;
  border-radius: 5px;
  :hover {
    background-color: #F4F3F3;
  }
`

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`