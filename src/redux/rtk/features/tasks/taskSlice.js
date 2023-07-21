import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  list: [],
  task: null,
  error: "",
  loading: false,
};

// ADD_task
export const addTask = createAsyncThunk("tasks/addTask", async (values) => {
  let header = {};

  try {
    if (Object.entries(values.attachments).length > 0) {
      const formValues = new FormData();

      for (let key in values) {
        if (key === "attachments") {
          values[key]?.fileList?.forEach((file) => {
            formValues.append(key, file.originFileObj);
          });
        } else {
          formValues.append(key, values[key]);
        }
      }

      values = formValues;
      header = {
        "Content-Type": "multipart/form-data",
      };
    } else {
      header = {
        "Content-Type": "application/json",
      };
    }
    const { data } = await axios({
      method: "post",
      headers: header,
      url: `tasks/`,
      data: values,
    });
    toast.success("task Added");
    return {
      data,
      message: "success",
    };
  } catch (error) {
    toast.error("Error in adding tasks try again");
    console.log(error.message);
    return {
      message: "error",
    };
  }
});

// DELETE_task
export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id) => {
  try {
    const resp = await axios({
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      url: `tasks/${id}`,
    });

    toast.success("task Deleted");
    return resp.data.id;
  } catch (error) {
    toast.error("Error in deleting task try again");
    console.log(error.message);
  }
});

// // task_DETAILS
export const loadSingleTask = createAsyncThunk(
  "tasks/loadSingleTask",
  async (id) => {
    try {
      const data = await axios.get(`tasks/${id}`);
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

// all tasks
export const loadAllTasks = createAsyncThunk("tasks/loadAllTask", async () => {
  try {
    const { data } = await axios.get(`tasks?status=true`);
    return data;
  } catch (error) {
    console.log(error.message);
  }
});

// UPDATE_task

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, values }) => {
    debugger;

    try {
      const { data } = await axios({
        method: "put",

        url: `tasks/${id}`,
        data: {
          ...values,
        },
      });
      toast.success("Task Updated");
      return {
        data,
        message: "success",
      };
    } catch (error) {
      toast.error("Error in updating task try again");
      console.log(error.message);
      return {
        message: "error",
      };
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    clearTask: (state) => {
      state.task = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for loadAllTasks ======

    builder.addCase(loadAllTasks.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadAllTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });

    builder.addCase(loadAllTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 2) ====== builders for addtask ======

    builder.addCase(addTask.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(addTask.fulfilled, (state, action) => {
      state.loading = false;

      if (!Array.isArray(state.list)) {
        state.list = [];
      }
      const list = [...state.list];
      list.push(action.payload);
      state.list = list;
    });

    builder.addCase(addTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 3) ====== builders for loadSingletask ======

    builder.addCase(loadSingleTask.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(loadSingleTask.fulfilled, (state, action) => {
      state.loading = false;
      state.task = action.payload;
    });

    builder.addCase(loadSingleTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 3) ====== builders for updatetask ======

    builder.addCase(updateTask.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(updateTask.fulfilled, (state, action) => {
      state.loading = false;
      const list = [...state.list];
      const index = list.findIndex(
        (task) => task.id === parseInt(action.payload.data.id)
      );
      list[index] = action.payload.data;
      state.list = list;
    });

    builder.addCase(updateTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });

    // 4) ====== builders for deletetask ======

    builder.addCase(deleteTask.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.loading = false;
      const filterTask = state.list.filter(
        (task) => task.id !== parseInt(action.payload) && task
      );
      state.list = filterTask;
    });

    builder.addCase(deleteTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export default taskSlice.reducer;
export const { clearTask } = taskSlice.actions;
