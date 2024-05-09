import express from 'express';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js'

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);


app.listen(8000, () => {
    console.log('Server running on http://localhost:8000/');
})