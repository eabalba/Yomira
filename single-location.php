<?php
/**
 * The Template for displaying all locations
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$context = Timber::context();
$timber_post = Timber::query_post();
$context['post'] = $timber_post;
$post = $timber_post;

$parentID = $post->post_parent;
if($parentID){
    $yachtsFeed = $parentID;
} else{
    $yachtsFeed = $post->ID;
}

$yachtargs = array(
    'post_type' => 'yacht',
    'posts_per_page'    => -1,
    'meta_query' => array(
        'relation'      => 'OR',
        array(
            'key' => 'summer_location', 
            'value' => '"' . $post->ID . '"',
            'compare' => 'LIKE'
        ),
        array(
            'key' => 'winter_location', 
            'value' => '"' . $post->ID . '"',
            'compare' => 'LIKE'
        )
    )
);
$context['yachts'] = Timber::get_posts( $yachtargs );
$context['light'] = get_field("light");


Timber::render(['single-location.twig'], $context);

