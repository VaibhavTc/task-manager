import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { Task } from '../contexts/TaskContext';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, taskData: Partial<Task>) => Promise<void>;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleStatus, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedPriority, setEditedPriority] = useState(task.priority);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleStatus = async () => {
    if (!task._id) return; // Add check for task ID
    await onToggleStatus(task._id, !task.completed);
  };

  const handleUpdateTask = async () => {
    if (editedTitle.trim() === '' || !task._id) return; // Add check for task ID

    await onUpdate(task._id, {
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority as 'Low' | 'Medium' | 'High',
      dueDate: editedDueDate
    });

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedPriority(task.priority);
    setEditedDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!task._id) return;
    setIsDeleting(true);
    try {
      await onDelete(task._id);
    } finally {
      setIsDeleting(false);
    }
  };

  const getPriorityClass = () => {
    switch (task.priority) {
      case 'High':
        return 'task-priority-high';
      case 'Medium':
        return 'task-priority-medium';
      case 'Low':
        return 'task-priority-low';
      default:
        return 'task-priority-low';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    return new Date() > dueDate;
  };

  return (
    <div className={`task-card ${getPriorityClass()} ${task.completed ? 'task-card-completed' : ''}`}>
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label htmlFor={`title-${task._id}`} className="form-label">Title</label>
            <input
              id={`title-${task._id}`}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-2 border rounded"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor={`description-${task._id}`} className="form-label">Description</label>
            <textarea
              id={`description-${task._id}`}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={2}
            />
          </div>

          <div>
            <label htmlFor={`priority-${task._id}`} className="form-label">Priority</label>
            <select
              id={`priority-${task._id}`}
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value as 'Low' | 'Medium' | 'High')}
              className="w-full p-2 border rounded"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label htmlFor={`dueDate-${task._id}`} className="form-label">Due Date</label>
            <input
              type="date"
              id={`dueDate-${task._id}`}
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={handleCancelEdit}
              className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </button>
            <button
              onClick={handleUpdateTask}
              className="btn btn-primary"
              disabled={editedTitle.trim() === ''}
            >
              <Check className="w-4 h-4 mr-1" />
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={handleToggleStatus}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
              />
              <div className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                <h3 className="text-lg font-medium">{task.title}</h3>
              </div>
            </div>
            <div className='flex'>
              {task.dueDate && (
                <span className="text-xs text-gray-500">
                  Due: {formatDate(task.dueDate)}
                </span>
              )}
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-gray-600 hover:text-red-600 transition-colors"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {task.description && (
            <p className={`mt-2 text-gray-700 ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.description}
            </p>
          )}

          {isOverdue() && !task.completed && (
            <div className="mt-2 text-sm text-red-600 font-medium">
              <strong>Overdue!</strong> This task's due date has passed.
            </div>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {task.priority}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(task.createdAt)}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
