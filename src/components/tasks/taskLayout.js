import React from "react";
import TaskListHeader from "../tasks/taskListHeader";
import TasksList from "../tasks/tasklist";
import AddTask from "../tasks/taskDetails";

export default function TaskLayout({ taskName }) {
  return (
    <div className="w-full">
      {/* <TaskListHeader taskName={taskName} />
      <TasksList /> */}
      <AddTask />
    </div>
  );
}
