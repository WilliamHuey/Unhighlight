/*
 *  Project: unhighlight
 *  Description: Provides a deselect event for input form elements (textarea, input).
 *  Author: William Huey
 *  License: MIT
 *  Version: 1.00.3
 *
 *  Credits:
 *  Tim Down (getInputSelection, setInputSelection)
 *    http://stackoverflow.com/questions/3549250/highlighting-a-piece-of-string-in-a-textarea
 */
//var console = {};
//console.log = function () {};

;(function ($, window, document, undefined) {
  "use strict";
  var pluginName = "unhighlight";
  var PluginWrapper = function (element, arg) {
    var Plugin = function () {};
    //Pm is an alias for the prototype methods
    //For tracking the main object context
    //and less typing when referencing "pm" than "this"
    var pm = Plugin.prototype.unhighlightMethods = {
      init: function (el) {
        //Reference the prototype and element in the dataStore 
        var ds = pm.dataStore;
        ds.pm = pm;
        ds.el = el;
        //Attach the event listeners  
        pm.attachListeners($(el), ds);
      },
      attachListeners: function ($el, ds) {
        //var ds = pm.dataStore;
        //Internal deselect listener
        //Namespace the deselect 
        $el.on("unhighlight-deselect", function () {
          pm.trackSelection();
          //Create the event for the function
          var evt = $.Event("unhighlight");
          //Assign the target because the created event 
          //object is sparse and target is often used
          evt.target = ($el)[0];
          //Run the plugin's deselect event callback function    
          //Preserve the 'this' reference to the object
          arg[0].call(this, evt);
        })
          .on("select." + pluginName, function () {
            pm.trackSelection();
            ds.selectedAndBlurredBefore = false;
          })
          .on("blur." + pluginName, function () {
            var prevSelection = ds.isTextSelected;
            //For Ie to prevent misread cursor with blur
            if (prevSelection) {
              ds.selectedAndBlurredBefore = true;
            }
          })
          .on("keydown." + pluginName, function () {
            //Need to use a timer for keydown because event occurs 
            //before text changes in the input element
            setTimeout(function () {
              if (ds.selectedAndBlurredBefore) {
                //For Ie where the cursor of keydown event is misread
                //when occurring after a blur event with text selection
                //Do not track keydown event 
                ds.selectedAndBlurredBefore = false;
              } else {
                //Tracking keydown event as usual as if there
                //was not a blur after selection
                pm.trackSelection();
              }
            });
          })
        //Have to use a timer for these events because of a bug in Chrome
        //http://code.google.com/p/chromium/issues/detail?id=32865
        .on("click." + pluginName, function () {
          setTimeout(function () {
            pm.trackSelection();
            ds.selectedAndBlurredBefore = false;
          });
        })
          .on("mouseout." + pluginName + " focus." + pluginName, function () {
            setTimeout(function () {
              pm.trackSelection();
            });
          });
      },
      dataStore: {
        caretStatus: {
          start: 0,
          end: 0
        },
        isTextSelected: false,
        selectedAndBlurredBefore: false
      },
      setDataStore: function (key, value) {
        pm.dataStore[key] = value;
      },
      trackSelection: function () {
        //Reference variables from dataStore
        var pm = this,
          ds = pm.dataStore,
          $el = $(ds.el);
        //Save the previous state text selection
        var prevSelection = ds.isTextSelected;
        //Track if selection is present
        pm.setSelectionStatus();
        //Get the current state text selection
        var currentSelection = ds.isTextSelected;
        //Trigger the deselect event
        if (prevSelection && !currentSelection) {
          $el.trigger("unhighlight-deselect");
        }
      },
      isTextSelected: function (caretStatus) {
        //A difference indicates a range, which means a selection
        if (Math.abs(caretStatus.start - caretStatus.end) > 0) {
          return true;
        }
      },
      setSelectionStatus: function () {
        //Determine if text is actually selected
        //and sets the status
        var ds = pm.dataStore;
        ds.caretStatus = ds.pm.getInputSelection(ds.el);
        if (ds.pm.isTextSelected(ds.caretStatus)) {
          this.setDataStore("isTextSelected", true);
        } else {
          this.setDataStore("isTextSelected", false);
        }
      },
      getInputSelection: function (el) {
        var start = 0,
          end = 0,
          normalizedValue,
          range,
          textInputRange,
          len,
          endRange;
        if (typeof el.selectionStart === "number" && typeof el.selectionEnd === "number") {
          start = el.selectionStart;
          end = el.selectionEnd;
        } else {
          range = document.selection.createRange();
          if (range && range.parentElement() === el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");
            // Create a working TextRange that lives only in the input
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());
            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn"t return what we want
            // in those cases
            endRange = el.createTextRange();
            endRange.collapse(false);
            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
              start = end = len;
            } else {
              start = -textInputRange.moveStart("character", -len);
              start += normalizedValue.slice(0, start).split("\n").length - 1;
              if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                end = len;
              } else {
                end = -textInputRange.moveEnd("character", -len);
                end += normalizedValue.slice(0, end).split("\n").length - 1;
              }
            }
          }
        }
        return {
          start: start,
          end: end
        };
      }
    };
    //Initialize the Plugin
    pm.init(element);
  };
  $.fn[pluginName] = function () {
    var arg = arguments;
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        try {
          if ($.isFunction(arg[0])) {
            //Determine if the item in argument is a function
            $.data(this, "plugin_" + pluginName, new PluginWrapper(this, arg));
          }
        } catch (error) {
          throw 'Not a function.';
        }
      }
    });
  };
})(jQuery, window, document);
