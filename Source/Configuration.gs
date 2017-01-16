var Order = {
  ASC: 1,
  DESC: -1
};

var status = function() {
  return "SpreadQL is working just fine";
};

var config = function(configArray) {
  var spreadSheet = SpreadsheetApp.getActive();
  var config = {};

  for (var i = 0, l = configArray.length; i < l; i++) {
    var tmpConfig = configArray[i];
    var sheet = spreadSheet.getSheetByName(tmpConfig.sheetName);
    if(sheet !== null) {
      tmpConfig.startColumn = typeof tmpConfig.startColumn !== "undefined" ? tmpConfig.startColumn.toUpperCase() : "A";
      tmpConfig.startRow = typeof tmpConfig.startRow !== "undefined" ? tmpConfig.startRow : 1;
      config[tmpConfig.sheetName] = {"name": tmpConfig.sheetName, "sheet": sheet, "beginPoint": {"x": tmpConfig.startColumn, "y": tmpConfig.startRow}, autoIncrement: tmpConfig.autoIncrement};
    }
    else {
      throw "Config error: a sheet called " + tmpConfig.sheetName + " is not found!";
    }
  }

  return new SpreadCollection(config);
};