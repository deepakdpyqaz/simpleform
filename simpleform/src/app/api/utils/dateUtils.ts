
function getDateDifferenceFromString(
    date1Str: string | undefined,
    date2Str: string | undefined
): number {
    if (date1Str === undefined || date2Str === undefined) {
        return 0;
    }
    // Parse the string dates into Date objects
    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);

    const diffInMilliseconds = Math.abs(date1.getTime() - date2.getTime());

    const minutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return days;
}
export {getDateDifferenceFromString};