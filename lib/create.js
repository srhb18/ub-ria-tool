var u = require('underscore');
var util = require('./util');

exports.description = '脚手架创建项目结构和文件';

exports.help = function () {
    console.log('ria create path/to/file/xx.js');
    console.log('    生成一个js文件，路径为项目根目录起始');
    console.log();

    console.log('ria create path/to/file/xx.less');
    console.log('    生成一个less文件，路径为项目根目录起始');
    console.log();

    console.log('ria create path/to/file/xx.html');
    console.log('    生成一个html文件，路径为项目根目录起始');
    console.log();

    console.log('ria create control {ControlType} [--extends {BaseType}]');
    console.log('    生成控件模板，路径为以"src"为基准，如：');
    console.log('    ria create control order/ui/ScheduleTable');
    console.log('    ria create control BubbleTip --extends esui/Tip');
    console.log('    ria create control creative/ui/Thumbnail --extends ui/ImagePanel');
    console.log();

    console.log('ria create module {entity}');
    console.log('    初始化业务模块，生成配置文件');
    console.log();

    console.log('ria create list for {entity}');
    console.log('    生成对应实体的列表页');
    console.log();

    console.log('ria create form for {entity}');
    console.log('    生成对应实体的表单页');
    console.log();

    console.log('ria create read for {entity}');
    console.log('    生成对应实体的只读页');
    console.log();

    console.log('ria create detail for {entity}');
    console.log('    生成对应实体的详情页');
};

exports.cli = function (args, context) {
    var data = {
        developer: require('./config').dump(),
        projectDirectory: util.findProjectDirectory()
    };

    try {
        data.dict = util.getDictionary();
    }
    catch (ex) {
        console.error(ex.message);
        process.exit(1);
    }

    try {
        data.project = util.getProjectInfo();
    }
    catch (ex) {
        console.error(ex.message);
        process.exit(1);
    }

    u.extend(data, context);

    try {
        if (args[0].indexOf('.') > 0) {
            require('./scaffold/file').render(args, data);
        }
        else {
            var painter = require('./scaffold/' + args[0]);
            painter.render(args.slice(1), data);
        }
    }
    catch (err) {
        console.error('无法创建指定文件：' + err.message);
    }
};
