'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

//New Version


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
        default: 'p3 Site'
    },
    {
        name: 'version',
        message: 'What version is this site',
        default: '0.0.0'
    },
    {
        name: 'description',
        message: 'Provide a short description of this site',
        default: 'A simple P3 client site'
    }];

    //this function consumes the prompts array and tosses each item to the callback
    this.prompt(prompts, function (props) {
        
        this.siteName = props.siteName;
        this.version  = props.version;
        this.description  = props.description;

        console.log(props);
        
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
    this.copy('close.php', 'inc/close.php');

    this.copy('main.js', 'js/main.js');
    this.copy('main.scss', 'scss/main.scss');
    this.copy('_layout.scss', 'scss/_layout.scss');
    this.copy('_typography.scss', 'scss/_typography.scss');

    this.copy('_Gruntfile.js', 'Gruntfile.js');
    this.template('index.php', 'index.php');
    this.template('_bower.json', 'bower.json');
    this.template('_package.json', 'package.json');

    this.copy('open.php', 'inc/open.php');
};
