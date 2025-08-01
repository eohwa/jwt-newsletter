# Free Online JWT Newsletter Prototype

A personalized newsletter system using **100% free online services**: Vercel hosting, Contentful CMS, and Mailchimp API integration.

## 🚀 **Live Demo**

Deploy this to Vercel in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/jwt-newsletter)

## ✨ **Features**

- **🔐 JWT-based Magic Links** - Secure, expiring personalized URLs
- **🎯 Topic-based Content** - ESG, DEI, Executive Business filtering  
- **⭐ Tier-based Access** - Premium content for Gold users
- **📊 Interactive Charts** - Built-in data visualizations
- **📋 Embedded Polls** - User engagement tracking
- **📱 Responsive Design** - Works on all devices
- **🆓 100% Free** - No hosting costs, no database fees

## 🛠 **Free Services Used**

| Service | Purpose | Free Tier Limits |
|---------|---------|------------------|
| **▲ Vercel** | Hosting & Functions | 100GB bandwidth, 1000 functions |
| **📝 Contentful** | Content Management | 25,000 API calls/month |
| **📧 Mailchimp** | Email API | 2,000 contacts, 10,000 emails |

## 🚀 **Quick Setup**

### 1. Deploy to Vercel

\`\`\`bash
# Clone this repository
git clone https://github.com/your-username/jwt-newsletter
cd jwt-newsletter

# Install dependencies  
npm install

# Deploy to Vercel
npx vercel --prod
\`\`\`

### 2. Set Environment Variables

In your Vercel dashboard, add these environment variables:

\`\`\`bash
JWT_SECRET=your-super-secret-jwt-key-change-this
CONTENTFUL_SPACE_ID=your-contentful-space-id
CONTENTFUL_ACCESS_TOKEN=your-contentful-access-token
MAILCHIMP_API_KEY=your-mailchimp-api-key
MAILCHIMP_SERVER_PREFIX=us1
\`\`\`

### 3. Generate Test Links

\`\`\`bash
# Generate link for Aaron (ESG + DEI topics)
node scripts/generate-link.js aaron https://your-app.vercel.app

# Generate link for Sarah (DEI + Executive, Gold tier)  
node scripts/generate-link.js sarah https://your-app.vercel.app

# Generate link for Demo User (All topics, Gold tier)
node scripts/generate-link.js demo https://your-app.vercel.app
\`\`\`

## 📋 **Content Setup Options**

### Option A: Use Sample Data (Fastest)
The app includes sample stories and works immediately after deployment.

### Option B: Connect Contentful (Recommended)

1. **Create free Contentful account** at [contentful.com](https://contentful.com)
2. **Create content model** with these fields:
   - Title (Short text)
   - Excerpt (Long text) 
   - Content (Rich text)
   - Topic (Short text) - values: esg, dei, exb
   - Has Chart (Boolean)
   - Has Poll (Boolean)
   - Published Date (Date & time)

3. **Add sample content** with appropriate topic tags

### Option C: Connect Mailchimp (Advanced)

1. **Create free Mailchimp account** at [mailchimp.com](https://mailchimp.com)
2. **Get API key** from Account > Extras > API keys
3. **Create audience** and add custom merge tags for topics
4. **Update API integration** in the code

## 🎯 **Test Users**

| User | Topics | Tier | Features |
|------|--------|------|----------|
| **Aaron** | ESG, DEI | Standard | Basic content access |
| **Sarah** | DEI, Executive | Gold | Premium blocks + all content |
| **Demo** | All Topics | Gold | Full feature showcase |

## 📊 **Interactive Features**

### Charts (Recharts Integration)
- **ESG Stories**: Bar charts showing sustainability metrics
- **DEI Stories**: Pie charts displaying diversity data  
- **Executive Stories**: Revenue and profit trend charts

### Polls (Built-in Components)
- Topic importance ratings
- User engagement tracking
- Response analytics (console logging)

## 🔧 **Customization**

### Adding New Topics
1. Update \`sampleStories\` array with new topic tags
2. Add topic labels in \`topicLabels\` object
3. Create CSS classes for new topic tags
4. Update test users with new topic combinations

### Adding New Users
1. Edit \`testUsers\` object in \`scripts/generate-link.js\`
2. Define topics, tier, and user details
3. Generate links using the script

### Styling Customization
- Edit \`app/globals.css\` for global styles
- Modify Tailwind classes in components
- Update color schemes in \`tailwind.config.json\`

## 🔒 **Security Notes**

⚠️ **This is a prototype** - not production ready:

- JWT secret is in environment variables (good)
- No signature verification on client (add server-side verification)
- Sample data is hardcoded (connect real CMS)
- No rate limiting (add for production)

### Production Security Checklist:
- [ ] Use proper JWT library with signature verification
- [ ] Implement server-side token validation
- [ ] Add rate limiting and abuse protection
- [ ] Use HTTPS only
- [ ] Implement proper error handling
- [ ] Add logging and monitoring

## 📈 **Analytics & Tracking**

The system includes basic analytics:

- **Console Logging**: User views and story interactions
- **Intersection Observer**: Tracks which stories are viewed
- **User Segmentation**: Topics and tier-based analytics

For production, integrate:
- Google Analytics 4
- Mixpanel or Amplitude
- Custom event tracking

## 🚀 **Deployment**

### Vercel (Recommended)
\`\`\`bash
npx vercel --prod
\`\`\`

### Netlify
\`\`\`bash
npm run build
# Deploy dist folder to Netlify
\`\`\`

### Railway
\`\`\`bash
# Connect GitHub repo to Railway
# Auto-deploys on push
\`\`\`

## 🔄 **API Integration Examples**

### Contentful Integration
\`\`\`javascript
// lib/contentful.js
import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
})

export async function getStoriesByTopic(topic) {
  const entries = await client.getEntries({
    content_type: 'newsletterStory',
    'fields.topic': topic,
    order: '-fields.publishedDate'
  })
  return entries.items
}
\`\`\`

### Mailchimp Integration
\`\`\`javascript
// lib/mailchimp.js
import mailchimp from '@mailchimp/mailchimp_marketing'

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
})

export async function getPersonalizedContent(email, topics) {
  // Fetch user-specific content from Mailchimp
  const campaigns = await mailchimp.campaigns.list({
    count: 10,
    status: 'sent'
  })
  
  return campaigns.campaigns.filter(campaign => 
    topics.some(topic => campaign.settings.title.includes(topic))
  )
}
\`\`\`

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push to branch (\`git push origin feature/amazing-feature\`)
5. Open Pull Request

## 📄 **License**

MIT License - feel free to use for personal and commercial projects.

## 🆘 **Support**

- **Issues**: [GitHub Issues](https://github.com/your-username/jwt-newsletter/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/jwt-newsletter/discussions)
- **Email**: your-email@example.com

---

**Built with ❤️ using 100% free online services**
