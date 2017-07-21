var state = {}

var content = function(contentParams){
  var order=['date','sender','subject','audience']
  contentParams.date=contentParams.date.replace(/-/g,"")
  var contentCombine = order.map(function(d){
        return contentParams[d]
      }).join("_");
    return contentCombine;
}

var googleanalytics = function(params){

var gaKeys = Object.keys(params).filter(function(d){
    return params[d]!=""&&params[d]!="___"
  }).map(function(d){
    return "utm_"+d+"="+params[d];
  })

return gaKeys.join("&");

}

var bsd = function(params){
  var sourceOrder=['medium','source','campaign','content']
  var createSource = sourceOrder.map(function(d){
        return params[d]
      }).join("_");
    return "source="+createSource;
}

var actblue = function(params){
  var refCodeOrder=['medium','source','campaign','content']
  var createRefCode = refCodeOrder.map(function(d){
        return params[d]
      }).join("_");
    return "refcode="+createRefCode;
}

var paramFunctions = {
  googleanalytics:googleanalytics,
  bsd:bsd,
  actblue:actblue
}

$(document).ready(function(){

  var updateURL = function(){

    var params={};
    var contentParams={};

    var tools = $("#tool-select>.btn-group>label.active>input").map(function(idx,elem){
      return $(elem).val();
    }).get();

    var unsourcedURL = $("#basic-url").val();

    $(".input-group>.param:not(.content-form)").map(function(idx,elem){
      var id = $(elem).attr("id");
      var value = $(elem).val();
      params[id]=value
    }).get();

    $(".input-group>.content-form").map(function(idx,elem){
      var id = $(elem).attr("id");
      var value = $(elem).val();
      contentParams[id]=value

    }).get();

params.content=content(contentParams);
console.log(params);

return "https://"+unsourcedURL+"/?"+tools.map(function(d){
  return paramFunctions[d](params)
}).join("&")

  }



  $(".input-group>input").on("change",function(){
    $("#url-holder").text(updateURL());
  })

  $("#tool-select>.btn-group>.tool-select").on("click",function(){
    setTimeout(function(){
      $("#url-holder").text(updateURL());
    },300)
  })

$("#test").on("click",function(){
  window.open(updateURL(),"_blank")
})

$("#copy").on("click",function(){
  $("#url-holder").select()
  document.execCommand("copy");
})

})