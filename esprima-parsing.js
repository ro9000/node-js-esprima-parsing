'use strict';


var fs = require('fs');
var esprima = require('esprima');

console.log('aloha');

// fails because hashbang needs to be stripped most likely
//var exfile = 'node_modules/esprima/bin/esparse.js';

var exfile = 'node_modules/esprima/dist/esprima.js';

fs.readFile(exfile, 'utf8', function(err, data) {
  if (err) {
    console.error('could not read file', err);
    return;
  }
  try {
    var parsed = esprima.parse(data, {sourceType: 'module', tolerant: true, range: true});
  } catch(e) {
    console.error('not able to parse');
    console.error(e);
    return
  }
  //console.log(parsed);

  var ast = parsed;
  traverse(ast, function(node) {
    if (node.type === 'Identifier') {
      console.log(node.type, node.name, node.range);
    }
    if (node.type === 'FunctionDeclaration') {
      var id = node.id;
      if (id != null) {
        console.log('\x1b[33m%s\x1b[0m:', node.type, id.name, node.range);
      }
    }

  });

});

function traverse(node, func) {
    func(node);//1
    for (var key in node) { //2
        if (node.hasOwnProperty(key)) { //3
            var child = node[key];
            if (typeof child === 'object' && child !== null) { //4

                if (Array.isArray(child)) {
                    child.forEach(function(node) { //5
                        traverse(node, func);
                    });
                } else {
                    traverse(child, func); //6
                }
            }
        }
    }
}


