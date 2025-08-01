<?php
/**
 * Newsletter Report Template
 * Custom template for personalized newsletter content
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

get_header();

// Get JWT token from URL parameter
$token = isset($_GET['t']) ? sanitize_text_field($_GET['t']) : '';

// Decode JWT
$user_data = decode_newsletter_jwt($token);

if (!$user_data) {
    // Show error message
    $error_message = get_jwt_error_message($token);
    ?>
    <!DOCTYPE html>
    <html <?php language_attributes(); ?>>
    <head>
        <meta charset="<?php bloginfo('charset'); ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="noindex, nofollow">
        <title>Newsletter Access Error - <?php bloginfo('name'); ?></title>
        <?php wp_head(); ?>
    </head>
    <body <?php body_class(); ?>>
        <div class="newsletter-container">
            <div class="error-message">
                <h2>Access Error</h2>
                <p><?php echo esc_html($error_message); ?></p>
                <p><a href="<?php echo home_url(); ?>">Return to homepage</a></p>
            </div>
        </div>
        <?php wp_footer(); ?>
    </body>
    </html>
    <?php
    exit;
}

// Extract user data
$first_name = isset($user_data['first_name']) ? $user_data['first_name'] : 'Subscriber';
$topics = isset($user_data['topics']) ? $user_data['topics'] : array();
$tier = isset($user_data['tier']) ? $user_data['tier'] : 'Standard';

// Get posts for user's topics
$posts_by_topic = get_newsletter_posts($topics);

// Log the view
log_newsletter_view($user_data, array_keys($posts_by_topic));
?>

<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Your Personalized Newsletter - <?php bloginfo('name'); ?></title>
    <?php wp_head(); ?>
</head>

<body <?php body_class('newsletter-page'); ?>>

<div class="newsletter-container">
    <!-- Header Section -->
    <header class="newsletter-header">
        <h1 class="newsletter-greeting">
            Welcome back, <?php echo esc_html($first_name); ?>! 👋
        </h1>
        <p class="newsletter-topics">
            Your personalized content for: 
            <?php 
            $topic_labels = array(
                'esg' => 'ESG & Sustainability',
                'dei' => 'Diversity & Inclusion', 
                'exb' => 'Executive Business'
            );
            
            $formatted_topics = array();
            foreach ($topics as $topic) {
                $formatted_topics[] = isset($topic_labels[$topic]) ? $topic_labels[$topic] : ucfirst($topic);
            }
            echo esc_html(implode(' • ', $formatted_topics));
            ?>
        </p>
    </header>

    <!-- Premium Block for Gold tier users -->
    <?php if ($tier === 'Gold'): ?>
    <div class="premium-block">
        <div class="premium-badge">🌟 GOLD MEMBER</div>
        <h3>Exclusive Premium Content</h3>
        <p>As a Gold member, you have access to exclusive insights, detailed analytics, and premium research reports.</p>
    </div>
    <?php endif; ?>

    <!-- Content Sections by Topic -->
    <?php foreach ($posts_by_topic as $topic => $posts): ?>
        <section class="topic-section">
            <h2 class="topic-heading">
                <span class="story-tag <?php echo esc_attr($topic); ?>">
                    <?php echo esc_html(isset($topic_labels[$topic]) ? $topic_labels[$topic] : ucfirst($topic)); ?>
                </span>
            </h2>
            
            <div class="story-grid">
                <?php foreach ($posts as $post): ?>
                    <article class="story-card">
                        <h3><?php echo esc_html($post->post_title); ?></h3>
                        <div class="story-excerpt">
                            <?php 
                            echo wp_trim_words($post->post_content, 30, '...');
                            ?>
                        </div>
                        
                        <!-- Check for shortcodes in content -->
                        <?php 
                        $content = $post->post_content;
                        
                        // Look for Visualizer charts
                        if (strpos($content, '[visualizer') !== false) {
                            echo '<div class="chart-container">';
                            echo '<h4>📊 Data Visualization</h4>';
                            // In a real implementation, you'd process the shortcode
                            echo '<p><em>Chart would be rendered here via Visualizer plugin</em></p>';
                            echo '<div style="height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; border-radius: 4px;">Sample Chart Placeholder</div>';
                            echo '</div>';
                        }
                        
                        // Look for WPForms polls
                        if (strpos($content, '[wpforms') !== false) {
                            echo '<div class="poll-container">';
                            echo '<h4>📋 Quick Poll</h4>';
                            echo '<p><em>Poll would be rendered here via WPForms plugin</em></p>';
                            echo '<div style="padding: 1rem; background: white; border-radius: 4px; border: 1px solid #ddd;">';
                            echo '<p><strong>Sample Poll Question:</strong> How important is this topic to your organization?</p>';
                            echo '<label><input type="radio" name="sample" disabled> Very Important</label><br>';
                            echo '<label><input type="radio" name="sample" disabled> Somewhat Important</label><br>';
                            echo '<label><input type="radio" name="sample" disabled> Not Important</label>';
                            echo '</div>';
                            echo '</div>';
                        }
                        ?>
                        
                        <div class="story-meta">
                            <small>Published: <?php echo date('M j, Y', strtotime($post->post_date)); ?></small>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>
        </section>
    <?php endforeach; ?>

    <!-- Footer -->
    <footer style="margin-top: 3rem; padding: 2rem; background: #f8f9fa; text-align: center; border-radius: 8px;">
        <p><strong>This is your personalized newsletter view</strong></p>
        <p><small>Generated for <?php echo esc_html($first_name); ?> • Topics: <?php echo esc_html(implode(', ', $topics)); ?> • Tier: <?php echo esc_html($tier); ?></small></p>
        <p><small>This link expires on <?php echo date('M j, Y g:i A', $user_data['exp']); ?></small></p>
    </footer>
</div>

<!-- Simple analytics logging -->
<script>
console.log('Newsletter View Analytics:', {
    user: '<?php echo esc_js($first_name); ?>',
    topics: <?php echo json_encode($topics); ?>,
    tier: '<?php echo esc_js($tier); ?>',
    stories_shown: <?php echo count($posts_by_topic); ?>,
    timestamp: new Date().toISOString()
});

// Track which stories are visible
document.addEventListener('DOMContentLoaded', function() {
    const storyCards = document.querySelectorAll('.story-card');
    console.log(`Displaying ${storyCards.length} personalized stories`);
    
    // Simple scroll tracking
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const title = entry.target.querySelector('h3').textContent;
                console.log('Story viewed:', title);
            }
        });
    });
    
    storyCards.forEach(card => observer.observe(card));
});
</script>

<?php wp_footer(); ?>
</body>
</html>
