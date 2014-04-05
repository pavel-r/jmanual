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
                    "admin/js/templates.js": ["admin/templates/*.html"]
                }
            }
        },
		concat: {
			dist: {
			src : ['admin/js/*.js'],
			dest : 'build/jmanual-admin.js'
			}
		},
		uglify: {		
		   build: {
			src: 'build/jmanual-admin.js',
			dest: 'build/jmanual-admin.min.js'
		   }
		},
		jshint: {
			files : ["admin/**/*.js", "client/**/*.js"]
		}
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	//Test tasks
	grunt.registerTask('test', ['jshint']);

    // Default task.
    grunt.registerTask('default', ['jst', 'concat', 'uglify']);

};

