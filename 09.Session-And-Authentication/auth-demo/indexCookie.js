import express from 'express';
import cookieParser from 'cookie-parser';

const port = 100;
const CUSTOM_COOKIE = 'Initial Cookie Value';
const CUSTOM_COOKIE2 = 'Initial Cookie Value 2';
const CUSTOM_COOKIE3 = 'Initial Cookie Value 3';
const CUSTOM_COOKIE4 = 'Initial Cookie Value 4';
const app = express();

app.use(cookieParser());

app.get('/', (req, res) => {
    res.header('Set-Cookie', 'cookie-mookie-dookie=Custom set cookie');
    res.cookie('CUSTOM_COOKIE',CUSTOM_COOKIE);
    res.cookie('CUSTOM_COOKIE2',CUSTOM_COOKIE2);
    res.cookie('CUSTOM_COOKIE3',CUSTOM_COOKIE3);
    // res.send('Hello world!')
    res.send(`<h1>Hello ${req.cookies.username || 'n/a'}</h1>`);
});

app.get('/login/:username', (req, res) => {
    res.cookie('username', req.params.username);
    res.send('You have been logged!');
})

app.get('/show', (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    console.log(cookies['4uki']);
    console.log(cookies.Chuki);
    console.log(cookies.username);
    res.cookie('custom_cookie', CUSTOM_COOKIE4);
    res.cookie('CUSTOM_COOKIE3',CUSTOM_COOKIE3);
    res.cookie('4uki', '4uki');
    res.cookie('Chuki', 'Puki');
    res.send(cookies);

})

app.listen(port, x => console.log(`Server is listening on port ${port}...`));