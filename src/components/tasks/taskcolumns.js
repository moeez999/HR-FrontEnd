import React, { useEffect } from "react";
import { message, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  loadAllTasks,
  deleteTask,
} from "../../redux/rtk/features/tasks/taskSlice";

import TaskCard from "./task";
import axios from "axios";

const TaskForm = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.task.list);

  useEffect(() => {
    dispatch(loadAllTasks());
  }, [dispatch]);

  const handleDelete = (taskId) => {
    dispatch(deleteTask(taskId));
  };

  const handleDownload = async (filenames) => {
    try {
      for (const filename of filenames) {
        const response = await axios.get(
          `http://localhost:4000/tasks/download/${filename}`,
          {
            responseType: "blob", // For handling binary data (attachments)
          }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading attachments:", error);
      message.error("Error downloading attachments.");
    }
  };
  const countTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status).length;
  };

  console.log(tasks.filter((task) => task.status === "IN PROGRESS"));

  return (
    <div className="mt-4 mr-2">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <div className="column">
            <div className="flex items-center justify-between bg-white shadow-md p-2 rounded border-t-2 border-gray-300 ">
              <h2 className="font-semibold text-base">TO DO </h2>{" "}
              <p>
                <span class="rounded border border-solid border-gray-300 px-2 py-1">
                  {countTasksByStatus("TO DO")}
                </span>
              </p>
            </div>
            {tasks
              .filter((task) => task.status === "TO DO")
              .map((task) => (
                <TaskCard
                  task={task}
                  key={task.id}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                />
              ))}
          </div>
        </Col>
        <Col span={8}>
          <div className="column">
            <div className="flex items-center justify-between bg-white shadow-md p-2 rounded border-t-2 border-yellow-400">
              <h2 className="font-semibold text-base">IN PROGRESS</h2>
              <p>
                <span class="rounded border border-solid border-gray-300 px-2 py-1">
                  {countTasksByStatus("IN PROGRESS")}
                </span>
              </p>
            </div>
            {tasks
              .filter((task) => task.status === "IN PROGRESS")
              .map((task) => (
                <TaskCard
                  task={task}
                  key={task.id}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                />
              ))}
          </div>
        </Col>
        <Col span={8}>
          <div className="column">
            <div className="flex items-center justify-between bg-white shadow-md p-2 rounded border-t-2 border-green-500">
              <h2 className="font-semibold text-base">COMPLETED</h2>
              <p>
                <span class="rounded border border-solid border-gray-300 px-2 py-1">
                  {countTasksByStatus("COMPLETED")}
                </span>
              </p>
            </div>
            {tasks
              .filter((task) => task.status === "COMPLETED")
              .map((task) => (
                <TaskCard
                  task={task}
                  key={task.id}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                />
              ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TaskForm;
