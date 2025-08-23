import {Stack} from 'expo-router';
import CustomNavigationBar from '../../../src/components/NavigationBar';
import DeletedTodos from '../../../src/screens/TodoList/Deleted';

export default function DeletedTodosScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Deleted',
          header: props => <CustomNavigationBar {...props} />,
        }}
      />
      <DeletedTodos />
    </>
  );
}
