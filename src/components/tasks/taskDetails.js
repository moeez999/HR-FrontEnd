import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
// import { CSVLink } from "react-csv";
// import { Link } from "react-router-dom";
import { toast } from "react-toastify";
// import ViewBtn from "../Buttons/ViewBtn";
// import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
// import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { useDispatch, useSelector } from "react-redux";
import {
  loadAllStaff,
  loadSingleStaff,
} from "../../redux/rtk/features/user/userSlice";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, DatePicker, Upload } from "antd";
import { addTask } from "./../../redux/rtk/features/tasks/taskSlice";

const AddTask = ({ props }) => {
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();
  const list = useSelector((state) => state.users.list);
  list.forEach((element) => {
    const role = element.role.name;
  });

  useEffect(() => {
    dispatch(loadAllStaff({ status: "true" }));
  }, []);

  // const { Title } = Typography;
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    debugger;
    const taskData = {
      clientId: values.clientId || "",
      taskPrice: values.taskPrice || "",
      title: values.title || "",
      description: values.description || "",
      comments: values.comments || "",
      attachments: values.attachments || "",
      assignee: values.assignee || "",
      startDate: moment(values.startDate).format() || "",
      endDate: moment(values.endDate).format() || "",
      status: values.status,
    };

    setLoader(true);
    const resp = await dispatch(addTask(taskData));

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
            <Input type="number" />
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

        <Form.Item name="attachments" label="Image">
          <Upload>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Assignee" name="assignee">
          <Select mode="multiple">
            {list.map((user) => (
              <Select.Option
                key={user.id}
                value={`${user.firstName}  ${user.lastName}:${user.id}`}
              >
                {`${user.firstName} ${user.lastName}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          style={{ marginBottom: "10px" }}
          label="Start Time"
          name="startDate"
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: "20px" }}
          label="End Time"
          name="endDate"
        >
          <DatePicker />
        </Form.Item>
        <Form.Item label="Status" name="status">
          <Select>
            <Select.Option value="TO DO">TO DO</Select.Option>
            <Select.Option value="IN PROGRESS">IN PROGRESS</Select.Option>
            <Select.Option value="COMPLETED">COMPLETED</Select.Option>
          </Select>
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
