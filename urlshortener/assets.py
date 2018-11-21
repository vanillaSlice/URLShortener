"""
Exports asset bundles to be used in the UI.
"""

from flask_assets import Bundle

bundles = {
    'all_js': Bundle(
        '**/*.js',
        filters='jsmin',
        output='build/bundle.min.js'
    )
}
