import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {useRouter} from 'expo-router';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useToken} from '../data/token';
import {safeAreaMetrics} from '../testUtils';
import NavigationDrawer from './NavigationDrawer';

jest.mock('../data/token', () => ({useToken: jest.fn()}));
jest.mock('expo-router', () => ({useRouter: jest.fn()}));

describe('NavigationDrawer', () => {
  const ICON_BY_ROUTE = {};

  it('navigates via router when unauthenticated links are pressed', () => {
    const navigation = {
      navigate: jest.fn().mockName('navigation.navigate'),
    };
    const state = {routes: []};
    useToken.mockReturnValue({isLoggedIn: false});
    const mockRouter = {push: jest.fn(), replace: jest.fn(), back: jest.fn()};
    useRouter.mockReturnValue(mockRouter);

    render(
      <SafeAreaProvider initialMetrics={safeAreaMetrics}>
        <NavigationDrawer
          iconByRoute={ICON_BY_ROUTE}
          navigation={navigation}
          state={state}
        />
      </SafeAreaProvider>,
    );

    fireEvent.press(screen.getByText('About'));

    expect(mockRouter.push).toHaveBeenCalledWith('/about');
  });

  describe('when signed in', () => {
    it('allows signing out', async () => {
      const navigation = {
        navigate: jest.fn().mockName('navigation.navigate'),
      };
      const state = {
        routes: [],
      };
      const clearToken = jest.fn().mockName('clearToken');
      useToken.mockReturnValue({
        isLoggedIn: true,
        clearToken,
      });
      const mockRouter = {push: jest.fn(), replace: jest.fn(), back: jest.fn()};
      useRouter.mockReturnValue(mockRouter);

      render(
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <NavigationDrawer
            iconByRoute={ICON_BY_ROUTE}
            navigation={navigation}
            state={state}
          />
        </SafeAreaProvider>,
      );

      fireEvent.press(screen.getByText('Sign out'));

      expect(clearToken).toHaveBeenCalledWith();
      await waitFor(() =>
        expect(mockRouter.replace).toHaveBeenCalledWith('/signin'),
      );
    });
  });
});
