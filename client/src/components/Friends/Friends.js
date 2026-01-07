import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Layout/Navbar';
import './Friends.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function Friends() {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState({ sent: [], received: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
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

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/friends/requests`);
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
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

  const sendFriendRequest = async (friendId) => {
    try {
      await axios.post(`${API_URL}/friends`, { friendId });
      setSearchQuery('');
      setSearchResults([]);
      await fetchPendingRequests(); // Refresh pending requests
      setMessage({ type: 'success', text: 'Friend request sent!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to send friend request'
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      await axios.put(`${API_URL}/friends/requests/${requestId}/accept`);
      await fetchFriends(); // Refresh friends list
      await fetchPendingRequests(); // Refresh pending requests
      setMessage({ type: 'success', text: 'Friend request accepted!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to accept friend request'
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const rejectFriendRequest = async (requestId) => {
    try {
      await axios.delete(`${API_URL}/friends/requests/${requestId}`);
      await fetchPendingRequests(); // Refresh pending requests
      setMessage({ type: 'success', text: 'Friend request removed' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to remove friend request'
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

  const isPendingRequest = (userId) => {
    return pendingRequests.sent.some(req => req.userId === userId) ||
           pendingRequests.received.some(req => req.userId === userId);
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

        {/* Pending Friend Requests - Received */}
        {pendingRequests.received.length > 0 && (
          <div className="card">
            <h2>Friend Requests ({pendingRequests.received.length})</h2>
            <div className="requests-list">
              {pendingRequests.received.map(request => (
                <div key={request.id} className="request-item">
                  <div className="user-info">
                    <div className="friend-avatar">
                      {request.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong>{request.username}</strong>
                      <span className="user-email">{request.email}</span>
                    </div>
                  </div>
                  <div className="request-actions">
                    <button
                      className="btn btn-primary btn-small"
                      onClick={() => acceptFriendRequest(request.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => rejectFriendRequest(request.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Friend Requests - Sent */}
        {pendingRequests.sent.length > 0 && (
          <div className="card">
            <h2>Sent Requests ({pendingRequests.sent.length})</h2>
            <div className="requests-list">
              {pendingRequests.sent.map(request => (
                <div key={request.id} className="request-item">
                  <div className="user-info">
                    <div className="friend-avatar">
                      {request.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong>{request.username}</strong>
                      <span className="user-email">{request.email}</span>
                    </div>
                  </div>
                  <div className="request-actions">
                    <span className="request-status">Pending</span>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => rejectFriendRequest(request.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search for Friends */}
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
              {searchResults.map(user => {
                const isPending = isPendingRequest(user.id);
                return (
                  <div key={user.id} className="search-result-item">
                    <div className="user-info">
                      <strong>{user.username}</strong>
                      <span className="user-email">{user.email}</span>
                    </div>
                    {isPending ? (
                      <span className="request-sent">Request Sent</span>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => sendFriendRequest(user.id)}
                      >
                        Send Request
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {searchQuery && !searching && searchResults.length === 0 && (
            <div className="no-results">No users found</div>
          )}
        </div>

        {/* Accepted Friends List */}
        <div className="card">
          <h2>Friends List ({friends.length})</h2>
          {loading ? (
            <div className="loading">Loading friends...</div>
          ) : friends.length === 0 ? (
            <div className="empty-state">
              <p>You don't have any friends yet. Search above to send friend requests!</p>
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

