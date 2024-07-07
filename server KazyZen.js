const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;
const PAYDUNYA_PRIVATE_KEY ='live_private_52UBiDEjX80ty1vjnzigc1fvRDX';

const PAYDUNYA_PUBLIC_KEY = 'live_public_FHeTwrRiFyQ0FHuJwYXafWn4KD2';

const PAYDUNYA_MASTER_KEY ='0LWb6jp0-LTDw-bQTE-T5nb-H1ecuwCjSH0d';

const PAYDUNYA_TOKEN = '1az9Mad0BkN6Y2daR7Ge';

let users = [];
let subscriptions = {};

app.use(bodyParser.json());
app.use(cors());

app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    const userExists = users.some(u => u.email === email);

    if (userExists) {
        return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    users.push({ username, email, password: hashedPassword });
    res.json({ message: 'Utilisateur enregistré avec succès' });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Connexion réussie', token });
});

app.post('/logout', (req, res) => {
    res.json({ message: 'Déconnexion réussie' });
});

app.get('https://golbeyprog.github.io/', (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({ message: 'Pas de token fourni' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userEmail = decoded.email;
        const userSubscriptions = subscriptions[userEmail] || 'Pas d\'abonnements';
        res.json({ message: userSubscriptions });
    } catch (err) {
        res.status(500).json({ message: 'Échec de l\'authentification du token' });
    }
});

app.post('https://golbeyprog.github.io/', async (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({ message: 'Pas de token fourni' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userEmail = decoded.email;

        const response = await axios.post(
        https://golbeyprog.github.io/, {
            invoice: {
                items: [
                    { name: 'Abonnement', quantity: 1, unit_price: 1.00 }
                ],
                total_amount: 1.00,
                description: 'Paiement de l\'abonnement'
            },
            store: {
                name: 'KazyZen',
                tagline: 'La meilleure app'
            },
            custom_data: {
                email: userEmail
            }
        }, {
            headers: {
               'Content-Type': 'application/json,'
               
'live_private_52UBiDEjX80ty1vjnzigc1fvRDX': 
                PAYDUNYA_PRIVATE_KEY,
                
             'live_public_FHeTwrRiFyQ0FHuJwYXafWn4KD2':
             PAYDUNYA_PUBLIC_KEY,
             
  '0LWb6jp0-LTDw-bQTE-T5nb-H1ecuwCjSH0d':
   PAYDUNYA_MASTER_KEY,
                    
                    '1az9Mad0BkN6Y2daR7Ge':
                   PAYDUNYA_TOKEN
          
            }
        });

        if (response.data && response.data.response_code === "00") {
            res.json({ redirectUrl: response.data.invoice_url });
        } else {
            res.status(500).json({ message: 'Échec du paiement' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Une erreur est survenue lors du paiement' });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
