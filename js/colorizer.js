/* global $ rIndex json */

$(document).ready(function() {
    $(".textSlide").css("background-color", json["themes"][rIndex]["textBack"]);
    $(".imgSlide").css("background-color", json["themes"][rIndex]["imgBack"]);
    $(".mwrapper").css("color", json["themes"][rIndex]["textColor"]);
    $(".resptxt").css("color", json["themes"][rIndex]["textColor"]);
});