"use client";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import Image from "next/image";
import img1 from "../../assets/home/pgt-removebg-preview 2.png";
import img2 from "../../assets/home/pst-removebg-preview 2.png";
import img3 from "../../assets/home/image 23.png";
import group from "../../assets/home/Group 101.png";
import "../../style/home/home.scss";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Barlow_Condensed } from "next/font/google";
import { FaPlay, FaSquare } from "react-icons/fa";
import ReplayIcon from "@mui/icons-material/Replay";
import Footer from "@/components/Footer";
import { getTaskData, updateTask } from "@/utilities/localDB";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { FaPause } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { Refresh } from "@mui/icons-material";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });
const barlow = Barlow_Condensed({ subsets: ["latin"], weight: "500" });

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemID = searchParams.get("id");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState("choose");
  const runningSeconds = 25 * 60;
  const rewardPerMinute = 60;
  const [seconds, setSeconds] = useState(runningSeconds);
  const [reward, setReward] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [settings, setSettings] = useState({
    focusDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    cycleCount: 4,
    autoStart: false,
  });
  const [currentState, setCurrentState] = useState("focus");
  const [currentCycle, setCurrentCycle] = useState(1);

  const date = new Date();
  const today = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`;
  if (localStorage.getItem('energyGivenOn') !== today) {
      localStorage.setItem('energyGivenOn', today);
      localStorage.setItem('energy', 100);
  }

  const handleSelectDataFunc = (id) => {
    let tmpCycle = 1;
    const tasks = getTaskData();
    const filtered = tasks.find((task) => task._id === id);
    
    if (filtered && filtered.currentCycleCount && filtered.currentCycleCount > 0) {
      tmpCycle = filtered.currentCycleCount;
    }
    setSelectedTaskId(id);
    setCurrentCycle(tmpCycle);
  };

  const handleSelectData = (e) => {
    handleSelectDataFunc(e.target.value);
  };

  // pomodoro timer
  useEffect(() => {
    const settingsLocalData = JSON.parse(
      typeof window !== "undefined" ? localStorage.getItem("settings") : null
    );

    if (settingsLocalData) {
      setSeconds(parseInt(settingsLocalData.focusTime) * 60);
      setSettings({
        focusDuration: parseInt(settingsLocalData.focusTime) * 60,
        shortBreakDuration: parseInt(settingsLocalData.shortBreak) * 60,
        longBreakDuration: parseInt(settingsLocalData.longBreak) * 60,
        cycleCount: parseInt(settingsLocalData.cycleCount),
        autoStart: settingsLocalData.check,
      });
    }

    const tasks = getTaskData();
    const status = "Completed";
    const filtered = tasks.filter((task) => task.status != status);
    setFilteredTasks(filtered);
    if (itemID) {
      setSelectedTaskId(itemID);
      handleSelectDataFunc(itemID);
    }
  }, []);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = prevSeconds - 1;
          setReward(((runningSeconds - newSeconds) / 60) * rewardPerMinute);

          const addEnergy = (((runningSeconds - newSeconds) / 60) % 5) === 0;
          if (addEnergy)
            localStorage.setItem('energy', +localStorage.getItem('energy') + 1);

          const minusEnergy = (((runningSeconds - newSeconds) / 60) % 1) === 0;
          if (minusEnergy)
            localStorage.setItem('energy', +localStorage.getItem('energy') - 1);

          return newSeconds;
        });


        // current date
        const currentDate = new Date();
        const options = { day: "numeric", month: "numeric", year: "numeric" };
        const formattedDate = currentDate.toLocaleDateString("en-GB", options);

        let statisticsData = JSON.parse(
          typeof window !== "undefined"
            ? localStorage.getItem("statistics")
            : null
        );

        if (!statisticsData) {
          statisticsData = {};
        }

        if (
          statisticsData[formattedDate] &&
          statisticsData[formattedDate][selectedTaskId]
        ) {
          if (currentState === "focus") {
            statisticsData[formattedDate][selectedTaskId].focus++;
            const tasks = getTaskData();
            const findData = tasks.find((task) => task._id === selectedTaskId);
            let tempTotalTime = 0;
            if (findData && findData.time) {
              tempTotalTime = findData.time;
            }
            updateTask(selectedTaskId, { time: tempTotalTime + 1 });
          } else if (currentState === "shortBreak") {
            statisticsData[formattedDate][selectedTaskId].shortBreak++;
          } else if (currentState === "longBreak") {
            statisticsData[formattedDate][selectedTaskId].longBreak++;
          }
        } else {
          statisticsData[formattedDate] = {
            ...statisticsData[formattedDate],
            [selectedTaskId]: {
              focus: 0,
              shortBreak: 0,
              longBreak: 0,
            },
          };
        }

        localStorage.setItem("statistics", JSON.stringify(statisticsData));
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  useEffect(() => {
    if (seconds === 0) {
      handleTimerEnd();
    }
  }, [seconds]);

  useEffect(() => {
    if (settings.autoStart && !isRunning) {
      startTimer();
    }
  }, [settings.autoStart, isRunning, selectedTaskId]);

  const startTimer = () => {
    if (selectedTaskId && selectedTaskId !== "choose") {
      updateTask(selectedTaskId, { status: "In Progress", statusColor: "#FED000" });
      setIsRunning(true);
    } else if (selectedTaskId === "choose") {
      toast.error("Select the task or create new");
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (selectedTaskId === "choose") {
      toast.error("Select the task or create new");
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(settings.focusDuration);
    setCurrentState("focus");
    setCurrentCycle(1);
    if (selectedTaskId === "choose") {
      toast.error("Select the task or create new");
    }
  };

  const handleTimerEnd = () => {
    setIsRunning(false);

    if (currentState === "focus") {
      if (currentCycle < settings.cycleCount) {
        setCurrentState("shortBreak");
        setSeconds(settings.shortBreakDuration);
      } else {
        setCurrentState("longBreak");
        setSeconds(settings.longBreakDuration);
      }
    } else if (currentState === "shortBreak") {
      // cycle update
      updateTask(selectedTaskId, { currentCycleCount: currentCycle + 1 });
      setCurrentCycle((prevCycle) => prevCycle + 1);
      setCurrentState("focus");
      setSeconds(settings.focusDuration);
    } else if (currentState === "longBreak") {
      // cycle update
      setSelectedTaskId("choose");
      setCurrentCycle(1);
      setCurrentState("focus");
      setSeconds(settings.focusDuration);
      updateTask(selectedTaskId, { status: "Completed", statusColor: "#14985A" });
      // Update filteredTasks after task completion
      const updatedTasks = getTaskData();
      const updatedFilteredTasks = updatedTasks.filter(
        (task) => task.status !== "Completed"
      );
      setFilteredTasks(updatedFilteredTasks);
      // Show success toast
      toast.success(`Task is Completed`);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  localStorage.setItem('expectedPgcReward', (+localStorage.getItem('pgcReward') || 0) + reward);

  return (
    <div>
      <Navbar />

      <section className="home-section">
        <div className="addcontainer 2xl:px-5 lg:px-14 md:px-10 sm:px-6 max-sm:px-3">
          <div className="home-inner">
            <div className="first-box flex justify-between items-center">
              <Image src={img1} width={30} height={30} alt="PGT" />
              <p className="max-[322px]:text-[12px]">100 PGT</p>
              <Image src={img2} width={30} height={30} alt="PST" />
              <p className="max-[322px]:text-[12px]">100 PST</p>
              <Image src={img3} width={30} height={30} alt="100 APT" />
              <p className="max-[322px]:text-[12px]">100 APT</p>
            </div>
            <div className="first-box mt-5">
              <div className="box-inner flex items-center mt-3">
                <div className="skill flex-1">
                  <p className="">Level</p>
                  <div className="skill-bar skill2 wow slideInLeft animated">
                    <span className="skill-count2"></span>
                  </div>
                </div>
                <h4 className={`ml-3 -mt-2 font-bold ${jakarta.className}`}>
                  60%
                </h4>
              </div>
              <div className="box-inner flex items-center">
                <div className="skill flex-1">
                  <p className="">Energy</p>
                  <div className="skill-bar skill3 wow slideInLeft animated">
                    <span className="skill-count2"></span>
                  </div>
                </div>
                <h4 className={`ml-3 -mt-2 font-bold ${jakarta.className}`}>
                { localStorage.getItem('energy') }%
                </h4>
              </div>
            </div>

            <div className="first-box mt-5">
              <select
                name="task"
                id="task"
                className="w-full outline-none"
                onChange={handleSelectData}
                value={selectedTaskId}>
                <option className="font-semibold" value="choose">
                  Choose Task
                </option>
                {filteredTasks.map((task) => {
                  return <option value={task._id}>{task.title}</option>;
                })}
              </select>
            </div>

            <div className="first-box mt-5">
              <div className="containerr">
                <div className="progress">
                  <div className="overlay"></div>
                  <div className="left"></div>
                  <div className="right"></div>
                </div>
                <div
                  className={`absolute max-sm:text-[33px] sm:text-[40px] md:text-[43px] lg:text-[48px] font-semibold ${barlow.className}`}>
                  {formatTime(seconds)}
                </div>
              </div>
              <div className="flex justify-center space-x-3">
                {selectedTaskId !== "choose" ? (
                  <>
                    <span>Time to {currentState}</span>
                    <span>
                      {currentCycle}/{settings.cycleCount}
                    </span>
                  </>
                ) : (
                  ""
                )}
              </div>
              <div className="play-move-btn space-x-2 mt-5">
                <button onClick={pauseTimer}>
                  <FaSquare />
                </button>
                <button
                  onClick={startTimer}
                  className="mid"
                >
                  {isRunning ? <FaPause /> : <FaPlay />}
                </button>
                <button onClick={resetTimer}>
                  <ReplayIcon className="font-bold" />
                </button>
              </div>
            </div>

            <div className="home-foot my-12">
              <Image src={group} width={380} height={305} alt="group" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Page;
