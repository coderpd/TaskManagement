'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch tasks
        const taskResponse = await axios.get('http://localhost:5000/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(taskResponse.data);

        // Fetch summary stats
        const summaryResponse = await axios.get('http://localhost:5000/tasks/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(summaryResponse.data);

        updateChart(taskResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setSummary({ error: "Failed to fetch task summary. Please try again later." });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update chart data
  const updateChart = (tasks) => {
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    setChartData({
      labels: ['Completed', 'Pending', 'On Progress'],
      datasets: [
        {
          label: 'Task Status',
          data: ['Completed', 'Pending', 'On Progress'].map(
            (key) => statusCounts[key] || 0
          ),
          backgroundColor: ['green', 'pink', 'brown'],
          borderColor: ['green', 'pink', 'brown'],
          borderWidth: 1,
        },
      ],
    });
  };

  // Chart options
  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
    plugins: {
      legend: { labels: { color: 'white' } },
      tooltip: { titleColor: 'white', bodyColor: 'white' },
    },
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-200">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-cyan-950 text-white transition-all duration-300 ease-in-out p-6`}
      >
        <button
          onClick={toggleSidebar}
          className="bg-black p-2 rounded-full mb-4 focus:outline-none hover:bg-yellow-400"
        >
          {sidebarOpen ? '<' : '>'}
        </button>
        {sidebarOpen && (
          <div>
            <h2 className="text-4xl font-sans font-bold mb-6 text-green-300">Dashboard</h2>
            <nav>
              <ul className="space-y-4">
                <li><Link href="/home" className="hover:text-yellow-300">Home</Link></li>
                <li><Link href="/createtask" className="hover:text-yellow-300">Create Task</Link></li>
                <li><Link href="/tasktable" className="hover:text-yellow-300">View Task Table</Link></li>
              </ul>
            </nav>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full mt-6 bg-red-700 hover:bg-green-500"
            >
              Logout
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 space-y-6 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          {/* Task Summary Card */}
          <Card className="p-6 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-lg shadow-lg w-full transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <CardHeader>
              <h2 className="text-2xl font-semibold mb-4">Task Summary</h2>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-black items-center">
              {loading ? (
                <div className="col-span-2 text-xl text-center">Loading...</div>
              ) : summary ? (
                summary.error ? (
                  <div className="col-span-2 text-center text-red-500">{summary.error}</div>
                ) : (
                  <>
                    <div className="text-center">
                      <h3 className="text-xl font-bold">{summary.total}</h3>
                      <p>Total Tasks</p>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold">{summary.completed}</h3>
                      <p>Completed</p>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold">{summary.pending}</h3>
                      <p>Pending</p>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold">{summary.onprogress}</h3>
                      <p>On Progress</p>
                    </div>
                  </>
                )
              ) : (
                <div className="col-span-2 text-center">No data available.</div>
              )}
            </CardContent>
          </Card>

          {/* Chart Card */}
          <Card className="p-6 bg-gradient-to-r from-black to-blue-900 text-white rounded-lg shadow-lg w-full transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <CardHeader>
              <h2 className="text-2xl font-semibold mb-4">Task Status Overview</h2>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center text-xl">Loading...</div>
              ) : chartData ? (
                <div className="w-full h-80">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              ) : (
                <div className="text-center">No data available.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
