import {Stack} from 'expo-router';
import CustomNavigationBar from '../../../src/components/NavigationBar';
import TodoDetail from '../../../src/screens/TodoDetail';

export default function TomorrowTodoDetailScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Todo',
          header: props => <CustomNavigationBar {...props} />,
        }}
      />
      <TodoDetail />
    </>
  );
}
