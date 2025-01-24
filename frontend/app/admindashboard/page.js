"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // ShadCN Card components

// Register necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [taskStatusData, setTaskStatusData] = useState(null);
  const [userTaskData, setUserTaskData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/login"); // Redirect to login if no token
    } else {
      fetchTasks(token);
    }
  }, []);

  const fetchTasks = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/tasks/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
      generateTaskStatusData(response.data);
      generateUserTaskData(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const generateTaskStatusData = (tasks) => {
    const statusCount = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    const data = {
      labels: Object.keys(statusCount),
      datasets: [
        {
          data: Object.values(statusCount),
          backgroundColor: ["#4caf50", "#f57c00", "#d32f2f"],
          hoverBackgroundColor: ["#66bb6a", "#ffa726", "#e57373"],
        },
      ],
    };

    setTaskStatusData(data);
  };

  const generateUserTaskData = (tasks) => {
    const userTaskCount = tasks.reduce((acc, task) => {
      acc[task.username] = (acc[task.username] || 0) + 1;
      return acc;
    }, {});

    const data = {
      labels: Object.keys(userTaskCount),
      datasets: [
        {
          label: "Tasks Assigned",
          data: Object.values(userTaskCount),
          backgroundColor: "#42a5f5",
          borderColor: "#1e88e5",
          borderWidth: 1,
        },
      ],
    };

    setUserTaskData(data);
  };

  const deleteTask = async (taskId) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 p-8">
      <h1 className="text-4xl font-extrabold text-center text-white mb-8">Admin Dashboard</h1>

      {/* Logout Button */}
      <div className="text-right mb-6">
        <Button
          className="bg-red-600 text-white hover:bg-red-700 py-2 px-4 rounded-lg shadow-md"
          onClick={logout}
        >
          Logout
        </Button>
      </div>

      {/* Task Status and User Task Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
        {/* Task Status Pie Chart */}
        <Card className="p-6 bg-white rounded-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
              Task Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {taskStatusData ? (
              <Pie
                data={taskStatusData}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (tooltipItem) {
                          const status = tooltipItem.label;
                          const value = tooltipItem.raw;

                          // Find users with this status
                          const usersWithStatus = tasks
                            .filter((task) => task.status === status)
                            .map((task) => task.username)
                            .join(", ");

                          return `${status}: ${value} tasks\nUsers: ${usersWithStatus}`;
                        },
                      },
                    },
                  },
                }}
              />
            ) : (
              <p className="text-center text-gray-500">Loading chart data...</p>
            )}
          </CardContent>
        </Card>

        {/* User Task Bar Chart */}
        <Card className="p-6 bg-white rounded-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
              Task Distribution Per User
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userTaskData ? (
              <Bar
                data={userTaskData}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) =>
                          `${tooltipItem.label}: ${tooltipItem.raw} tasks`,
                      },
                    },
                  },
                }}
              />
            ) : (
              <p className="text-center text-gray-500">Loading chart data...</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Task Cards */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className="bg-gradient-to-br from-green-400 to-blue-500 text-white shadow-lg p-6 rounded-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300"
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{task.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Priority:</strong> {task.priority}
              </p>
              <p>
                <strong>Status:</strong> {task.status}
              </p>
              <p>
                <strong>Due Date:</strong> {task.due_date}
              </p>
              <p>
                <strong>Assigned User:</strong> {task.username}
              </p>
            </CardContent>
            <div className="mt-4 flex justify-end">
              <Button
                className="bg-red-600 text-white hover:bg-red-700 py-2 px-4 rounded-md shadow-md"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
