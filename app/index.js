'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var P3Generator = module.exports = function P3Generator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(P3Generator, yeoman.generators.Base);

P3Generator.prototype.askFor = function askFor() {
    
    var cb = this.async();

    // have Yeoman greet the user.
    console.log(this.yeoman);


    //create prompts as objects in this array
    var prompts = [{
        name: 'siteName',
        message: 'What do you want to call your site?',
        default: 'p3'
    },
    {
        name: 'version',
        message: 'What version is this site',
        default: '0.0.0'
    },
    {
        name: 'description',
        message: 'Provide a short description of this site',
        default: 'p3 client site'
    }];

    //this function consumes the prompts array and tosses each item to the callback
    this.prompt(prompts, function (props) {
        
        this.siteName = props.siteName;
        this.version  = props.version;
        this.description  = props.description;
        
        cb();

    }.bind(this));
};

P3Generator.prototype.projectfiles = function projectfiles() {
    
    this.copy('editorconfig', '.editorconfig');
    this.copy('bowerrc', '.bowerrc');
    this.copy('htaccess', '.htaccess');
    this.copy('gitignore', '.gitignore');
};

P3Generator.prototype.app = function app() {

    //new project directories
    this.mkdir('scss');
    this.mkdir('js');
    this.mkdir('inc');
    this.mkdir('img');
    this.mkdir('dist');
    this.mkdir('zip');

    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('_Gruntfile.js', 'Gruntfile.js');

    //html templates
    this.copy('index.php', 'index.php');
    this.copy('open.php', 'inc/open.php');
    this.copy('close.php', 'inc/close.php');

    //default js file
    this.copy('main.js', 'js/main.js');

    //default scss files. Nothing included except a link to compass and normalize.scss
    this.copy('main.scss', 'scss/main.scss');
    this.copy('_layout.scss', 'scss/_layout.scss');
    this.copy('_typography.scss', 'scss/_typography.scss');
};
