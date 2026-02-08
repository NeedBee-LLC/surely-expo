import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import nock from 'nock';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {TokenProvider} from '../../data/token';
import {mockUseFocusEffect, safeAreaMetrics} from '../../testUtils';
import Tomorrow from './Tomorrow';

const {useRouter} = require('expo-router');

jest.mock('expo-router', () => ({
  useFocusEffect: jest.fn(),
  useRouter: jest.fn(),
}));

describe('Tomorrow', () => {
  const category = {
    id: 'c1',
    type: 'categories',
    attributes: {
      name: 'My Category',
      'sort-order': 1,
    },
  };
  const todo = {
    id: 'abc123',
    type: 'todos',
    attributes: {
      name: 'Todo 1',
    },
    relationships: {
      category: {
        data: {
          type: 'categories',
          id: category.id,
        },
      },
    },
  };

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

  describe('when there are no tomorrow todos', () => {
    it('shows a message', async () => {
      const response = {data: [], included: []};

      nock('http://localhost:3000')
        .get('/todos?filter[status]=tomorrow&include=category')
        .reply(200, response);

      render(providers(<Tomorrow />));

      await screen.findByText('You have no todos for tomorrow. Nice work!');
    });
  });

  describe('when there are tomorrow todos', () => {
    const response = {data: [todo], included: [category]};

    function renderComponent() {
      const mockedServer = nock('http://localhost:3000')
        .get('/todos?filter[status]=tomorrow&include=category')
        .reply(200, response);

      render(providers(<Tomorrow />));

      return {mockedServer};
    }

    it('displays tomorrow todos from the server', async () => {
      renderComponent();

      await screen.findByText(todo.attributes.name);
      expect(screen.getByText(`${category.attributes.name} (1)`)).toBeTruthy();
    });

    it('allows navigating to a todo detail', async () => {
      const mockRouter = {push: jest.fn(), replace: jest.fn(), back: jest.fn()};
      useRouter.mockReturnValue(mockRouter);

      renderComponent();

      fireEvent.press(await screen.findByText('Todo 1'));

      expect(mockRouter.push).toHaveBeenCalledWith('/todos/tomorrow/abc123');
    });

    it('allows adding a todo', async () => {
      const todoName = 'My New Todo';

      const {mockedServer} = renderComponent();

      mockedServer
        .post(
          '/todos?',
          body =>
            body.data.attributes.name === todoName &&
            body.data.attributes['deferred-until'] !== null,
        )
        .reply(200, {data: {}})
        .get('/todos?filter[status]=tomorrow&include=category')
        .reply(200, response);

      await screen.findByText('Todo 1');

      const addField = screen.getByLabelText('New todo name');
      fireEvent.changeText(addField, todoName);
      fireEvent(addField, 'submitEditing');

      // wait for post and second get
      await waitFor(() => expect(mockedServer.isDone()).toBe(true));
    });
  });
});
