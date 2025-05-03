import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

export interface Task {
  _id: string; // Changed from 'id' to '_id' to match MongoDB
  title: string;
  description: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  userId: string;
  dueDate: string;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: 'All' | 'Active' | 'Completed';
  setFilter: (filter: 'All' | 'Active' | 'Completed') => void;
  addTask: (taskData: Omit<Task, '_id' | 'createdAt' | 'userId'>) => Promise<void>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string, completed: boolean) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/tasks');
      setTasks(response.data);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch tasks');
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, '_id' | 'createdAt' | 'userId'>) => {
    try {
      const response = await api.post('/api/tasks', taskData);
      setTasks([...tasks, response.data]);
      toast.success('Task added successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add task');
      throw error;
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      const response = await api.put(`/api/tasks/${id}`, taskData);
      setTasks(tasks.map(task => task._id === id ? response.data : task));
      toast.success('Task updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update task');
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      toast.success('Task deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
      throw error;
    }
  };

  const toggleTaskStatus = async (id: string, completed: boolean) => {
    try {
      const response = await api.patch(`/api/tasks/${id}/status`, { completed });
      setTasks(tasks.map(task => task._id === id ? response.data : task));
      toast.success(`Task marked as ${completed ? 'completed' : 'active'}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update task status');
      throw error;
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      error,
      filter,
      setFilter,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};