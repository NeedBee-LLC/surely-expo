import {Stack} from 'expo-router';
import CustomNavigationBar from '../src/components/NavigationBar';
import SignInForm from '../src/screens/Login/SignInForm';

export default function SignInScreen() {
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
