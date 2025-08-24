import {Redirect, Slot} from 'expo-router';
import {useToken} from '../../src/data/token';

export default function TodosLayout() {
  const {isLoggedIn} = useToken();
  if (!isLoggedIn) {
    return <Redirect href="/signin" />;
  }
  return <Slot />;
}
