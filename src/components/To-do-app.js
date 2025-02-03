import React, { useState, useEffect } from 'react';

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [showEmptyTaskPopup, setShowEmptyTaskPopup] = useState(false);

  const handleClosePopup = () => {
    setShowLimitPopup(false);
    setShowEmptyTaskPopup(false);
  };

  const handleChange = (event) => {
    setInput(event.target.value);
    handleClosePopup();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addTask();
  };

  const addTask = () => {
    if (input.trim() !== '') {
      if (tasks.length < 5) {
        const newTasks = [...tasks, { text: input, checked: false }];
        setTasks(newTasks);
        saveTasks(newTasks);
        setInput('');
        handleClosePopup();
      } else {
        setShowLimitPopup(true);
      }
    } else {
      setShowEmptyTaskPopup(true);
    }
  };

  const handleDelete = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const handleCheckboxChange = (index) => {
    const newTasks = [...tasks];
    newTasks[index] = {
      ...newTasks[index],
      checked: !newTasks[index].checked,
    };
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const saveTasks = (newTasks) => {
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    if (tasks.length < 5 && showLimitPopup) {
      handleClosePopup();
    }
    if (input.trim() !== '' && showEmptyTaskPopup) {
      handleClosePopup();
    }
  }, [tasks.length, input, showLimitPopup, showEmptyTaskPopup]);

  return (
    <div className="todo-app">
      <h1>To-Do App</h1>
      {showLimitPopup && <div className="popup">Task limit reached (5 tasks).</div>}
      {showEmptyTaskPopup && <div className="popup">Please enter a non-empty task.</div>}
      <form onSubmit={handleSubmit} className="task-form">
        <input type="text" value={input} onChange={handleChange} placeholder="Enter a new task" />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <div className="task-item">
              <input
                type="checkbox"
                checked={task.checked}
                onChange={() => handleCheckboxChange(index)}
              />
              <div className="task-text">
                <span className={task.checked ? 'completed' : ''}>{task.text}</span>
              </div>
            </div>
            <button className="delete" onClick={() => handleDelete(index)}>Delete</button>
          </li>
        ))}
    </ul>

    </div>
  );
}

export default TodoApp;
