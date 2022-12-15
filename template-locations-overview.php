<?php
/**
 * Template Name: Locations Overview
 *
 * @package WordPress
 */


$context = Timber::context();

$locationargs = array(
    'post_type'         => 'location',
    'posts_per_page'    => -1,
	'orderby'			=> 'menu_order',
    'post_parent'    => 0,
);
$context['locations'] = Timber::get_posts( $locationargs );


$timber_post = new Timber\Post();
$context['overview'] = $timber_post;
$templates = ['locations-overview.twig'];

$context['light'] = get_field("light");
Timber::render($templates, $context);