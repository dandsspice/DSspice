import React, { useState } from 'react';
import authService from '../../api/authService';
import { cookies } from '../../utils/cookies';

export default function TestUserProfile() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  const testGetProfile = async () => {
    setLoading(true);
    setError(null);
    setDebugInfo(null);
    
    try {
      // Get debug information
      const token = cookies.getToken();
      const isAuth = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      setDebugInfo({
        token: token ? 'Token exists' : 'No token',
        isAuthenticated: isAuth,
        currentUser: currentUser
      });

      const response = await authService.getUserProfile();
      setResult(response);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Test User Profile</h2>
      
      <button 
        onClick={testGetProfile}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Test Get Profile'}
      </button>

      {debugInfo && (
        <div className="mt-4 p-4 bg-yellow-100 rounded">
          <h3 className="font-bold">Debug Information:</h3>
          <pre className="mt-2 p-4 bg-white rounded overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="mt-4">
          <h3 className="font-bold">Response:</h3>
          <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 