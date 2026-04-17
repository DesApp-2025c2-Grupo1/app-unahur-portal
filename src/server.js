const app = require('./index');

const PORT = process.env.PORT;

app.listen(PORT, () => {
    try {
        console.log(`App listening on port ${PORT}`);
    } catch (error) {
        console.error('Error al iniciar la app:', error);
    }
});