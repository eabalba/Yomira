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

$background = get_the_post_thumbnail_url($ID, 'featured_xl');
$fold['author'] = $post->author->name;
$fold['background'] = $background;
$fold['date'] = $post->date;
$fold['light'] = true;
$fold['title'] = $post->title;
$context['fold'] = $fold;

$context['fields'] = get_fields($ID);
$primary_cat_id = get_post_meta($ID, '_yoast_wpseo_primary_category', true);
if ($primary_cat_id) {
  $product_cat = get_term($primary_cat_id, 'category');
  if (isset($product_cat->name)) {
    $context['category'] = $product_cat->name;
  }
}

$meta = get_post_meta($ID, '_yoast_wpseo_metadesc', true);
$context['meta_description'] = $meta;

if (post_password_required($timber_post->ID)) {
  Timber::render('single-password.twig', $context);
} else {
  Timber::render(
    [
      'single-' . $ID . '.twig',
      'single-' . $timber_post->post_type . '.twig',
      'single-' . $timber_post->slug . '.twig',
      'single.twig',
    ],
    $context
  );
}
