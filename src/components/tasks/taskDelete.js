import { Button, Popconfirm } from "antd";
import React, { useState } from "react";
import CloseCircleOutlined from "../UI/Button/btnDeleteSvg";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask } from "../../redux/rtk/features/tasks/taskSlice";
import { useNavigate } from "react-router-dom";

const TaskDelete = ({ id }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { loading } = useSelector((state) => state.task);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onDelete = () => {
    try {
      dispatch(deleteTask(id));
      navigate("/admin/tasks");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <button
      onClick={onDelete}
      type="primary"
      className="text-black font-bold p-1 rounded mt-4 absolute top-[-20px] right-0 del-btn"
    >
      x
    </button>
  );
};

export default TaskDelete;
