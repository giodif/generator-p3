module.exports = function( grunt ){
    
    grunt.initConfig({

        concurrent : {
            tasks : [
                'compass:verbose',
                'watch'
            ],
            options : {
                logConcurrentOutput : true
            }
        },
        
        compass : {

            options : {
                sassDir : 'scss',
                cssDir : ''
            },
            verbose : {
                options : {
                    outputStyle : 'expanded'
                }
            },
            terse : {
                options : {
                    outputStyle : 'compressed'
                }
            },
        },

        //only used for js files
        //compass compiles all of the css
        watch : {
            scripts : {
                files : [ 'js/*.js', 'js/**/*.js' ],
                tasks : [ 'concat:tobrowser' ]
            }
        },


        //slaps all of the various js files together in order
        //lighter than require.js, but not as friendly
        //does not handle dependecy issues
        concat : {
            options : {
                seperator : ';',
                stripBanners : true
            },
            tobrowser : {
                src : '<%= src_js %>',
                dest : 'init.js'
            },
            tosource : {
                src : '<%= src_js %>',
                dest : 'js/main-concat.js'
            }
        },

        //moves all production files to a dist folder
        //so that it's easier to push them to the server
        copy : {
            main : {
                files : [
                    {
                        expand : true,
                        src : [
                            'init.js',
                            'index.php',
                            'main.css',
                            'inc/**'
                        ],
                        dest : 'dist/'
                    },
                ]
            },
            zip : {
                files : [
                    {
                        expand : true,
                        cwd : 'dist',
                        src : [
                            'index.php',
                            'inc/**',
                            'img/**'
                        ],
                        dest : 'zip/'
                    },
                ]
            }
        },

        //compresses jpg, png, gif and moves them to the dist folder
        imagemin : {
            movetodist : {
                options : {
                    optimizationLevel : 3
                },
                files : [
                    {
                        expand : true,
                        cwd : 'img/',
                        src : [ '**/*.{png,jpg,gif}' ],
                        dest : 'dist/img/'
                    }
                ]
            }
        },

        //just concat the js during compilation
        uglify : {
            my_target : {
                files : {
                    'init.js' : [ 'js/main-concat.js' ]
                }
            }
        },

        //compresses all files with gzip for even more minification
        compress : {
            main : {
                options : {
                    mode : 'gzip'
                },
                expand : true,
                cwd : 'dist/',
                src : [
                    'init.js',
                    'main.css'
                ],
                dest : 'zip/'
            }
        },

        //list of all js files that are to be concatonated
        //IMPORTANT: these files need to be listed in order of compilation
        //concat does not handle dependency issues
        src_js : [
            'js/bower/modernizr/modernizr.js',
            'js/bower/jquery/jquery.js',
            //add custom files here, after jquery and before main
            'js/main.js'
        ]
    });

    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-compass' );
    grunt.loadNpmTasks( 'grunt-contrib-imagemin' );
    grunt.loadNpmTasks( 'grunt-contrib-compress' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-concurrent' );

    grunt.registerTask(
        'default',
        [
            'concurrent'
        ]
    );
    
    grunt.registerTask(
        'build',
        [
            'compass:terse',
            'concat:tosource',
            'uglify'
        ]
    );
    
    grunt.registerTask(
        'stage',
        [
            'build',
            'copy:main',
            'imagemin'
        ]
    );

    grunt.registerTask(
        'zip',
        [
            'stage',
            'compress',
            'copy:zip'
        ]
    );
};