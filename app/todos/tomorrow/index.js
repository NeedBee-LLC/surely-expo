import {Stack} from 'expo-router';
import CustomNavigationBar from '../../../src/components/NavigationBar';
import TomorrowTodos from '../../../src/screens/TodoList/Tomorrow';

export default function TomorrowTodosScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Tomorrow',
          header: props => <CustomNavigationBar {...props} />,
        }}
      />
      <TomorrowTodos />
    </>
  );
}
