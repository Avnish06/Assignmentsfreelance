import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Search,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  ListFilter,
  AlertCircle
} from 'lucide-react';
import AppointmentForm from './components/AppointmentForm';
import AppointmentCard from './components/AppointmentCard';
import {
  fetchAppointments,
  createAppointment,
  updateAppointmentStatus
} from './services/api';

const STATUS_FILTERS = ['All', 'Pending', 'Confirmed', 'Cancelled'];

export default function App() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Load appointments
  const loadAppointments = async (status = activeStatus, search = searchTerm) => {
    try {
      setError(null);
      const data = await fetchAppointments({ status, search });
      setAppointments(data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server. Please verify the server is running and MongoDB is connected.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadAppointments(activeStatus, searchTerm);
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [activeStatus, searchTerm]);

  const handleStatusFilterChange = (status) => {
    setActiveStatus(status);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleManualRefresh = () => {
    setRefreshing(true);
    loadAppointments(activeStatus, searchTerm);
  };

  const handleAddAppointment = async (newAppointmentData) => {
    const created = await createAppointment(newAppointmentData);
    // Reload to respect sort & active filters
    await loadAppointments(activeStatus, searchTerm);
    return created;
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      // Update local state smoothly
      setAppointments((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
      );
      // If filtering by a specific status, re-query to keep list consistent
      if (activeStatus !== 'All' && activeStatus !== newStatus) {
        loadAppointments(activeStatus, searchTerm);
      }
    } catch (err) {
      alert('Failed to update appointment status: ' + err.message);
    }
  };

  // Stats calculation
  const counts = appointments.reduce(
    (acc, cur) => {
      acc.total++;
      if (cur.status === 'Pending') acc.pending++;
      if (cur.status === 'Confirmed') acc.confirmed++;
      if (cur.status === 'Cancelled') acc.cancelled++;
      return acc;
    },
    { total: 0, pending: 0, confirmed: 0, cancelled: 0 }
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Appointment Manager</h1>
              <p className="text-xs text-slate-500 font-medium">Full-stack MERN Assessment Solution</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleManualRefresh}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-colors"
              title="Refresh Appointments"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Error notification banner if backend down */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">Connection Alert</p>
              <p className="text-rose-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form (5 Cols on LG) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <AppointmentForm onAppointmentAdded={handleAddAppointment} />

            {/* Quick Metrics / Summary */}
            <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Current View Summary
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-xs text-amber-700 font-medium">Pending</p>
                  <p className="text-lg font-bold text-amber-800">{counts.pending}</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-xs text-emerald-700 font-medium">Confirmed</p>
                  <p className="text-lg font-bold text-emerald-800">{counts.confirmed}</p>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                  <p className="text-xs text-rose-700 font-medium">Cancelled</p>
                  <p className="text-lg font-bold text-rose-800">{counts.cancelled}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Filter, Search, List (8 Cols on LG) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              {/* Customer Search Input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by customer name..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-sm transition-colors focus:outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                {STATUS_FILTERS.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilterChange(status)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                      activeStatus === status
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* List Header */}
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                <ListFilter className="w-4 h-4 text-slate-500" />
                <span>
                  Showing {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'}
                </span>
                {activeStatus !== 'All' && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    Filter: {activeStatus}
                  </span>
                )}
                {searchTerm && (
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                    Query: "{searchTerm}"
                  </span>
                )}
              </h2>
            </div>

            {/* Appointment Cards Grid / List */}
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
                <p className="text-sm font-medium">Loading appointments from MongoDB Atlas...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">No appointments found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {searchTerm || activeStatus !== 'All'
                    ? 'Try adjusting your search criteria or changing the status filter above.'
                    : 'Get started by creating your first appointment with the form on the left.'}
                </p>
                {(searchTerm || activeStatus !== 'All') && (
                  <button
                    onClick={() => {
                      setActiveStatus('All');
                      setSearchTerm('');
                    }}
                    className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Appointment Manager Assessment Solution • MERN Stack</span>
          <span className="font-mono text-slate-400">Connected to MongoDB Atlas</span>
        </div>
      </footer>
    </div>
  );
}

