import React from 'react';
import { Calendar, Clock, User, Briefcase, CheckCircle, Clock3, XCircle } from 'lucide-react';

export default function AppointmentCard({ appointment, onStatusChange }) {
  const { _id, customerName, service, dateTime, status } = appointment;

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Confirmed':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />,
        };
      case 'Cancelled':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          icon: <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />,
        };
      case 'Pending':
      default:
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          icon: <Clock3 className="w-3.5 h-3.5 mr-1 text-amber-600" />,
        };
    }
  };

  const badgeStyle = getStatusBadge(status);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
              {customerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base leading-snug">{customerName}</h3>
              <div className="flex items-center text-xs text-slate-500 mt-0.5">
                <Briefcase className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <span>{service}</span>
              </div>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyle.bg}`}
          >
            {badgeStyle.icon}
            {status}
          </span>
        </div>

        <div className="space-y-1.5 py-3 border-y border-slate-100 my-3 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700">{formatDate(dateTime)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{formatTime(dateTime)}</span>
          </div>
        </div>
      </div>

      <div className="mt-2 pt-1 flex items-center justify-between">
        <label className="text-xs font-medium text-slate-500">Status:</label>
        <div className="flex items-center space-x-1">
          {['Pending', 'Confirmed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => onStatusChange(_id, st)}
              disabled={status === st}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                status === st
                  ? 'bg-slate-100 text-slate-400 cursor-default'
                  : 'text-slate-600 hover:bg-slate-100 active:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

