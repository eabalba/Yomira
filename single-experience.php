<?php
/**
 * The Template for displaying all single posts
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
$ID = $post->ID;

$context['light'] = get_field("light");

Timber::render(['page.twig'], $context);
