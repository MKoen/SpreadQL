# Update
The SpreadQL source code has now been committed and can be explored by anyone interested!
More features and functionality is coming in the future.

![SpreadQL. A lightweight spreadseet SQL-ish library.](https://i.imgur.com/oYz5qhe.png "SpreadQL. A lightweight spreadseet SQL-ish library." =300x120)

---

# SpreadQL
A lightweight spreadsheet SQL-ish library.

SpreadQL is a library that creates an interface between the Google Apps Script and the Spreadsheet communication layer. It makes talking to a Google Spreadsheet more pleasant and easy for developers.

## How to install
You can easily import SpreadQL by going to Resources > Libraries. Then just use our key (MWbnTNG1K7a7dfZDiJbpememrDAFfAv3a) to find it. Then just click "Select" and chose the latest version. Now just click "Save" and you're done.

## Configuring SpreadQL
Before you can address data, you first need to configure it so SpreadQL knows what you're asking. It's pretty easy actually, you just pass it an array of objects referring to your sheets and where the tables start. Et voilà, done!

````javascript
/**
 * Configures the main spreadcollection of a spreadsheet
 * @param {object[]} sheetConfigurations - The name and starting column and row from the spreadsheets you want to use.
 * @param {string} sheetConfigurations.sheetName - The name of the sheet you want to use.
 * @param {string} sheetConfigurations.startColumn = A - The starting column of the table on given sheet.
 * @param {number} sheetConfigurations.startRow = 1 - The name and starting column and row from the spreadsheets you want to use.
 * @param {string} sheetConfigurations.autoIncrement - The column that will be incremented when inserting data.
 * @returns {SpreadCollection}
 */
SpreadQL.config(sheetConfiguration);
````


## Reading Data
This is the most used - and most important - part of SpreadQL, the ability to read data from your spreadsheet like it's a fully working database.

So first of all, you use the ````from```` function to select which sheet to get the data from. After this, you can use a number of optional functions (````orderBy```` , ````find```` ````join```` and ````distinct````) to to customise the result. All these functions will return an object of class ````SpreadCollection````.

After you choose what to read, you can use the ````select```` function. This to convert the ````SpreadCollection```` to a fully native JavaScript array of objects with the properties of the columns you selected using this function.

Here is the JSDoc for reading data using SpreadQL:

````javascript
//Instance of SpreadCollection returned from SpreadQL.config
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
 * @param {SpreadQl.Order=SpreadQL.Order.ASC} [order] - The way to order
 * @returns {SpreadCollection}
 */
.orderBy(columnNames, order)

/**
 * Optionally filter data from SpreadCollection
 * @param {object} criteria - The criteria to filter the data by
 * @returns {SpreadCollection}
 */
.find(criteria)

/**
 * Optionally join data from another spreadcollection
 * @param {string} columnName - The column to base the join upon
 * @param {string} otherColumnName - The column of another sheet of the same spreadsheet to join with. "sheetName.ColumnName" syntax is required.
 * @returns {SpreadCollection}
 */
.join(columnName, otherColumnName)

/**
 * Optionally remove duplicate data
 * If no columns are given, all columns are checked for duplicates
 * @param {string[]} [columnNames] - The columns to check for duplicates
 * @returns {SpreadCollection}
 */
.distinct(columnNames)


/**
 * Convert SpreadCollection to object
 * If no columnNames are given, all columns are included in object
 * @param {string[]} [columnNames] - The column names to be included in object
 * @returns {object}
 */
.select(columnNames);
````


## Inserting Data
If you want to insert something in a table using your script, SpreadQL is the library for you! Just call the ````insert```` function on your instance of ````SpreadCollection```` and pass the name of the sheet and the data you want to insert on it.
Here is the JSDoc for inserting data using SpreadQL:

````javascript
//Instance of SpreadCollection returned from SpreadQL.config
spreadCollection

/**
 * Insert data in given spreadsheet
 * @param {string} sheetName - The name of the spreadsheet
 * @param {object|object[]} data - The data to insert
 * @returns {SpreadCollection}
 */
.insert(sheetName, data);
````


## Updating Data
Updating the data in your sheets is also possible using SpreadQL. Just chose a sheet and select which rows to update and pass the values to update it with.

Here is the JSDoc for updating data using SpreadQL:

````javascript
//Instance of SpreadCollection returned from SpreadQL.config
spreadCollection

/**
 * Choose which spreadsheet to talk to.
 * @param {string} sheetname - The name of the spreadsheet to talk to
 * @returns {SpreadCollection}
 */
.from(sheetname)

/**
 * Update data in given spreadsheet
 * @param {object} properties - The rows to be updated
 * @param {object} data - The new data for the given rows
 * @returns {SpreadCollection}
 */
.update(properties, newValues);
````


## Removing Data
Since SpreadQL has a fully working CRUD functionality, you can also remove data. This is almost the same as update, but you just use the ````update```` function

Here is the JSDoc for removing data using SpreadQL:

````javascript
//Instance of SpreadCollection returned from SpreadQL.config
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


## Exporting Data
A special feature in SpreadQL is that you can export your selected data to a new sheet in the existing spreadsheet.

This has the same syntax as reading data, except that you use the ````export```` functions instead of the ````select```` function.

Here is the JSDoc for exporting data using SpreadQL:

````javascript
//Instance of SpreadCollection returned from SpreadQL.config
spreadCollection

//This includes the full syntax of reading data, but without the select function.

/**
 * Export SpreadCollection to a new spreadsheet.
 * If no columnNames are given, all columns are exported
 * @param {fileName} fileName - The name of the new spreadsheet that will be generated
 * @param {string[]} [columnNames] - The column names to be included in the new spreadsheet
 * @returns {undefined}
 */
.export(fileName, columnNames);
````

---

## Full list of available functions
### SpreadQL
- ````config````

### SpreadCollection
- ````insert````
- ````from````
- ````orderBy````
- ````find````
- ````join````
- ````distinct````
- ````select````
- ````export````
- ````update````
- ````remove````

<sup><center>© 2016 - SpreadQL Team </center></sup>
