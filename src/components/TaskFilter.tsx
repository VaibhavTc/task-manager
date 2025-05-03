import React from 'react';
import { useTask } from '../contexts/TaskContext';

const TaskFilter: React.FC = () => {
  const { filter, setFilter, tasks } = useTask();

  const getCount = (filterType: 'All' | 'Active' | 'Completed') => {
    if (filterType === 'All') return tasks.length;
    if (filterType === 'Active') return tasks.filter(task => !task.completed).length;
    return tasks.filter(task => task.completed).length;
  };

  return (
    <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2">
      {(['All', 'Active', 'Completed'] as const).map((filterType) => (
        <button
          key={filterType}
          onClick={() => setFilter(filterType)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap ${filter === filterType
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
        >
          {filterType} <span className="text-xs rounded-full px-1.5 ml-1 inline-flex items-center justify-center">
            {getCount(filterType)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;