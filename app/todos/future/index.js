import {Stack} from 'expo-router';
import CustomNavigationBar from '../../../src/components/NavigationBar';
import FutureTodos from '../../../src/screens/TodoList/Future';

export default function FutureTodosScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Future',
          header: props => <CustomNavigationBar {...props} />,
        }}
      />
      <FutureTodos />
    </>
  );
}
