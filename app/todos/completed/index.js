import {Stack} from 'expo-router';
import CustomNavigationBar from '../../../src/components/NavigationBar';
import CompletedTodos from '../../../src/screens/TodoList/Completed';

export default function CompletedTodosScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Completed',
          header: props => <CustomNavigationBar {...props} />,
        }}
      />
      <CompletedTodos />
    </>
  );
}
