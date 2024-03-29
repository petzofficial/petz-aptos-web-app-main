"use client";
import GoBackBtn from "@/components/button/GoBackBtn";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Urbanist } from "next/font/google";
import { v4 as uuid } from "uuid";
import { addTask, getTaskData, updateTask } from "../../utils/localDB";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const urban = Urbanist({ subsets: ["latin"] });

const EditAddTask = ({ method }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const existingTaskId = searchParams.get("id");
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "",
  });
  const [priority, setPriority] = useState("");

  useEffect(() => {
    const task = getTaskData().find((item) => item._id == existingTaskId);
    if (method === "edit") {
      setPriority(task.priority);
    }
    setTask(task);
  }, []);

  const handlePriority = (v) => {
    setPriority(v);
  };

  const handleAddData = (e) => {
    e.preventDefault();
    const form = e.target;
    const workOut = form.workOut.value;
    const description = form.description.value;

    // unique id
    const unique_id = method === "edit" ? existingTaskId : uuid();

    // date
    const currentDate = new Date();
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = currentDate.toLocaleDateString("en-GB", options);

    // create object
    const addObj = {
      title: workOut,
      time: 0,
      statusColor: "#8B0000",
      description: description,
      priority: priority,
      date: formattedDate,
      reward_PGC: "",
      status: "Pending",
      currentCycleCount: 1,
      _id: unique_id,
    };

    if (!addObj || !addObj.title || !addObj.description || !addObj.priority) {
      return false;
    }

    //local storage logic...
    if (method === "edit") {
      if (task) {
        updateTask(existingTaskId, addObj);
        router.push("/task", { scroll: true });
        toast.success("Task Updated");
      }
    } else {
      addTask(addObj);
      router.push("/task", { scroll: true });
      toast.success("Task Added");
    }

    // input field empty
    form.workOut.value = "";
    form.description.value = "";
    setPriority("");
  };

  return (
    <section className="task-edit">
      <div className="addconatiner 2xl:px-5 lg:px-14 md:px-10 sm:px-6 max-sm:px-3">
        <div className="back-button">
          <Link href={"/"} className="text-[30px] font-bold">
            <GoBackBtn />
          </Link>
        </div>
        <div className="task-edit-inner mt-[-40px]">
          <h2>
            {method === "edit" ? "Edit Task" : ""}
            {method === "add" ? "New Task" : ""}
          </h2>
          <form
            onSubmit={handleAddData}
            className={typeof window !== "undefined" && urban.className}
            action="#"
            method="post"
          >
            <h4>Task Name</h4>
            <input
              type="text"
              name="workOut"
              placeholder="WorkOut"
              defaultValue={task ? task.title : ""}
            />
            <p>Task Priority</p>
            <div className="task-lvl-btn">
              <button
                type="button"
                onClick={() => {
                  handlePriority("High");
                }}
                className={priority === "High" ? "selected" : ""}
              >
                High
              </button>
              <button
                type="button"
                onClick={() => {
                  handlePriority("Medium");
                }}
                className={priority === "Medium" ? "selected" : ""}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => {
                  handlePriority("Low");
                }}
                className={priority === "Low" ? "selected" : ""}
              >
                Low
              </button>
            </div>
            <h4>Task Description</h4>
            <textarea
              className="h-[152px]"
              name="description"
              rows="10"
              placeholder="Add Task Description"
              defaultValue={task ? task.description : ""}
            ></textarea>

            <button type="submit" id="submitBtn" className="submit-btn">
              {method === "edit" ? "Update Task" : ""}
              {method === "add" ? "Add New Task" : ""}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditAddTask;
