
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://task-manager-1k66.onrender.com/tasks";
function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setError("");
      const response = await axios.get(API);
      setTasks(response.data);
    } catch (err) {
      setError("Cannot connect to server. Check MongoDB and backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }

    try {
      await axios.post(API, {
        title: title.trim(),
        description: description.trim(),
      });

      setTitle("");
      setDescription("");
      loadTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to add task");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/${id}`, { status });
      loadTasks();
    } catch (err) {
      alert("Unable to update task");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Do you want to delete this task?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      loadTasks();
    } catch (err) {
      alert("Unable to delete task");
    }
  };

  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pending = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Task Manager</h1>
          <p>Organize your work. Achieve your goals.</p>
        </div>
        <span className="task-count">{tasks.length} Tasks</span>
      </header>

      <main className="container">
        <section className="stats">
          <div className="stat-card">
            <span>Total Tasks</span>
            <h2>{tasks.length}</h2>
          </div>

          <div className="stat-card">
            <span>Pending</span>
            <h2>{pending}</h2>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <h2>{completed}</h2>
          </div>
        </section>

        <section className="panel">
          <h2>Add New Task</h2>

          <form onSubmit={addTask}>
            <label>Task Title</label>
            <input
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label>Description</label>
            <textarea
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />

            <button className="add-button" type="submit">
              + Add Task
            </button>
          </form>
        </section>

        <section className="panel">
          <h2>My Tasks</h2>

          {error && <p className="error">{error}</p>}

          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="empty">No tasks yet. Add your first task!</p>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <article className="task-card" key={task._id}>
                  <div className="task-info">
                    <h3>{task.title}</h3>
                    <p>{task.description || "No description"}</p>
                    <span className={`status ${task.status.toLowerCase().replace(" ", "-")}`}>
                      {task.status}
                    </span>
                  </div>

                  <div className="task-actions">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateStatus(task._id, e.target.value)
                      }
                      aria-label="Task status"
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>

                    <button
                      className="delete-button"
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
