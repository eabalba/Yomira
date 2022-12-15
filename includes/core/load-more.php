<?php

/*
AJAX Load More Function
Called when requested by collection block to - /wp-admin/admin-ajax.php
*/

function handle_load_more()
{
  /*
    If AJAX/Fetch request contains key 'page' then
    Get the value of 'page' as a string
    With the string value, convert 'page' to an integer

    If no 'page' defined then assume 'page' is 1
	*/
  $page = isset($_POST['page']) ? intval($_POST['page']) : 1;

  /*
    If AJAX/Fetch request contains key 'tag' then
    Get the value of 'tag' as a string
  */
  if (isset($_POST['tag'])) {
    $tag = $_POST['tag'];
  }

  /*
    Get the number of posts to load from the 'Global Settings' option.
    Default to 6 if the field doesn't exist.
	*/
  $posts_per_page = get_field('load_more_count', 'option')
    ? intval(get_field('load_more_count', 'option'))
    : 9;

  header("Content-Type: text/html");

  // Offsets by 1 for the sticky post
  // and page * posts per (e.g. 3 * 9 = 27)
  $offset = 1 + $page * $posts_per_page;

  // If the page number sent to the AJAX request is 0,
  // Then it is assumed we want to load a fresh batch of items
  $hasReset = $page === 0;

  // If we have reset, then we need to load 10 posts
  // With no offset on initial load
  if ($hasReset) {
    $posts_per_page = 10;
    $offset = 0;
  }

  /*
    Create WP_Query with values sent to function, or defaults
  */
  $args = [
    'offset' => $offset,
    'orderby' => 'date',
    'order' => 'DESC',
    'paged' => $page,
    'posts_per_page' => $posts_per_page,
    'suppress_filters' => true,
    'post_status' => ['publish'],
  ];

  // If we have a tag value, use it in the WP Query
  if ($tag && $tag !== "all") {
    $args['tag'] = $tag;
  }

  $loop = new WP_Query($args);

  /*
    Loop over the items found in the query
    Use the item template to construct HTML to be sent back
	*/
  $count = 0;
  $items = '';
  if ($loop->have_posts()):
    while ($loop->have_posts()):
      $count++;
      $loop->the_post();
      $context = Timber::context();
      $context['ajax'] = true;
      $context['post'] = new Timber\Post();

      if ($hasReset && $count === 1) {
        $items .= Timber::compile('partial/item-featured.twig', $context);
      } else {
        $items .= Timber::compile('partial/item.twig', $context);
      }
    endwhile;
  endif;
  wp_reset_postdata();

  $res['args'] = $args;
  $res['items'] = $items;

  /* Encode HTML for response to AJAX/Fetch request */
  $data = json_encode($res);
  return $data;
}
