export const timeAgo = (date: Date) => {
    if (!date) return '';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime(); // milliseconds
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
};



export const formatSchedule = (startISO: string, endISO: string) => {
    if (!startISO || !endISO) return '';

    const start = new Date(startISO);
    const end = new Date(endISO);

    const optionsDate: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    };

    const optionsTime: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'Asia/Dhaka',
    };

    const datePart = start.toLocaleDateString('en-US', optionsDate);
    const startTime = start.toLocaleTimeString('en-US', optionsTime);
    const endTime = end.toLocaleTimeString('en-US', optionsTime);

    return `${datePart} - ${startTime} - ${endTime}`;
};