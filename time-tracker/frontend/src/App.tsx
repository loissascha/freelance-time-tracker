import { useState, useEffect } from 'react';

// Mock data - replace with your actual data fetching
const customers = [
  { id: 1, name: 'Client A' },
  { id: 2, name: 'Client B' },
  { id: 3, name: 'Project X' },
];

interface TimeEntry {
  id: number;
  customerName: string;
  startTime: Date;
  endTime: Date | null;
  comment: string;
}

function App() {
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(customers[0]?.id || null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timer: number;
    if (isTracking && activeEntry) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((new Date().getTime() - activeEntry.startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTracking, activeEntry]);

  const handleStartTracking = () => {
    if (!selectedCustomer) {
      alert('Please select a customer first.');
      return;
    }
    const customer = customers.find(c => c.id === selectedCustomer);
    if (customer) {
      const newEntry: TimeEntry = {
        id: Date.now(),
        customerName: customer.name,
        startTime: new Date(),
        endTime: null,
        comment: '',
      };
      setActiveEntry(newEntry);
      setIsTracking(true);
    }
  };

  const handleStopTracking = () => {
    if (activeEntry) {
      const now = new Date();
      const updatedEntry = { ...activeEntry, endTime: now };
      setTimeEntries(prevEntries => [updatedEntry, ...prevEntries]);
      setIsTracking(false);
      setActiveEntry(null);
      setElapsedTime(0);
    }
  };

  const handleCommentChange = (id: number, comment: string) => {
    setTimeEntries(prevEntries =>
      prevEntries.map(entry => (entry.id === id ? { ...entry, comment } : entry))
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (start: Date, end: Date | null) => {
    if (!end) return '...';
    const seconds = Math.floor((end.getTime() - start.getTime()) / 1000);
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const formatElapsedTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-100">Time Tracker</h1>
          <p className="text-gray-400">Track your freelance work with ease.</p>
        </header>

        <main>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label htmlFor="customer-select" className="text-lg">Customer:</label>
              <select
                id="customer-select"
                disabled={isTracking}
                value={selectedCustomer || ''}
                onChange={(e) => setSelectedCustomer(Number(e.target.value))}
                className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-6">
              {isTracking && (
                <div className="text-3xl font-mono bg-gray-900 px-4 py-2 rounded-md">
                  {formatElapsedTime(elapsedTime)}
                </div>
              )}
              <button
                onClick={isTracking ? handleStopTracking : handleStartTracking}
                disabled={!selectedCustomer}
                className={`px-8 py-3 rounded-md font-semibold text-white transition-all duration-300 ${
                  isTracking
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } disabled:bg-gray-500 disabled:cursor-not-allowed`}
              >
                {isTracking ? 'Stop Tracking' : 'Start Tracking'}
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Time Log</h2>
            <div className="space-y-4">
              {timeEntries.length > 0 ? (
                timeEntries.map(entry => (
                  <div key={entry.id} className="bg-gray-700 p-4 rounded-md flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-grow">
                      <p className="font-bold text-lg">{entry.customerName}</p>
                      <p className="text-sm text-gray-400">
                        {entry.startTime.toLocaleDateString()} | {formatTime(entry.startTime)} - {entry.endTime ? formatTime(entry.endTime) : 'Now'}
                      </p>
                    </div>
                    <div className="text-xl font-semibold w-32 text-center">
                      {formatDuration(entry.startTime, entry.endTime)}
                    </div>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={entry.comment}
                      onChange={(e) => handleCommentChange(entry.id, e.target.value)}
                      className="bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow min-w-[200px]"
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">No time entries yet. Start tracking to log your work.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;