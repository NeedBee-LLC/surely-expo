import {fireEvent, render, screen} from '@testing-library/react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {large, medium, useBreakpoint} from '../breakpoints';
import NavigationBar from './NavigationBar';
import {useRouter} from 'expo-router';

jest.mock('../breakpoints');
jest.mock('expo-router', () => ({useRouter: jest.fn()}));

describe('NavigationBar', () => {
  function wrapper(children) {
    return (
      <SafeAreaProvider
        initialMetrics={{
          frame: {x: 0, y: 0, width: 1000, height: 1000},
          insets: {top: 0, left: 0, right: 0, bottom: 0},
        }}
      >
        {children}
      </SafeAreaProvider>
    );
  }

  describe('back button', () => {
    describe('when React Nav provides a truthy back prop', () => {
      it('renders a button that allows you to go back', () => {
        const options = {};
        const navigation = {};
        const router = {back: jest.fn()};
        useRouter.mockReturnValue(router);

        render(
          wrapper(
            <NavigationBar back options={options} navigation={navigation} />,
          ),
        );

        fireEvent.press(screen.getByLabelText('Back'));

        expect(router.back).toHaveBeenCalledWith();
      });
    });

    describe('when React Nav provides a falsy back prop', () => {
      it('does not render a back button', () => {
        const options = {};
        const navigation = {};

        render(
          wrapper(
            <NavigationBar
              back={false}
              options={options}
              navigation={navigation}
            />,
          ),
        );

        expect(screen.queryByLabelText('Back')).toBeNull();
      });
    });
  });

  describe('menu button', () => {
    describe('when on a viewport that is not large', () => {
      it('render a button that allows toggling the drawer', () => {
        useBreakpoint.mockReturnValue(large);

        const options = {};
        const navigation = {};

        render(
          wrapper(<NavigationBar options={options} navigation={navigation} />),
        );

        expect(screen.queryByLabelText('Menu')).toBeNull();
      });
    });

    describe('when on a large viewport', () => {
      it('does not render a menu button', () => {
        useBreakpoint.mockReturnValue(medium);

        const options = {};
        const navigation = {
          toggleDrawer: jest.fn().mockName('navigation.toggleDrawer'),
        };

        render(
          wrapper(<NavigationBar options={options} navigation={navigation} />),
        );

        fireEvent.press(screen.getByLabelText('Menu'));

        expect(navigation.toggleDrawer).toHaveBeenCalledWith();
      });
    });
  });
});
