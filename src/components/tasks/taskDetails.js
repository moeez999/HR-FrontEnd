// import React from "react";

// export default function TaskDetails() {
//   return (
//     <div className="card rounded mt-6 shadow-md ">
//       <div class="flex flex-row items-center justify-between">
//         <h1>Task Name</h1>
//         <p className="rounded-full text-sm">AN</p>
//       </div>
//       <button className="text-xs opacity-50 mt-10 add-subtask">
//         + ADD SUBTASK
//       </button>
//     </div>
//   );
// }
import React, { useState } from "react";
import { Input } from "antd";

export default function TaskDetails() {
  const [subtasks, setSubtasks] = useState([]);
  const [task, setTask] = useState([]);
  const handletaskNameChange = (taskId, newName) => {
    const updatedtask = task.map((task) => {
      if (task.id === taskId) {
        return { ...task, title: newName };
      }
      return task;
    });
    setTask(updatedtask);
  };

  const handleAddSubtask = () => {
    const newSubtask = { id: subtasks.length + 1, title: "Title" };
    setSubtasks([...subtasks, newSubtask]);
  };

  const handleDeleteSubtask = (subtaskId) => {
    const updatedSubtasks = subtasks.filter(
      (subtask) => subtask.id !== subtaskId
    );
    setSubtasks(updatedSubtasks);
  };

  const handleSubtaskNameChange = (subtaskId, newName) => {
    const updatedSubtasks = subtasks.map((subtask) => {
      if (subtask.id === subtaskId) {
        return { ...subtask, title: newName };
      }
      return subtask;
    });
    setSubtasks(updatedSubtasks);
  };

  return (
    <div className="card rounded mt-6 shadow-md">
      <div className="flex flex-row items-center justify-between">
        <div class="flex flex-col tems-center">
          <input className="w-full outline-none"></input>
          <textarea
            className="text-sm outline-none w-full"
            type="text"
            value={task.title}
            onChange={(e) => handletaskNameChange(task.id, e.target.value)}
          />
        </div>
        <p className="rounded-full text-sm">AN</p>
      </div>
      <button
        className="text-xs opacity-50 mt-10 add-subtask"
        onClick={handleAddSubtask}
      >
        + ADD SUBTASK
      </button>
      <div className="subtasks">
        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="subtask-item mt-2 flex flex-row justify-between"
          >
            <textarea
              className="text-sm outline-none w-full"
              type="text"
              value={subtask.title}
              onChange={(e) =>
                handleSubtaskNameChange(subtask.id, e.target.value)
              }
            />
            <p className="rounded-full text-sm">AN</p>
            <button
              className="delete-subtask"
              onClick={() => handleDeleteSubtask(subtask.id)}
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
