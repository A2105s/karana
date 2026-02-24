'use client';

import { useCallback, useState } from 'react';

const DEPARTMENTS = ['PWD', 'WATER', 'BESCOM', 'MUNICIPAL', 'TELECOM'] as const;
type Dept = (typeof DEPARTMENTS)[number];

export interface ProjectForm {
  dept: Dept;
  title: string;
  startDate: string;
  endDate: string;
  cost: number;
  description: string;
}

interface SaveProjectModalProps {
  isOpen: boolean;
  geometryType: string;
  onSave: (data: ProjectForm) => void;
  onClose: () => void;
}

const deptColors: Record<Dept, string> = {
  PWD: '#EF4444',
  WATER: '#3B82F6',
  BESCOM: '#F59E0B',
  MUNICIPAL: '#8B5CF6',
  TELECOM: '#10B981',
};

export default function SaveProjectModal({
  isOpen,
  geometryType,
  onSave,
  onClose,
}: SaveProjectModalProps) {
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState<ProjectForm>({
    dept: 'PWD',
    title: '',
    startDate: today,
    endDate: '',
    cost: 0,
    description: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectForm, string>>>({});

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof ProjectForm, string>> = {};
    if (!form.title.trim()) newErrors.title = 'Project title is required';
    if (!form.startDate) newErrors.startDate = 'Start date is required';
    if (!form.endDate) newErrors.endDate = 'End date is required';
    if (form.endDate && form.startDate && form.endDate < form.startDate)
      newErrors.endDate = 'End date must be after start date';
    if (!form.cost || form.cost <= 0) newErrors.cost = 'Enter a valid cost greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (validate()) {
        onSave(form);
        // Reset form
        setForm({
          dept: 'PWD',
          title: '',
          startDate: today,
          endDate: '',
          cost: 0,
          description: '',
        });
        setErrors({});
      }
    },
    [form, onSave, validate, today]
  );

  const handleClose = useCallback(() => {
    setErrors({});
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-project-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2
              id="save-project-title"
              className="text-lg font-bold text-white"
            >
              💾 Save New Project
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {geometryType === 'LineString' ? '📏 Route drawn on map' : '📍 Point marked on map'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="text-gray-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4">

          {/* Department */}
          <div>
            <label
              htmlFor="dept-select"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Department <span aria-hidden="true" className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, dept: d }))}
                  aria-pressed={form.dept === d}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 ${
                    form.dept === d
                      ? 'text-white border-transparent'
                      : 'bg-transparent text-gray-300 border-white/20 hover:border-white/40'
                  }`}
                  style={
                    form.dept === d
                      ? { backgroundColor: deptColors[d], borderColor: deptColors[d] }
                      : {}
                  }
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Project Title */}
          <div>
            <label htmlFor="project-title" className="block text-sm font-medium text-gray-300 mb-1">
              Project Title <span aria-hidden="true" className="text-red-400">*</span>
            </label>
            <input
              id="project-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. NH-46 Road Widening"
              aria-required="true"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
              className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.title ? 'border-red-500' : 'border-white/20'
              }`}
            />
            {errors.title && (
              <p id="title-error" role="alert" className="mt-1 text-xs text-red-400">
                {errors.title}
              </p>
            )}
          </div>

          {/* Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-300 mb-1">
                Start Date <span aria-hidden="true" className="text-red-400">*</span>
              </label>
              <input
                id="start-date"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                aria-required="true"
                aria-invalid={!!errors.startDate}
                aria-describedby={errors.startDate ? 'start-error' : undefined}
                className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.startDate ? 'border-red-500' : 'border-white/20'
                }`}
              />
              {errors.startDate && (
                <p id="start-error" role="alert" className="mt-1 text-xs text-red-400">
                  {errors.startDate}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-300 mb-1">
                End Date <span aria-hidden="true" className="text-red-400">*</span>
              </label>
              <input
                id="end-date"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                aria-required="true"
                aria-invalid={!!errors.endDate}
                aria-describedby={errors.endDate ? 'end-error' : undefined}
                className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.endDate ? 'border-red-500' : 'border-white/20'
                }`}
              />
              {errors.endDate && (
                <p id="end-error" role="alert" className="mt-1 text-xs text-red-400">
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Estimated Cost */}
          <div>
            <label htmlFor="project-cost" className="block text-sm font-medium text-gray-300 mb-1">
              Estimated Cost (₹) <span aria-hidden="true" className="text-red-400">*</span>
            </label>
            <input
              id="project-cost"
              type="number"
              min={1}
              value={form.cost || ''}
              onChange={(e) => setForm((f) => ({ ...f, cost: Number(e.target.value) }))}
              placeholder="e.g. 5000000"
              aria-required="true"
              aria-invalid={!!errors.cost}
              aria-describedby={errors.cost ? 'cost-error' : 'cost-hint'}
              className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.cost ? 'border-red-500' : 'border-white/20'
              }`}
            />
            <p id="cost-hint" className="mt-1 text-xs text-gray-500">
              {form.cost > 0 ? `₹${(form.cost / 1000000).toFixed(2)}L` : 'Enter amount in ₹'}
            </p>
            {errors.cost && (
              <p id="cost-error" role="alert" className="mt-1 text-xs text-red-400">
                {errors.cost}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="project-desc" className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="project-desc"
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of the project scope..."
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 rounded-lg transition text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-lg transition text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              💾 Save &amp; Check Clashes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
