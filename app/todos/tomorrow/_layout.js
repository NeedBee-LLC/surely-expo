import {Stack} from 'expo-router';
import CustomNavigationBar from '../../../src/components/NavigationBar';

export default function TomorrowTodosLayout() {
  return (
    <Stack
      screenOptions={{
        header: props => <CustomNavigationBar {...props} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Tomorrow',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Todo',
        }}
      />
    </Stack>
  );
}
