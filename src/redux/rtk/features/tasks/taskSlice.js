import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  list: [],
  task: null,
  error: "",
  loading: false,
};

export const allTasks = createAsyncThunk(
  "tasks/getAllTasks",
  async (values) => {
    try {
      const { data } = await axios({
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        url: `shift/`,
        data: {
          ...values,
        },
      });
      toast.success("shift Added");
      return {
        data,
        message: "success",
      };
    } catch (error) {
      toast.error("Error in adding shift try again");
      console.log(error.message);
      return {
        message: "error",
      };
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTask: (state) => {
      state.task = null;
    },
  },
  extraReducers: (builder) => {
    // 1) ====== builders for allTasks ======

    builder.addCase(allTasks.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(allTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });

    builder.addCase(allTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    });
  },
});

export default taskSlice.reducer;
export const { clearTask } = taskSlice.actions;
