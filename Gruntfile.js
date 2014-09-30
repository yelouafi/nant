module.exports = function(grunt) {
	grunt.initConfig({
	    mochaTest: {
            test: {
                src: ['test/*.js']
            }
        },
        
		uglify: {
			build: {
				options: {
					sourceMap: true,
					compress: {
						drop_console: true
					}
				},
				files: {
					'nant.min.js': ['nant.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['mochaTest', 'uglify' ]);
};