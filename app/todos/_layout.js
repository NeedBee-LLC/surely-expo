import {Stack} from 'expo-router';
import CustomNavigationBar from '../../src/components/NavigationBar';

export default function TodosLayout() {
  return (
    <Stack
      screenOptions={{
        header: props => <CustomNavigationBar {...props} />,
      }}
    >
      <Stack.Screen
        name="available"
        options={{
          title: 'Available',
        }}
      />
      <Stack.Screen
        name="tomorrow"
        options={{
          title: 'Tomorrow',
        }}
      />
      <Stack.Screen
        name="future"
        options={{
          title: 'Future',
        }}
      />
      <Stack.Screen
        name="completed"
        options={{
          title: 'Completed',
        }}
      />
      <Stack.Screen
        name="deleted"
        options={{
          title: 'Deleted',
        }}
      />
    </Stack>
  );
}
