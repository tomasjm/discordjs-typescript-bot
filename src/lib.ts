// export const formatTime = (duration: string): string => {
//     const { hours, minutes, seconds} = duration;
//     function formatHour(hours: number) {
//         if (hours == 0) return '';
//         if (hours<10) return `0${hours}:`
//         return `${hours}:`
//     }
//     function formatMinute(minutes: number) {
//         if (minutes == 0) return '';
//         if (minutes<10) return `0${minutes}:`
//         return `${minutes}:`
//     }
//     function formatSecond(seconds: number) {
//         if (seconds == 0) return '';
//         if (seconds<10) return `0${seconds}`
//         return `${seconds}`
//     }
//     return `${formatHour(hours)}${formatMinute(minutes)}${formatSecond(seconds)}`;
// };