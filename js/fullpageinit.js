/* global $ */
$('document').ready(function() {
    $('#fullpage').fullpage({
        css3: true,
        scrollBar: false,
        anchors: ['section1', 'section2', 'section3', 'section4']
    });
});

$('#fullpage').fullpage({
    sectionsColor: ['yellow', 'orange', '#C0C0C0', '#ADD8E6'],
    onLeave: function(index, nextIndex, direction){
    }      
});