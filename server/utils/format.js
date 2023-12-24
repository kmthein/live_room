module.exports = formatMessage = (username, message) => {
    return {
        username,
        message,
        sent_at: Date.now()
    }
}