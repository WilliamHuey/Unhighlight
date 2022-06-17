Unhighlight - Deselect Event
=========================================

Description
-------------
Provides an unhighlight (deselect) event for input form elements (textarea, input). [Demo](http://williamhuey.github.io/code/unhighlight)

Usage
-------------

```bash
<script>
  $(document).ready(function () {

    //Attach to all input elements
    $("input").unhighlight(function () {
      alert("Unhighlight for input element.");
     });

    //Now for all textarea elements
    $("textarea").unhighlight(function () {
      alert("Event came from the textarea.");
     });

  });
</script>
```

Notes
------
Chrome-based browsers and IE will automatically perform a deselection event for a textarea when refocusing on the textarea after losing focus on a textarea that previously had text selected. Supposedly, there is text 'abc' highlighted in a textarea. Focus is lost by pressing the tab key and then the textarea is refocused by pressing shift tab. The 'unhighlight' event will trigger.

Text must be completely unhighlighted for the unhighlight event to occur. Partial unhighlighting is not supported. For example, the text '123' is selected in a textarea with the mouse still held down. The mouse moves to change the selection to '12', but the unhighlight event will not trigger.

If text was selected in an input or textarea element, focusing away from the element will not trigger the unhighlight event.

Requires JQuery >= 1.7 but should be on the >= 1.10.x branch to support older IE.

Tested with Opera >= 12.16, Firefox 23, Chrome 29, IE >= 6.

ChangeLog
------
v1.00.3
* Refactor: Namespace events

v1.00.2
* Fix:Touch up demo page

v1.00.1
* Fix: Correct README.md

v1.0.0
* Initial release