import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, setDoc, Timestamp } from '@firebase/firestore';
import { auth, db } from '../firebase';
import Login from './login';
import Loading from '../components/Loading';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      const ref = doc(db, 'users', user.uid);
      setDoc(ref, {
        email: user.email,
        lastSeen: Timestamp.now(),
        photoUrl: user.photoURL
      })
    }
  }, [user])
  if(loading) return <Loading/>
  
  if (!user) return <Login />

  return <Component {...pageProps} />
}

export default MyApp
