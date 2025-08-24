import {Stack} from 'expo-router';
import CustomNavigationBar from '../../src/components/NavigationBar';
import SupportScreen from '../../src/screens/About/SupportScreen';

export default function Support() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Support',
          headerShown: true,
          header: props => <CustomNavigationBar {...props} />,
        }}
      />
      <SupportScreen />
    </>
  );
}
