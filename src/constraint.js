// Core/NPM Modules
const esprima = require("esprima");
const faker   = require("faker");
const fs      = require('fs');
const Random  = require('random-js');
const _       = require('lodash');
const randexp = require('randexp');



// Set options
faker.locale  = "en";
const options = { tokens: true, tolerant: true, loc: true, range: true };



// Create random generator engine
const engine = Random.engines.mt19937().autoSeed();


/**
 * Constraint class. Represents constraints on function call parameters.
 *
 * @property {String}                                                          ident      Identity of the parameter mapped to the constraint.
 * @property {String}                                                          expression Full expression string for a constraint.
 * @property {String}                                                          operator   Operator used in constraint.
 * @property {String|Number}                                                   value      Main constraint value.
 * @property {String|Number}                                                   altvalue   Constraint alternative value.
 * @property {String}                                                          funcName   Name of the function being constrained.
 * @property {'fileWithContent'|'fileExists'|'integer'|'string'|'phoneNumber'} kind       Type of the constraint.
 */
class Constraint {
    constructor(properties){
        this.ident = properties.ident;
        this.expression = properties.expression;
        this.operator = properties.operator;
        this.value = properties.value;
        this.altvalue = properties.altvalue;
        this.funcName = properties.funcName;
        this.kind = properties.kind;
    }
}


/**
 * Generate function parameter constraints for an input file
 * and save them to the global functionConstraints object.
 *
 * @param   {String} filePath Path of the file to generate tests for.
 * @returns {Object}          Function constraints object.
 */
function constraints(filePath) {

    // Initialize function constraints directory
    let functionConstraints = {};

    // Read input file and parse it with esprima.
    let buf = fs.readFileSync(filePath, "utf8");
    let result = esprima.parse(buf, options);

    // Start traversing the root node
    traverse(result, function (node) {

        // If some node is a function declaration, parse it for potential constraints.
        if (node.type === 'FunctionDeclaration') {

            // Get function name and arguments
            let funcName = functionName(node);
            let params = node.params.map(function(p) {return p.name});

            // Initialize function constraints
            functionConstraints[funcName] = {
                constraints: _.zipObject(params, _.map(params, () => [])),
                params: params
            };

            // handle phoneNumber parameter
            for(let p in params){
                if(params[p] === 'phoneNumber'){
                    let constraints = functionConstraints[funcName].constraints[params[p]];
                    let phoneNum = generateRandomDigits(10);

                    constraints.push(new Constraint({
                        ident: params[p],
                        value: "\'"+phoneNum+"\'",
                        funcName: funcName,
                        kind: "phoneNumber"
                    }));
                }
            }

            // Traverse function node.
            traverse(node, function(child) {

                // handle unary expressions
                if(child.type === 'UnaryExpression' && child.operator === '!'){
                    // full epxression
                    let expression = buf.substring(child.range[0], child.range[1]);
                    
                    // if unary expression is being applied directly on of the parameters
                    if(child.argument && child.argument.type === "Identifier"){
                        for(let p in params){
                            if(child.argument.name === params[p]){

                                // push both true and false as constraints
                                let ident = params[p];
                                let constraints = functionConstraints[funcName].constraints[ident];

                                constraints.push(new Constraint({
                                    ident: params[p],
                                    value: "true",
                                    funcName: funcName,
                                    kind: "integer",
                                    operator : child.operator,
                                    expression: expression
                                }));

                                constraints.push(new Constraint({
                                    ident: params[p],
                                    value: "false",
                                    funcName: funcName,
                                    kind: "integer",
                                    operator : child.operator,
                                    expression: expression
                                }));
                            }
                        }
                    }

                    // if unary expression is being applied directly on of the properties of a parameters
                    else if(child.argument && child.argument.type === "MemberExpression"){
                        for(let p in params){
                            if(child.argument.object.name === params[p]){
                                let ident = params[p];
                                let property = child.argument.property.name;
                                let constraints = functionConstraints[funcName].constraints[ident];
                                
                                constraints.push(new Constraint({
                                    ident: params[p],
                                    value: "{ "+property+": 'true' }",
                                    funcName: funcName,
                                    kind: "integer",
                                    operator : child.operator,
                                    expression: expression
                                }));

                                constraints.push(new Constraint({
                                    ident: params[p],
                                    value: "{ "+property+": 'false' }",
                                    funcName: funcName,
                                    kind: "integer",
                                    operator : child.operator,
                                    expression: expression
                                }));

                            }
                        }
                    }
                }

                // Handle binary expressions
                if(_.get(child, 'type') === 'BinaryExpression' && _.includes(['!=', '!==', '==', '===', '<', '<=', '>', '>='], _.get(child, 'operator'))) {
                    if(_.get(child, 'left.type') === 'Identifier') {

                        // Get identifier
                        let ident = child.left.name;

                        // Get expression from original source code:
                        let expression = buf.substring(child.range[0], child.range[1]);
                        let rightHand = buf.substring(child.right.range[0], child.right.range[1]);

                        // Test to see if right hand is a string
                        let match = rightHand.match(/^['"](.*)['"]$/);

                        if (_.includes(params, _.get(child, 'left.name'))) {

                            // Push a new constraints
                            let constraints = functionConstraints[funcName].constraints[ident];

                            if(_.includes(['!=', '!==', '==', '==='], _.get(child, 'operator'))){       // handle equivalence
                                constraints.push(new Constraint({
                                    ident: child.left.name,
                                    value: rightHand,
                                    funcName: funcName,
                                    kind: "integer",
                                    operator : child.operator,
                                    expression: expression
                                }));
                                constraints.push(new Constraint({
                                    ident: child.left.name,
                                    value: match ? `'NEQ - ${match[1]}'` : NaN,
                                    funcName: funcName,
                                    kind: "integer",
                                    operator : child.operator,
                                    expression: expression
                                }));
                            }

                            if(_.includes(['<', '<=', '>', '>='], _.get(child, 'operator'))){       // handle <, >
                                // push 2 constraints, 1 with value greater than rightHand and the other one less than
                                constraints.push(new Constraint({
                                    ident: child.left.name,
                                    value: createConcreteIntegerValue(parseInt(rightHand), true),
                                    funcName: funcName,
                                    kind: "integer",
                                    operator : child.operator,
                                    expression: expression
                                }));
                                constraints.push(new Constraint({
                                    ident: child.left.name,
                                    value: createConcreteIntegerValue(parseInt(rightHand), false),
                                    funcName: funcName,
                                    kind: "integer",
                                    operator : child.operator,
                                    expression: expression
                                }));
                            }
                        }

                        // handle 'area' variable
                        if(ident === 'area'){
                            let constraints = functionConstraints[funcName].constraints['phoneNumber'];
                            
                            let areaVal = child.right.value;
                            let phoneNum = areaVal + generateRandomDigits(10 - areaVal.length);

                            constraints.push(new Constraint({
                                ident: 'phoneNumber',
                                value: "\'"+phoneNum+"\'",
                                funcName: funcName,
                                kind: "phoneNumber"
                            }));

                            constraints.push(new Constraint({
                                ident: 'phoneNumber',
                                value: "\'"+generateRandomDigits(10)+"\'",
                                funcName: funcName,
                                kind: "phoneNumber"
                            }));

                        }
                    }

                    // handle indexOf() comparisons within Binary Expressions
                    else if(_.get(child, 'left.type') === 'CallExpression') {
                        if(child.left.callee.property && child.left.callee.property.name === "indexOf"){
                            
                            // entire expression
                            let expression = buf.substring(child.range[0], child.range[1]);

                            for(let p in params){
                                if(child.left.callee.object.name === params[p]){

                                    let ident = child.left.callee.object.name;  // identifier

                                    let arg = child.left.arguments[0].value;    // argument string
                                    
                                    let rightHand = buf.substring(child.right.range[0], child.right.range[1]);  // right hand value
                                    
                                    var str1 = (new Random(engine).string(rightHand)).concat(arg);          // random string with argument string at given index
                                    var str2 = (new Random(engine).string(rightHand + 1)).concat(arg);      // random string with argument string NOT at given index

                                    // push new constraints
                                    functionConstraints[funcName].constraints[ident].push(new Constraint({
                                        ident: params[p],
                                        value:  "\'"+str1+"\'",
                                        funcName: funcName,
                                        kind: "string",
                                        operator : child.operator,
                                        expression: expression
                                    }));

                                    functionConstraints[funcName].constraints[ident].push(new Constraint({
                                        ident: params[p],
                                        value:  "\'"+str2+"\'",
                                        funcName: funcName,
                                        kind: "string",
                                        operator : child.operator,
                                        expression: expression
                                    }));
                                }
                            }
                        }
                    }
                }

                // Handle fs.existsSync
                if( child.type === "CallExpression" && child.callee.property && child.callee.property.name === "existsSync" ) {
                    
                    // full expression
                    let expression = buf.substring(child.range[0], child.range[1]);
                    //console.log(expression);

                    for(let p in params){
                        if(child.arguments[0].name === params[p]){
                            // Get identifier
                            let ident = params[p];

                            // push new constraints

                            if(ident === 'filePath'){       // only add files
                                functionConstraints[funcName].constraints[ident].push(new Constraint({
                                    ident: params[p],
                                    value:  "'file'",
                                    funcName: funcName,
                                    kind: "fileExists",
                                    operator : child.operator,
                                    expression: expression
                                }));
                            }

                            else{                           // else add directories and files
                                functionConstraints[funcName].constraints[ident].push(new Constraint({
                                    ident: params[p],
                                    value:  "'emptyDir'",
                                    funcName: funcName,
                                    kind: "fileExists",
                                    operator : child.operator,
                                    expression: expression
                                }));
                                functionConstraints[funcName].constraints[ident].push(new Constraint({
                                    ident: params[p],
                                    value:  "'nonEmptyDir'",
                                    funcName: funcName,
                                    kind: "fileExists",
                                    operator : child.operator,
                                    expression: expression
                                }));
                            }                            
                        }
                    }
                }

                // Handle fs.readFileSync
                if( child.type === "CallExpression" && child.callee.property && child.callee.property.name === "readFileSync" ) {

                    // Get expression from original source code:
                    let expression = buf.substring(child.range[0], child.range[1]);

                    for (let p in params) {
                        if( child.arguments[0].name === params[p] ) {

                            // Get identifier
                            let ident = params[p];

                            // Push a new constraint

                            if(ident === 'filePath'){       // only add files
                                functionConstraints[funcName].constraints[ident].push(new Constraint({
                                    ident: params[p],
                                    value:  "'pathContent/file1'",
                                    funcName: funcName,
                                    kind: "fileWithContent",
                                    operator : child.operator,
                                    expression: expression
                                }));
                            }
                            else{                           // else add directories and files
                                functionConstraints[funcName].constraints[ident].push(new Constraint({
                                    ident: params[p],
                                    value:  "'pathContent/file1'",
                                    funcName: funcName,
                                    kind: "fileWithContent",
                                    operator : child.operator,
                                    expression: expression
                                }));
                                functionConstraints[funcName].constraints[ident].push(new Constraint({
                                    ident: params[p],
                                    value:  "'pathContent/someDir'",
                                    funcName: funcName,
                                    kind: "fileWithContent",
                                    operator : child.operator,
                                    expression: expression
                                }));
                            }
                        }
                    }
                }

            });

            // console.log( functionConstraints[funcName]);

        }
    });

    //console.log(functionConstraints['inc'].constraints['p']);

    return functionConstraints;
}

/**
 * Traverse an object tree, calling the visitor at each
 * visited node.
 *
 * @param {Object}   object  Esprima node object.
 * @param {Function} visitor Visitor called at each node.
 */
function traverse(object, visitor) {

    // Call the visitor on the object
    visitor(object);

    // Traverse all children of object
    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            let child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}


/**
 * Return the name of a function node.
 */
function functionName(node) {
    return node.id ? node.id.name : '';
}


/**
 * Generates an integer value based on some constraint.
 *
 * @param   {Number}  constraintValue Constraint integer.
 * @param   {Boolean} greaterThan     Whether or not the concrete integer is greater than the constraint.
 * @returns {Number}                  Integer satisfying constraints.
 */
function createConcreteIntegerValue(constraintValue, greaterThan) {
    if( greaterThan ) return Random.integer(constraintValue + 1, constraintValue + 10)(engine);
    else return Random.integer(constraintValue - 10, constraintValue - 1)(engine);
}


function generateRandomDigits(numDigits){
    var digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    var pNumber  = "";
    for(let i=0; i < numDigits; i++) pNumber += digits[Random.integer(0, 9)(engine)];
    return pNumber;
}

// Export
module.exports = constraints;