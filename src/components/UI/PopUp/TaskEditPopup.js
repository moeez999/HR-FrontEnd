import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  Form,
  Input,
  DatePicker,
  Modal,
  Button,
  Select,
  message,
  Upload,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loadAllStaff } from "../../../redux/rtk/features/user/userSlice";
import UploadOutlined from "@ant-design/icons";
import {
  loadAllTasks,
  updateTask,
  loadSingleTask,
} from "../../../redux/rtk/features/tasks/taskSlice";
import { useParams } from "react-router-dom";
const { RangePicker } = DatePicker;

const TaskEditForm = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const task = useSelector((state) => state.task.list);

  const userList = useSelector((state) => state.users.list);

  const [initialValues, setInitialValues] = useState({});

  const dispatch = useDispatch();

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(loadAllTasks());
    if (id) {
      dispatch(loadSingleTask(id));
    }
    dispatch(loadAllStaff({ status: "true" }));
  }, [id]);

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
  useEffect(() => {
    if (task && task.length !== 0 && id) {
      const singleTask = task.find((t) => t.id === parseInt(id));
      console.log(singleTask.attachments);

      if (singleTask) {
        setInitialValues({
          id: singleTask.id,
          title: singleTask.title || "",
          description: singleTask.description || "",
          status: singleTask.status || "",
          attachments: singleTask.attachments || "",
          startDate: singleTask.startDate ? moment(singleTask.startDate) : null,
          endDate: singleTask.endDate ? moment(singleTask.endDate) : null,
          assignee: singleTask.assignee || [],
          comments: singleTask.comments || "",
        });
      }
    }
  }, [id, task]);

  const onFinish = async (values) => {
    try {
      const resp = await dispatch(
        updateTask({
          id,
          values: {
            ...values,
          },
        })
      );

      setLoader(true);
      if (resp.payload.message === "success") {
        setLoader(false);
        dispatch(loadAllTasks(id));
        setIsModalOpen(false);
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.log(error.message);
      setLoader(false);
      toast.error("Something went wrong");
    }
  };

  const onFinishFailed = (errorInfo) => {
    setLoader(false);
    console.log("Failed:", errorInfo);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        onClick={showModal}
        type="primary"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold  rounded"
      >
        View
      </Button>
      <Modal
        width="50%"
        title="Update Task"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={initialValues}
          autoComplete="off"
          // key={task.id}
        >
          <Form.Item
            label="Task Title"
            name="title"
            rules={[{ required: true, message: "Please enter the task title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Task Description"
            name="description"
            rules={[
              { required: true, message: "Please enter the task description" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item label="Task Dates" name="startDate">
            <DatePicker />
          </Form.Item>
          <Form.Item label="Task Dates" name="endDate">
            <DatePicker />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select>
              <Select.Option value="TO DO">TO DO</Select.Option>
              <Select.Option value="IN PROGRESS">IN PROGRESS</Select.Option>
              <Select.Option value="COMPLETED">COMPLETED</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Assignee" name="assignee">
            <Select mode="multiple">
              {userList.map((user) => (
                <Select.Option
                  key={user.id}
                  value={`${user.firstName}:${user.id}`}
                >
                  {`${user.firstName} ${user.lastName}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="attachments" label="File">
            <Upload>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            {Array.isArray(initialValues.attachments) &&
              initialValues.attachments.map((attachment) => (
                <Button
                  className="mt-2"
                  key={attachment.filename}
                  onClick={() => handleDownload([attachment.filename])}
                >
                  Download {attachment.filename}
                </Button>
              ))}
          </Form.Item>
          <Form.Item label="Comments" name="comments">
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              block
              htmlType="submit"
              onClick={() => setLoader(true)}
              loading={loader}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TaskEditForm;
