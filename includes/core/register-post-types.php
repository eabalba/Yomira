<?php

/** This is where you can register custom post types. */

$post_types = [
  [
    'public' => true,
    'menu_icon' => 'dashicons-palmtree',
    'plural_name' => "Experiences",
    'singular_name' => "Experience",
  ],
  [
    //'public' => false,
    'menu_icon' =>
      'data:image/svg+xml;base64,' .
      base64_encode(
        '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="anchor" class="svg-inline--fa fa-anchor fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M12.971 352h32.394C67.172 454.735 181.944 512 288 512c106.229 0 220.853-57.38 242.635-160h32.394c10.691 0 16.045-12.926 8.485-20.485l-67.029-67.029c-4.686-4.686-12.284-4.686-16.971 0l-67.029 67.029c-7.56 7.56-2.206 20.485 8.485 20.485h35.146c-20.29 54.317-84.963 86.588-144.117 94.015V256h52c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-52v-5.47c37.281-13.178 63.995-48.725 64-90.518C384.005 43.772 341.605.738 289.37.01 235.723-.739 192 42.525 192 96c0 41.798 26.716 77.35 64 90.53V192h-52c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h52v190.015c-58.936-7.399-123.82-39.679-144.117-94.015h35.146c10.691 0 16.045-12.926 8.485-20.485l-67.029-67.029c-4.686-4.686-12.284-4.686-16.971 0L4.485 331.515C-3.074 339.074 2.28 352 12.971 352zM288 64c17.645 0 32 14.355 32 32s-14.355 32-32 32-32-14.355-32-32 14.355-32 32-32z"></path></svg>'
      ),
    'plural_name' => "Yachts",
    'singular_name' => "Yacht",
  ],
  [
    'public' => true,
    'menu_icon' => 'dashicons-location-alt',
    'plural_name' => "Locations",
    'singular_name' => "Location",
  ]
];

foreach ($post_types as $post_type) {
  $labels = [
    'name' => _x($post_type['plural_name'], 'Post type general name', 'yomira'),
    'singular_name' => _x(
      $post_type['singular_name'],
      'Post type singular name',
      'yomira'
    ),
    'menu_name' => _x($post_type['plural_name'], 'Admin Menu text', 'yomira'),
    'name_admin_bar' => _x(
      $post_type['singular_name'],
      'Add New on Toolbar',
      'yomira'
    ),
    'add_new' => __('Add New', 'yomira'),
    'add_new_item' => __('Add New ' . $post_type['singular_name'], 'yomira'),
    'new_item' => __('New ' . $post_type['singular_name'], 'yomira'),
    'edit_item' => __('Edit ' . $post_type['singular_name'], 'yomira'),
    'view_item' => __('View ' . $post_type['singular_name'], 'yomira'),
    'all_items' => __('All ' . $post_type['plural_name'], 'yomira'),
    'search_items' => __('Search ' . $post_type['plural_name'], 'yomira'),
    'parent_item_colon' => __(
      'Parent  ' . $post_type['singular_name'] . ':',
      'yomira'
    ),
    'not_found' => __('No ' . $post_type['plural_name'] . ' found.', 'yomira'),
    'not_found_in_trash' => __(
      'No ' . $post_type['plural_name'] . ' found in Trash.',
      'yomira'
    ),
    'featured_image' => _x(
      $post_type['singular_name'] . ' Cover Image',
      'Overrides the “Featured Image” phrase for this post type. Added in 4.3',
      'yomira'
    ),
    'set_featured_image' => _x(
      'Set cover image',
      'Overrides the “Set featured image” phrase for this post type. Added in 4.3',
      'yomira'
    ),
    'remove_featured_image' => _x(
      'Remove cover image',
      'Overrides the “Remove featured image” phrase for this post type. Added in 4.3',
      'yomira'
    ),
    'use_featured_image' => _x(
      'Use as cover image',
      'Overrides the “Use as featured image” phrase for this post type. Added in 4.3',
      'yomira'
    ),
    'archives' => _x(
      $post_type['singular_name'] . ' archives',
      'The post type archive label used in nav menus. Default “Post Archives”. Added in 4.4',
      'yomira'
    ),
    'insert_into_item' => _x(
      'Insert into ' . $post_type['singular_name'],
      'Overrides the “Insert into post”/”Insert into page” phrase (used when inserting media into a post). Added in 4.4',
      'yomira'
    ),
    'uploaded_to_this_item' => _x(
      'Uploaded to this ' . $post_type['singular_name'],
      'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase (used when viewing media attached to a post). Added in 4.4',
      'yomira'
    ),
    'filter_items_list' => _x(
      'Filter ' . $post_type['plural_name'] . ' list',
      'Screen reader text for the filter links heading on the post type listing screen. Default “Filter posts list”/”Filter pages list”. Added in 4.4',
      'yomira'
    ),
    'items_list_navigation' => _x(
      $post_type['plural_name'] . ' list navigation',
      'Screen reader text for the pagination heading on the post type listing screen. Default “Posts list navigation”/”Pages list navigation”. Added in 4.4',
      'yomira'
    ),
    'items_list' => _x(
      $post_type['plural_name'] . ' list',
      'Screen reader text for the items list heading on the post type listing screen. Default “Posts list”/”Pages list”. Added in 4.4',
      'yomira'
    ),
  ];

  $args = [
    'publicly_queryable' => $post_type['public'],
    'show_in_nav_menus' => $post_type['public'],
    'exclude_from_search' => !$post_type['public'],
    'public' => true,
    'show_ui' => true,
    'show_in_menu' => true,
    'query_var' => true,
    'capability_type' => 'post',
    'has_archive' => false,
    'hierarchical' => true,
    'menu_position' => null,
    'show_in_rest' => true,
    'supports' => ['title', 'editor', 'thumbnail', 'video', 'page-attributes'],
    'show_in_graphql' => true,
    'graphql_single_name' => $post_type['singular_name'],
    'graphql_plural_name' => $post_type['plural_name'],
  ];

  $args['menu_icon'] = $post_type['menu_icon'];
  $args['labels'] = $labels;
  $args['rewrite'] = [
    'slug' => strtolower($post_type['singular_name']),
    'with_front' => false,
  ];
  register_post_type($post_type['singular_name'], $args);
}
