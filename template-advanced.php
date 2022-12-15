<?php
/**
 * Template Name: Advanced Page
 *
 * @package WordPress
 */

$context = Timber::context();

$timber_post = new Timber\Post();
$context['advanced'] = true;
$context['post'] = $timber_post;
$context['light'] = get_field("light");

$content = $timber_post->post_content;
$content = apply_filters('the_content', $content);

$headings = [];
$regex = '/<h2(?s).*?>(?s).*?<\/h2>/';

preg_match_all($regex, $content, $matches, PREG_SET_ORDER);

function parseTag($content, $tg)
{
  $dom = new DOMDocument();
  $dom->loadHTML($content);
  $attr = [];
  foreach ($dom->getElementsByTagName($tg) as $tag) {
    foreach ($tag->attributes as $attribName => $attribNodeVal) {
      $removedDataPrefix = str_replace('data-', '', $attribName);
      $attr[$removedDataPrefix] = $tag->getAttribute($attribName);
      $attr['id'] = sanitize_title($tag->textContent);
      $attr['text'] = $tag->textContent;
    }
  }
  return $attr;
}

if ($matches) {
  foreach ($matches as $val) {
    $title = $val[0];
    $titleParts = parseTag($title, 'h2');
    array_push($headings, $titleParts);
  }
}

$context['headings'] = $headings;

Timber::render(
  ['page-' . $timber_post->post_name . '.twig', 'page.twig'],
  $context
);
