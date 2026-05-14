<?php
/*
Plugin Name: Custom Meta Boxes for Projects
Description: Adds custom fields for Logo and Thumbnail URL to the projects post type.
Version: 1.0
Author: System
*/

function hugs_add_project_meta_boxes() {
    // Logo Meta Box (Right sidebar)
    add_meta_box(
        'hugs_logo_meta',      
        'Logo Khách Hàng', 
        'hugs_logo_meta_html', 
        'projects',               
        'side',                 
        'default'                    
    );
}
add_action('add_meta_boxes', 'hugs_add_project_meta_boxes');

function hugs_thumbnail_after_title($post) {
    if ($post->post_type !== 'projects') return;
    ?>
    <div class="hugs-custom-container" style="margin: 20px 0; background: #fff; border: 1px solid #ccd0d4; box-shadow: 0 1px 1px rgba(0,0,0,.04);">
        <div style="padding: 10px 15px; border-bottom: 1px solid #eee; background: #f9f9f9;">
            <strong style="font-size: 14px;">Ảnh Thumbnail (Hiển thị ở danh sách dự án)</strong>
        </div>
        <div style="padding: 15px;">
            <?php hugs_thumbnail_meta_html($post); ?>
        </div>
    </div>
    <?php
}
add_action('edit_form_after_title', 'hugs_thumbnail_after_title');

// Common styles & scripts
function hugs_project_meta_assets() {
    global $post;
    if (!$post || $post->post_type !== 'projects') return;
    ?>
    <style>
        .hugs-meta-box { padding: 5px; }
        .hugs-meta-box label { display: block; font-weight: bold; margin-bottom: 8px; font-size: 13px; }
        .hugs-meta-box input[type="text"] { width: 100%; padding: 5px; margin-bottom: 10px; }
        .hugs-meta-box button { width: 100%; text-align: center; }
        .hugs-image-preview { max-width: 100%; height: auto; display: block; margin-top: 15px; border: 1px dashed #ccc; padding: 5px; background: #fff; border-radius: 4px; }
    </style>
    <script>
    jQuery(document).ready(function($){
        var custom_uploader;
        $('.hugs-upload-btn').click(function(e) {
            e.preventDefault();
            var target_input_id = $(this).data('target');
            
            if (custom_uploader) {
                custom_uploader.open();
                custom_uploader.target_input = target_input_id;
                return;
            }

            custom_uploader = wp.media.frames.file_frame = wp.media({
                title: 'Chọn hình ảnh',
                button: { text: 'Sử dụng ảnh này' },
                multiple: false
            });

            custom_uploader.target_input = target_input_id;

            custom_uploader.on('select', function() {
                var attachment = custom_uploader.state().get('selection').first().toJSON();
                $('#' + custom_uploader.target_input).val(attachment.url);
                $('#preview_' + custom_uploader.target_input).attr('src', attachment.url).show();
            });

            custom_uploader.open();
        });
        
        $('#hugs_thumbnail_url, #hugs_logo').on('change input', function() {
            var val = $(this).val();
            var target = $(this).attr('id');
            if(val) {
                $('#preview_' + target).attr('src', val).show();
            } else {
                $('#preview_' + target).hide();
            }
        });
    });
    </script>
    <?php
}
add_action('admin_head', 'hugs_project_meta_assets');

// Thumbnail HTML
function hugs_thumbnail_meta_html($post) {
    wp_nonce_field('_hugs_project_meta_nonce', 'hugs_project_meta_nonce');
    $thumbnail_url = get_post_meta($post->ID, '_thumbnail_url', true);
    ?>
    <div class="hugs-meta-box">
        <input type="text" id="hugs_thumbnail_url" name="hugs_thumbnail_url" value="<?php echo esc_attr($thumbnail_url); ?>" placeholder="https://..." />
        <button type="button" class="button button-primary hugs-upload-btn" data-target="hugs_thumbnail_url">Tải lên / Chọn từ thư viện</button>
        <?php if ($thumbnail_url) : ?>
            <img src="<?php echo esc_url($thumbnail_url); ?>" class="hugs-image-preview" id="preview_hugs_thumbnail_url" />
        <?php else: ?>
            <img src="" class="hugs-image-preview" id="preview_hugs_thumbnail_url" style="display:none;" />
        <?php endif; ?>
        <p class="description" style="margin-top: 10px;">Bạn có thể dán link trực tiếp vào ô trống hoặc ấn nút tải lên.</p>
    </div>
    <?php
}

// Logo HTML
function hugs_logo_meta_html($post) {
    $logo = get_post_meta($post->ID, '_hugs_logo', true);
    ?>
    <div class="hugs-meta-box">
        <input type="text" id="hugs_logo" name="hugs_logo" value="<?php echo esc_attr($logo); ?>" placeholder="https://..." />
        <button type="button" class="button hugs-upload-btn" data-target="hugs_logo">Tải lên / Chọn từ thư viện</button>
        <?php if ($logo) : ?>
            <img src="<?php echo esc_url($logo); ?>" class="hugs-image-preview" id="preview_hugs_logo" />
        <?php else: ?>
            <img src="" class="hugs-image-preview" id="preview_hugs_logo" style="display:none;" />
        <?php endif; ?>
    </div>
    <?php
}

function hugs_save_project_meta($post_id) {
    if (!isset($_POST['hugs_project_meta_nonce']) || !wp_verify_nonce($_POST['hugs_project_meta_nonce'], '_hugs_project_meta_nonce')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    if (isset($_POST['hugs_thumbnail_url'])) {
        update_post_meta($post_id, '_thumbnail_url', esc_url_raw($_POST['hugs_thumbnail_url']));
    }
    if (isset($_POST['hugs_logo'])) {
        update_post_meta($post_id, '_hugs_logo', esc_url_raw($_POST['hugs_logo']));
    }
}
add_action('save_post_projects', 'hugs_save_project_meta');

function hugs_enqueue_media_scripts($hook) {
    global $post;
    if ($hook == 'post-new.php' || $hook == 'post.php') {
        if ('projects' === $post->post_type) {
            wp_enqueue_media();
        }
    }
}
add_action('admin_enqueue_scripts', 'hugs_enqueue_media_scripts');
?>
