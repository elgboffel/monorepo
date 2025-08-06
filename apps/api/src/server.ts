import express from 'express';
import { getMessage, getVersion } from 'shared/helpers';
import { formatDate, constants } from 'shared/utils';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    app: constants.APP_NAME,
    message: getMessage(),
    version: getVersion(),
    date: formatDate(new Date()),
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/message', (req, res) => {
  res.json({ message: getMessage() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📦 Using shared package: ${getMessage()}`);
});
