import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      try {
        await axios.put(`http://localhost:5000/api/users/${editingId}`, {
          name,
          email,
          age
        });
        fetchUsers();
        resetForm();
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      try {
        await axios.post('http://localhost:5000/api/users', {
          name,
          email,
          age
        });
        fetchUsers();
        resetForm();
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
  };

  const handleEdit = (user) => {
    setName(user.name);
    setEmail(user.email);
    setAge(user.age);
    setEditingId(user._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setAge('');
    setEditingId(null);
  };

  return (
    <div className="App">
      <h1>User Management</h1>
      
      <form onSubmit={handleSubmit} className="user-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <button type="submit">
          {editingId ? 'Update User' : 'Add User'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <div className="user-list">
        <h2>Users</h2>
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.age}</td>
                  <td>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;