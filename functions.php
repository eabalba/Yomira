<?php
/**
 * Yomira WordPress Theme
 */

/**
 * If you are installing Timber as a Composer dependency in your theme, you'll need this block
 * to load your dependencies and initialize Timber. If you are using Timber via the WordPress.org
 * plug-in, you can safely delete this block.
 */

define("WP_ENV", false);
$composer_autoload = __DIR__ . '/vendor/autoload.php';
if (file_exists($composer_autoload)) {
  require_once $composer_autoload;
  $timber = new Timber\Timber();
}

if (!class_exists('Timber')) {
  add_action('admin_notices', function () {
    echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' .
      esc_url(admin_url('plugins.php#timber')) .
      '">' .
      esc_url(admin_url('plugins.php')) .
      '</a></p></div>';
  });

  add_filter('template_include', function ($template) {
    return get_stylesheet_directory() . '/static/no-timber.html';
  });

  return;
}

/**
 * Sets the directories (inside your theme) to find .twig files
 */
Timber::$dirname = ['components/templates', 'components'];

/**
 * By default, Timber does NOT autoescape values. Want to enable Twig's autoescape?
 * No prob! Just set this value to true
 */
Timber::$autoescape = false;

/**
 * We're going to configure our theme inside of a subclass of Timber\Site
 * You can move this to its own file and include here via php's include("MySite.php")
 */
class StarterSite extends Timber\Site
{
  /** Add timber support. */
  public function __construct()
  {
    add_action('after_setup_theme', [$this, 'theme_supports']);
    add_filter('timber/context', [$this, 'add_to_context']);
    add_filter('timber/twig', [$this, 'add_to_twig']);
    add_action('init', [$this, 'register_blocks']);
    add_action('init', [$this, 'register_post_types']);
    add_action('init', [$this, 'register_menus']);
    add_action('intermediate_image_sizes_advanced', [
      $this,
      'disable_broken_enum_images',
    ]);
    add_image_size('tiny', 10, 10, true);
    add_image_size('ratio', 300, 300, true);
    add_image_size('featured_xs', 350, 175, true);
    add_image_size('featured_sm', 450, 225, true);
    add_image_size('featured_md', 768, 384, true);
    add_image_size('featured_lg', 1300, 640, true);
    add_image_size('featured_xl', 1920, 1080, true);
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
    add_filter(
      'replace_editor',
      [$this, 'enable_gutenberg_editor_for_blog_page'],
      10,
      2
    );
    add_filter('post_thumbnail_html', [$this, 'remove_image_size_attributes']);
    add_filter('image_send_to_editor', [$this, 'remove_image_size_attributes']);
    add_filter('big_image_size_threshold', [$this, '__return_false']);
    add_filter(
      'allowed_block_types',
      [$this, 'misha_allowed_block_types'],
      10,
      2
    );
    add_action('wp_enqueue_scripts', [$this, 'loadScripts']);
    add_action('wp_enqueue_scripts', [$this, 'loadStyles']);
    add_filter('the_content', [$this, 'auto_id_headings']);
    add_filter('block_categories', [$this, 'wpdocs_new_block_category']);
    /*add_filter(
      'use_block_editor_for_post_type',
      [$this, 'disable_gutenberg_cpt'],
      10,
      2
    );*/
    add_action('enqueue_block_editor_assets', [$this, 'setup_editor_styles']);
    add_action('acf/init', [$this, 'create_acf_options_page']);
    add_action('acf/init', [$this, 'googlemap_register']);
    add_action('wp_ajax_more_collection', [$this, 'more_collection'], 0);
    add_action('wp_ajax_nopriv_more_collection', [$this, 'more_collection'], 0);
    parent::__construct();
  }

  public function register_post_types()
  {
    require_once get_stylesheet_directory() .
      '/includes/core/register-post-types.php';
  }

  function disable_gutenberg_cpt($current_status, $post_type)
  {
    if ($post_type === 'yacht') {
      return false;
    }
    return $current_status;
  }

  /**
   * Creating a new (custm) block category.
   *
   * @param   array $categories     List of block categories.
   * @return  array
   */
  public function wpdocs_new_block_category($categories)
  {
    // Plugin’s block category title and slug.
    $clientCategory = [
      'title' => esc_html__('Yomira', 'yomira'),
      'slug' => 'yomira',
    ];

    $clientAdvanced = [
      'title' => esc_html__('Yomira Advanced', 'yomira'),
      'slug' => 'yomira-advanced',
    ];

    $blockCategories = [$clientCategory, $clientAdvanced];
    $customCategories = [];

    foreach ($blockCategories as $blockCategory) {
      $category = [
        'title' => $blockCategory['title'], // Required
        'slug' => $blockCategory['slug'], // Required
        'icon' => 'block-default', // Slug of a WordPress Dashicon or custom SVG
      ];

      array_push($customCategories, $category);
    }

    $category_slugs = wp_list_pluck($categories, 'slug');
    $categories = array_merge($categories, $customCategories);

    return $categories;
  }

  public function create_acf_options_page()
  {
    if (function_exists('acf_add_options_page')) {
      acf_add_options_page([
        'page_title' => 'Global Settings',
        'menu_title' => 'Global Settings',
        'menu_slug' => 'global-settings',
        'capability' => 'edit_posts',
        'position' => '20.5',
        'redirect' => true,
        'show_in_graphql' => true,
      ]);
    }
  }

  public function slugify($string)
  {
    return sanitize_title($string);
  }

  /**
   * Automatically add IDs to headings such as <h2></h2>
   */
  public function auto_id_headings($content)
  {
    $content = preg_replace_callback(
      '/(\<h[1-6](.*?))\>(.*)(<\/h[1-6]>)/i',
      function ($matches) {
        if (!stripos($matches[0], 'id=')):
          $matches[0] =
            $matches[1] .
            $matches[2] .
            ' id="' .
            sanitize_title($matches[3]) .
            '">' .
            $matches[3] .
            $matches[4];
        endif;
        return $matches[0];
      },
      $content
    );

    return $content;
  }

  public function getContrastColor($hexColor)
  {
    // hexColor RGB
    $R1 = hexdec(substr($hexColor, 1, 2));
    $G1 = hexdec(substr($hexColor, 3, 2));
    $B1 = hexdec(substr($hexColor, 5, 2));

    // Black RGB
    $blackColor = "#222222";
    $R2BlackColor = hexdec(substr($blackColor, 1, 2));
    $G2BlackColor = hexdec(substr($blackColor, 3, 2));
    $B2BlackColor = hexdec(substr($blackColor, 5, 2));

    // Calc contrast ratio
    $L1 =
      0.2126 * pow($R1 / 255, 2.2) +
      0.7152 * pow($G1 / 255, 2.2) +
      0.0722 * pow($B1 / 255, 2.2);

    $L2 =
      0.2126 * pow($R2BlackColor / 255, 2.2) +
      0.7152 * pow($G2BlackColor / 255, 2.2) +
      0.0722 * pow($B2BlackColor / 255, 2.2);

    $contrastRatio = 0;
    if ($L1 > $L2) {
      $contrastRatio = (int) (($L1 + 0.05) / ($L2 + 0.05));
    } else {
      $contrastRatio = (int) (($L2 + 0.05) / ($L1 + 0.05));
    }

    // If contrast is more than 5, return black color
    if ($contrastRatio > 5) {
      return '#222222';
    } else {
      // if not, return white color.
      return '#FFFFFF';
    }
  }

  /**
   * My custom Twig functionality.
   *
   * @param \Twig\Environment $twig
   * @return \Twig\Environment
   */
  public function add_to_twig($twig)
  {
    // Adding a slugify string function.
    $twig->addFunction(new Timber\Twig_Function('slugify', [$this, 'slugify']));
    $twig->addFunction(
      new Timber\Twig_Function('getContrastColor', [$this, 'getContrastColor'])
    );
    return $twig;
  }

  /** This is where you add some context
   *
   * @param string $context context['this'] Being the Twig's {{ this }}.
   */
  public function add_to_context($context)
  {
    // ACF
    $context['options'] = get_fields('options');

    // Menus
    $context['menu'] = new Timber\Menu('header-primary');
    $context['footer_primary'] = new TimberMenu('footer-primary');

    // Generic
    $context['is_front_page'] = is_front_page();
   
    $posts_page_id = get_option('page_for_posts');
    $posts_page = get_post($posts_page_id);
    $posts_page_content = apply_filters(
      'the_content',
      $posts_page->post_content
    );
    $context['posts_page'] = get_permalink($posts_page_id);
    $context['posts_page_content'] = $posts_page_content;

    $context['posts_page_title'] = get_field('posts_archive_title', 'options');
    $context['posts_page_subtitle'] = get_field('posts_archive_subtitle', 'options');

    $context['site'] = $this;
    $context['env'] = WP_ENV;

    $context['accepted_tracking'] = null;

    // Cookies
    if (isset($_COOKIE['accepted-tracking'])) {
      $context['accepted_tracking'] = $_COOKIE['accepted-tracking'];
    }

    $args = [
      'orderby' => 'date',
      'order' => 'DESC',
      'posts_per_page' => 3,
      'suppress_filters' => true,
    ];

    $sticky = get_option('sticky_posts');
    if ($sticky) {
      $args['post__not_in'] = [get_option('sticky_posts')[0]];
    }

    $latest_posts = Timber::get_posts($args);
    $context['latest_posts'] = $latest_posts;

    $all_tags = get_tags([
      'hide_empty' => true,
    ]);
    $context['all_tags'] = $all_tags;

    /*
    Get a count of all posts in the query, with no limit
    on posts_per_page key.
      */
    $allPostsArgs["posts_per_page"] = 9999;
    $allPosts = get_posts($allPostsArgs);
    $count = count($allPosts);
    $context['posts_count'] = $count;

    return $context;
  }

  public function register_menus()
  {
    register_nav_menus([
      'header-primary' => 'Header Primary Menu',
      'footer-primary' => 'Footer Primary Menu',
    ]);
  }

  public function loadScripts()
  {
    $env = WP_ENV;
    $isDev = $env === "development" || $env === "staging";

    wp_enqueue_script(
      'slick',
      get_template_directory_uri() . '/dist/js/lib/slick.min.js',
      ['jquery'],
      $isDev ? time() : '1.8.1',
      true
    );
    wp_enqueue_script(
      'vanilla-lazyload',
      get_template_directory_uri() . '/dist/js/lib/vanilla-lazyload.min.js',
      ['jquery'],
      $isDev ? time() : '17.3.0',
      true
    );
    wp_enqueue_script(
      'main-script',
      get_template_directory_uri() . '/dist/js/index.js',
      ['vanilla-lazyload', 'slick', 'custom-select'],
      $isDev ? time() : '1.0.0',
      true
    );

    wp_enqueue_script(
      'new-script',
      get_template_directory_uri() . '/dist/js/bamboonine.js',
      ['slick'],
      $isDev ? time() : '1.0.0',
      true
    );
    wp_enqueue_script(
      'custom-select',
      get_template_directory_uri() . '/dist/js/lib/custom-select.min.js',
      [],
      $isDev ? time() : '1.1.16',
      true
    );

    wp_localize_script('main-script', 'ajax_posts', [
      'ajaxurl' => admin_url('admin-ajax.php'),
      'noposts' => __('No older items found', 'organic'),
    ]);
  }

  public function loadStyles()
  {
    $env = WP_ENV;
    $isDev = $env === "development" || $env === "staging";

    wp_enqueue_style(
      'main-stylesheet',
      get_template_directory_uri() . '/dist/css/index.min.css',
      true ? time() : null
    );
    wp_enqueue_style(
      'new-stylesheet',
      get_template_directory_uri() . '/dist/css/bamboonine.css',
      true ? time() : null
    );
  }

  public function setup_editor_styles()
  {
    wp_enqueue_style(
      'main-stylesheet',
      get_template_directory_uri() . '/dist/css/editor.css'
    );
  }

  public function render_block($block, $content = '', $is_preview = false)
  {
    require_once get_stylesheet_directory() . '/includes/blocks/render.php';
    $context = block_context($block);

    $name = strtolower($context["block"]["title"]);
    $path = 'blocks/' . $name . '.twig';

    if ( $is_preview ) {
       echo '<img src="' .get_template_directory_uri() . '/assets/images/preview/' . $name . '.png">';
      return;
  }


    $isContact = $name === 'contact';
    $replace = ($is_preview && !$context['fields']) || $isContact;

    if ($replace) {
      $context["fields"] = $context["block"]["data"];
    }
    


    $context["preview"] = $is_preview;

    Timber::render($path, $context);
  }

  public function register_blocks()
  {
    if (function_exists('acf_register_block')) {
      /*
       * Create array of custom ACF guteneberg blocks
       * Key: Name of the block in slug form (lowercase & hyphentated)
       * Value: Dashicon icon assigned for editor
       */
      $customBlocks = [
        'button' => 'button',
        'carousel' => 'align-pull-left',
        'collapsible' => 'feedback',
        'columns' => 'columns',
        //'contact' => 'phone',
        'hero' => 'align-full-width',
        'gallery' => 'images-alt2',
        'panels' => 'screenoptions',
        'posts' => 'admin-post',
        'quote' => 'format-quote',
        'title' => 'heading',
        'yacht-overview' => 'id',
        'key-features' => 'star-filled',
        'insight' => 'format-quote',
        'media-text' => 'chart-bar',
        'media-heading-text' => 'chart-bar',
        'text-cols' => 'columns',
        'food-menu' => 'carrot',
        'crew' => 'admin-users',
        'panel-banner-with-cards' => 'table-row-before',
        'image-carousel' => 'images-alt',
        'image-text-tabs' => 'index-card',
        'related-locations-map' => 'admin-site-alt',
        'destinations' => 'admin-site-alt2',
        'yacht-links' => 'palmtree',
      ];

      foreach ($customBlocks as $b => $v) {
        $mode = "edit";
       

        $settings = [
          'name' => $b,
          'title' => ucfirst($b),
          'description' => 'A custom ' . $b . ' block.',
          'render_callback' => [$this, 'render_block'],
          'category' => 'yomira',
          'mode' => $mode,
          'icon' => $v,
          'supports' => [
            'align' => ['wide', 'full'],
            'jsx' => true,
          ],
          'example'           => [
            'attributes'  => [
              'mode'  => 'preview',
              'data' => array(
                'preview_image_help' => get_template_directory_uri() . '/assets/images/preview/' . $b . '.png',
              )
            ]
          ],
        ];

        // Register a new block.
        acf_register_block_type($settings);
      }

      /*
       * Create array of custom ACF guteneberg blocks
       * Key: Name of the block in slug form (lowercase & hyphentated)
       * Value: Dashicon icon assigned for editor
       */
      $advancedBlocks = [
        'advanced-banner' => 'format-image',
        'advanced-columns' => 'columns',
        'advanced-heading' => 'heading',
        'advanced-gallery' => 'images-alt',
        'advanced-quote' => 'format-status',
      ];

      foreach ($advancedBlocks as $b => $v) {
        $mode = "auto";

        $settings = [
          'name' => $b,
          'title' => ucfirst($b),
          'description' => 'A custom ' . $b . ' block.',
          'render_callback' => [$this, 'render_block'],
          'category' => 'yomira-advanced',
          'mode' => $mode,
          'icon' => $v,
          'supports' => [
            'align' => ['wide', 'full'],
            'jsx' => true,
          ],
        ];

        // Register a new block.
        acf_register_block_type($settings);
      }
    }
  }

  /**
   * Simulate non-empty content to enable Gutenberg editor
   *
   * @param bool    $replace Whether to replace the editor.
   * @param WP_Post $post    Post object.
   * @return bool
   */
  public function enable_gutenberg_editor_for_blog_page($replace, $post)
  {
    if (
      !$replace &&
      absint(get_option('page_for_posts')) === $post->ID &&
      empty($post->post_content)
    ) {
      // This comment will be removed by Gutenberg since it won't parse into block.
      $post->post_content = '<!--non-empty-content-->';
    }

    return $replace;
  }

  public function theme_supports()
  {
    if (function_exists('acf_add_options_page')) {
      acf_add_options_page([
        'page_title' => 'Global Settings',
        'menu_title' => 'Global Settings',
        'menu_slug' => 'global-settings',
        'capability' => 'edit_posts',
      ]);

      acf_add_options_page([
        'page_title' => '404 Page',
        'menu_title' => '404 Page',
        'menu_slug' => 'notfound-settings',
        'capability' => 'edit_posts',
      ]);
    }

    add_theme_support('automatic-feed-links');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['gallery']);
    add_theme_support('post-formats', [
      'aside',
      'image',
      'video',
      'link',
      'gallery',
    ]);
    add_theme_support('menus');

    add_theme_support('align-wide');
    add_theme_support('disable-custom-colors');
    add_theme_support('disable-custom-font-sizes');
  }

  public function misha_allowed_block_types($allowed_blocks, $post)
  {
    $advancedArray = [];
    $blockArray = [];

    $coreArray = [
      'core/block',
      'core/heading',
      'core/image',
      'core/list',
      'core/paragraph',
      'core/table',
      'core/video',
      'core-embed/vimeo',
      'core-embed/youtube',
      'leadin/leadin-forms',
    ];

    $advancedBlocks = [
      'advanced-banner',
      'advanced-columns',
      'advanced-heading',
      'advanced-gallery',
      'advanced-quote',
    ];

    $customBlocks = [
      'button',
      'carousel',
      'collapsible',
      'columns',
      //'contact',
      'gallery',
      'hero',
      'panels',
      'posts',
      'quote',
      'row',
      'timeline',
      'title',
      'yacht-overview',
      'key-features',
      'insight',
      'media-text',
      'media-heading-text',
      'text-cols',
      'food-menu',
      'crew',
      'panel-banner-with-cards',
      'image-carousel',
      'image-text-tabs',
      'related-locations-map',
      'destinations',
      'yacht-links'
    ];

    // Add ACF blocks to arrays
    foreach ($advancedBlocks as $v) {
      array_push($advancedArray, 'acf/' . $v);
    }

    // Add ACF blocks to arrays
    foreach ($customBlocks as $v) {
      array_push($blockArray, 'acf/' . $v);
    }

    // Merge core blocks into valid blocks
    $advancedArray = array_merge($advancedArray, $coreArray);
    $blockArray = array_merge($blockArray, $coreArray);

    // Return default blocks to any post type that isn't a page
    if ($post->post_type != 'page') {
      return $blockArray;
    }

    // Limit blocks in 'page' post type
    if ($post->post_type == 'page') {
      $template = get_post_meta($post->ID, '_wp_page_template', true);
      $isAdvanced = $template === "template-advanced.php";
      $isLegal = $template === "template-legal.php";

      // Return default blocks
      if ($isLegal) {
        return $blockArray;
      }

      // Return advanced blocks
      if ($isAdvanced) {
        return $advancedArray;
      }

      // Return default blocks
      return $blockArray;
    }
  }

  public function remove_image_size_attributes($html)
  {
    return preg_replace('/(width|height)="\d*"/', '', $html);
  }

  public function googlemap_register()
  {
    acf_update_setting('google_api_key', getenv('GOOGLE_API_KEY'));
  }

  public function more_collection()
  {
    require_once get_stylesheet_directory() . '/includes/core/load-more.php';
    $data = handle_load_more();
    die($data);
  }
}

new StarterSite();

// Disable theme and plugin editor	
define( 'DISALLOW_FILE_EDIT', true );

/* ----- Add reusable blocks to dash ----- */
function be_reusable_blocks_admin_menu()
{
    add_menu_page('Reusable Blocks', 'Reusable Blocks', 'edit_posts', 'edit.php?post_type=wp_block', '', 'dashicons-editor-table', 22);
}
add_action('admin_menu', 'be_reusable_blocks_admin_menu');
