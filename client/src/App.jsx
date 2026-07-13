import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewCampaign from './pages/NewCampaign';
import ApprovalQueue from './pages/ApprovalQueue';
import History from './pages/History';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="new-campaign" element={<NewCampaign />} />
        <Route path="approval-queue" element={<ApprovalQueue />} />
        <Route path="history" element={<History />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
