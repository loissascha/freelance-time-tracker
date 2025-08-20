import { useState, useEffect } from 'react';
import { Select } from '@base-ui-components/react';
import styles from "../styles/baseuiselect.module.css"
import { Link } from 'react-router';

// Mock data - replace with your actual data fetching
const customers = [
    { label: 'Client A', value: 1 },
    { label: 'Client B', value: 2 },
    { label: 'Client C', value: 3 },
]

interface TimeEntry {
    id: number;
    customerName: string;
    startTime: Date;
    endTime: Date | null;
    comment: string;
}

function App() {
    const [selectedCustomer, setSelectedCustomer] = useState<number | null>(customers[0]?.value || null);
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
        const customer = customers.find(c => c.value === selectedCustomer);
        if (customer) {
            const newEntry: TimeEntry = {
                id: Date.now(),
                customerName: customer.label,
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
        <>
            <header className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-100">Time Tracker</h1>
                    <p className="text-gray-400">Track your work with ease.</p>
                </div>
                <Link to="/manage-customers" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                    Manage Customers
                </Link>
            </header>

            <main>
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <label htmlFor="customer-select" className="text-lg">Customer:</label>
                        <Select.Root items={customers} value={selectedCustomer} onValueChange={(value) => setSelectedCustomer(value)}>
                            <Select.Trigger className={styles.Select}>
                                <Select.Value />
                                <Select.Icon className={styles.SelectIcon}>
                                    <ChevronUpDownIcon />
                                </Select.Icon>
                            </Select.Trigger>
                            <Select.Portal>
                                <Select.Positioner className={styles.Positioner} sideOffset={8}>
                                    <Select.ScrollUpArrow className={styles.ScrollArrow} />
                                    <Select.Popup className={styles.Popup}>
                                        {customers.map(({ label, value }) => (
                                            <Select.Item key={label} value={value} className={styles.Item}>
                                                <Select.ItemIndicator className={styles.ItemIndicator}>
                                                    <CheckIcon className={styles.ItemIndicatorIcon} />
                                                </Select.ItemIndicator>
                                                <Select.ItemText className={styles.ItemText}>{label}</Select.ItemText>
                                            </Select.Item>
                                        ))}
                                    </Select.Popup>
                                    <Select.ScrollDownArrow className={styles.ScrollArrow} />
                                </Select.Positioner>
                            </Select.Portal>
                        </Select.Root>
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
                            className={`px-8 py-3 rounded-md font-semibold text-white transition-all duration-300 ${isTracking
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
        </>
    );
}
function ChevronUpDownIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            width="8"
            height="12"
            viewBox="0 0 8 12"
            fill="none"
            stroke="currentcolor"
            strokeWidth="1.5"
            {...props}
        >
            <path d="M0.5 4.5L4 1.5L7.5 4.5" />
            <path d="M0.5 7.5L4 10.5L7.5 7.5" />
        </svg>
    );
}

function CheckIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
            <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
        </svg>
    );
}

export default App;
