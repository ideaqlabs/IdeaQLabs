import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://YOUR-PROJECT-REF.supabase.co';
const supabaseAnonKey = 'YOUR-ANON-KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Capture token from OAuth redirect
async function handleOAuthRedirect() {
  try {
    const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
    if (error) {
      console.error('OAuth redirect error:', error.message);
    }
    if (data?.session) {
      console.log('User logged in:', data.session.user);
      // Optionally, remove #access_token from URL
      window.history.replaceState({}, document.title, '/');
    }
  } catch (err) {
    console.error(err);
  }
}

handleOAuthRedirect();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
