import {Stack} from 'expo-router';
import CustomNavigationBar from '../../src/components/NavigationBar';
import ThanksScreen from '../../src/screens/About/ThanksScreen';

export default function SayThanks() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Ways to Say Thanks',
          header: props => <CustomNavigationBar {...props} />,
        }}
      />
      <ThanksScreen />
    </>
  );
}
