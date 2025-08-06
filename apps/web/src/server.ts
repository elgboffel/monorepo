import express from 'express';
import { getMessage, getVersion } from 'shared/helpers';
import { formatDate, constants } from 'shared/utils';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.static('public'));

// Helper function to generate HTML
function generateHTML(title: string, content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.6;
      color: #333;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      text-align: center;
    }
    .content {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    .info {
      background: #e3f2fd;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
    }
    .nav {
      margin: 2rem 0;
      text-align: center;
    }
    .nav a {
      display: inline-block;
      margin: 0 1rem;
      padding: 0.5rem 1rem;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background 0.3s;
    }
    .nav a:hover {
      background: #5a6fd8;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${constants.APP_NAME}</h1>
    <p>Web Application</p>
  </div>
  
  <nav class="nav">
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/api-info">API Info</a>
  </nav>
  
  <div class="content">
    ${content}
  </div>
  
  <div class="info">
    <strong>Generated:</strong> ${formatDate(new Date())} at ${new Date().toLocaleTimeString()}<br>
    <strong>Version:</strong> ${getVersion()}<br>
    <strong>Message:</strong> ${getMessage()}
  </div>
</body>
</html>
  `;
}

// Routes
app.get('/', (req, res) => {
  const content = `
    <h2>Welcome to the Web App</h2>
    <p>This is a simple web application built in the monorepo with TypeScript and Express.js.</p>
    <p>The app demonstrates how to use shared packages across different applications in a monorepo setup.</p>
    <ul>
      <li>Built with Express.js and TypeScript</li>
      <li>Uses shared packages for common functionality</li>
      <li>Generates dynamic HTML responses</li>
      <li>Part of a pnpm + Turborepo monorepo</li>
    </ul>
  `;

  res.send(generateHTML('Home - Web App', content));
});

app.get('/about', (req, res) => {
  const content = `
    <h2>About This Application</h2>
    <p>This web application is part of a minimal monorepo setup using:</p>
    <ul>
      <li><strong>pnpm workspaces</strong> - For package management</li>
      <li><strong>Turborepo</strong> - For build orchestration and caching</li>
      <li><strong>TypeScript</strong> - For type safety</li>
      <li><strong>Express.js</strong> - For the web server</li>
    </ul>
    
    <h3>Architecture</h3>
    <p>The monorepo contains:</p>
    <ul>
      <li><code>apps/web</code> - This web application</li>
      <li><code>apps/api</code> - REST API server</li>
      <li><code>packages/shared</code> - Shared utilities and functions</li>
    </ul>
    
    <p>All packages are consumed directly as TypeScript source files, with no build step required for internal packages.</p>
  `;

  res.send(generateHTML('About - Web App', content));
});

app.get('/api-info', (req, res) => {
  const content = `
    <h2>API Information</h2>
    <p>This monorepo also includes a REST API server running on port 3000.</p>
    
    <h3>Available API Endpoints:</h3>
    <ul>
      <li><code>GET /</code> - Welcome message with app info</li>
      <li><code>GET /health</code> - Health check endpoint</li>
      <li><code>GET /api/message</code> - Get message from shared package</li>
    </ul>
    
    <h3>Try the API:</h3>
    <p>You can test the API endpoints using curl or any HTTP client:</p>
    <pre><code>curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/api/message</code></pre>
    
    <p>Both the web app and API use the same shared package for consistent messaging and utilities.</p>
  `;

  res.send(generateHTML('API Info - Web App', content));
});

// 404 handler
app.use((req, res) => {
  const content = `
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
    <p><a href="/">Go back to home</a></p>
  `;

  res.status(404).send(generateHTML('404 - Web App', content));
});

// Start server
app.listen(PORT, () => {
  console.log(`🌐 Web app running on http://localhost:${PORT}`);
  console.log(`📦 Using shared package: ${getMessage()}`);
});
