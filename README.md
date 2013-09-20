Unhighlight - Deselect Event
=========================================

Description: 
-------------
Provides a unhighlight (deselect) event for input form elements (textarea, input).

Usage:
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



Notes:
------
Chrome-based browsers and Ie will automatically perform a deselection for a textarea when refocusing on the textarea after losing focus on a textarea that previously had text selected. Supposely, there is text 'abc', highlighted in a textarea. Focus is lost by pressing tab and then the textarea is refocused by pressing shift tab. The unhighlight event will trigger.

Text must be completely unhighlighted for the unhighlight event to occur. Partial unhighlighting is not supported. For example, the text '123' is selected in a textarea with the mouse still held down. The mouse moves to change the selection to '12', but the unhighlight event will not trigger.

If text was selected in an input or textarea element, focusing away from the element will not trigger the unhighlight event.

Requires JQuery >= 1.7 but should be on the >= 1.10.x branch to support older Ie.

Tested with Opera >= 12.16, Firefox 23, Chrome 29, Ie >= 6.

ChangeLog:
------

v1.00

* Use native maxlength when supported.
* Ability to show or hide indicator.
* Drag and drop restriction.
