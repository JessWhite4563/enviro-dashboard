import moment from 'moment';

export const calculateDifference = (utcDatetime: string) => {
    const date1 = moment.utc(utcDatetime);
    const date2 = moment();
    const duration = moment.duration(date2.diff(date1));

    const seconds = duration.asSeconds();
    const minutes = duration.asMinutes();
    const hours = duration.asHours();
    const days = duration.asDays();

    if ( seconds < 60) {
        return `${Math.round(seconds)}s`;
    } else if ( minutes < 60) {
        const label = Math.round(minutes) === 1 ? 'minute' : 'minutes';
        return `${Math.round(minutes)} ${label}`;
    } else if ( hours < 24) {
        const label = Math.round(hours) === 1 ? 'hour' : 'hours';
        return `${Math.round(hours)} ${label}`;
    } else {
        const label = Math.round(days) === 1 ? 'day' : 'days';
        return `${Math.round(days)} ${label}`;
    }
};