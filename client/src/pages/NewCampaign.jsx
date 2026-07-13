import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Sparkles } from 'lucide-react';
import { createCampaign } from '../services/api';

export default function NewCampaign() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name:      '',
    product:   '',
    objective: '',
    audience:  '',
    budget:    '',
    startDate: '',
    endDate:   '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Campaign name is required.');
      return;
    }

    setLoading(true);
    try {
      await createCampaign({
        ...form,
        budget: Number(form.budget) || 0,
      });
      navigate('/approval-queue');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create campaign. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-600/20">
            <Sparkles className="h-5 w-5 text-accent-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">New Campaign</h1>
            <p className="text-sm text-gray-400">Launch an AI-powered marketing campaign</p>
          </div>
        </div>
      </div>

      {/* Form card */}
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8 space-y-5">
        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Campaign Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="name">
            Campaign Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Summer Product Launch"
            className="input-dark"
            required
          />
        </div>

        {/* Product + Audience (2-col) */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="product">Product</label>
            <input
              type="text"
              id="product"
              name="product"
              value={form.product}
              onChange={handleChange}
              placeholder="e.g. SaaS Pro"
              className="input-dark"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="audience">Target Audience</label>
            <input
              type="text"
              id="audience"
              name="audience"
              value={form.audience}
              onChange={handleChange}
              placeholder="e.g. Tech-savvy adults 25-45"
              className="input-dark"
            />
          </div>
        </div>

        {/* Objective */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="objective">
            Campaign Objective
          </label>
          <textarea
            id="objective"
            name="objective"
            rows={3}
            value={form.objective}
            onChange={handleChange}
            placeholder="Describe the campaign goals, key messages, and desired outcomes..."
            className="input-dark resize-none"
          />
        </div>

        {/* Budget */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="budget">
            Budget (₹)
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            placeholder="e.g. 100000"
            min="0"
            className="input-dark"
          />
        </div>

        {/* Date range (2-col) */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="input-dark"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300" htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="input-dark"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            id="submit-campaign"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4" />
                Launch Campaign
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
