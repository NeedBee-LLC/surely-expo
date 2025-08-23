import {Redirect, Stack} from 'expo-router';
import CustomNavigationBar from '../src/components/NavigationBar';
import SignInForm from '../src/screens/Login/SignInForm';
import {useToken} from '../src/data/token';

export default function SignInScreen() {
  const {isLoggedIn} = useToken();
  if (isLoggedIn) {
    return <Redirect href="/todos/available" />;
  }
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Sign in',
          header: props => <CustomNavigationBar {...props} />,
        }}
      />
      <SignInForm />
    </>
  );
}
