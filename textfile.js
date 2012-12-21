/**
+-----------------------------------------------------------------------------------+
|  textfile.js                                                                      |
|                                                                                   |
|  Version 0.1.1                                                                    |
|  Read, write and delete text files within a domain specific filesystem on HTML5   |
|  clients that support the FileSystem API standard. textfile.js is defined within  |
|  a RequireJS module for use with any Javascript application.                      |
|                                                                                   |
|  Copyright (c) 2012, Vito Chin <http://www.vitochin.com>                          |
|  All rights reserved.                                                             |
+-----------------------------------------------------------------------------------+
|  Redistribution and use in source and binary forms, with or without               |
|  modification, are permitted provided that the following conditions are met:      |
|     * Redistributions of source code must retain the above copyright              |
|       notice, this list of conditions and the following disclaimer.               |
|     * Redistributions in binary form must reproduce the above copyright           |
|       notice, this list of conditions and the following disclaimer in the         |
|       documentation and/or other materials provided with the distribution.        |
|     * Neither the name of the copyright holder nor the                            |
|       names of its contributors may be used to endorse or promote products        |
|       derived from this software without specific prior written permission.       |
+-----------------------------------------------------------------------------------+
|  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND  |
|  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED    |
|  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE           |
|  DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY                       |
|  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES       |
|  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;     |
|  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND      |
|  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT       |
|  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS    |
|  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.                     |
+-----------------------------------------------------------------------------------+
*/

define(function () {

  function TextFile(options) {
    this.filename = options.filename;
    if (options.filesize == undefined) {
      this.filesize = 5;
    } else {
      this.filesize = options.filesize;
    }
  }

  TextFile.prototype.run = function (callback) {
    var filename = this.filename;
    var filesize = this.filesize;
    var errorHandler = this.errorHandler;
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.webkitStorageInfo.requestQuota(PERSISTENT, filesize * 1024 * 1024, function (grantedBytes) {
      window.requestFileSystem(PERSISTENT, grantedBytes, function (fs) {
        fs.root.getFile(filename, {
          create: true
        }, function (fileEntry) {
          callback(fileEntry);
        }, errorHandler);
      }, errorHandler);
    }, function (e) {
      console.log('Error', e);
    });
  }

  TextFile.prototype.read = function (callback) {
    var errorHandler = this.errorHandler;
    this.run(

    function (fileEntry) {
      fileEntry.file(function (file) {
        var reader = new FileReader();
        reader.onloadend = callback;
        reader.readAsText(file);
      }, errorHandler);
    });
  }

  TextFile.prototype.write = function (content, callback) {
    this.run(

    function (fileEntry) {
      fileEntry.createWriter(function (fileWriter) {
        fileWriter.onwriteend = function (e) {
          callback();
        };
        fileWriter.onerror = function (e) {
          console.log('Failed to write: ' + e.toString());
        };
        fileWriter.seek(fileWriter.length);
        try {
          var blob = new Blob([content], {
            type: 'text/plain'
          });
          fileWriter.write(blob);
        } catch (error) {
          var bb = new(window.BlobBuilder || window.WebKitBlobBuilder)();
          bb.append(content);
          fileWriter.write(bb.getBlob());
        }
      }, this.errorHandler);
    });
  }

  TextFile.prototype.delete = function (callback) {
    this.run(

    function (fileEntry) {
      fileEntry.remove(function () {
        callback();
      }, this.errorHandler);
    });
  }

  TextFile.prototype.errorHandler = function (e) {
    var msg = '';
    switch (e.code) {
      case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        break;
      case FileError.NOT_FOUND_ERR:
        msg = 'NOT_FOUND_ERR';
        break;
      case FileError.SECURITY_ERR:
        msg = 'SECURITY_ERR';
        break;
      case FileError.INVALID_MODIFICATION_ERR:
        msg = 'INVALID_MODIFICATION_ERR';
        break;
      case FileError.INVALID_STATE_ERR:
        msg = 'INVALID_STATE_ERR';
        break;
      default:
        msg = 'Unknown Error';
        break;
    };
    console.log('Error: ' + msg);
  }

  return TextFile;

});
