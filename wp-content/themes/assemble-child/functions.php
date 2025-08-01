<?php
/**
 * Assemble Child Theme Functions
 */

// Enqueue parent theme styles
function assemble_child_enqueue_styles() {
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('child-style', get_stylesheet_directory_uri() . '/style.css', array('parent-style'));
}
add_action('wp_enqueue_scripts', 'assemble_child_enqueue_styles');

// Include JWT functions
require_once get_stylesheet_directory() . '/functions-jwt.php';

// Add custom post meta for newsletter tracking
function newsletter_add_meta_boxes() {
    add_meta_box(
        'newsletter-tags',
        'Newsletter Tags',
        'newsletter_tags_callback',
        'post',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'newsletter_add_meta_boxes');

function newsletter_tags_callback($post) {
    $tags = get_the_tags($post->ID);
    echo '<p>Current tags: ';
    if ($tags) {
        foreach ($tags as $tag) {
            echo '<span class="story-tag ' . esc_attr($tag->slug) . '">' . esc_html($tag->name) . '</span> ';
        }
    } else {
        echo 'No tags assigned';
    }
    echo '</p>';
    echo '<p><em>Use tags: esg, dei, exb for newsletter filtering</em></p>';
}

// Custom query for newsletter content
function get_newsletter_posts($topics) {
    $posts_by_topic = array();
    
    foreach ($topics as $topic) {
        $query = new WP_Query(array(
            'tag' => $topic,
            'post_status' => 'publish',
            'posts_per_page' => 5,
            'orderby' => 'date',
            'order' => 'DESC'
        ));
        
        if ($query->have_posts()) {
            $posts_by_topic[$topic] = $query->posts;
        }
        
        wp_reset_postdata();
    }
    
    return $posts_by_topic;
}

// Log newsletter views (simple logging)
function log_newsletter_view($user_data, $topics_shown) {
    error_log("Newsletter view - User: " . $user_data['first_name'] . ", Topics: " . implode(',', $topics_shown));
}
