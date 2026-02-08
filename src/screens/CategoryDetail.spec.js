import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import nock from 'nock';
import {TokenProvider} from '../data/token';
import CategoryDetail from './CategoryDetail';

const {useRouter, useLocalSearchParams} = require('expo-router');

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

describe('CategoryDetail', () => {
  function providers(children) {
    return <TokenProvider loadToken={false}>{children}</TokenProvider>;
  }

  describe('for a new category', () => {
    const name = 'New Category';

    function setUp() {
      const mockRouter = {
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
      };
      useRouter.mockReturnValue(mockRouter);
      useLocalSearchParams.mockReturnValue({id: 'new'});

      render(providers(<CategoryDetail />));

      return {router: mockRouter};
    }

    it('allows creating the category', async () => {
      const response = {
        data: {
          id: 'abc123',
          type: 'todos',
          attributes: {
            name: 'My Available Todo',
            notes: 'Notes for the todo',
            'created-at': '2021-08-27T23:54:49.483Z',
            'updated-at': '2021-08-27T23:54:49.483Z',
            'deleted-at': null,
            'completed-at': null,
            'deferred-at': null,
            'deferred-until': null,
          },
          relationships: {
            category: {
              data: null,
            },
          },
        },
      };
      const mockedServer = nock('http://localhost:3000')
        .post('/categories?', {
          data: {attributes: {name: 'New Category'}, type: 'categories'},
        })
        .reply(200, response);

      const {router} = setUp({
        response,
      });

      fireEvent.changeText(screen.getByLabelText('Category name'), name);
      fireEvent.press(screen.getByText('Save'));

      await waitFor(() => {
        expect(router.push).toHaveBeenCalledWith('/categories');
      });

      mockedServer.done();
    });

    it('allows cancelling creation', async () => {
      const {router} = setUp();

      fireEvent.changeText(screen.getByLabelText('Category name'), name);
      fireEvent.press(screen.getByText('Cancel'));

      await waitFor(() => {
        expect(router.push).toHaveBeenCalledWith('/categories');
      });
    });
  });

  describe('for an existing category', () => {
    const category = {
      id: 'cat1',
      type: 'categories',
      attributes: {
        name: 'Category C',
        'sort-order': 3,
      },
    };

    function setUp({response, deleteError = null, saveError = null} = {}) {
      const mockRouter = {push: jest.fn(), replace: jest.fn(), back: jest.fn()};
      useRouter.mockReturnValue(mockRouter);

      const mockedServer = nock('http://localhost:3000')
        .get(`/categories/${category.id}?`)
        .reply(200, {data: category});

      // const client = {
      //   get: () => Promise.resolve({data: {data: category}}),
      //   patch: jest.fn(),
      //   delete: jest.fn().mockResolvedValue(),
      // };
      // authenticatedHttpClient.mockReturnValue(client);

      // if (saveError) {
      //   client.patch.mockRejectedValue(saveError);
      // }

      // if (response) {
      //   client.patch.mockResolvedValue(response);
      // }

      // if (deleteError) {
      //   client.delete.mockRejectedValue(deleteError);
      // } else {
      //   client.delete.mockResolvedValue();
      // }

      useLocalSearchParams.mockReturnValue({id: category.id});
      render(providers(<CategoryDetail />));

      return {
        mockedServer,
        router: mockRouter,
      };
    }

    it('displays the category name', async () => {
      setUp();
      await waitFor(() =>
        expect(screen.getByLabelText('Category name')).toHaveProp(
          'value',
          'Category C',
        ),
      );
    });

    it('allows editing the category', async () => {
      const updatedName = 'Updated Name';

      const {router, mockedServer} = setUp();

      mockedServer
        .patch('/categories/cat1?', {
          data: {
            type: 'categories',
            id: category.id,
            attributes: {name: updatedName},
          },
        })
        .reply(200, {data: category});

      await screen.findByText('Delete');

      fireEvent.changeText(screen.getByLabelText('Category name'), updatedName);
      fireEvent.press(screen.getByText('Save'));

      await waitFor(() => {
        expect(router.push).toHaveBeenCalledWith('/categories');
      });

      mockedServer.done();
    });

    it('shows a message upon error saving edits to the category', async () => {
      const saveError = 'saveError';
      const updatedName = 'Updated Name';

      const {router, mockedServer} = setUp();

      mockedServer.patch('/categories/cat1?').reply(500, saveError);

      const saveButton = await screen.findByText('Save');
      fireEvent.changeText(screen.getByLabelText('Category name'), updatedName);
      fireEvent.press(saveButton);

      await screen.findByText('An error occurred saving the category.');
      expect(router.push).not.toHaveBeenCalled();
    });

    it('allows deleting the category', async () => {
      const {router, mockedServer} = setUp();

      mockedServer.delete('/categories/cat1?').reply(200, {});

      fireEvent.press(await screen.findByText('Delete'));

      await waitFor(() => {
        expect(router.push).toHaveBeenCalledWith('/categories');
      });

      mockedServer.done();
    });

    it('shows a message upon error deleting the category', async () => {
      const deleteError = 'deleteError';

      const {router, mockedServer} = setUp({
        deleteError,
      });

      mockedServer.delete('/categories/cat1?').reply(500, deleteError);

      fireEvent.press(await screen.findByText('Delete'));

      await screen.findByText('An error occurred deleting the category.');
      expect(router.push).not.toHaveBeenCalled();
    });
  });
});
