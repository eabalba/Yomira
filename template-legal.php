<?php
/**
 * Template Name: Legal Post
 *
 * @package WordPress
 */

$context = Timber::context();

$timber_post = new Timber\Post();
$context['post'] = $timber_post;
$context['legal'] = true;
Timber::render(['page.twig'], $context);
