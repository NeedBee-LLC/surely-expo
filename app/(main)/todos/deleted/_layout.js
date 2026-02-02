import {Stack} from 'expo-router';
import NavigationBar from '../../../../src/components/NavigationBar';

export default function DeletedLayout() {
  return (
    <Stack
      screenOptions={{
        header: props => <NavigationBar {...props} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Deleted',
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
