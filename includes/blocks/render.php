<?php

function block_context($block, $content = '', $is_preview = false)
{
  /*
    Initialise Timber context access, getting info for current block
  */
  $context = Timber::context();

  /*
    Store block object values, accessible in render templates
  */
  $context['block'] = $block;

  /*
    Use ACF function get_fields() to retrieve field values for block
    Then store the field values in the context object for template access
  */
  $fields = get_fields();
  $context['fields'] = $fields;

  /*
    Store is_preview boolean in context, allows for conditional rendering
    based on if the block is being rendered on the front-end or in Gutenberg
  */
  $context['is_preview'] = $is_preview;

  /*
    Lowercase the block title to access a name value
    This value is used to conditionally access block functions
  */
  $name = strtolower($block["title"]);

  // Create id attribute allowing for custom "anchor" value.
  $id = $name . '-' . $block['id'];
  if (!empty($block['anchor'])) {
    $id = $block['anchor'];
  }

  $context['id'] = $id;

  // Create class attribute allowing for custom "className" and "align" values.
  $className = $name;
  $className .= ' ' . 'block--' . $name;
  if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
  }
  if (!empty($block['align'])) {
    $className .= ' align--' . $block['align'];
  }
  if ($is_preview) {
    $className .= ' ' . "block--preview";
  }

  if (isset($fields['is_light']) && $fields['is_light'] !== false) {
    $className .= ' ' . "section--light";
  }

  $context['className'] = $className;

  return $context;
}
