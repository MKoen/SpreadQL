var SpreadCollection = function(config) {
  this.config = config;
  this.data = [];
  this.cache = {};
  this.currentSheet = "";
};

SpreadCollection.prototype = (function () {
  var _toSpreadsheetNotation = function (begin, end) {
          return begin.x + '' + begin.y + ':' + end.y + '' + end.x;
      },

      _translateIntegerToChar = function (num) {
          var begin = 'A'.charCodeAt(0) - 1;
          return String.fromCharCode(begin + num);
      },

      _translateCharToInteger = function (char) {
        var begin = 'A'.charCodeAt(0) - 1;
        return char.charCodeAt(0) - begin;
      },

      _parseToObject = function (values) {
          var headerRow = values[0],
              result = [],
              obj = null;

         for (var i = 1, l = values.length; i < l; i++) {
             obj = {};
             for (var j = 0, k = headerRow.length; j < k; j++) {
                 obj[headerRow[j]] = values[i][j];
             }
             result.push(obj);
        }

        return result;
      },

      _createEmptyColumnsIfNecessaryForRow = function (sheetname) {
        return new Array(
          _translateCharToInteger(this.config[sheetname].beginPoint.x)
        ).join(' ').split('');
      },

      _setAutoIncrementCountInCache = function (sheetname) {
        var column = this.config[sheetname].autoIncrement,
            highestValue;

        if (column) {
          highestValue = this.from(sheetname).orderBy([ column ], Order.DESC).select([ column ]).shift()[column];
          this.cache[sheetname].autoIncrementCount = parseInt(highestValue, 10);
        }
      },

      _addAutoIncrementField = function (sheetname, properties) {
        var column = this.config[sheetname].autoIncrement;

        if (!column || properties.hasOwnProperty(column)) {
          return properties;
        }

        if (!this.cache[sheetname].autoIncrementCount) {
          _setAutoIncrementCountInCache.call(this, sheetname);
        }

        this.cache[sheetname].autoIncrementCount += 1;
        properties[column] = this.cache[sheetname].autoIncrementCount;
        return properties;
      },

      _objectToRowForSheet = function (sheetname, obj) {
        var header = this.cache[sheetname].header,
            result = _createEmptyColumnsIfNecessaryForRow.call(this, sheetname),
            hasProperty = false,
            valid = true;

        for (var i = 0, l = header.length; i < l; i++) {
          hasProperty = false;
          for (var prop in obj) {
            if (prop.toLowerCase() === header[i].toLowerCase()) {
              result.push(obj[prop]);
              hasProperty = true;
            }
          }

          if (!hasProperty) {
            valid = false;
            throw "Insert error: Property called " + header[i] + " is missing.";
          }
        }

        return (valid) ? result : null;
      },

      _getRealRowNumbers = function(sheetName, criteria){ //object
        var realRowNumbers = [];

        for(var i = 0, l = this.data.length; i < l; i++) {
          var obj = this.data[i];
          var matchesAllProps = true;

          for (var prop in criteria) {
            if((obj.hasOwnProperty(prop) && obj[prop] !== criteria[prop]) || realRowNumbers.indexOf(i + this.config[sheetName].beginPoint.y) > 0){
              matchesAllProps = false;
            }
          }

          if(matchesAllProps) {
            realRowNumbers.push(i + this.config[sheetName].beginPoint.y + 1);
          }
        }

        return realRowNumbers;
      },

      _addNewSheetToConfig = function(sheetName, sheet, beginPoint) {
        beginPoint = beginPoint || {"x": "A", "y": 1};
        this.config[sheetName] = {"name": sheetName, "beginPoint": beginPoint, "sheet": sheet};
      };

  var from = function (sheetname, override) {
      override = override || false;
      if (!override && this.cache.hasOwnProperty(sheetname)) {
          this.data = this.cache[sheetname].values;
          return this;
      }

      if (!this.config.hasOwnProperty(sheetname)) {
        throw "From error: Sheet called " + sheetname + " was not found in config.";
      }

      var sheet = this.config[sheetname].sheet,
          range = sheet.getRange(
                             _toSpreadsheetNotation(this.config[sheetname].beginPoint, {
                               x: sheet.getLastRow(),
                               y: _translateIntegerToChar(sheet.getLastColumn())
                             })
          ),
          values = _parseToObject(range.getValues());

          this.cache[sheetname] = { values: values, header: range.getValues()[0] };
          this.data = values;
          this.currentSheet = sheetname;
          return this;
      },

      find = function (criteria) {
        for (var key in criteria) {
            if (criteria.hasOwnProperty(key))
            {
                this.data = this.data.filter(function(data){
                    if (typeof criteria[key] === 'object') {
                        return criteria[key].indexOf(data[key]) > -1;
                    } else {
                        return data[key] === criteria[key];
                    }
               });
            }
        }
        return this;
      },
      export = function(sheetname, properties){
        var output = this.select(properties);

        properties = properties || this.cache[this.currentSheet].header;
        this.create(sheetname, properties);

        var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
        var sheet = spreadsheet.getSheetByName(sheetname);

        this.from(sheetname);
        this.cache[sheetname].values = output;

        for(var i = 0, l = output.length; i < l; i++){
          sheet.appendRow(_objectToRowForSheet.call(this, sheetname, output[i]));
        }
      },

      select = function (properties) {
          var arr = [];
          var obj = {};
        
        if(properties === undefined) {
          return this.data;
        }

        for(var i = 0, l = this.data.length; i < l; i++) {
          var row = this.data[i];
          var obj = {};
          for(var j = 0, propertieslength = properties.length; j < propertieslength; j++) {
            var property = properties[j];
            if(row[property] !== undefined) {
              obj[property] = row[property];
            }
          }
          arr.push(obj);
        }

          return arr;
      },

      orderBy = function (criteria, spreadQLOrder) {
        var spreadQLOrder = spreadQLOrder !== undefined ? spreadQLOrder : Order.ASC; //var can be removed, and isn't (typeof spreadQLOrder !== "undefined") cleaner?

        this.data = this.data.sort(function(a,b) {
          for(var i = 0, l = criteria.length; i < l; i++) {
            var key = criteria[i];
            if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) continue;

            if(a[key] > b[key]) {
              return 1 * spreadQLOrder;
            }

            if(a[key] < b[key]) {
              return -1 * spreadQLOrder;
            }
          }

          return 0;
        });

          return this;
      },

      insert = function (sheetname, properties) {
        properties = (properties instanceof Array) ? properties : [ properties ];
        var row;

        if (!this.cache.hasOwnProperty(sheetname)) {
          this.from(sheetname);
        }

        for (var i = 0, l = properties.length; i < l; i++) {
          properties[i] = _addAutoIncrementField.call(this, sheetname, properties[i]);
          row = _objectToRowForSheet.call(this, sheetname, properties[i]);

          if (row) {
            this.config[sheetname].sheet.appendRow(row);
          }
        }

        return this.from(sheetname, true);
      },

      update = function(properties, newValues) {
        var rowIdx = _getRealRowNumbers.call(this, this.currentSheet, properties);
        this.find(properties);

        for(var i = 0, l = rowIdx.length; i < l; i++) {
          var sheet = this.config[this.currentSheet].sheet;
          var range = sheet.getRange(rowIdx[i], _translateCharToInteger(this.config[this.currentSheet].beginPoint.x), 1, (sheet.getLastColumn() - _translateCharToInteger(this.config[this.currentSheet].beginPoint.x)) + 1);
          var obj = this.data[i];

          for(var key in newValues) {
            obj[key] = newValues[key];
          }

          range.setValues([_objectToRowForSheet.call(this, this.currentSheet, obj)]);
        }

        return this;
      },

      create =  function(name,header)
        {
          var ss = SpreadsheetApp.getActive();
          var s = ss.getSheetByName(name);
          if(s)
          {
            ss.deleteSheet(s);
          }
          ss.insertSheet(name);
          s = ss.getSheetByName(name);
          s.appendRow(header);

          _addNewSheetToConfig.call(this, name, s);
        },

      distinct = function(properties) {
        properties = properties || this.cache[this.currentSheet].header;

        var uniqueCheckObj = {},
            res = [];

        for(var i = 0, l = this.data.length; i < l; ++i){
          var keyOfProperty = "";

          for(var p = 0, propl = properties.length; p < propl; p++) {
            keyOfProperty += this.data[i][properties[p]];
          }

          if(uniqueCheckObj.hasOwnProperty(keyOfProperty)) {
            continue;
          }

          res.push(this.data[i]);
          uniqueCheckObj[keyOfProperty] = true;
        }

        this.data = res;

        return this;
      },

      join = function (column, joinLocation) {
        if (joinLocation.indexOf('.') < 0) {
          throw 'JoinLocation has to contain a "." for example: "Student.id" (sheet Student, column id)';
        }

        joinLocation = joinLocation.split('.');
        var sheet = joinLocation[0],
            columnToMatch = joinLocation[1],
            currentData = this.data,
            currentSheet = this.currentSheet,
            joinSheetData = this.from(sheet).data,
            matches;

        for (var i = 0, l = currentData.length; i < l; i++) {
          if (currentData[i].hasOwnProperty(column)) {
            matches = [];
            for (var j = 0, joinDataLength = joinSheetData.length; j < joinDataLength; j++) {
              if (joinSheetData[j].hasOwnProperty(columnToMatch) && joinSheetData[j][columnToMatch] === currentData[i][column]) {
                matches.push(joinSheetData[j]);
              }
            }

            if (matches.length) {
              currentData[i][sheet] = matches;
            }
          }
        }

        this.currentSheet = currentSheet;
        this.data = currentData;
        return this;
      },

      remove = function(criteria){
        realRowNumbers = _getRealRowNumbers.call(this, this.currentSheet, criteria);

        for(var i = realRowNumbers.length - 1;i >= 0; i--){
          var sheet = this.config[this.currentSheet].sheet;

          sheet.deleteRow(realRowNumbers[i]);
        }

        return this;
      };

  return {
    from: from,
    find: find,
    select: select,
    orderBy: orderBy,
    insert: insert,
    export: export,
    update: update,
    create: create,
    distinct: distinct,
    join: join,
    remove: remove
  };
})();