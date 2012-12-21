README
======

Use textfile.js to read, write and delete text files within a domain specific filesystem on HTML5 clients that support the FileSystem API standard. textfile.js is defined within a RequireJS module for use with any Javascript application.

Setting up
==========

	  require(['textfile'], function (TextFile) {

		var tfs = new TextFile({
		  filename: "test_file",
		  filesize: 3
		});

	  });

`filename` is any String indicating name of the file to create (Mandatory). `filesize` is the size of the file in Megabyte (Optional, defaults to 5 Megabyte). File will not actually be created until `write()` is called.  

Writing
=======

	  tfs.write("The road goes ever on and on - J.R.R. Tolkien", function () {
		console.log("Write Callback")
	  });

textfile.js will append content to existing files. To write from the beginning of a file afresh, `delete()` first.

Reading
=======

	  tfs.read(function () {
		console.log(this.result);
	  });

Call `read()` with a callback. Content of file will be available within `this.result`.

Deleting
========

	  tfs.delete(function () {
		console.log("File removed");
	  });

Call `delete()` with a callback.

Error Handling
==============

Textfile.js comes with a default error handler but you may create your own error handler and assign it to `TextFile.prototype.errorHandler`.

Example
=======

	  require(['textfile'], function (TextFile) {

		var tfs = new TextFile({
		  filename: "testtext"
		});

		tfs.write("The road goes ever on and on - J.R.R. Tolkien", function () {
		  tfs.read(function () {
		    console.log(this.result);
		    tfs.delete(function () {
		      console.log("File removed");
		    });
		  });
		});

	  });
