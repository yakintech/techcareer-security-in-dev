const express = require('express');
var jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const secretKey = "secretKey";

const orders = [
    { id: 1, product: 'Apple', price: 100 },
    { id: 2, product: 'Banana', price: 200 },
    { id: 3, product: 'Cherry', price: 300 }
]


app.use((req, res, next) => {

    if (req.path == '/api/login') {
        return next();
    }

    try {
        const token = req.headers['authorization'];
        if (token) {
            //bearer token
            const tokenString = token.split(' ')[1];
            const decoded = jwt.verify(tokenString, secretKey);
            console.log(decoded);
            return next();
        }
        else {
            return res.status(401).send('Unauthorized');
        }
    } catch (error) {
        return res.status(401).send('Unauthorized');
    }
})



app.post('/api/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (email == 'cagatay@mail.com' && password == '123') {
        //kullanıcı adı ve şifre doğruysa bilet veriyorum. Bilet süresi 1 saat
        const token = jwt.sign({ email: email, name: "cagatay.yildiz" }, secretKey, { expiresIn: '1h' });
        res.json({ token: token });
    }
    else {
        res.status(401).send('Unauthorized');
    }
}
)



app.get('/api/orders', (req, res) => {
    res.json(orders);
})

app.post('/api/orders', (req, res) => {
    const order = {
        id: orders.length + 1,
        product: req.body.product,
        price: req.body.price
    }
    orders.push(order);
    res.json(order);
})




app.listen(3000, () => console.log('Server is running on port 3000...'));