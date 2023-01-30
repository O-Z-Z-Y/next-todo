import { TodoType } from "../types/todo";
import styled from "styled-components";
import palette from "../styles/palette";

import React, { useMemo, useCallback } from "react";
import { checkTodoAPI, deleteTodoAPI } from "../lib/api/todo";
import TrashCanIcon from "../public/statics/svg/trash_can.svg";
import CheckMarkIcon from "../public/statics/svg/check_mark.svg";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { todoActions } from "../store/todo";

const Container = styled.div`
  width: 100%;

  .todo-num {
    margin-left: 12px;
  }

  .todo-list-header {
    padding: 12px;
    position: relative;
    border-bottom: 1px solid ${palette.gray};

    .todo-list-lat-todo {
      font-size: 14px;
      margin: 0 0 8px;
      span {
        margin-left: 12px;
      }
    }

    .todo-list-header-colors {
      display: flex;
      .todo-list-header-color-num {
        display: flex;
        margin-right: 8px;
        p {
          font-size: 14px;
          line-height: 16px;
          margin: 0;
          margin-left: 6px;
        }
        .todo-list-header-round-color {
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }
      }
    }
  }
  .bg-blue {
    background-color: ${palette.blue};
  }
  .bg-green {
    background-color: ${palette.green};
  }
  .bg-navy {
    background-color: ${palette.navy};
  }
  .bg-orange {
    background-color: ${palette.orange};
  }
  .bg-red {
    background-color: ${palette.red};
  }
  .bg-yellow {
    background-color: ${palette.yellow};
  }

  .todo-list {
    .todo-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 52px;
      border-bottom: 1px solid ${palette.gray};

      .todo-left-side {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        .todo-color-block {
          width: 12px;
          height: 100%;
        }
        .checked-todo-text {
          color: ${palette.gray};
          text-decoration: line-through;
        }
        .todo-text {
          margin-left: 12px;
          font-size: 16px;
        }
      }
      .todo-right-side {
        display: flex;
        margin-right: 12px;
        svg {
          &:first-child {
            margin-right: 16px;
          }
        }
        .todo-trash-can {
          width: 24px;
          path {
            fill: ${palette.deep_red};
          }
        }
        .todo-check-mark {
          fill: ${palette.deep_green};
        }
        .todo-button {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid ${palette.gray};
          background-color: transparent;
          outline: none;
        }
      }
    }
  }
`;

interface IProps {
  todos: TodoType[];
}

const TodoList: React.FC<IProps> = () => {
  const todos = useSelector((state: RootState) => state.todo.todos);
  const dispatch = useDispatch();
  //* 색깔 객체 구하기 1
  const getTodoColorNums = useCallback(() => {
    let red = 0;
    let orange = 0;
    let yellow = 0;
    let green = 0;
    let blue = 0;
    let navy = 0;
    todos.forEach((todo) => {
      switch (todo.color) {
        case "red":
          red += 1;
          break
        case "orange":
          orange += 1;
          break
        case "yellow":
          yellow += 1;
          break
        case "green":
          green += 1;
          break
        case "blue":
          blue += 1;
          break
        case "navy":
          navy += 1;
          break
      }
  });

  return {
    red,
    orange,
    yellow,
    green,
    blue,
    navy,
  };
  }, [todos]);

  //* 객체의 문자열 인덱스 사용을 위한 타입
  type ObjectIndexType = {
    [key: string]: number | undefined;
  };

  //* 색깔 객체 구하기 2
  const todoColorNums = useMemo(() => {
    const colors: ObjectIndexType = {};
    todos.forEach((todo) => {
      const value = colors[todo.color];
      if (!value) {
        //* 존재하지 않는 key라면
        colors[`${todo.color}`] = 1;
      } else {
        //* 존재하는 key라면
        colors[`${todo.color}`] = value + 1;
      }
    });
    return colors;
  }, [todos]);

  //* 투두 체크하기
  const checkTodo = async (id: number) => {
    try {
      await checkTodoAPI(id);
      console.log("체크하였습니다.");
      //* 체크를 적용하는 방법 1(데이터 다시 받기)
      // router.reload();
      //* 체크를 적용하는 방법 2(데이터 다시 받기)
      //* 체크를 적용하는 방법 3(data를 local로 저장하여 사용하기)
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, checked: !todo.checked };
        }
        return todo;
      });
      dispatch(todoActions.setTodo(newTodos));
      console.log("체크하였습니다.")
    } catch (e) {
      console.log(e);
    }
  };

  //* 투두 삭제하기
  const deleteTodo = async (id: number) => {
    try {
      await deleteTodoAPI(id);
      const newTodos = todos.filter((todo) => todo.id !== id);
      dispatch(todoActions.setTodo(newTodos));
      console.log("삭제했습니다.")
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <Container>
      <div className="todo-list-header">
        <p className="todo-list-last-todo">
          남은 Todo <span>{todos.length}개</span>
        </p>
        <div className="todo-list-header-colors">
          {Object.keys(todoColorNums).map((color, index) => (
            <div className="todo-list-header-color-num" key={index}>
              <div className={`todo-list-header-round-color bg-${color}`} />
              <p>{todoColorNums[color]}개</p>
            </div>
          ))}
        </div>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li className="todo-item" key={todo.id}>
            <div className="todo-left-side">
              <div className={`todo-color-block bg-${todo.color}`} />
              <p
                className={`todo-text ${todo.checked ? "checked-todo-text" : ""}`}
              >
                {todo.text}
              </p>
            </div>
            <div className="todo-right-side">
              {todo.checked && (
                <>
                  <TrashCanIcon className="todo-trash-can" onClick={() => {deleteTodo(todo.id)}} />
                  <CheckMarkIcon className="todo-check-mark" onClick={() => {checkTodo(todo.id)}} />
                </>
              )}
              {!todo.checked && (
                <button type="button" className="todo-button" onClick={() => {checkTodo(todo.id)}}/>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default TodoList;