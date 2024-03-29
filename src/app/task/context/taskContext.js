"use client";
import React, { createContext, useState, useRef } from "react";
export const TaskContext = createContext({});

export const TaskContextProvider = ({ children }) => {
  const [taskId, setTaskId] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [energy, setEnergy] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("choose");
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);

  const [isEnergyRunning, setIsEnergyRunning] = useState(true);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const secondsRef = useRef(seconds);
  const [settings, setSettings] = useState({
    focusDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    cycleCount: 4,
    autoStart: false,
  });
  const [currentState, setCurrentState] = useState("focus");
  const [currentCycle, setCurrentCycle] = useState(1);
  const [minutes, setMinutes] = useState("");
  return (
    <TaskContext.Provider
      value={{
        taskId,
        setTaskId,
        seconds,
        setSeconds,
        currentState,
        setCurrentState,
        currentCycle,
        setCurrentCycle,
        minutes,
        setMinutes,
        settings,
        setTotalSeconds,
        setSettings,
        setSelectedTaskId,
        selectedTaskId,
        filteredTasks,
        setFilteredTasks,
        totalSeconds,
        isRunning,
        setIsRunning,
        setIsEnergyRunning,
        energy,
        isEnergyRunning,
        secondsRef,
        setEnergy,
        setTotalSeconds,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
