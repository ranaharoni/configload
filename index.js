var fs = require('fs');

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Mutator = function Mutator(pathToJsonFile, targetObject, params){
    _classCallCheck(this,Mutator);

    if(!targetObject || !(targetObject instanceof Object)){ targetObject = {}; }

    var hasParams  = params instanceof Object;
    var hasSetters = hasParams && params.setters instanceof Object,
        hasSpecs   = hasParams && params.specs instanceof Object;

    /**
     * [checkType description]
     * @method checkType
     * @param  {Object}  objectType [description]
     * @param  {Mixed}  value      [description]
     * @return {[type]}             [description]
     */
    function checkType(objectType,value){
        switch(objectType){
            case String:
                return typeof value === 'string';
                break;
            case Number:
                return typeof value === 'number';
                break;
            case Boolean:
                return typeof value === 'boolean';
                break;
            //case Object:
            //case Array:
            //case Function:
            default:
                return value instanceof objectType;
                break;
        }
    }

    /**
     * [checkSpec description]
     * @method checkSpec
     * @param  {String}  pn PropertyName
     * @param  {Mixed}  v  Value
     * @return {Boolean}     [description]
     */
    function checkSpec(pn, v){
        return !hasSpecs || hasSpecs && params.specs[pn] === undefined || checkType(params.specs[pn],v);
    }

    /**
     * [getObject description]
     * @method getObject
     * @return {Object}  [description]
     */
    this.getObject = () => {
        return targetObject;
    };

    /**
     * [extract description]
     * @method extract
     * @param  {Array} propertyNames [description]
     * @return {Mixed}               [description]
     */
    this.extract = (propertyNames) => {
        if (propertyNames instanceof Array && propertyNames.length) {
            var obj    = this.getObject(),
                newObj = {},
                count = 0;

            for(var i in propertyNames) if(obj.hasOwnProperty(propertyNames[i])) {
                newObj[propertyNames[i]] = obj[propertyNames[i]];
                count++;
            }

            if(count){
                return newObj;
            }
        }

        return false;
    };

    /**
     * [setProperty description]
     * @method setProperty
     * @param  {String}    name  [description]
     * @param  {Mixed}    value [description]
     */
    this.setProperty = (name, value) => {
        if(hasSetters && params.setters[name] instanceof Function){
            let newValue = params.setters[name](value, this[name], this);
            if( checkSpec(name,newValue) ){
                targetObject[name] = newValue;
                return newValue;
            }
        }else{
            if( checkSpec(name,value) ){
                targetObject[name] = value;
                return value;
            }
        }
        return false;

    };

    /**
     * [save description]
     * @method save
     * @return {[type]} [description]
     */
    this.save = () => {
        fs.writeFileSync(pathToJsonFile, JSON.stringify(this.getObject(), null, 4));
    }

    /**
     * [construct description]
     * @method construct
     * @param  {String}  pathToJsonFile [description]
     * @return {[type]}                 [description]
     */
    this.construct = (pathToJsonFile) => {
        var object = JSON.parse( fs.readFileSync(pathToJsonFile, 'utf8').replace(/^(?:\t| )+[/]{2}.*$\n/gm,'') ); // throws an exception if the file is not properly JSON formetted
        for(var property in object) if(object.hasOwnProperty(property)) {
            this.setProperty(property, object[property]);
        }
    }

    this.construct(pathToJsonFile);
}


exports.load = (pathToJsonFile, targetObject, params) => {
    return new Mutator(pathToJsonFile, targetObject, params);
};
