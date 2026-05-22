/**
 * @file useTodos.ts
 * @description React Query 기반 Todo 상태 관리 훅.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studyApi } from '../../api/study';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../../types';

// 캐시 키
export const QUERY_KEY_TODOS = ['todos'];

export function useTodos() {
  const queryClient = useQueryClient();

  // 1. 목록 조회
  const { data: todos = [], isLoading, isError, error } = useQuery<Todo[]>({
    queryKey: QUERY_KEY_TODOS,
    queryFn: studyApi.getTodos,
  });

  // 2. 단건 추가
  const createTodoMutation = useMutation({
    mutationFn: (dto: CreateTodoDto) => studyApi.createTodo(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_TODOS });
    },
  });

  // 3. 다중 추가 (일괄)
  const createTodosBulkMutation = useMutation({
    mutationFn: (dtos: CreateTodoDto[]) => studyApi.createTodosBulk(dtos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_TODOS });
    },
  });

  // 4. 수정 (낙관적 업데이트)
  const updateTodoMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTodoDto }) => studyApi.updateTodo(id, dto),
    
    // 캐시 사전 갱신 (선반영)
    onMutate: async ({ id, dto }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY_TODOS });
      const previousTodos = queryClient.getQueryData<Todo[]>(QUERY_KEY_TODOS);
      
      if (previousTodos) {
        queryClient.setQueryData<Todo[]>(QUERY_KEY_TODOS, previousTodos.map(todo => 
          todo.id === id ? { ...todo, ...dto } : todo
        ));
      }
      return { previousTodos };
    },
    // 에러 시 롤백
    onError: (_err, _newTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(QUERY_KEY_TODOS, context.previousTodos);
      }
    },
    // 완료 후 캐시 무효화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_TODOS });
    },
  });

  // 5. 삭제
  const deleteTodoMutation = useMutation({
    mutationFn: (id: string) => studyApi.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_TODOS });
    },
  });

  return {
    todos,
    isLoading,
    isError,
    error,
    createTodo: createTodoMutation.mutateAsync,
    createTodosBulk: createTodosBulkMutation.mutateAsync,
    updateTodo: updateTodoMutation.mutateAsync,
    deleteTodo: deleteTodoMutation.mutateAsync,
  };
}



