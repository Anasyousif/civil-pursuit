.gradient (@startColor: #eee, @endColor: white) {
  background-color: @startColor;
  background: -webkit-gradient(linear, left top, left bottom, from(@startColor), to(@endColor));
  background: -webkit-linear-gradient(top, @startColor, @endColor);
  background: -moz-linear-gradient(top, @startColor, @endColor);
  background: -ms-linear-gradient(top, @startColor, @endColor);
  background: -o-linear-gradient(top, @startColor, @endColor);
}