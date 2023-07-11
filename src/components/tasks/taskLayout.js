import React from "react";
import TaskListHeader from "../tasks/taskListHeader";
import TasksList from "../tasks/tasklist";
import TaskDetails from "../tasks/taskDetails";

export default function TaskLayout({ taskName }) {
  return (
    <div className="w-full">
      {/* <TaskListHeader taskName={taskName} />
      <TasksList /> */}
      <TaskDetails />
    </div>
  );
}
