# VentureWave 🌊

VentureWave is an AI-powered platform that connects startups with mentors and investors, leveraging intelligent matching algorithms to facilitate meaningful connections in the startup ecosystem.

## Features 🚀

- **AI-Powered Matching**: Smart algorithm to find the perfect mentor based on startup needs
- **Credit System**: Fair usage system with initial 5 credits
- **Real-time Results**: Instant, formatted responses with highlighted key information
- **Secure Authentication**: Google OAuth integration
- **Responsive Design**: Beautiful UI that works across all devices
- **Dark Mode Support**: Full dark mode implementation

## Tech Stack 💻

- **Framework**: Next.js 14 (App Router)
- **Authentication**: NextAuth.js with Google Provider
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Database**: Prisma with PostgreSQL
- **AI Integration**: Custom AI implementation
- **Icons**: Lucide React

## Getting Started 🏁

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/venturewave.git
   cd venturewave
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```env
   # Create a .env file with:
   DATABASE_URL="your_postgresql_url"
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## Project Structure 📁

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Key Features Explained 🔑

### Credit System
- Users start with 5 free credits
- Each search consumes 1 credit
- One-time recharge available
- Email notification system for recharge requests

### Search Functionality
- Real-time AI processing
- Formatted responses with highlighted topics
- Bullet point parsing
- Error handling and loading states

### Authentication
- Secure Google OAuth integration
- Protected routes
- Persistent user sessions
- Credit tracking per user

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 👏

- Next.js team for the amazing framework
- Shadcn for the beautiful UI components
- Vercel for hosting and deployment
