# ConfigLoad
> A nodejs module that allows you to include JSON config files with ease


## Install:

```sh
npm install configload --save
```

## Import:
```javascript
var cfgl = require('configload');
```

---
###Super simple to use
#####JavaScript
```javascript
var object = cfgl.load('./person.json').getObject();
console.log(object);
```
#####Result
```	json
{
	"firstName": "John",
	"lastName": "Doe",
	"email": "j.doe@example.com",
	"age": 32,
	"smokes": false,
	"drinks": true,
	"nicknames": ["Big J", "J.Doe", "JD", "Bobby J"],
	"attributes": {"height": 1.8, "smart": true}
}
```
---
###Extend another object
#####JavaScript
```javascript
var baseCar = {
	wheels: 4,
	doors: 5,
	gearType: 'manual',
	gears: 5,
	engineSize: 1.2,
	cylinders: 3,
	bhp: 75,
	acceletationPerSecond: 8,
	maxKmph: 150
};

var object = cfgl.load('./cars/vw/golf.json', baseCar).getObject();
console.log(object);
```

#####Result
```json
{
	"brand": "Volkswagen",
	"model": "Golf",
	"wheels": 4,
	"doors": 5,
	"gearType": "manual",
	"gears": 5,
	"engineSize": 1.8,
	"cylinders": 4,
	"bhp": 170,
	"acceletationPerSecond": 6.8,
	"maxKmph": 190,
	"color": "silver",
	"gps": true
}
```
---
###Transform values & create new properties
#####JavaScript
```javascript
var _params = {

    setters: {
    	// We choose the (first) shortest nickname and set it as his
    	// username and sort the nicknames alphabetically
        nicknames: function(value,currentValue,mutator){
            var username = null;

            for(var i = 0; i < value.length; i++){
               if(shortest && value[i].length < username.length) {
                   username = value[i];
               }
            }

        	mutator.setProperty('username', username);

        	value.sort();
            return value;
        }
    }
};



var object = cfgl.load('./people.json',null,_params).getObject();
console.log(object);
```
---
###Force property data-types
#####JavaScript
```javascript
var _params = {
    specs:{
        "firstName": String,
        "lastName": String,
        "email": String,
        "age": Number,
        "smokes": Boolean,
        "drinks": Boolean,
        "nicknames": Array,
        "attributes": Object
    }
};

var object = cfgl.load('./config.json',null,_params).getObject();
console.log(object);
```
---
###You can even load selected properties from another file, and use them as defaults for the main one.
#####JavaScript
```javascript

var defm = cfgl.load('./defaults.json');

var object = cfgl.load('./people.json', defm.extract(["smokes","drinks"]) );

console.log(object);
```
