import { useState, useEffect } from 'react';
import axios from 'axios';

const URL = import.meta.env.VITE_API_URL;

const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    address: '',
    phone: '',
    website: '',
  });
  const [editingUserId, setEditingUserId] = useState(null);

  // Fetch users from the API
  useEffect(() => {
    axios.get(URL)
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add a new user
  const addUser = () => {
    axios.post(URL, formData)
      .then(response => setUsers([...users, response.data]))
      .catch(error => console.error('Error adding user:', error));
    setFormData({
      name: '',
      username: '',
      email: '',
      address: '',
      phone: '',
      website: '',
    });
  };

  // Edit an existing user
  const editUser = (user) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      address: user.address,
      phone: user.phone,
      website: user.website,
    });
  };

  // Update an existing user
  const updateUser = () => {
    axios.put(`${URL}/${editingUserId}`, formData)
      .then(response => {
        setUsers(users.map(user => user.id === editingUserId ? response.data : user));
        setEditingUserId(null);
        setFormData({
          name: '',
          username: '',
          email: '',
          address: '',
          phone: '',
          website: '',
        });
      })
      .catch(error => console.error('Error updating user:', error));
  };

  // Delete a user
  const deleteUser = (id) => {
    axios.delete(`${URL}/${id}`)
      .then(() => setUsers(users.filter(user => user.id !== id)))
      .catch(error => console.error('Error deleting user:', error));
  };

  return (
    <div className="App">
      <h1>Users CRUD Operations</h1>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="website"
          placeholder="Website"
          value={formData.website}
          onChange={handleInputChange}
        />
        <button onClick={editingUserId ? updateUser : addUser}>
          {editingUserId ? 'Update User' : 'Add User'}
        </button>
      </div>

      <h2>Users List</h2>
      <ol>
        {users.map(user => (
          <li key={user.id}>
            <strong>Name:</strong> {user.name} <br />
            <strong>Username:</strong> {user.username} <br />
            <strong>Email:</strong> {user.email} <br />
            <strong>Address:</strong> {user.address} <br />
            <strong>Phone:</strong> {user.phone} <br />
            <strong>Website:</strong> {user.website} <br />
            <button onClick={() => editUser(user)}>Edit</button>
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default App;
