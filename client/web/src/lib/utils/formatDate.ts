export function beautifyDate(date: string) {
    const dateObj = new Date(date)

    return dateObj.toLocaleDateString()
}
