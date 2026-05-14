<?php
function project_post_types() {

  $labels = array(
    'name'                  => _x( 'Dự án', 'Post Type General Name', 'xland' ),
    'singular_name'         => _x( 'Dự án', 'Post Type Singular Name', 'xland' ),
    'menu_name'             => __( 'Dự án', 'xland' ),
    'all_items'             => __( 'Tất cả dự án', 'xland' ),
    'add_new_item'          => __( 'Thêm dự án mới', 'xland' ),
    'add_new'               => __( 'Thêm mới', 'xland' ),
    'new_item'              => __( 'Dự án mới', 'xland' ),
    'edit_item'             => __( 'Sửa dự án', 'xland' ),
    'update_item'           => __( 'Cập nhật dự án', 'xland' ),
    'view_item'             => __( 'Xem dự án', 'xland' ),
    'search_items'          => __( 'Tìm dự án', 'xland' ),
    'featured_image'        => __( 'Ảnh đại diện', 'xland' ),
    'set_featured_image'    => __( 'Thiết lập ảnh đại diện', 'xland' ),
    'remove_featured_image' => __( 'Xóa ảnh đại diện', 'xland' ),
    'use_featured_image'    => __( 'Dùng làm ảnh đại diện', 'xland' ),
  );

  $args = array(
    'label'               => __( 'Dự án', 'xland' ),
    'description'         => __( 'Quản lý dự án', 'xland' ),
    'labels'              => $labels,
    'supports'            => array( 'title', 'editor', 'thumbnail', 'excerpt', 'comments', 'revisions', 'author' ),
    'taxonomies'          => array( 'project_category', 'project_tag' ),
    'hierarchical'        => false,
    'public'              => true,
    'show_ui'             => true,
    'show_in_menu'        => true,
    'menu_position'       => 5,
    'menu_icon'           => 'dashicons-portfolio',
    'show_in_admin_bar'   => true,
    'show_in_nav_menus'   => true,
    'can_export'          => true,
    'has_archive'         => true,
    'exclude_from_search' => false,
    'publicly_queryable'  => true,
    'capability_type'     => 'post',
    'show_in_rest'        => true,
  );
  register_post_type( 'projects', $args );

}
add_action( 'init', 'project_post_types', 0 );
