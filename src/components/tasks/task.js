import { Button } from "antd";
import TaskEditForm from "../UI/PopUp/TaskEditPopup";
import TaskDelete from "./taskDelete";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import { updateTask } from "../../redux/rtk/features/tasks/taskSlice";

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();

  const [status, setStatus] = useState(task.status);

  const getStatusBackgroundColor = (status) => {
    if (status === "IN PROGRESS") {
      return "#FFC800";
    } else if (status === "COMPLETED") {
      return "#28C88A";
    } else {
      return "#FFFFFF"; // Set a default background color for 'TO DO' status or any other undefined status.
    }
  };
  const handleStatusChange = async () => {
    let newStatus;
    if (status === "TO DO") {
      newStatus = "IN PROGRESS";
    } else if (status === "IN PROGRESS") {
      newStatus = "COMPLETED";
    } else if (status === "COMPLETED") {
      newStatus = "TO DO";
    } else {
      newStatus = "TO DO";
    }

    // Optimistically update the local state to reflect the changes immediately
    setStatus(newStatus);

    // Dispatch the updateTask action to update the status in the Redux store and backend
    try {
      const { message } = await dispatch(
        updateTask({ id: task.id, values: { status: newStatus } })
      );
      if (message === "success") {
        // Task successfully updated
        // Optionally, you can show a success message or handle other UI changes here
      } else {
        // Handle the case when the API call fails (optional)
        // You can revert the state if needed or show an error message to the user
      }
    } catch (error) {
      // Handle errors (optional)
      console.error("Error updating task status:", error);
      // Revert the state in case of an error
      setStatus(task.status);
    }
  };
  const getRandomColor = () => {
    const colors = ["#7B68EE", "#49CCF9", "#FD71AF", "#FFC800"];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  return (
    <div
      className="task-card pd-1 rounded shadow-md mt-2 relative bg-white"
      key={task.id}
    >
      <div class="flex flex-row justify-between items-center relative assignee-div">
        <div className="task-title">{task.title}</div>
        <div className="hide-name mt-2 absolute top-[-15px] right-0">
          {task.assignee.map((item, index) => (
            <div key={index} className="assignee flex flex-col">
              {item.split(",").map((assignee) => (
                <span className="text-xs" key={assignee.split(":")[1]}>
                  {assignee
                    .split(":")[0]
                    .split("")
                    .map((namePart) => namePart.charAt(0))
                    .join("")}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="task-details mt-2">
          {task.assignee.map((item, index) => (
            <div key={index} className="assignee flex flex-row">
              {item.split(",").map((assignee) => (
                <span
                  className="task-assignee"
                  style={{ backgroundColor: getRandomColor() }}
                  key={assignee.split(":")[1]}
                >
                  {assignee
                    .split(":")[0]
                    .split("  ")
                    .map((namePart) => namePart.charAt(0).toUpperCase())
                    .join("")}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div class="flex flex-row items-center gap-1 edit-del">
        <TaskEditForm id={task.id} size={25} />
        <div className="task-status">
          <Button
            className="status font-medium"
            onClick={handleStatusChange}
            style={{ backgroundColor: getStatusBackgroundColor(status) }}
          >
            {task.status}
          </Button>
        </div>
        <TaskDelete id={task.id} />
      </div>
    </div>
  );
};

export default TaskCard;
