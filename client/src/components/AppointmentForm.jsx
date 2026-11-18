import React, { useState } from 'react';
import { PlusCircle, Calendar, User, Briefcase, CheckCircle2 } from 'lucide-react';

const SERVICES = [
  'Consultation',
  'Follow-up',
  'Review',
  'Assessment',
  'Therapy Session',
  'Support & Maintenance',
];

export default function AppointmentForm({ onAppointmentAdded }) {
  const [customerName, setCustomerName] = useState('');
  const [service, setService] = useState('Consultation');
  const [dateTime, setDateTime] = useState('');
  const [status, setStatus] = useState('Pending');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const errs = {};
    if (!customerName.trim()) {
      errs.customerName = 'Customer name is required.';
    } else if (customerName.trim().length < 2) {
      errs.customerName = 'Customer name must be at least 2 characters.';
    }

    if (!service.trim()) {
      errs.service = 'Please select or enter a service.';
    }

    if (!dateTime) {
      errs.dateTime = 'Date and time are required.';
    } else {
      const selectedDate = new Date(dateTime);
      if (isNaN(selectedDate.getTime())) {
        errs.dateTime = 'Please enter a valid date and time.';
      }
    }

    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
      errs.status = 'Invalid status selected.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onAppointmentAdded({
        customerName: customerName.trim(),
        service: service.trim(),
        dateTime,
        status,
      });

      // Reset form
      setCustomerName('');
      setService('Consultation');
      setDateTime('');
      setStatus('Pending');
      setErrors({});
      setSuccessMessage('Appointment scheduled successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ general: err.message || 'Error creating appointment.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
          <PlusCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">New Appointment</h2>
          <p className="text-sm text-slate-500">Schedule an appointment with customer and service details</p>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center space-x-3 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errors.general && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Customer Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (errors.customerName) setErrors({ ...errors, customerName: null });
              }}
              placeholder="e.g. Alex Morgan"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 ${
                errors.customerName
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20 text-rose-900'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 bg-white'
              }`}
            />
          </div>
          {errors.customerName && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.customerName}</p>
          )}
        </div>

        {/* Service */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Service <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <select
              value={service}
              onChange={(e) => {
                setService(e.target.value);
                if (errors.service) setErrors({ ...errors, service: null });
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white text-sm transition-colors focus:outline-none"
            >
              {SERVICES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          {errors.service && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.service}</p>
          )}
        </div>

        {/* Date and Time */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Date &amp; Time <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => {
                setDateTime(e.target.value);
                if (errors.dateTime) setErrors({ ...errors, dateTime: null });
              }}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 ${
                errors.dateTime
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20 text-rose-900'
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100 bg-white'
              }`}
            />
          </div>
          {errors.dateTime && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.dateTime}</p>
          )}
        </div>

        {/* Initial Status */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Initial Status
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Pending', 'Confirmed', 'Cancelled'].map((st) => (
              <button
                type="button"
                key={st}
                onClick={() => setStatus(st)}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  status === st
                    ? st === 'Pending'
                      ? 'bg-amber-500 border-amber-600 text-white shadow-sm'
                      : st === 'Confirmed'
                      ? 'bg-emerald-600 border-emerald-700 text-white shadow-sm'
                      : 'bg-rose-500 border-rose-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Saving Appointment...</span>
              </>
            ) : (
              <span>Book Appointment</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

