import {Stack} from 'expo-router';
import CustomNavigationBar from '../../src/components/NavigationBar';
import CategoryDetail from '../../src/screens/CategoryDetail';

export default function CategoryDetailScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Category',
          header: props => <CustomNavigationBar {...props} />,
        }}
      />
      <CategoryDetail />
    </>
  );
}
