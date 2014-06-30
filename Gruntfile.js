module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nodewebkit: {
      options: {
        version: "0.9.2",
        build_dir: './dist',
        // specifiy what to build
        mac: true,
        win: true,
        linux32: true,
        linux64: true
      },
      src: './'
    },
  });

  grunt.loadNpmTasks('grunt-node-webkit-builder');

  grunt.registerTask('default', ['nodewebkit']);
};