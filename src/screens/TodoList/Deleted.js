import {useRouter} from 'expo-router';
import {useCallback} from 'react';
import {useTodos} from '../../data/todos';
import {groupByDate} from '../../utils/grouping';
import TodoListScreen from './TodoListScreen';

export default function DeletedTodos() {
  const todoClient = useTodos();
  const router = useRouter();

  const loadDeletedTodos = useCallback(
    ({searchText, pageNumber}) =>
      todoClient
        .where({
          filter: {status: 'deleted', search: searchText},
          options: {sort: '-deletedAt', 'page[number]': pageNumber},
        })
        .then(todoResponse => ({
          todoGroups: groupByDate({
            todos: todoResponse.data,
            attribute: 'deleted-at',
            reverse: true,
          }),
          maxPageNumber: todoResponse?.meta?.['page-count'],
        })),
    [todoClient],
  );

  const goToDeletedTodo = todo => router.push(`/todos/deleted/${todo.id}`);

  return (
    <TodoListScreen
      search
      paginate
      onLoadTodos={loadDeletedTodos}
      onPressTodo={goToDeletedTodo}
      noTodosMessage="You have no deleted todos. Don't be afraid to give up!"
      noSearchResultsMessage="No deleted todos matched your search"
    />
  );
}
