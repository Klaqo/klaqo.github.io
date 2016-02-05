$(document).ready(function(){

  var amountToShow = 3;
  var ttURL = "https://teamtreehouse.com/samsycamore.json";

  function showCourses(data) {
    var courseHTML = '';
    $.each(data.badges.reverse(), function(i, course) {
      if (i < amountToShow - 1) {
      courseHTML += course.name + ", ";
      } else if (i === amountToShow - 1) {
      courseHTML += "and " + course.name + ". ";
      }
      
      if (i === amountToShow - 1) {
        return false;
      }
    });
    $('#treehouse-courses').html(courseHTML);
  } //end showCourses
  $.getJSON(ttURL, showCourses);

  $('.arrow').click(function(){
  	$('html,body').animate({scrollTop: $(document).height()-$(window).height()}, 'slow');
  })

}); //end ready