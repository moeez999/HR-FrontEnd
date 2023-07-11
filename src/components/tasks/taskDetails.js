// // import React from "react";

// // export default function TaskDetails() {
// //   return (
// //     <div className="card rounded mt-6 shadow-md ">
// //       <div class="flex flex-row items-center justify-between">
// //         <h1>Task Name</h1>
// //         <p className="rounded-full text-sm">AN</p>
// //       </div>
// //       <button className="text-xs opacity-50 mt-10 add-subtask">
// //         + ADD SUBTASK
// //       </button>
// //     </div>
// //   );
// // }
// import React, { useState } from "react";
// import { Input } from "antd";

// export default function TaskDetails() {
//   const [subtasks, setSubtasks] = useState([]);
//   const [task, setTask] = useState([]);
//   const handletaskNameChange = (taskId, newName) => {
//     const updatedtask = task.map((task) => {
//       if (task.id === taskId) {
//         return { ...task, title: newName };
//       }
//       return task;
//     });
//     setTask(updatedtask);
//   };

//   const handleAddSubtask = () => {
//     const newSubtask = { id: subtasks.length + 1, title: "Title" };
//     setSubtasks([...subtasks, newSubtask]);
//   };

//   const handleDeleteSubtask = (subtaskId) => {
//     const updatedSubtasks = subtasks.filter(
//       (subtask) => subtask.id !== subtaskId
//     );
//     setSubtasks(updatedSubtasks);
//   };

//   const handleSubtaskNameChange = (subtaskId, newName) => {
//     const updatedSubtasks = subtasks.map((subtask) => {
//       if (subtask.id === subtaskId) {
//         return { ...subtask, title: newName };
//       }
//       return subtask;
//     });
//     setSubtasks(updatedSubtasks);
//   };

//   return (
//     <div className="card rounded mt-6 shadow-md">
//       <div className="flex flex-row items-center justify-between">
//         <div class="flex flex-col tems-center">
//           <input className="w-full outline-none"></input>
//           <textarea
//             className="text-sm outline-none w-full"
//             type="text"
//             value={task.title}
//             onChange={(e) => handletaskNameChange(task.id, e.target.value)}
//           />
//         </div>
//         <p className="rounded-full text-sm">AN</p>
//       </div>
//       <button
//         className="text-xs opacity-50 mt-10 add-subtask"
//         onClick={handleAddSubtask}
//       >
//         + ADD SUBTASK
//       </button>
//       <div className="subtasks">
//         {subtasks.map((subtask) => (
//           <div
//             key={subtask.id}
//             className="subtask-item mt-2 flex flex-row justify-between"
//           >
//             <textarea
//               className="text-sm outline-none w-full"
//               type="text"
//               value={subtask.title}
//               onChange={(e) =>
//                 handleSubtaskNameChange(subtask.id, e.target.value)
//               }
//             />
//             <p className="rounded-full text-sm">AN</p>
//             <button
//               className="delete-subtask"
//               onClick={() => handleDeleteSubtask(subtask.id)}
//             >
//               x
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ViewBtn from "../Buttons/ViewBtn";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { useDispatch, useSelector } from "react-redux";

import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
// import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, TimePicker, Typography } from "antd";
import { addTask } from "./../../redux/rtk/features/tasks/taskSlice";
import GetAllCust from "../user/GetAllUser";

const AddTask = () => {
  const [loader, setLoader] = useState(false);
  const listFromGetAllCust = useSelector((state) => state.users.list);
  console.log(listFromGetAllCust);
  // const task = useSelector((state) => state.task.list);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   // dispatch(loadAllTask());
  // }, []);

  // const { Title } = Typography;
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    debugger;
    const taskData = {
      clientId: values.clientId,
      taskPrice: values.taskPrice,
      title: values.title,
      description: values.description,
      comments: values.comments,
      assignee: values.assignee,
      watchers: values.watchers,
      startTime: moment(values.startTime).format(),
      endTime: moment(values.endTime).format(),
    };

    setLoader(true);
    const resp = await dispatch(addTask(values));

    if (resp.payload.message === "success") {
      setLoader(false);
      form.resetFields();
      // dispatch(loadAllTask());
    } else {
      setLoader(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    toast.warning("Failed at adding task");
    setLoader(false);
  };
  const { TextArea } = Input;

  return (
    <>
      <h1 className="font-black text-5xl text-center">Create a Task</h1>
      <Form
        className="mt-12 w-full"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <UserPrivateComponent permission={"read-task"}>
          <Form.Item
            label="Client"
            name="clientId"
            rules={[
              {
                required: true,
                message: "Please input your Client name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Task Price"
            name="taskPrice"
            rules={[
              {
                required: true,
                message: "Please input your task price!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </UserPrivateComponent>
        <Form.Item
          label="Task Title"
          name="title"
          rules={[
            {
              required: true,
              message: "Please input your task!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Assignee" name="assignee">
          <Select mode="multiple">
            {listFromGetAllCust.map((user) => (
              <Select.Option key={user.id} value={user.id}>
                {`${user.firstName} ${user.lastName}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Watchers" name="watchers">
          <Select mode="multiple">
            {listFromGetAllCust.map((user) => (
              <Select.Option key={user.id} value={user.id}>
                {`${user.firstName} ${user.lastName}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          style={{ marginBottom: "10px" }}
          label="Start Time"
          name="startTime"
          rules={[
            {
              required: true,
              message: "Please input your task!",
            },
          ]}
        >
          <TimePicker />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: "20px" }}
          label="End Time"
          name="endTime"
          rules={[
            {
              required: true,
              message: "Please input your task!",
            },
          ]}
        >
          <TimePicker />
        </Form.Item>
        <Form.Item label="Comments" name="comments">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Save">
          <Button
            onClick={() => setLoader(true)}
            type="primary"
            size="large"
            htmlType="submit"
            block
            loading={loader}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
      <UserPrivateComponent permission={"read-task"}>
        {/* {drawer || <CustomTable list={task} />}/ */}
      </UserPrivateComponent>
    </>
  );
};

export default AddTask;
