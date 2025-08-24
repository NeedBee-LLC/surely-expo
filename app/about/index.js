import {Stack} from 'expo-router';
import CustomNavigationBar from '../../src/components/NavigationBar';
import AboutScreen from '../../src/screens/About/AboutScreen';

export default function About() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'About',
          headerShown: true,
          header: props => <CustomNavigationBar {...props} />,
        }}
      />
      <AboutScreen />
    </>
  );
}
