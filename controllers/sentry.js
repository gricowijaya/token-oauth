module.exports = {
    mainHandler: (req, res) => {
        throw new Error("My First Sentry Error");
    }
}
