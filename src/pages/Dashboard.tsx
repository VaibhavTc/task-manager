import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useTask, Task } from '../contexts/TaskContext';
// import TaskCard from '../components/TaskCard';
import TaskFilter from '../components/TaskFilter';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Modal from '../components/Modal';


const Dashboard: React.FC = () => {
  const { tasks, loading, filter, addTask, updateTask, deleteTask, toggleTaskStatus } = useTask();
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    if (filter === 'Active') return !task.completed;
    return task.completed;
  });
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'userId' | 'completed'>) => {
    await addTask({ ...taskData, completed: false });
    setShowAddForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>

          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary"
            >
              <PlusCircle className="h-5 w-5 mr-1" />
              <span>Add Task</span>
            </button>
          )}
        </div>
      </div>

      {/* {showAddForm && (
        <TaskForm
          onSubmit={handleAddTask}
          onCancel={() => setShowAddForm(false)}
        />
      )} */}

      <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
        <TaskForm onSubmit={handleAddTask}
          onCancel={() => setShowAddForm(false)} />
      </Modal>

      {/* Task filter */}
      <TaskFilter />

      {/* Task list */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <span className="ml-2 text-lg text-gray-600">Loading tasks...</span>
        </div>
      ) : (
        <div className="space-y-4 mt-4">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-xl font-medium text-gray-600 mb-2">No tasks found</h3>
              <p className="text-gray-500">
                {filter === 'All'
                  ? "You don't have any tasks yet. Add a new task to get started!"
                  : filter === 'Active'
                    ? "You don't have any active tasks."
                    : "You don't have any completed tasks."}
              </p>
              {filter !== 'All' && tasks.length > 0 && (
                <p className="text-gray-500 mt-1">Try changing the filter to see other tasks.</p>
              )}
            </div>
          ) :
            // (
            //   sortedTasks.map(task => (
            //     <TaskCard
            //       key={task.id}
            //       task={task}
            //       onToggleStatus={toggleTaskStatus}
            //       onDelete={deleteTask}
            //       onUpdate={updateTask}
            //     />
            //   ))
            // )
            <TaskList
              tasks={sortedTasks}
              onToggleStatus={toggleTaskStatus}
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          }
        </div>
      )}
    </div>
  );
};

export default Dashboard;