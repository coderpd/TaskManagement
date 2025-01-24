'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const priorities = ["High", "Medium", "Low"];
const statuses = ["Pending", "On Progress", "Completed"];

export default function CreateTask() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const handlePriorityChange = (value) => {
    setSelectedPriority(value);
    setValue('priority', value); // Sync with react-hook-form
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setValue('status', value); // Sync with react-hook-form
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage("You need to login first");
        setShowPopup(true);
        return;
      }
      
      const response = await axios.post(
        'http://localhost:5000/tasks',
        { ...data },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.status === 201) {
        setMessage('Task created successfully!');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          router.push('/view-tasks'); // Redirect after 2 seconds
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      setMessage('Failed to create task. Please try again.');
      setShowPopup(true);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-10 bg-gradient-to-r from-green-500 to-slate-900">
      <div className="w-full md:w-3/4 lg:w-1/2 rounded-lg mx-auto">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CardHeader>
              <CardTitle className="text-center text-green-700 text-4xl">Create Task</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Task Name */}
              <div>
                <Label htmlFor="name">Task Name</Label>
                <Input
                  id="name"
                  name="name"
                  {...register("name", { required: "Task name is required" })}
                  placeholder="Enter task name"
                  className="mt-1 hover:border-purple-600 w-full"
                />
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
              </div>

              {/* Task Status */}
              <div>
                <Label htmlFor="status">Task Status</Label>
                <Select value={selectedStatus} onValueChange={handleStatusChange} required>
                  <SelectTrigger id="status" className="mt-1 hover:border-purple-600 w-full">
                    <SelectValue placeholder="Select task status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Task Priority */}
              <div>
                <Label htmlFor="priority">Task Priority</Label>
                <Select value={selectedPriority} onValueChange={handlePriorityChange} required>
                  <SelectTrigger id="priority" className="mt-1 hover:border-purple-600 w-full">
                    <SelectValue placeholder="Select task priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date */}
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  {...register("dueDate", { required: "Due date is required" })}
                  className="mt-1 hover:border-purple-600 w-full"
                />
                {errors.dueDate && <p className="text-red-500">{errors.dueDate.message}</p>}
              </div>

              <Button type="submit" className="w-full mt-2 bg-purple-500 hover:bg-purple-700 text-white">
                Create Task
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>

      {/* Popup Message */}
      {showPopup && (
        <div className="fixed top-0 left-0 right-0 flex justify-center items-center z-50 p-4">
          <div className="bg-purple-600 text-white p-4 rounded-lg shadow-lg">
            {message}
          </div>
        </div>
      )}

      <div className="w-full md:w-1/2 flex justify-center items-center p-6 mt-4">
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
