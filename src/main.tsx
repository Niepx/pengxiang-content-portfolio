import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import LoadingBoundary from './LoadingBoundary';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><LoadingBoundary><App/></LoadingBoundary></React.StrictMode>);
