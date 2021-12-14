import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./style.css";
import image from "../assets/img/X2oObC4.png";
import { createAction } from "../store/actions";
import { actionType } from "../store/actions/type";

const TodoList = (props) => {
  const [state, setState] = useState({
    taskName: "",
    disabled: true,
  });

  const dispatch = useDispatch();
  const { taskList } = useSelector((state) => state.todoListReducer);
  const { taskEdit } = useSelector((state) => state.todoListReducer);

  const handleAddTask = () => {
    let { taskName } = state;

    let cloneTaskList = [...taskList];

    let newTask = {
      id: Date.now(),
      taskName,
      done: false,
    };

    console.log("newtask", newTask);

    if (newTask.taskName === "") {
      alert("Task name is required");
    }

    let index = cloneTaskList.findIndex(
      (item) => item.taskName === newTask.taskName
    );

    if (index === -1) {
      cloneTaskList.push(newTask);
    } else {
      alert("Taskname already exists!");
      return cloneTaskList;
    }

    dispatch(createAction(actionType.SET_TASK, cloneTaskList));
  };

  const handleSetCompleted = (id) => {
    let cloneTaskList = [...taskList];
    let foundIndex = cloneTaskList.findIndex((item) => item.id === id);
    if (foundIndex !== -1) cloneTaskList[foundIndex].done = true;

    dispatch(createAction(actionType.SET_TASK, cloneTaskList));
  };

  const handleDelete = (id) => {
    let cloneTaskList = [...taskList];
    let listAfterDeleted = cloneTaskList.filter((task) => task.id !== id);

    dispatch(createAction(actionType.SET_TASK, listAfterDeleted));
  };

  const handleEditTask = (task) => {
    setState({ taskName: task.taskName, disabled: false });
    dispatch(createAction(actionType.EDIT_TASK, task));
  };

  const handleUpdateTask = () => {
    let cloneTaskEdit = { ...taskEdit };
    let cloneTaskList = [...taskList];

    //đối chiếu task.id giữa taskList và taskEdit:
    let index = cloneTaskList.findIndex((item) => item.id === cloneTaskEdit.id);

    //nếu trùng task.id, gán taskname mới vào
    if (index !== -1) {
      cloneTaskList[index].taskName = state.taskName;
    }

    dispatch(createAction(actionType.SET_TASK, cloneTaskList));

    setState({
      disabled: true,
      taskName: "",
    });
  };

  return (
    <div className="card">
      <div className="card__header">
        <img src={image} />
      </div>

      <div className="card__body">
        <div className="card__content">
          <div className="card__title">
            <h2>My Tasks</h2>
          </div>
          <div className="card__add">
            <input
              value={state.taskName}
              name="taskName"
              onChange={(e) => {
                setState({
                  taskName: e.target.value,
                  disabled: state.disabled,
                });
                console.log(state.taskName);
                console.log(state.disabled);
              }}
              id="newTask"
              type="text"
              placeholder="Enter an activity..."
            />
            {state.disabled ? (
              <button id="addItem" onClick={handleAddTask}>
                <i className="fa fa-plus" />
              </button>
            ) : (
              <button onClick={handleUpdateTask}>
                <i className="fa fa-check"></i>
              </button>
            )}
          </div>
          <div className="card__todo">
            {/* Uncompleted tasks */}

            <ul className="todo" id="todo">
              {taskList
                .filter((task) => !task.done)
                .map((task, i) => {
                  return (
                    <li key={i}>
                      <span>{task.taskName}</span>
                      <div className="buttons">
                        <button
                          className="complete"
                          onClick={() => handleEditTask(task)}
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                        <button
                          className="remove"
                          onClick={() => handleDelete(task.id)}
                        >
                          <i className="fa fa-trash-alt" />
                        </button>
                        <button
                          className="complete"
                          onClick={() => handleSetCompleted(task.id)}
                        >
                          <i className="far fa-check-circle" />
                        </button>
                      </div>
                    </li>
                  );
                })}
            </ul>

            {/* Completed tasks */}
            <ul className="todo" id="completed">
              {taskList
                .filter((task) => task.done)
                .map((task, i) => {
                  return (
                    <li key={i}>
                      <span>{task.taskName}</span>
                      <div className="buttons">
                        <button
                          className="remove"
                          onClick={() => handleDelete(task.id)}
                        >
                          <i className="fa fa-trash-alt" />
                        </button>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
