import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
// import { CSVLink } from "react-csv";
// import { Link } from "react-router-dom";
import { toast } from "react-toastify";
// import ViewBtn from "../Buttons/ViewBtn";
// import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
// import { CsvLinkBtn } from "../UI/CsvLinkBtn";
import { useDispatch, useSelector } from "react-redux";
import { loadAllStaff } from "../../redux/rtk/features/user/userSlice";
import UserPrivateComponent from "../PrivateRoutes/UserPrivateComponent";
// import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, TimePicker } from "antd";
import { addTask } from "./../../redux/rtk/features/tasks/taskSlice";

const AddTask = ({ props }) => {
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();
  const list = useSelector((state) => state.users.list);

  // useEffect(() => {
  //   // dispatch(loadAllTask());
  // }, []);
  useEffect(() => {
    dispatch(loadAllStaff({ status: "true" }));
  }, []);

  console.log(list);

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
      assigneeId: values.assigneeId || "",
      startDate: moment(values.startDate).format() || "",
      endDate: moment(values.endDate).format() || "",
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
        <Form.Item label="Assignee" name="assigneeId">
          <Select mode="multiple">
            {list.map((user) => (
              <Select.Option key={user.id} value={user.id}>
                {`${user.firstName} ${user.lastName}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          style={{ marginBottom: "10px" }}
          label="Start Time"
          name="startDate"
          // rules={[
          //   {
          //     // required: true,
          //     message: "Please input your task!",
          //   },
          // ]}
        >
          <TimePicker />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: "20px" }}
          label="End Time"
          name="endDate"
          // rules={[
          //   {
          //     // required: true,
          //     message: "Please input your task!",
          //   },
          // ]}
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
