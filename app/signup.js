import {Stack} from 'expo-router';
import CustomNavigationBar from '../src/components/NavigationBar';
import SignUpForm from '../src/screens/Login/SignUpForm';

export default function SignUpScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Sign up',
          header: props => <CustomNavigationBar {...props} />,
        }}
      />
      <SignUpForm />
    </>
  );
}
