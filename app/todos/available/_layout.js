import {Stack} from 'expo-router';
import CustomNavigationBar from '../../../src/components/NavigationBar';

export default function AvailableTodosLayout() {
  return (
    <Stack
      screenOptions={{
        header: props => <CustomNavigationBar {...props} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Available',
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
