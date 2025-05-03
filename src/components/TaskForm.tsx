import React from 'react';
import { useForm } from '../hooks/useForm';
import { X } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (values: {
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    dueDate: string;
  }) => Promise<void>;
  onCancel: () => void;
}

interface TaskFormValues {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel }) => {
  const initialValues: TaskFormValues = {
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: ''
  };

  const validateForm = (values: TaskFormValues) => {
    const errors: Partial<Record<keyof TaskFormValues, string>> = {};
    if (!values.title.trim()) errors.title = 'Title is required';
    return errors;
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm
  } = useForm<TaskFormValues>({
    initialValues,
    validate: validateForm,
    onSubmit: async (values) => {
      await onSubmit(values);
      resetForm();
    }
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md px-6 py-5 mb-6 border border-gray-200"
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-800">Add New Task</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="col-span-full">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            name="title"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full mt-1 px-3 py-2 rounded-md border ${touched.title && errors.title ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="e.g., Finish project report"
          />
          {touched.title && errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div className="col-span-full">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (optional)</label>
          <textarea
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={3}
            className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Details about the task"
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            id="priority"
            name="priority"
            value={values.priority}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={values.dueDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full mt-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={() => {
            resetForm();
            onCancel();
          }}
          className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
              </svg>
              Saving
            </>
          ) : (
            'Add Task'
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
