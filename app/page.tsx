import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Personalized Newsletter Demo</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience personalized content delivery using JWT-based magic links. Built with free online services:
            Vercel + Contentful + Mailchimp.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>👤 Aaron</CardTitle>
              <CardDescription>Standard Tier</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Topics: ESG & Sustainability, Diversity & Inclusion</p>
              <div className="space-y-2">
                <div className="topic-tag esg">ESG</div>
                <div className="topic-tag dei">DEI</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>👤 Sarah</CardTitle>
              <CardDescription>Gold Tier ⭐</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Topics: Social Media & Digital, Senior Leadership</p>
              <div className="space-y-2">
                <div className="topic-tag social-media">Social Media</div>
                <div className="topic-tag senior">Senior</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>👤 Executive</CardTitle>
              <CardDescription>Gold Tier ⭐</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Topics: Senior Leadership, ESG & Sustainability</p>
              <div className="space-y-2">
                <div className="topic-tag senior">Senior</div>
                <div className="topic-tag esg">ESG</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>👤 Social Manager</CardTitle>
              <CardDescription>Standard Tier</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Topics: Social Media & Digital, Diversity & Inclusion</p>
              <div className="space-y-2">
                <div className="topic-tag social-media">Social Media</div>
                <div className="topic-tag dei">DEI</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>👤 Demo User</CardTitle>
              <CardDescription>Gold Tier ⭐</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Topics: All Categories</p>
              <div className="space-y-2">
                <div className="topic-tag esg">ESG</div>
                <div className="topic-tag dei">DEI</div>
                <div className="topic-tag social-media">Social Media</div>
                <div className="topic-tag senior">Senior</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 max-w-2xl mx-auto shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">🚀 How to Generate Links</h2>
            <div className="text-left space-y-4">
              <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                <div># Generate link for Aaron (ESG + DEI)</div>
                <div>node scripts/generate-link.js aaron https://your-app.vercel.app</div>
                <br />
                <div># Generate link for Sarah (Social Media + Senior)</div>
                <div>node scripts/generate-link.js sarah https://your-app.vercel.app</div>
                <br />
                <div># Generate link for Executive (Senior + ESG)</div>
                <div>node scripts/generate-link.js executive https://your-app.vercel.app</div>
                <br />
                <div># Generate link for Social Manager (Social Media + DEI)</div>
                <div>node scripts/generate-link.js social https://your-app.vercel.app</div>
                <br />
                <div># Generate link for Demo User (All topics)</div>
                <div>node scripts/generate-link.js demo https://your-app.vercel.app</div>
              </div>
              <p className="text-sm text-gray-600">
                Replace <code>your-app.vercel.app</code> with your actual Vercel deployment URL.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-8">🛠 Built With Free Services</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">▲ Vercel</h3>
              <p className="text-gray-600 text-sm">Free hosting & serverless functions</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">📝 Contentful</h3>
              <p className="text-gray-600 text-sm">Free headless CMS for content</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">📧 Mailchimp</h3>
              <p className="text-gray-600 text-sm">Free email marketing API</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
