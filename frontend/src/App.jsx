import React, { useState, useEffect } from 'react';
import api from './api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');

  // 1. Backend se saare tasks lekar aao
  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. Naya Task create karo
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const response = await api.post('/tasks', {
        title: newTitle,
        status: 'todo'
      });
      setTasks([...tasks, response.data]);
      setNewTitle('');
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // 3. Task ka status update karo (Move to next column)
  const moveTask = async (id, currentStatus) => {
    let nextStatus = 'todo';
    if (currentStatus === 'todo') nextStatus = 'in_progress';
    else if (currentStatus === 'in_progress') nextStatus = 'done';
    else return; // Agar pehle se 'done' hai toh kahin nahi jayega

    try {
      const response = await api.put(`/tasks/${id}`, { status: nextStatus });
      setTasks(tasks.map(t => t.id === id ? response.data : t));
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  // Columns filter karne ke liye helper
  const filterByStatus = (status) => tasks.filter(t => t.status === status);

  return (
    <div className="kanban-container">
      <h1>📋 Personal Kanban Board</h1>
      
      {/* Task Form */}
      <form onSubmit={handleAddTask} className="task-form">
        <input 
          type="text" 
          placeholder="Enter new task..." 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      {/* Board Columns */}
      <div className="board">
        {/* TODO COLUMN */}
        <div className="column todo">
          <h2>📌 Todo</h2>
          <div className="task-list">
            {filterByStatus('todo').map(task => (
              <div key={task.id} className="task-card">
                <p>{task.title}</p>
                <button onClick={() => moveTask(task.id, task.status)}>Start ➡️</button>
              </div>
            ))}
          </div>
        </div>

        {/* IN PROGRESS COLUMN */}
        <div className="column in-progress">
          <h2>⚡ In Progress</h2>
          <div className="task-list">
            {filterByStatus('in_progress').map(task => (
              <div key={task.id} className="task-card">
                <p>{task.title}</p>
                <button onClick={() => moveTask(task.id, task.status)}>Finish ➡️</button>
              </div>
            ))}
          </div>
        </div>

        {/* DONE COLUMN */}
        <div className="column done">
          <h2>✅ Done</h2>
          <div className="task-list">
            {filterByStatus('done').map(task => (
              <div key={task.id} className="task-card done-card">
                <p>{task.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;