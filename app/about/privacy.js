import {Stack} from 'expo-router';
import CustomNavigationBar from '../../src/components/NavigationBar';
import PrivacyScreen from '../../src/screens/About/PrivacyScreen';

export default function Privacy() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Privacy Policy',
          headerShown: true,
          header: props => <CustomNavigationBar {...props} />,
        }}
      />
      <PrivacyScreen />
    </>
  );
}
