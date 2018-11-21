"""
Exports asset bundles to be used in the UI.
"""

from flask_assets import Bundle

bundles = {
    'all_js': Bundle(
        '**/*.js',
        filters='jsmin',
        output='build/bundle.min.js'
    ),
    'all_css': Bundle(
        '**/*.css',
        filters='cssmin',
        output='build/bundle.min.css'
    )
}
