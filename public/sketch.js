var url;
function initialize() {
    $("input").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            url = $('input').val();
            //CANNOT SENT A URL IN A SIMPLE GET REQUEST SOMEHOW
            var query = {
                'url': url
            }
            $.ajax({
              type: 'POST',
              dataType: "json",
              url: '/scrapecolor/',
              data: query,
              success: function(data){
                  gotColors(data);
              }
            });
        }
    });
}

function gotColors(data) {
  // console.log(colors);
  for(i = 0; i < data.colors.length; i++){
    $("#color_blocks").append('<div class="color_block" id='+i+'></div>');
    $("#"+i).css('background-color', data.colors[i]);
    $("#"+i).html(data.colors[i]);
  }
}
