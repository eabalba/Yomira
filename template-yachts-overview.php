<?php
/**
 * Template Name: Yachts Overview
 *
 * @package WordPress
 */


$context = Timber::context();
$yachtargs = array(
    'post_type'         => 'yacht',
    'posts_per_page'    => -1,
    'meta_key'			=> 'price_eur',
	'orderby'			=> 'meta_value',
	'order'				=> 'DESC'
);
/* order doesn't work becuase custom post type order plugin overrides the query */
$context['yachts'] = Timber::get_posts( $yachtargs );

$locationargs = array(
    'post_type'         => 'location',
    'posts_per_page'    => -1,
	'orderby'			=> 'title',
    'post_parent'    => 0,
);
$context['locations'] = Timber::get_posts( $locationargs );


$timber_post = new Timber\Post();
$context['overview'] = $timber_post;
$templates = ['yachts-overview.twig'];

$context['light'] = get_field("light");
Timber::render($templates, $context);