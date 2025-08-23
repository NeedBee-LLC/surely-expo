import {Stack} from 'expo-router';
import CustomNavigationBar from '../../../src/components/NavigationBar';
import AvailableTodos from '../../../src/screens/TodoList/Available';

export default function AvailableTodosScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Available',
          header: props => <CustomNavigationBar {...props} />,
        }}
      />
      <AvailableTodos />
    </>
  );
}
