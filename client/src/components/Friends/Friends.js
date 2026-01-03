import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Layout/Navbar';
import './Friends.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function Friends() {
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        searchUsers();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${API_URL}/friends`);
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const response = await axios.get(`${API_URL}/users/search`, {
        params: { query: searchQuery }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };

  const addFriend = async (friendId) => {
    try {
      const response = await axios.post(`${API_URL}/friends`, { friendId });
      setFriends([...friends, response.data]);
      setSearchQuery('');
      setSearchResults([]);
      setMessage({ type: 'success', text: 'Friend added successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to add friend'
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const removeFriend = async (friendshipId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/friends/${friendshipId}`);
      setFriends(friends.filter(f => f.friendshipId !== friendshipId));
      setMessage({ type: 'success', text: 'Friend removed successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to remove friend'
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="page-title">My Friends</h1>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="card">
          <h2>Add Friend</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searching && <div className="search-loading">Searching...</div>}
          </div>

          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(user => (
                <div key={user.id} className="search-result-item">
                  <div className="user-info">
                    <strong>{user.username}</strong>
                    <span className="user-email">{user.email}</span>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => addFriend(user.id)}
                  >
                    Add Friend
                  </button>
                </div>
              ))}
            </div>
          )}

          {searchQuery && !searching && searchResults.length === 0 && (
            <div className="no-results">No users found</div>
          )}
        </div>

        <div className="card">
          <h2>Friends List ({friends.length})</h2>
          {loading ? (
            <div className="loading">Loading friends...</div>
          ) : friends.length === 0 ? (
            <div className="empty-state">
              <p>You don't have any friends yet. Search above to add some!</p>
            </div>
          ) : (
            <div className="friends-grid">
              {friends.map(friend => (
                <div key={friend.friendshipId} className="friend-card">
                  <div className="friend-avatar">
                    {friend.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="friend-info">
                    <h3>{friend.username}</h3>
                    <p>{friend.email}</p>
                  </div>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => removeFriend(friend.friendshipId)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Friends;

