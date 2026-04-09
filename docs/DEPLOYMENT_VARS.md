# Production Environment Variables

## Required for Server

- `DATABASE_URL` - MongoDB Atlas production connection string
- `JWT_SECRET` - Strong random secret (min 32 characters)
- `NODE_ENV` - Set to `production`
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `FRONTEND_URL` - URL of deployed frontend (e.g., https://yourapp.vercel.app)

## Required for Client

- `VITE_API_BASE_URL` - URL of deployed backend (e.g., https://yourapp.onrender.com)

## Security Notes

- Never commit these values to Git
- Use platform environment variable settings (Render, Vercel dashboards)
- DATABASE_URL contains password - treat as highly sensitive
