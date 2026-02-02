import {useRouter} from 'expo-router';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useToken} from '../data/token';
import {safeAreaMetrics} from '../testUtils';
import NavigationDrawer from './NavigationDrawer';

jest.mock('../data/token', () => ({useToken: jest.fn()}));
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('NavigationDrawer', () => {
  const ICON_BY_ROUTE = {};

  it('allows navigating to the passed-in routes', () => {
    const push = jest.fn().mockName('push');
    useRouter.mockReturnValue(push);
    
    const route = {
      name: 'Available',
      key: '123',
    };
    const state = {
      routes: [route],
    };
    useToken.mockReturnValue({
      isLoggedIn: false,
    });

    render(
      <SafeAreaProvider initialMetrics={safeAreaMetrics}>
        <NavigationDrawer
          iconByRoute={ICON_BY_ROUTE}
          state={state}
        />
      </SafeAreaProvider>,
    );

    fireEvent.press(screen.getByText(route.name));

    expect(push).toHaveBeenCalledWith('/todos/available');
  });

  describe('when signed in', () => {
    it('allows signing out', async () => {
      const push = jest.fn().mockName('push');
      useRouter.mockReturnValue(push);
      
      const state = {
        routes: [],
      };
      const clearToken = jest.fn().mockName('clearToken');
      useToken.mockReturnValue({
        isLoggedIn: true,
        clearToken,
      });

      render(
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <NavigationDrawer
            iconByRoute={ICON_BY_ROUTE}
            state={state}
          />
        </SafeAreaProvider>,
      );

      fireEvent.press(screen.getByText('Sign out'));

      expect(clearToken).toHaveBeenCalledWith();

      await waitFor(() =>
        expect(push).toHaveBeenCalledWith('/signin'),
      );
    });
  });
});
