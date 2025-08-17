# Environment Variables Configuration Guide

## 🎯 **Quick Setup**

### 1. Go to Your Vercel Dashboard
1. Open your project in [vercel.com](https://vercel.com)
2. Go to **Settings** → **Environment Variables**
3. Add the variables below

### 2. Required Environment Variables

#### **NEWSLETTER_TAGS** (JSON format)
Configure your available topic tags:

\`\`\`json
[
  {"slug":"talent-marketing","label":"Talent & Marketing","color":"purple"},
  {"slug":"supply-chain","label":"Supply Chain","color":"orange"},
  {"slug":"esg","label":"ESG & Sustainability","color":"green"},
  {"slug":"dei","label":"Diversity & Inclusion","color":"blue"},
  {"slug":"social-media","label":"Social Media & Digital","color":"pink"},
  {"slug":"senior","label":"Senior Leadership","color":"amber"},
  {"slug":"finance","label":"Finance & Accounting","color":"indigo"},
  {"slug":"hr","label":"Human Resources","color":"rose"}
]
\`\`\`

#### **NEWSLETTER_USERS** (JSON format)
Configure your user profiles:

\`\`\`json
[
  {
    "key":"aaron",
    "name":"Aaron",
    "email":"aaron@example.com",
    "topics":["talent-marketing","supply-chain"],
    "tier":"Standard"
  },
  {
    "key":"sarah",
    "name":"Sarah Johnson",
    "email":"sarah@example.com",
    "topics":["esg","dei"],
    "tier":"Gold"
  },
  {
    "key":"demo",
    "name":"Demo User",
    "email":"demo@example.com",
    "topics":["talent-marketing","supply-chain","esg","dei"],
    "tier":"Gold"
  }
]
\`\`\`

## 🚀 **How to Update Tags**

### Adding a New Tag:
1. **Copy your current NEWSLETTER_TAGS** value
2. **Add the new tag** to the JSON array:
   \`\`\`json
   {"slug":"new-tag","label":"New Tag Name","color":"emerald"}
   \`\`\`
3. **Update the environment variable** in Vercel
4. **Redeploy** (Vercel auto-deploys on env var changes)

### Available Colors:
- `purple`, `orange`, `green`, `blue`, `pink`, `amber`
- `indigo`, `rose`, `emerald`, `cyan`, `yellow`, `red`

## 👥 **How to Update Users**

### Adding a New User:
1. **Copy your current NEWSLETTER_USERS** value
2. **Add the new user** to the JSON array:
   \`\`\`json
   {
     "key":"newuser",
     "name":"New User Name", 
     "email":"newuser@example.com",
     "topics":["talent-marketing","esg"],
     "tier":"Gold"
   }
   \`\`\`
3. **Update the environment variable** in Vercel
4. **Generate links** using: `node scripts/generate-link.js newuser`

### User Properties:
- **key**: Unique identifier for generating links
- **name**: Display name in the newsletter
- **email**: User's email address
- **topics**: Array of tag slugs this user is interested in
- **tier**: "Standard" or "Gold" (affects premium content access)

## 🔧 **Easy JSON Formatting**

### Use an Online JSON Formatter:
1. Go to [jsonformatter.org](https://jsonformatter.org)
2. **Paste your JSON** in the left panel
3. **Click "Format"** to make it readable
4. **Copy the minified version** for environment variables

### Example Workflow:
1. **Start with readable JSON**:
   \`\`\`json
   [
     {
       "slug": "new-topic",
       "label": "New Topic Name",
       "color": "emerald"
     }
   ]
   \`\`\`

2. **Minify for environment variable**:
   \`\`\`json
   [{"slug":"new-topic","label":"New Topic Name","color":"emerald"}]
   \`\`\`

## 🎯 **Common Use Cases**

### **Scenario 1: Adding Industry-Specific Tags**
\`\`\`json
[
  {"slug":"healthcare","label":"Healthcare & Life Sciences","color":"green"},
  {"slug":"fintech","label":"Financial Technology","color":"blue"},
  {"slug":"manufacturing","label":"Manufacturing & Operations","color":"orange"}
]
\`\`\`

### **Scenario 2: Department-Based Tags**
\`\`\`json
[
  {"slug":"marketing","label":"Marketing & Communications","color":"pink"},
  {"slug":"sales","label":"Sales & Business Development","color":"purple"},
  {"slug":"operations","label":"Operations & Process","color":"amber"},
  {"slug":"technology","label":"Technology & Innovation","color":"indigo"}
]
\`\`\`

### **Scenario 3: Role-Based Users**
\`\`\`json
[
  {
    "key":"ceo",
    "name":"CEO",
    "email":"ceo@company.com",
    "topics":["senior","esg","finance"],
    "tier":"Gold"
  },
  {
    "key":"marketing-director",
    "name":"Marketing Director", 
    "email":"marketing@company.com",
    "topics":["marketing","social-media"],
    "tier":"Gold"
  },
  {
    "key":"manager",
    "name":"Department Manager",
    "email":"manager@company.com", 
    "topics":["operations","hr"],
    "tier":"Standard"
  }
]
\`\`\`

## ⚠️ **Important Notes**

1. **JSON must be valid** - use a validator if unsure
2. **No line breaks** in environment variables
3. **Redeploy triggers automatically** when you change env vars
4. **Test after changes** by generating new links
5. **Keep backups** of your configurations

## 🔍 **Testing Your Configuration**

### 1. Check Available Tags:
Visit your deployed app homepage to see all configured tags

### 2. Generate Test Links:
\`\`\`bash
# Test each user profile
node scripts/generate-link.js aaron https://your-app.vercel.app
node scripts/generate-link.js demo https://your-app.vercel.app
\`\`\`

### 3. Verify WordPress Integration:
Make sure your WordPress.com site has posts tagged with your configured slugs

---

**🎉 That's it!** You can now update tags and users without touching any code - just update the environment variables in Vercel!
