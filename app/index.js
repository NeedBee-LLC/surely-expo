import {Redirect} from 'expo-router';
import {useToken} from '../src/data/token';

export default function Index() {
  const {isTokenLoaded, isLoggedIn} = useToken();

  // Wait for token to load before redirecting
  if (!isTokenLoaded) {
    return null;
  }

  // Redirect based on auth state
  if (isLoggedIn) {
    return <Redirect href="/todos/available" />;
  } else {
    return <Redirect href="/signin" />;
  }
}
