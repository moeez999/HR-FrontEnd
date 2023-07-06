// import React from "react";

// export default function TaskListHeader({ taskName, taskCount }) {
//   return (
//     <div className="flex flex-row justify-between w-full header shadow-md p-4 items-center mt-4 rounded-lg">
//       <div className="flex flex-row gap-2 items-center">
//         <h1 className="font-medium">{taskName}</h1>
//         <p className="font-normal text-sm count">{0}</p>
//       </div>
//       <div className="btn-div">
//         <button className="text-lg font-medium add-task-btn opacity-50">
//           +
//         </button>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";

// const HandleAddTask = () => {
//   const [Tasks, setTasks] = useState([]);

//   const newTasks = { id: Tasks.length + 1, title: "Title" };
//   setTasks([...Tasks, newTasks]);
// };

export default function TaskListHeader({ taskName, onNewTaskClick }) {
  return (
    <div className="flex flex-row justify-between w-full header shadow-md p-4 items-center mt-4 rounded-lg">
      <div className="flex flex-row gap-2 items-center">
        <h1 className="font-medium">{taskName}</h1>
        <p className="font-normal text-sm count">0</p>
      </div>
      <div className="btn-div">
        <button
          className="text-lg font-medium add-task-btn opacity-50"
          onClick={onNewTaskClick}
        >
          +
        </button>
      </div>
    </div>
  );
}
