export function beautifyDate(date: string) {
    const dateObj = new Date(date)

    return dateObj.toLocaleDateString()
}

export function beautifyFullDate(date: string) {
    const dateObj = new Date(date)

    return dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString()
}
