import {Redirect, Stack} from 'expo-router';
import CustomNavigationBar from '../src/components/NavigationBar';
import SignUpForm from '../src/screens/Login/SignUpForm';
import {useToken} from '../src/data/token';

export default function SignUpScreen() {
  const {isLoggedIn} = useToken();
  if (isLoggedIn) {
    return <Redirect href="/todos/available" />;
  }
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Sign up',
          headerShown: true,
          header: props => <CustomNavigationBar {...props} />,
        }}
      />
      <SignUpForm />
    </>
  );
}
