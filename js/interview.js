$('.output-interview').mouseover(function () {
  $('.input-base').animate({
    bottom:-50,
    opacity: 0.5,
  },300);
  $('.input-base').blur();
});

$('.output-interview').mouseout(function () {
  $('.input-base').animate({
    bottom:0,
    opacity: 0,
  },300);
});

