import {Redirect} from 'expo-router';
import {useToken} from '../src/data/token';

// Root redirect logic based on authentication state
export default function Index() {
  const {token} = useToken();

  // Redirect to available todos if logged in, signin if not
  if (token) {
    return <Redirect href="/todos/available" />;
  }

  return <Redirect href="/signin" />;
}
