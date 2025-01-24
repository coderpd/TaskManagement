'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function ViewTasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [task, setTask] = useState({
    name: '',
    status: '',
    priority: '',
    due_date: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  const router = useRouter();

  // Fetch tasks from backend when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login'); // Redirect to login if no token is found
        return;
      }
      try {
        const response = await axios.get('http://localhost:5000/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
        setFilteredTasks(response.data); // Set the tasks initially
      } catch (error) {
        console.error('Error fetching tasks:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          router.push('/login'); // Redirect to login if the token is invalid or expired
        } else if (error.response?.status === 404) {
          console.error('Tasks route not found.');
        }
      }
    };

    fetchTasks();
  }, [router]);

  // Filter tasks based on search query and status
  useEffect(() => {
    const filtered = tasks.filter(
      (task) =>
        task.name.toLowerCase().includes(search.toLowerCase()) &&
        (statusFilter ? task.status.toLowerCase() === statusFilter.toLowerCase() : true)
    );
    setFilteredTasks(filtered);
  }, [search, statusFilter, tasks]);

  // Handle task edit change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle task update (submit edit form)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
        `http://localhost:5000/tasks/${editingTaskId}`,
        task,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setTasks(tasks.map((t) => (t.id === editingTaskId ? { ...t, ...task } : t)));
        setEditingTaskId(null);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Pagination logic
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const tasksToShow = filteredTasks.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage);

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gradient-to-br from-cyan-500 to-black text-black">
      <h1 className="text-4xl font-bold mb-6 text-center">Task List</h1>

      {/* Search and Filter */}
      <div className="flex space-x-4 mb-6 flex-wrap justify-center">
        <div className="flex items-center space-x-2">
          <label htmlFor="search" className="text-lg font-medium">Search:</label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks"
            className="w-64 md:w-80 p-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="status" className="text-lg font-medium">Status:</label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">All</option>
            <option value="completed">completed</option>
            <option value="pending">pending</option>
            <option value="on progress">On Progress</option>
          </select>
        </div>
      </div>

      {/* Table displaying tasks */}
      <div className="w-full max-w-4xl mb-6 p-4 bg-white rounded-lg shadow-lg">
        <Table className="w-full">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-3 text-left">Task Name</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Due Date</th>
              {/* <th className="p-3 text-left">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {tasksToShow.map((taskData) => (
              <tr key={taskData.id} className="hover:bg-gray-100 transition-all duration-300">
                {editingTaskId === taskData.id ? (
                  <td colSpan={5} className="p-4 bg-gray-50">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block mb-2 font-medium">Task Name</label>
                        <Input
                          type="text"
                          name="name"
                          value={task.name}
                          onChange={handleEditChange}
                          className="w-64 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          required
                        />
                      </div>

                      <div>
                        <label className="block mb-2 font-medium">Priority</label>
                        <Input
                          type="text"
                          name="priority"
                          value={task.priority}
                          onChange={handleEditChange}
                          className="w-64 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          required
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-medium">Status</label>
                        <select
                          name="status"
                          value={task.status}
                          onChange={handleEditChange}
                          className="w-64 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          required
                        >
                          <option value="completed">Completed</option>
                          <option value="pending">Pending</option>
                          <option value="on progress">On Progress</option>
                        </select>
                      </div>

                      <div>
                        <label className="block mb-2 font-medium">Due Date</label>
                        <Input
                          type="date"
                          name="due_date"
                          value={task.due_date}
                          onChange={handleEditChange}
                          className="w-64 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                          required
                        />
                      </div>
                      <div className="flex space-x-4">
                        <Button type="submit" className="w-32 bg-yellow-500 hover:bg-yellow-700 transition duration-300">Save</Button>
                        <Button onClick={() => setEditingTaskId(null)} className="w-32 bg-red-500 hover:bg-red-600 transition duration-300">Cancel</Button>
                      </div>
                    </form>
                  </td>
                ) : (
                  <>
                    <td className="p-3">{taskData.name}</td>
                    <td className="p-3">{taskData.priority}</td>
                    <td className="p-3">{taskData.status}</td>
                    <td className="p-3">{new Date(taskData.due_date).toLocaleDateString()}</td>
                    {/* <td className="p-3 flex space-x-2">
                      <Button onClick={() => setEditingTaskId(taskData.id)} className="bg-blue-500 hover:bg-blue-800 transition duration-300">Edit</Button>
                      <Button onClick={() => deleteTask(taskData.id)} variant="destructive" className="bg-red-500 hover:bg-red-600 transition duration-300">Delete</Button>
                    </td> */}
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex space-x-4 mb-6 justify-center">
        <Button disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)} className="bg-gray-500 hover:bg-gray-600 text-white">Previous</Button>
        <div className="flex items-center space-x-2 text-lg">
          <span>Page {currentPage} of {totalPages}</span>
        </div>
        <Button disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)} className="bg-gray-500 hover:bg-gray-600 text-white">Next</Button>
      </div>

      {/* Go back button */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">
        <Button
          onClick={() => router.push('/dashboard')}
          className="bg-pink-600 hover:bg-pink-900 text-white p-4 rounded-lg transition-all duration-300 ease-in-out"
        >
          Go Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
