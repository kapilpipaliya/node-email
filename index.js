const express = require('express')
const Email = require('./email')
const dotenv = require('dotenv');

const app = express()

dotenv.config({ path: './.env' });

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

app.get('/', function (req, res) {
    res.send('API is working!')
})

app.post("/reset-password", async (req, res) => {
    try {

        const {
            user,
            template,
            mailto,
            title,
            resetUrl,
            EMAIL_HOST,
            EMAIL_PORT,
            EMAIL_USERNAME,
            EMAIL_PASSWORD,
        } = req.body;

        await new Email({
            user,
            mailto,
            resetUrl,
            EMAIL_USERNAME,
        }).send({
            template,
            title,
            EMAIL_HOST,
            EMAIL_PORT,
            EMAIL_USERNAME,
            EMAIL_PASSWORD,
        });

        return res.json({ success: true })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message
        })
    }

})

app.all('*', (req, res, next) => {
    return res.json({
        success: false,
        message: `Can't find ${req.originalUrl} on this server!`
    })
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});