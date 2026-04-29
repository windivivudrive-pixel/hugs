<?php
// Custom endpoint to export Projects with all Hugs Agency metadata for Next.js

// Initialize WordPress environment safely
define('WP_USE_THEMES', false);
require_once(dirname(__FILE__) . '/wp-load.php');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

global $wpdb;

$query = "
    SELECT p.ID as id, p.post_title as title, p.post_name as slug, p.post_content as content, p.post_excerpt as excerpt, p.post_date as created_at,
           MAX(CASE WHEN pm.meta_key = '_thumbnail_url' THEN pm.meta_value END) as thumbnail,
           MAX(CASE WHEN pm.meta_key = '_hugs_featured' THEN pm.meta_value END) as featured,
           MAX(CASE WHEN pm.meta_key = '_hugs_service_id' THEN pm.meta_value END) as service_id,
           MAX(CASE WHEN pm.meta_key = '_hugs_display_order' THEN pm.meta_value END) as display_order,
           MAX(CASE WHEN pm.meta_key = '_hugs_logo' THEN pm.meta_value END) as logo
    FROM {$wpdb->posts} p
    LEFT JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id
    WHERE p.post_type = 'project' AND p.post_status = 'publish'
    GROUP BY p.ID
    ORDER BY CAST(MAX(CASE WHEN pm.meta_key = '_hugs_display_order' THEN pm.meta_value END) AS UNSIGNED) ASC, p.post_date DESC
    LIMIT 200
";

$results = $wpdb->get_results($query, ARRAY_A);

$data = array();
$seen_titles = array();

if ($results && is_array($results)) {
    foreach ($results as $row) {
        // Simple deduplication by title to avoid visual duplicates from WP copies
        $clean_title = trim($row['title']);
        if (in_array($clean_title, $seen_titles)) {
            continue;
        }
        $seen_titles[] = $clean_title;

        // Find categories
        $categories = wp_get_post_terms($row['id'], 'project_category', array('fields' => 'ids'));
        
        // Find industries
        $industries = wp_get_post_terms($row['id'], 'industry', array('fields' => 'ids'));
        
        $data[] = array(
            'id' => (int)$row['id'],
            'title' => $row['title'], // keep original for display
            'slug' => $row['slug'],
            'content' => $row['content'],
            'excerpt' => $row['excerpt'],
            'created_at' => $row['created_at'],
            'thumbnail' => $row['thumbnail'],
            'featured' => ($row['featured'] === '1' || $row['featured'] === 1 || strtolower($row['featured']) === 'true'),
            'service_id' => $row['service_id'] ? (int)$row['service_id'] : null,
            'display_order' => $row['display_order'] ? (int)$row['display_order'] : 999,
            'logo' => $row['logo'],
            'project_category_ids' => $categories && !is_wp_error($categories) ? $categories : array(),
            'project_industry_ids' => $industries && !is_wp_error($industries) ? $industries : array(),
            'service' => $row['service_id'] ? array('id' => (int)$row['service_id']) : null
        );
    }
}

echo json_encode($data);
exit;
