import React from 'react';
import TaskCard from './TaskCard';
import { Task } from '../contexts/TaskContext';

interface TaskListProps {
    tasks: Task[];
    onToggleStatus: (id: string, completed: boolean) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onUpdate: (id: string, taskData: Partial<Task>) => Promise<void>;
}

const formatDateKey = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toDateString(); // "Mon Apr 29 2025"
};

const getHeadingLabel = (dateKey: string) => {
    const today = new Date();
    const date = new Date(dateKey);
    const diffInDays = Math.floor((+today - +date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';

    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleStatus, onDelete, onUpdate }) => {
    const grouped: { [key: string]: Task[] } = {};

    tasks.forEach(task => {
        console.log(task);
        const key = formatDateKey(task.createdAt);
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(task);
    });

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return (
        <div className="space-y-6">
            {sortedDates.map(dateKey => (
                <div key={dateKey}>
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">{getHeadingLabel(dateKey)}</h2>
                    <div className="space-y-4">
                        {grouped[dateKey].map(task => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onToggleStatus={onToggleStatus}
                                onDelete={onDelete}
                                onUpdate={onUpdate}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TaskList;
