<?php
/*
Plugin Name: Custom Industry Taxonomy for Projects
Description: Registers the Industry taxonomy for the project post type.
Version: 1.0
Author: System
*/

function register_project_industry_taxonomy() {
    $labels = array(
        'name'              => 'Các ngành',
        'singular_name'     => 'Ngành',
        'search_items'      => 'Tìm ngành',
        'all_items'         => 'Tất cả các ngành',
        'parent_item'       => 'Ngành cha',
        'parent_item_colon' => 'Ngành cha:',
        'edit_item'         => 'Sửa ngành',
        'update_item'       => 'Cập nhật ngành',
        'add_new_item'      => 'Thêm ngành mới',
        'new_item_name'     => 'Tên ngành mới',
        'menu_name'         => 'Lĩnh vực / Ngành',
    );

    $args = array(
        'hierarchical'      => true,
        'labels'            => $labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array( 'slug' => 'industry' ),
        'show_in_rest'      => true, // Expose to Gutenberg and REST API
    );

    register_taxonomy( 'industry', array( 'projects' ), $args );
}
add_action( 'init', 'register_project_industry_taxonomy', 0 );
