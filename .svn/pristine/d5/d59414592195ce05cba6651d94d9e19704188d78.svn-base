
Object.defineProperty(Object.prototype, "equals", {
    enumerable: false,
    value: function (obj) {
        var p;
        if (this === obj) {
            return true;
        }

        // some checks for native types first

        // function and sring
        if (typeof(this) === "function" || typeof(this) === "string" || this instanceof String) {
            return this.toString() === obj.toString();
        }

        // number
        if (this instanceof Number || typeof(this) === "number") {
            if (obj instanceof Number || typeof(obj) === "number") {
                return this.valueOf() === obj.valueOf();
            }
            return false;
        }

        // null.equals(null) and undefined.equals(undefined) do not inherit from the
        // Object.prototype so we can return false when they are passed as obj
        if (typeof(this) !== typeof(obj) || obj === null || typeof(obj) === "undefined") {
            return false;
        }

        function sort (o) {
            var result = {};

            if (typeof o !== "object") {
                return o;
            }

            Object.keys(o).sort().forEach(function (key) {
                result[key] = sort(o[key]);
            });

            return result;
        }

        if (typeof(this) === "object") {
            if (Array.isArray(this)) { // check on arrays
                return JSON.stringify(this) === JSON.stringify(obj);
            } else { // anyway objects
                for (p in this) {
                    if (typeof(this[p]) !== typeof(obj[p])) {
                        return false;
                    }
                    if ((this[p] === null) !== (obj[p] === null)) {
                        return false;
                    }
                    switch (typeof(this[p])) {
                    case 'undefined':
                        if (typeof(obj[p]) !== 'undefined') {
                            return false;
                        }
                        break;
                    case 'object':
                        if (this[p] !== null
                                && obj[p] !== null
                                && (this[p].constructor.toString() !== obj[p].constructor.toString()
                                        || !this[p].equals(obj[p]))) {
                            return false;
                        }
                        break;
                    case 'function':
                        if (this[p].toString() !== obj[p].toString()) {
                            return false;
                        }
                        break;
                    default:
                        if (this[p] !== obj[p]) {
                            return false;
                        }
                    }
                };

            }
        }

        // at least check them with JSON
        return JSON.stringify(sort(this)) === JSON.stringify(sort(obj));
    }
});

function Create2DArray(columns, rows) {
   var x = new Array(columns);
   for (var i = 0; i < columns; i++) {
       x[i] = new Array(rows);
   }
   return x;
}

function include(filename)
{
    var head = document.getElementsByTagName('head')[0];

    var script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';

    head.appendChild(script)
}

function getRandomItemKey(enumObj)
{
  return Object.keys(enumObj)[Math.floor(Math.random() * Object.keys(enumObj).length)];
}

function getRandomItemValue(enumObj)
{
  return enumObj[getRandomItemKey(enumObj)];
}

function randomNumber(lowMark, highMark)
{
   return lowMark + parseInt(Math.random() * ( (highMark + 1 ) - lowMark));
}

function PreloadImage() {
  for (i = 0; i < BildListe.length; i++) {
    Bilder[i] = new Image();
    Bilder[i].src = BildListe[i];
  }
}

DRNG = function() {
  this.distribution = {};
  this.distSum = 0;
}
DRNG.prototype.constructor = DRNG;
DRNG.prototype.addNumber = function(value, distribution) {
  if (this.distribution[value] != undefined)
  {
    this.distSum -= this.distribution[value];
  }
  this.distribution[value] = distribution;
  this.distSum += distribution;
}

DRNG.prototype.getRandomNumber = function() {
  var rand = Math.random();
  var ratio = 1.0 / this.distSum;
  var tempDist = 0;

  var keys = Object.keys(this.distribution);
  for (index = 0; index < keys.length; index++)
  {
    var i = keys[index];
    tempDist += this.distribution[i];
    if (rand / ratio <= tempDist) {
      return i;
    }
  }
  return 0;
}
