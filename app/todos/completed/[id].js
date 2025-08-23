import {Stack} from 'expo-router';
import CustomNavigationBar from '../../../src/components/NavigationBar';
import TodoDetail from '../../../src/screens/TodoDetail';

export default function CompletedTodoDetailScreen() {
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
