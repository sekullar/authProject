import Plus from "../images/ic--round-plus.svg";
import Circle from "../images/material-symbols--circle-outline.svg";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import DeleteIcon from "../images/mingcute--delete-line.svg";
import "../index.css"
import Open from "../images/open.svg"

const Main = () => {
  const [task, setTask] = useState("");
  const [value, setValue] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [dark, setDark] = useState(true);

  const saveTasksToCookies = (tasks) => {
    Cookies.set("tasks", JSON.stringify(tasks), { expires: 365 }); // 1 yıl
  };

  const addTask = () => {
    if (task) {
      const newTasks = [...tasks, { critic: value, task: task }];
      setTasks(newTasks);
      setTask("");
      saveTasksToCookies(newTasks);
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    saveTasksToCookies(updatedTasks);
  };

  const handleEnterPress = (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  };

  useEffect(() => {
    const savedTasks = Cookies.get("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const [show, setShow] = useState(false);

  return (
    <>
      <div className={`${dark ? "flex justify-center items-center flex-col dark-theme bg-global relative select-none overflow-hidden h-full" : "flex justify-center flex-col  rounded-lg relative h-full overflow-hidden items-center  light-theme bg-global select-none"}`}>
        <div onClick={() => setShow(!show)} className="absolute top-0 right-0 mr-3 mt-3 cursor-pointer">
        </div>
        <div className={`${dark ? "dark-theme bg-menu p-8 rounded-xl box-shadow-todo flex flex-col items-center overflow-hidden " : "light-theme bg-menu p-8 rounded-lg box-shadow-todo flex flex-col overflow-hidden items-center"}`}>
          <h2 className={`${dark ? "dark-theme mb-4 inter-400 text-xl" : "bg-gray-200 mb-4 inter-400 text-xl"}`}>Seku ToDo App</h2>
          <div className="flex flex-col sm:flex-row items-center">
            <input
              type="text"
              placeholder="Görev ekleyin"
              value={task}
              id="todoAppInput"
              onKeyDown={handleEnterPress}
              onChange={(e) => setTask(e.target.value)}
              className="rounded-xl px-2 h-[45px] outline-0 w-[300px] input-theme"
            />
            <button className="ml-2 py-2 px-3 mt-3 sm:mt-0 w-full flex bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-300 justify-center">
              <img src={Plus} alt="" onClick={addTask} className="w-7" />
            </button>
          </div>
          <p className="my-1 mt-3">Önem derecesi</p>
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => setValue(0)} className="h-11 w-12 rounded-lg bg-gray-200 flex justify-center items-center">
              <img src={Circle} alt="" className="w-7" />
            </button>
            <button
              onClick={() => setValue(1)}
              className="h-11 w-12 flex justify-center items-center rounded-lg bg-green-500 text-white"
            >
              <span className="text-xl text-white font-semibold">!</span>
            </button>
            <button
              onClick={() => setValue(2)}
              className="h-11 w-12 flex justify-center items-center rounded-lg bg-yellow-500 text-white"
            >
              <span className="text-xl text-white font-semibold">!!</span>
            </button>
            <button
              onClick={() => setValue(3)}
              className="h-11 w-12 flex justify-center items-center rounded-lg bg-red-500 text-white"
            >
              <span className="text-xl text-white font-semibold">!!!</span>
            </button>
          </div>
          <hr className="w-full border-t-2" />
          <div className="flex items-center">
            <ul className="p-0">
              {tasks.map((listTasks, index) => (
                <li key={index}>
                  <div className="flex items-center justify-between px-2 w-[700px]">
                    <span className="text-lg font-semibold">{listTasks.task}</span>
                    <div className="flex items-center">
                      <span className="text-4xl font-semibold text-red-500">
                        {listTasks.critic === 3
                          ? "!!!"
                          : listTasks.critic === 2
                          ? "!!"
                          : listTasks.critic === 1
                          ? "!"
                          : "O"}
                      </span>
                      <img
                        src={DeleteIcon}
                        className="w-8 cursor-pointer ml-2"
                        onClick={() => deleteTask(index)}
                        alt=""
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-center mt-8 box-shadow-todo rounded-xl">
          <a href="https://sekutodo.vercel.app/" target="_blank" className=" py-2 px-4 rounded-lg flex items-center inter-400 rounded-lg">Sitede aç <img src={Open} className="ms-1 w-[20px]" alt="Open" /> </a>
        </div>
      </div>
    </>
  );
};

export default Main;
