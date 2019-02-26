var path = require('path');

module.exports = function (grunt) {
  var project = {
    src: 'src',
    dist: 'dist',
    locales: 'locales',
    assets: 'assets',
  }

  grunt.initConfig({
    i18n: {
      dist: {
        options: {
          baseDir: project.src,
          outputDir: project.dist,
        }
      },
      options: {
        fileFormat: 'json',
        exclude: [],
        locales: ['en', 'fr'],
        locale: 'en',
        localesPath: path.join(project.src, project.locales),
      },
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [path.join(project.src, project.assets, '**')],
            dest: path.join(project.dist, project.assets),
            filter: 'isFile',
          },
          {
            flatten: true,
            expand: true,
            src: path.join(project.src, 'CNAME'),
            dest: path.join(project.dist, '/'),
          },
          {
            flatten: true,
            expand: true,
            src: path.join(project.src, 'sitemap.xml'),
            dest: path.join(project.dist, '/'),
          },
          {
            flatten: true,
            expand: true,
            src: path.join(project.src, 'google1e6df2694e0730ed.html'),
            dest: path.join(project.dist, '/'),
          },
          {
            flatten: true,
            expand: true,
            src: path.join(project.src, 'BingSiteAuth.xml'),
            dest: path.join(project.dist, '/'),
          }
        ],
      },
    },
    clean: [project.dist],
    watch: {
			options: { livereload:true },
			files: [path.join(project.src, '**')],
			tasks: ['sass', 'replace'],
		},
    express:{
      all:{
        options:{
          port: 3000,
          hostname: 'localhost',
          bases: [project.dist],
          livereload: true	
        }
      }
    },
    cwebp: {
      images: {
        files: {
          'dist/assets/': [
            'dist/assets/*.jpg',
            'dist/assets/*.png'
          ]
        }
      }
    },
    replace: {
      dist: {
        options: {
          patterns: [
              {
                  match: 'styles{}',
                  replacement: '<%= grunt.file.read("src/styles/styles.css") %>'
              }
          ],
          prefix: '#'
        },
        files: [
            {expand: true, flatten: true, src: ['src/index.html'], dest: 'dist/'},
            // {expand: true, flatten: true, src: ['dist/fr/index.html'], dest: 'dist/fr'},
        ]
      }
    },
    sass: {
      dist: {
        options: {
          style: 'compressed',
        },
        files: {
          'src/styles/styles.css': 'src/styles/main.scss'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-i18n-static');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-webp-compress');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-replace');

  grunt.registerTask('default', ['clean', 'sass', 'copy', 'cwebp', 'replace']);
  grunt.registerTask('serve',['express','watch']);
};