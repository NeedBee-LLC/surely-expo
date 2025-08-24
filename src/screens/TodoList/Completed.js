import {useRouter} from 'expo-router';
import {useCallback} from 'react';
import {useTodos} from '../../data/todos';
import {groupByDate} from '../../utils/grouping';
import TodoListScreen from './TodoListScreen';

export default function CompletedTodos() {
  const todoClient = useTodos();
  const router = useRouter();

  const loadCompletedTodos = useCallback(
    ({searchText, pageNumber}) =>
      todoClient
        .where({
          filter: {status: 'completed', search: searchText},
          options: {sort: '-completedAt', 'page[number]': pageNumber},
        })
        .then(todoResponse => {
          return {
            todoGroups: groupByDate({
              todos: todoResponse.data,
              attribute: 'completed-at',
              reverse: true,
            }),
            maxPageNumber: todoResponse?.meta?.['page-count'],
          };
        }),
    [todoClient],
  );

  const goToCompletedTodo = todo => router.push(`/todos/completed/${todo.id}`);

  return (
    <TodoListScreen
      search
      paginate
      onLoadTodos={loadCompletedTodos}
      onPressTodo={goToCompletedTodo}
      noTodosMessage="You have no completed todos. You'll get there!"
      noSearchResultsMessage="No completed todos matched your search"
    />
  );
}
