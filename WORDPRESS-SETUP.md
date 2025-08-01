# WordPress.com Setup Guide

## 🚀 Quick Setup (5 minutes)

### 1. Create Your WordPress.com Site

1. **Go to [WordPress.com](https://wordpress.com)** and click "Get started"
2. **Choose "Start with a blog"** (free option)
3. **Pick a site name** like `your-newsletter.wordpress.com`
4. **Select the Free plan**
5. **Complete the setup**

### 2. Create Your Newsletter Content

#### Create Posts with Required Tags

Create at least 3-5 posts with these specific tags:

**📗 ESG & Sustainability Posts (tag: `esg`)**
- "ESG Reporting Standards: What's New in 2024"
- "Sustainable Supply Chain Best Practices" 
- "Carbon Footprint Reduction for Senior Leaders"
- "Social Media's Role in ESG Communication"

**👥 Diversity & Inclusion Posts (tag: `dei`)**
- "Building Inclusive Leadership Teams"
- "DEI Metrics That Actually Matter"
- "Social Media and Inclusive Messaging"
- "Senior Leadership's Role in DEI"

**📱 Social Media & Digital Posts (tag: `social-media`)**
- "Social Media Strategy for ESG Communication"
- "Digital Platforms for DEI Messaging"
- "Senior Executive Social Media Presence"
- "Crisis Communication on Social Platforms"

**👔 Senior Leadership Posts (tag: `senior`)**
- "Strategic Decision Making for Senior Leaders"
- "ESG Leadership at the C-Suite Level"
- "Senior Leaders and Social Media Engagement"
- "Inclusive Leadership for Executives"

#### How to Add Tags:
1. **Create/Edit a post**
2. **In the right sidebar**, find "Tags"
3. **Add the tag**: `esg`, `dei`, `social-media`, or `senior`
4. **Use multiple tags** for overlapping content (e.g., a post about "ESG Communication on Social Media" could have both `esg` and `social-media` tags)
5. **Publish the post**

### 3. Connect to Your Newsletter App

#### Option A: Use WordPress.com Subdomain
If your site is `my-newsletter.wordpress.com`:

\`\`\`bash
# Set environment variable
WORDPRESS_SITE_URL=my-newsletter.wordpress.com
\`\`\`

#### Option B: Use Custom Domain
If you have a custom domain `mynewsletter.com`:

\`\`\`bash
# Set environment variable  
WORDPRESS_SITE_URL=mynewsletter.com
\`\`\`

### 4. Test Your Integration

1. **Deploy your app** to Vercel
2. **Set the environment variable** in Vercel dashboard
3. **Generate a test link**:
   \`\`\`bash
   node scripts/generate-link.js aaron https://your-app.vercel.app
   \`\`\`
4. **Visit the link** - you should see your WordPress.com posts!

## 📝 Content Creation Tips

### Writing Effective Newsletter Posts

**Title Format:**
- "ESG Reporting: New Requirements for 2024"
- "DEI Metrics That Actually Matter"
- "Executive Leadership in Crisis"

**Content Structure:**
1. **Hook** - Start with a compelling statistic or question
2. **Key Points** - 3-5 main takeaways
3. **Action Items** - What readers should do next
4. **Data/Charts** - Include keywords like "data", "chart", "survey" to trigger chart displays

**Tag Strategy:**
- Use **exactly** these tags: `esg`, `dei`, `social-media`, `senior`
- You can add additional tags, but these are required for filtering
- **Multiple tags encouraged** - many posts will overlap categories:
  - ESG + Senior: "C-Suite ESG Leadership"
  - DEI + Social Media: "Inclusive Social Media Strategies"  
  - Senior + Social Media: "Executive Digital Presence"
  - ESG + Social Media: "Sustainability Communication"

### Adding Interactive Elements

**For Charts:**
Include words like "data", "chart", "metrics", "statistics" in your content to automatically trigger chart displays.

**For Polls:**
Include words like "poll", "survey", "feedback", "opinion" to trigger interactive polls.

## 🔧 Advanced WordPress.com Features

### Custom Fields (Business Plan)
If you upgrade to Business plan, you can add custom fields:
- `newsletter_chart_data` - JSON data for custom charts
- `newsletter_poll_question` - Custom poll questions
- `newsletter_tier` - Content tier (standard/gold)

### Categories vs Tags
- **Use Tags** for newsletter filtering (`esg`, `dei`, `social-media`, `senior`)
- **Use Categories** for site organization ("News", "Analysis", "Reports")

### SEO Optimization
- **Add meta descriptions** for better search visibility
- **Use featured images** (they'll show in the newsletter)
- **Internal linking** between related posts

## 🚨 Troubleshooting

### "No posts found" Error
1. **Check your site URL** in environment variables
2. **Verify tags** are exactly `esg`, `dei`, `social-media`, `senior` (lowercase)
3. **Ensure posts are published** (not draft)
4. **Test the API directly**: Visit `https://public-api.wordpress.com/wp/v2/sites/YOUR-SITE.wordpress.com/posts`

### API Rate Limits
WordPress.com allows:
- **Free sites**: 1000 API calls per hour
- **Paid sites**: Higher limits

### CORS Issues
WordPress.com REST API supports CORS by default, so no configuration needed.

## 📊 Content Analytics

### Track Performance
1. **WordPress.com Stats** - Built-in analytics
2. **Google Analytics** - Add tracking code
3. **Newsletter Analytics** - Console logs in the app

### A/B Testing Content
1. **Create multiple versions** of posts
2. **Use different tags** for testing
3. **Monitor engagement** in console logs

## 🎯 Content Calendar

### Weekly Schedule
- **Monday**: ESG news and updates
- **Wednesday**: DEI insights and best practices  
- **Friday**: Executive business strategies

### Monthly Themes
- **Week 1**: Industry trends and analysis
- **Week 2**: Case studies and success stories
- **Week 3**: Tools and frameworks
- **Week 4**: Future outlook and predictions

## 🔐 Security & Privacy

### WordPress.com Security
- **Automatic updates** and security patches
- **SSL certificates** included
- **Backup and restore** features

### Content Privacy
- **Public posts** are accessible via API
- **Private posts** require authentication
- **Password-protected posts** not accessible via API

## 💡 Pro Tips

1. **Batch create content** - Write multiple posts at once
2. **Use templates** - Create post templates for consistency
3. **Schedule posts** - Use WordPress.com's scheduling feature
4. **Cross-reference tags** - Some posts can have multiple topic tags
5. **Monitor API usage** - Check your site's API performance

---

**Need help?** Check the [WordPress.com Support](https://wordpress.com/support/) documentation or contact their support team.
