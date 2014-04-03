module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        //Read the package.json (optional)
        pkg: grunt.file.readJSON('package.json'),

        // Metadata.
        meta: {
            basePath: '../',
            srcPath: '../assets/src/',
            deployPath: '../assets/deploy/'
        },

        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> ',

        // Task configuration.
        jst: {
            compile: {
                options: {

                    //namespace: "templates",                 //Default: 'JST'
                    prettify: false,                        //Default: false|true
                    amdWrapper: false,                      //Default: false|true
                    templateSettings: {
                        //interpolate : /\{\{(.+?)\}\}/g    //Mustache Syntax
                    }
                },
                files: {
                    "admin/templates/templates.js": ["admin/templates/*.html"]
                }
            }
        },
	uglify: {		
	   build: {
		src: 'admin/js/jmanual.admin.js',
		dest: 'build/js/jmanual.admin.min.js'
	   }
	}
	
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task.
    grunt.registerTask('default', ['jst','uglify']);

};

