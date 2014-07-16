/**
 * Created by Fx on 16/07/2014.
 */

var tabs = document.querySelector('paper-tabs');
tabs.addEventListener('core-select', function () {
    console.log("Selected: " + tabs.selected);
});