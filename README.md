# POPPA — Creator Platform

> A hard-edged home for art, independent creators, strange ideas, and work with a pulse.

## 🎯 Features

- **Age Verification Gate** — Persistent verification using localStorage
- **Creator Profiles** — Dynamic creator cards with images, descriptions, and categories
- **Contact Form** — Full-featured contact form with validation and email notifications
- **Responsive Design** — Mobile-first, works on all devices
- **Backend API** — Node.js/Express with SQLite database
- **Modern UI** — Industrial aesthetic with smooth animations
- **Search & Filter** — Find creators by category (extensible)
- **Admin Dashboard** — View all contact messages (protected endpoint)

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Validation**: Validator.js
- **Styling**: Custom CSS with CSS variables

## 📦 Installation

### Prerequisites
- Node.js 14+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/zacherydotson-alt/poppa-creator-platform.git
cd poppa-creator-platform

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev

# Start production server
npm start
```

The app will be available at `http://localhost:3000`

## 🚀 API Documentation

### Creators

#### Get all creators
```
GET /api/creators
```
Returns an array of all creator profiles.

#### Get creator by ID
```
GET /api/creators/:id
```
Returns a single creator profile.

#### Add new creator
```
POST /api/creators
Content-Type: application/json

{
  "name": "Artist Name",
  "category": "Medium / Style",
  "description": "Description of work",
  "image": "https://...",
  "portfolio_url": "https://..."
}
```

### Contact

#### Submit contact form
```
POST /api/contact
Content-Type: application/json

{
  "name": "Your Name",
  "email": "you@example.com",
  "subject": "Subject Line",
  "message": "Your message here"
}
```

#### Get contact messages (admin)
```
GET /api/contact/messages
```
*Note: Add authentication before deploying*

### Health Check
```
GET /health
```
Returns server status and timestamp.

## 🎨 Customization

### Colors

Edit CSS variables in `styles.css`:
```css
:root {
  --black: #090a0a;
  --rust: #ce562d;
  --gold: #e4a941;
  /* ... more colors ... */
}
```

### Logo

The logo is an SVG in `index.html`. Edit the `<svg>` element in the header to customize.

### Content

- **Sample creators** are defined in `app.js`
- Edit the `creators` array to add/modify profiles
- Or add creators via the API endpoint

## 🔐 Security

### Before Production:

1. **Add Authentication** — Protect admin endpoints
2. **Enable HTTPS** — Use SSL/TLS certificates
3. **Add Rate Limiting** — Prevent abuse
4. **Validate All Input** — Already implemented with validator.js
5. **Set Up Email** — Configure SMTP for notifications
6. **Add CSRF Protection** — Use csrf tokens for forms
7. **Environment Variables** — Never commit `.env` file
8. **Database Backups** — Implement regular backups

## 📧 Email Setup

To enable email notifications:

1. Update `.env` with your SMTP details
2. Install nodemailer: `npm install nodemailer`
3. Uncomment email functions in `server.js`

## 🚢 Deployment

### Heroku
```bash
heroku login
heroku create poppa-platform
git push heroku main
```

### Railway
```bash
railway login
railway init
railway up
```

### Docker
```bash
docker build -t poppa .
docker run -p 3000:3000 poppa
```

## 📝 License

MIT — See LICENSE file

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Email: support@poppa.local
- Check the [Wiki](https://github.com/zacherydotson-alt/poppa-creator-platform/wiki)

## 🎓 Learning Resources

- [Express.js Guide](https://expressjs.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

---

**Made loud. Made real.** ✨