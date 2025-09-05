import { Select } from '@base-ui-components/react';
import styles from "../styles/baseuiselect.module.css"
import { Link } from 'react-router';
import { useCustomer } from '../context/CustomerContext';
import { MainButton, RedButton } from '../components/Button';
import { useTimeTracker } from '../context/TimeTrackerContext';
import SaveIcon from '../components/icons/SaveIcon';
import { useState } from 'react';
import { DeleteTime, ExportCustomer } from '../../wailsjs/go/customerhandler/CustomerHandler';

function App() {
    const { customers, selectedCustomer, setSelectedCustomer } = useCustomer()
    const { timeEntries, elapsedTime, isTracking, startTracking, stopTracking, changeComment, saveComment, reloadTimeEntries } = useTimeTracker()
    const [askDelete, setAskDelete] = useState(0)

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

    async function callDelete() {
        if (askDelete == 0) return
        await DeleteTime(askDelete)
        setAskDelete(0)
        await reloadTimeEntries()
    }

    async function exportButton() {
        if (!selectedCustomer) return
        console.log("exporting customer", selectedCustomer)
        await ExportCustomer(selectedCustomer)
		alert("Export erfolgreich!")
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
                        <label htmlFor="customer-select" className="text-lg">Customer / Project:</label>
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
                        {isTracking ?
                            <RedButton onClick={stopTracking} disabled={!selectedCustomer}>Stop Tracking</RedButton> :
                            <MainButton onClick={startTracking} disabled={!selectedCustomer}>Start Tracking</MainButton>
                        }
                    </div>
                </div>

                {askDelete > 0 ? (
                    <div className='absolute top-0 left-0 right-0 bottom-0 bg-black/50'>
                        <div className='w-full h-full flex items-center justify-center'>
                            <div className='max-w-3/4 max-h-3/4 overflow-y-auto bg-slate-800 rounded-xl border border-slate-600 p-8 text-center'>
                                <h1 className='text-3xl font-bold'>For Sure Dude?</h1>
                                <div className='mt-2'>Do you really want to delete this time entry?</div>
                                <div className='flex gap-4 justify-center mt-8'>
                                    <button className='px-8 py-2 bg-green-600 rounded-lg font-bold hover:bg-green-500 cursor-pointer' onClick={() => callDelete()}>Ok</button>
                                    <button className='cursor-pointer text-neutral-300 hover:text-neutral-100' onClick={() => setAskDelete(0)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}

                <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className='mb-4 flex justify-between items-center'>
                        <h2 className="text-2xl font-bold mb-4">Time Log</h2>
                        {selectedCustomer ? (
                            <button className='bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded cursor-pointer' onClick={() => {
                                exportButton()
                            }}>Export</button>
                        ) : null}
                    </div>
                    <div className="space-y-4">
                        {timeEntries.length > 0 ? (
                            timeEntries.map(entry => (
                                <div key={entry.id} className="bg-gray-700 p-4 rounded-md flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex-grow">
                                        <p className="text-sm text-gray-400">
                                            {entry.startTime.toLocaleDateString()} | {formatTime(entry.startTime)} - {entry.endTime ? formatTime(entry.endTime) : 'Now'}
                                        </p>
                                    </div>
                                    <div className="text-xl font-semibold w-32 text-center">
                                        {formatDuration(entry.startTime, entry.endTime)}
                                    </div>
                                    <button className='cursor-pointer text-red-600 hover:text-red-500 font-bold' onClick={() => setAskDelete(entry.id)}>
                                        X
                                    </button>
                                    <div className='flex gap-1'>
                                        <input
                                            type="text"
                                            placeholder="Add a comment..."
                                            value={entry.comment}
                                            onChange={(e) => changeComment(entry.id, e.target.value)}
                                            className="bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow min-w-[200px]"
                                        />
                                        {entry.hasCommentUpdate ? (
                                            <button onClick={() => {
                                                saveComment(entry.id)
                                            }} className='bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-lg px-3'>
                                                <SaveIcon />
                                            </button>
                                        ) : null}
                                    </div>
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
