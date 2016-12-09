# SpreadQL
A lightweight spreadsheet SQL-ish library.

SpreadQL is a library that creates an interface between the Google Apps Script and the Spreadsheet communication layer. It makes talking to a Google Spreadsheet more pleasant and easy for developers.

## Configurating SpreadQL
````javascript
var sheetConfiguration = [{
    sheetName: sheetName,
    startColumn: column,
    startRow: row
}];

/**
 * Configures the main spreadcollection of a spreadsheet
 * @param {object[]} sheetConfigurations - The name and starting column and row from the spreadsheets you want to use.
 * @returns {SpreadCollection}
 */
SpreadQL.config(sheetConfiguration);
````

## Reading Data
````javascript
//Instance of SpreadCollection gotten from SpreadQL.config
spreadCollection

/**
 * Choose which spreadsheet to talk to.
 * @param {string} sheetname - The name of the spreadsheet to talk to
 * @returns {SpreadCollection}
 */
.from(sheetname)


/**
 * Optionally choose which columns to order data by
 * @param {string[]} columnNames - The names of the columns to order by
 * @param {SpreadQl.Order=SpreadQL.Order.ASC} - The way to order
 * @returns {SpreadCollection}
 */
.orderBy(columnNames, SpreadQL.Order)

/**
 * Optionally filter data from SpreadCollection
 * @param {object} criteria - The criteria to filter the data by
 * @returns {SpreadCollection}
 */
.find(criteria)

/**
 * Convert SpreadCollection to object
 * If no columnNames are given, all columns are included in object
 * @param {string[]} columnNames - The column names to be included in object
 * @returns {object}
 */
.select(columnNames);
````

---

## Inserting Data
````javascript
//Instance of SpreadCollection gotten from SpreadQL.config
spreadCollection

/**
 * Insert data in given spreadsheet
 * @param {string} sheetName - The name of the spreadsheet
 * @param {object|object[]} data - The data to insert
 * @returns {SpreadCollection}
 */
.insert(sheetName, data);
````

---

## Updating Data
````javascript
//Instance of SpreadCollection gotten from SpreadQL.config
spreadCollection

/**
 * Choose which spreadsheet to talk to.
 * @param {string} sheetname - The name of the spreadsheet to talk to
 * @returns {SpreadCollection}
 */
.from(sheetname)

/**
 * Update data in given spreadsheet
 * @param {object} criteria - The rows to be updated
 * @param {object} data - The new data for the given rows
 * @returns {SpreadCollection}
 */
.update(sheetName, data);
````

---

## Removing Data
````javascript
//Instance of SpreadCollection gotten from SpreadQL.config
spreadCollection

/**
 * Choose which spreadsheet to talk to.
 * @param {string} sheetname - The name of the spreadsheet to talk to
 * @returns {SpreadCollection}
 */
.from(sheetname)

/**
 * Remove data in given spreadsheet
 * @param {object} criteria - The rows to be removed
 * @returns {SpreadCollection}
 */
.remove(criteria);
````

<sup><center>SpreadQL - A lightweight spreadsheet SQL-ish library - © 2016 - SpreadQL Team </center></sup>
