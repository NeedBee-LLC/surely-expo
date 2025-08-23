import {Redirect} from 'expo-router';
import {useToken} from '../src/data/token';

export default function Index() {
  const {isLoggedIn} = useToken();

  if (isLoggedIn) {
    return <Redirect href="/todos/available" />;
  } else {
    return <Redirect href="/signin" />;
  }
}
