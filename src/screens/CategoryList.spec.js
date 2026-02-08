import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import nock from 'nock';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {TokenProvider} from '../data/token';
import {mockUseFocusEffect, safeAreaMetrics} from '../testUtils';
import CategoryList from './CategoryList';

const {useRouter} = require('expo-router');

jest.mock('expo-router', () => ({
  useFocusEffect: jest.fn(),
  useRouter: jest.fn(),
}));

describe('CategoryList', () => {
  function providers(children) {
    return (
      <SafeAreaProvider initialMetrics={safeAreaMetrics}>
        <TokenProvider loadToken={false}>{children}</TokenProvider>
      </SafeAreaProvider>
    );
  }

  beforeEach(() => {
    mockUseFocusEffect();
  });

  it('shows a message when no categories listed', async () => {
    nock('http://localhost:3000').get('/categories?').reply(200, {data: []});

    render(providers(<CategoryList />));

    await screen.findByText('No categories yet');
  });

  describe('when categories are loaded', () => {
    const categories = [
      {
        id: 'cat1',
        attributes: {
          name: 'Category C',
          'sort-order': 3,
        },
      },
      {
        id: 'cat2',
        attributes: {
          name: 'Category B',
          'sort-order': 2,
        },
      },
      {
        id: 'cat3',
        attributes: {
          name: 'Category A',
          'sort-order': 1,
        },
      },
    ];

    function renderComponent() {
      const mockedServer = nock('http://localhost:3000')
        .get('/categories?')
        .reply(200, {data: categories});

      render(providers(<CategoryList />));

      return {
        mockedServer,
      };
    }

    it('lists categories from the server', async () => {
      renderComponent();

      await screen.findByText('Category A');
      expect(screen.getByText('Category B')).toBeTruthy();
    });

    it('allows navigating to create a category', async () => {
      const mockRouter = {push: jest.fn(), replace: jest.fn(), back: jest.fn()};
      useRouter.mockReturnValue(mockRouter);

      renderComponent();

      await screen.findByText('Category A');

      fireEvent.press(screen.getByText('Add'));
      expect(mockRouter.push).toHaveBeenCalledWith('/categories/new');
    });

    it('allows navigating to a category detail', async () => {
      const mockRouter = {push: jest.fn(), replace: jest.fn(), back: jest.fn()};
      useRouter.mockReturnValue(mockRouter);

      renderComponent();

      fireEvent.press(await screen.findByText('Category A'));

      expect(mockRouter.push).toHaveBeenCalledWith('/categories/cat3');
    });

    function mockSortCall({mockedServer, cat, sortOrder}) {
      mockedServer
        .patch(
          `/categories/${cat}?`,
          body => body.data.attributes['sort-order'] === sortOrder,
        )
        .reply(200, {data: {}});
    }

    it('allows moving an item down in the sort order', async () => {
      const {mockedServer} = renderComponent();

      mockSortCall({mockedServer, cat: 'cat2', sortOrder: 0});
      mockSortCall({mockedServer, cat: 'cat3', sortOrder: 1});
      mockSortCall({mockedServer, cat: 'cat1', sortOrder: 2});
      mockedServer.get('/categories?').reply(200, {data: categories});

      await screen.findByText('Category A');
      fireEvent.press(screen.getAllByLabelText('Move down')[0]);

      await waitFor(() => expect(mockedServer.isDone()).toBe(true));
    });

    it('shows a message when an error occurs moving an item down', async () => {
      const {mockedServer} = renderComponent();

      mockedServer.patch('/categories/cat2?').reply(500, {});

      await screen.findByText('Category A');
      fireEvent.press(screen.getAllByLabelText('Move down')[0]);

      await screen.findByText('An error occurred moving category down.');
    });

    it('allows moving an item up in the sort order', async () => {
      const {mockedServer} = renderComponent();

      mockSortCall({mockedServer, cat: 'cat3', sortOrder: 0});
      mockSortCall({mockedServer, cat: 'cat1', sortOrder: 1});
      mockSortCall({mockedServer, cat: 'cat2', sortOrder: 2});
      mockedServer.get('/categories?').reply(200, {data: categories});

      await screen.findByText('Category A');
      fireEvent.press(screen.getAllByLabelText('Move up')[2]);

      await waitFor(() => expect(mockedServer.isDone()).toBe(true));
    });

    it('shows a message when an error occurs moving an item up', async () => {
      const {mockedServer} = renderComponent();

      mockedServer.patch('/categories/cat2?').reply(500, {});

      await screen.findByText('Category A');
      fireEvent.press(screen.getAllByLabelText('Move up')[0]);

      await screen.findByText('An error occurred moving category up.');
    });
  });
});
