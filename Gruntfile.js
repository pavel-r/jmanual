module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        //Read the package.json (optional)
        pkg: grunt.file.readJSON('package.json'),

        // Task configuration.
        jst: {
			options: {
				processName: function(filename) {
					return filename.slice(filename.indexOf("template"), filename.length);
				}
			},
            client: {
                files: {
                    'widget/jmanual.client.templates.js': ['widget/templates/*.html']
                }
            },
			admin : {
				files: {
					'widget/jmanual.admin.templates.js': ['widget/templates/*.html']
				}
			}
        },
		concat: {
			//concatenate files in dependency order
			client: {
				src : ['widget/jmanual.common*.js', 
					   'widget/jmanual.client.templates.js', 
					   'widget/jmanual.client.app.js'],
				dest : 'build/jmanual-client.js'
			},
			admin: {
				src : ['widget/jmanual.common*.js', 
					   'widget/jmanual.admin.templates.js', 
					   'widget/jmanual.admin.app.js'],
				dest : 'build/jmanual-admin.js'
			}
		},
		uglify: {		
		   client: {
				src: 'build/jmanual-client.js',
				dest: 'build/jmanual-client.min.js'
		   },
		   admin: {
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

