module.exports = function (grunt) {

    grunt.initConfig({
        exec: {
            api: {
              command: 'cd api && node server.js'
            },
            ember_serve: {
              command: 'cd web && ember serve'
            }
          },
        express: {
            options: {
                // Override defaults here
            },
            dev: {
                options: {
                    script: 'api/server.js',
                    node_env: 'dev'
                }
            },
            prod: {
                options: {
                    script: 'api/server.js',
                    node_env: 'production'
                }
            },
        },
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');

    grunt.registerTask('default', ['jshint',  'exec:ember_serve', 'express:dev']);
};