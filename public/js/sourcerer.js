var state = {}

var loggedInDropdown = [
    {label:"Settings"
      , class:"settings"
      , id:"settings"
      , "data-toggle":"modal"
      , "data-target":"#account-settings-modal"},
    {label:"Logout"
      , class:"settings"
      , id:"user-logout"
      , "data-toggle":"modal"
      , "data-target":"#logged-out-modal"}]

var loggedOutDropdown = [
    {label:"Log In"
      , class:"settings"
      , id:"login"
      , "data-toggle":"modal"
      , "data-target":"#login-modal"}]

var mediumDefaults = [
      {value:"ads"
        , text:"Ads"},
      {value:"email"
        , text:"Email"},
      {value:"referral"
        , text:"Referral"},
      {value:"sms"
        , text:"SMS"},
      {value:"social"
        , text:"Social"}]

var sourceDefaults = [
      {value:"bsd"
        , text:"BSD"},
      {value:"mc"
        , text:"Mailchimp"},
      {value:"ngp"
        , text:"NGP"},
      {value:"fb"
        , text:"Facebook"},
      {value:"ig"
        , text:"Instagram"},
      {value:"tw"
        , text:"Twitter"},
      {value:"hustle"
        , text:"Hustle"}]

var campaignDefaults = [
      {value:"fr"
        , text:"Fundraising"},
      {value:"lb"
        , text:"Listbuilding"},
      {value:"msg"
        , text:"Messaging"},
      {value:"enviro"
        , text:"Environment"},
      {value:"edu"
        , text:"Education"},
      {value:"health"
        , text:"Health Care"},
      {value:"voting"
        , text:"Voting Rights"}]

var senderDefaults = [{value:""
        , text: ""}]

var audienceDefaults = [
      {value:"d"
        , text:"Donors"},
      {value:"nd"
        , text:"Non-Donors"},
      {value:"md"
        , text:"Maxed Donors"},
      {value:"vol"
        , text:"Volunteers"},
      {value:"vl"
        , text:"Volunteer Leaders"},
      {value:"attnd"
        , text:"Event Attendees"}]


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

var blackbaud = function(params){
  var srcOrder=['medium','source']
  var createSRC = srcOrder.map(function(d){
        return params[d]
      }).join("_");
  var subsrcOrder=['campaign','content']
  var createSubSRC = subsrcOrder.map(function(d){
        return params[d]
      }).join("_");
    return "s_src="+createSRC+"&s_subsrc="+createSubSRC;
}


var digital8 = function(params){
  var msOrder=['medium','source','campaign','content']
  var createMemberSource = msOrder.map(function(d){
        return params[d]
      }).join("_");
    return "ms="+createMemberSource;
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
  blackbaud:blackbaud,
  digital8:digital8,
  actblue:actblue
}

$(document).ready(function(){



  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      login();
    } else {
      console.log("User is logged out");
    }
  });

  function projectid() {
    return 'xxxxxxxx4xxxyxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function generateNewProjectID(projectid,cb) {

    firebase.database().ref('projects/' + projectid).set({
    projectid: projectid,
    createdat: Date.now(),
    protocol: "https://",
    medium: mediumDefaults,
    source: sourceDefaults,
    campaign: campaignDefaults,
    sender: senderDefaults,
    audience: audienceDefaults

      }).then(function(){return cb()})



  }



  var activeProjectSettings = function(){firebase.database().ref("projects/"+state.activeproject).once("value",function(d){
    var data = d.val()

    console.log(data.protocol)

    if(data.protocol==="https://"){
      $(".protocol-display")
                .attr("value","https://")
                .find("a")
                .attr("class","protocol-text")
                .text("https://")
      $(".protocol-choice.dropdown-menu>li")
                .attr("value","http://")
                .find("a")
                .attr("class","protocol-options")
                .attr("value","http://")
                .text("http://")
    }else{
      $(".protocol-display")
                .attr("value","http://")
                .find("a")
                .attr("class","protocol-text")
                .text("http://")
      $(".protocol-choice.dropdown-menu>li")
                .attr("value","http://")
                .find("a")
                .attr("class","protocol-options")
                .attr("value","https://")
                .text("https://")
    }

    data.medium.map(function(data){
      $("<li><a></a></li>")
              .attr("value",data["value"])
              .find("a")
              .attr("class","options")
              .text(data["text"])
              .end()
              .appendTo($(".dropdown-menu#medium"))

    })

    data.source.map(function(data){
      $("<li><a></a></li>")
              .attr("value",data["value"])
              .find("a")
              .attr("class","options")
              .text(data["text"])
              .end()
              .appendTo($(".dropdown-menu#source"))

    })

    data.campaign.map(function(data){
      $("<li><a></a></li>")
              .attr("value",data["value"])
              .find("a")
              .attr("class","options")
              .text(data["text"])
              .end()
              .appendTo($(".dropdown-menu#campaign"))

    })

    data.sender.map(function(data){
      $("<li><a></a></li>")
              .attr("value",data["value"])
              .find("a")
              .attr("class","options")
              .text(data["text"])
              .end()
              .appendTo($(".dropdown-menu#sender"))

    })

    data.audience.map(function(data){
      $("<li><a></a></li>")
              .attr("value",data["value"])
              .find("a")
              .attr("class","options")
              .text(data["text"])
              .end()
              .appendTo($(".dropdown-menu#audience"))

    })

    dropdownPopulateInput()

    $(".navbar-header>.header-title")
              .text("Sourcerer: "+data.projectname)

  })

  }

var loadProject = function(){  $(".edit-project-select.settings").on("click",function(){
    console.log("test")
    var currentProjectID = $(this).attr("id");
    console.log(currentProjectID)
    $("#account-settings-modal").modal("hide");
    $("#new-project-settings-modal").modal({backdrop: 'static',
              keyboard: false});

    state.projectid = currentProjectID

      firebase.database().ref('projects/'+currentProjectID).once("value",function(snapshot){
        var data = snapshot.val();
        mediumSetup(data.medium);
        sourceSetup(data.source);
        campaignSetup(data.campaign);
        senderSetup(data.sender);
        audienceSetup(data.audience);
        projectNameSetup(data.projectname);
        protocolSetup(data.protocol);

        $("#project-name").on("input",function(){
          var projectName = $('#project-name').val()
          firebase.database().ref('projects/'+currentProjectID+'/projectname').set(projectName)
        })

        $(".protocol-select").on("click",function(){
          var protocolSelect = $(this).attr("value")
          firebase.database().ref('projects/'+currentProjectID+'/protocol').set(protocolSelect)
        })

        $(".custom-medium-field").on("input",function(){
          var mediumSettings = $('.medium-input-row').map(function() {
            var row = $(this)
            var item = {};
            row.find("input").each(function(){
              var input = $(this)
              item[input.attr("data-key")]=input.val()
            })
            return item
          }).toArray();
          firebase.database().ref('projects/'+currentProjectID+'/medium').set(mediumSettings);
        })

        $(".custom-source-field").on("input",function(){
          var sourceSettings = $('.source-input-row').map(function() {
            var row = $(this)
            var item = {};
            row.find("input").each(function(){
              var input = $(this)
              item[input.attr("data-key")]=input.val()
            })
            return item
          }).toArray();
          firebase.database().ref('projects/'+currentProjectID+'/source').set(sourceSettings);
        })

        $(".custom-campaign-field").on("input",function(){
          var campaignSettings = $('.campaign-input-row').map(function() {
            var row = $(this)
            var item = {};
            row.find("input").each(function(){
              var input = $(this)
              item[input.attr("data-key")]=input.val()
            })
            return item
          }).toArray();
          firebase.database().ref('projects/'+currentProjectID+'/campaign').set(campaignSettings);
        })

        $(".custom-sender-field").on("input",function(){
          var senderSettings = $('.sender-input-row').map(function() {
            var row = $(this)
            var item = {};
            row.find("input").each(function(){
              var input = $(this)
              item[input.attr("data-key")]=input.val()
            })
            return item
          }).toArray();
          firebase.database().ref('projects/'+currentProjectID+'/sender').set(senderSettings);
        })

        $(".custom-audience-field").on("input",function(){
          var audienceSettings = $('.audience-input-row').map(function() {
            var row = $(this)
            var item = {};
            row.find("input").each(function(){
              var input = $(this)
              item[input.attr("data-key")]=input.val()
            })
            return item
          }).toArray();
          firebase.database().ref('projects/'+currentProjectID+'/audience').set(audienceSettings);
        })

      })


      $(".modal-title.project-settings")
                .text("Edit your project settings")

  })



}

  var updateURL = function(){

    var params={};
    var contentParams={};

    var tools = $("#tool-select>.btn-group>label.active>input").map(function(idx,elem){
      return $(elem).val();
    }).get();

    var tools = tools.sort().reverse()

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
console.log(tools);

var activeToolNames = $("#tool-select>.btn-group>label.active").map(function(idx,elem){
  return $(elem).text();
}).get();

state.tools=activeToolNames;
console.log(state.tools);

if(unsourcedURL.includes("?")){
return ($("#protocol-display>a").text()+(unsourcedURL+"&").replace(/\/\//g, '/')).replace(/http:\/\/https:\//g,"https://").replace(/http:\/\/http:\//g,"http://").replace(/https:\/\/https:\//g,"https://").replace(/https:\/\/http:\//g,"http://") +tools.map(function(d){
  return paramFunctions[d](params)
}).join("&").replace(/ /g,"-");
} else {
  return ($("#protocol-display>a").text()+(unsourcedURL+"/?").replace(/\/\//g, '/')).replace(/http:\/\/https:\//g,"https://").replace(/http:\/\/http:\//g,"http://").replace(/https:\/\/https:\//g,"https://").replace(/https:\/\/http:\//g,"http://") +tools.map(function(d){
    return paramFunctions[d](params)
  }).join("&").replace(/ /g,"-");

}




  }

  var updateShareLink = function(){

//    var sourcedURL = updateURL().val()
    var facebookBaseURL = 'https://www.facebook.com/sharer/sharer.php?u='

    return(facebookBaseURL+(($("#url-holder").text()).replace(/&/g,'%26').replace(/:/g,'%3A')))

  ;

  }


  var activeToolNames = $("#tool-select>.btn-group>label.active").map(function(idx,elem){
    return $(elem).text();
  }).get();

  state.tools=activeToolNames;
  $("#selected-tools").text("Here's your URL, which includes sourcing for "+state.tools.join(" / ")+":");

  $(".input-group>input").on("change",function(){
    $("#url-holder").text(updateURL());
    $("#url-holder").val(updateURL());
    $("#sharelink-holder").text(updateShareLink());
    $("#sharelink-holder").val(updateShareLink());


  })

  $("#tool-select>.btn-group>.tool-select").on("click",function(){
    setTimeout(function(){
      $("#url-holder").text(updateURL());
      $("#url-holder").val(updateURL());
      $("#sharelink-holder").text(updateShareLink());
      $("#sharelink-holder").val(updateShareLink());
      $("#selected-tools").text("Here's your URL, which includes sourcing for "+state.tools.join(" / ")+":");

    },300)
  })

$("#test").on("click",function(){
  window.open($("#url-holder").val(),"_blank");
  ga('send', 'event', 'test', 'click', 'URL Tested');
})

$("#copy").on("click",function(){
  $("#url-holder").select()
  document.execCommand("copy");
  ga('send', 'event', 'copy', 'click', 'URL Copied');
})

$("#sharelink").on("click",function(){
  $("#share-div").attr("class","row")
  setTimeout(function(){
    $("#sharelink-holder").text(updateShareLink());
    $("#sharelink-holder").val(updateShareLink());

  },300)

  ga('send', 'event', 'sharelink', 'click', 'Share Link Created');
})

$("#fbs-test").on("click",function(){
  window.open($("#sharelink-holder").val(),"_blank");
  ga('send', 'event', 'test', 'click', 'URL Tested');
})

$("#fbs-copy").on("click",function(){
  $("#sharelink-holder").select()
  document.execCommand("copy");
  ga('send', 'event', 'copy', 'click', 'URL Copied');
})


var dropdownPopulateInput = function(){$(".dropdown-menu>li").on("click",function(idx,elem){
  var id = $(this).parent().attr("id");
  var value = $(this).attr("value");
  $(".param#"+id).text(value);
  $(".param#"+id).val(value);
  $("#url-holder").text(updateURL());
  $("#url-holder").val(updateURL());
  $("#sharelink-holder").text(updateShareLink());
  $("#sharelink-holder").val(updateShareLink());
})}

$(".protocol-choice>li").on("click",function(idx,elem){
  var protocol = $(this).attr("value");
  console.log(protocol);
  if (protocol=="https://"){

    $("#protocol-display>a").text("https://");
    $(".protocol-choice>li").attr("value","http://");
    $(".protocol-choice>li>a").text("http://");
}
  else {
    $("#protocol-display>a").text("http://");
    $(".protocol-choice>li").attr("value","https://");
    $(".protocol-choice>li>a").text("https://");

}
  var protocol = $(".protocol-choice>li").attr("value");
  console.log(protocol);
  $("#url-holder").text(updateURL());
  $("#url-holder").val(updateURL());
  $("#sharelink-holder").text(updateShareLink());
  $("#sharelink-holder").val(updateShareLink());
;
})

var projectNameSetup = function(d){
    $("#project-name").val(d);
}

var protocolSetup = function(){
  $("#protocol-https").attr("class","protocol-select btn btn-default active");
  $("#protocol-http").attr("class","protocol-select btn btn-default");
}


var mediumSetup = function(options){
  $("#custom-medium-input").find(".medium-input-row").slice(0,-1).remove()
  options.map(function(d){
    $("#medium-input-row").first().clone().appendTo("#custom-medium-input")
        .find("#medium-label-input, #medium-tag-input").each(function(input){
          var key = $(this).attr("data-key")
          $(this).val(d[key])
          $(this).text(d[key])
        })
  });

  $("#medium-input-row").first().remove();

  $(".remove-line-button").on("click",function(){
    $(this).parent().parent().parent().remove();
  })

  $(".medium-remove-line-button").first().remove();
}

var sourceSetup = function(options){
$("#custom-source-input").find(".source-input-row").slice(0,-1).remove()
  options.map(function(d){
    $("#source-input-row").first().clone().appendTo("#custom-source-input")
        .find("#source-label-input, #source-tag-input").each(function(input){
          var key = $(this).attr("data-key")
          $(this).val(d[key])
          $(this).text(d[key])
        })
  });

  $("#source-input-row").first().remove();

  $(".remove-line-button").on("click",function(){
    $(this).parent().parent().parent().remove();
  })

  $(".source-remove-line-button").first().remove();
}

var campaignSetup = function(options){
$("#custom-campaign-input").find(".campaign-input-row").slice(0,-1).remove()
  options.map(function(d){
    $("#campaign-input-row").first().clone().appendTo("#custom-campaign-input")
        .find("#campaign-label-input, #campaign-tag-input").each(function(input){
          var key = $(this).attr("data-key")
          $(this).val(d[key])
          $(this).text(d[key])
        })
  });

  $("#campaign-input-row").first().remove();

  $(".remove-line-button").on("click",function(){
    $(this).parent().parent().parent().remove();
  })

  $(".campaign-remove-line-button").first().remove();
}

var senderSetup = function(options){
$("#custom-sender-input").find(".sender-input-row").slice(0,-1).remove()
  options.map(function(d){
    $(".sender-input-row").last().clone().appendTo("#custom-sender-input")
        .find("#sender-label-input, #sender-tag-input").each(function(input){
          var key = $(this).attr("data-key")
          $(this).val(d[key])
          $(this).text(d[key])
        })
  });


  $(".remove-line-button").on("click",function(){
    $(this).parent().parent().parent().remove();
  })

  $("#sender-input-row").first().find(".sender-remove-line-button").remove();
}

var audienceSetup = function(options){
$("#custom-audience-input").find(".audience-input-row").slice(0,-1).remove()
  options.map(function(d){
    $("#audience-input-row").first().clone().appendTo("#custom-audience-input")
        .find("#audience-label-input, #audience-tag-input").each(function(input){
          var key = $(this).attr("data-key")
          $(this).val(d[key])
          $(this).text(d[key])
        })
  });

  $("#audience-input-row").first().remove();

  $(".remove-line-button").on("click",function(){
    $(this).parent().parent().parent().remove();
  })

  $(".audience-remove-line-button").first().remove();
}



$("#signup-link>a").on("click", function(){
  $("#login-modal").modal("hide");
})

$("#login-link>a").on("click", function(){
  $("#signup-modal").modal("hide");
})



$("#create-new-project").on("click",function(){
  $("#account-settings-modal").modal("hide");
  $("#new-project-settings-modal").modal({backdrop: 'static',
            keyboard: false});
  var newProjectID = projectid();
  state.projectid = newProjectID

  generateNewProjectID(newProjectID,function(){
    firebase.database().ref('projects/'+newProjectID).once("value",function(snapshot){
      var data = snapshot.val();
      mediumSetup(data.medium);
      sourceSetup(data.source);
      campaignSetup(data.campaign);
      senderSetup(data.sender);
      audienceSetup(data.audience);
      projectNameSetup();
      protocolSetup();

      $("#project-name").on("input",function(){
        var projectName = $('#project-name').val()
        firebase.database().ref('projects/'+newProjectID+'/projectname').set(projectName)
      })

      $(".protocol-select").on("click",function(){
        var protocolSelect = $(this).attr("value")
        firebase.database().ref('projects/'+newProjectID+'/protocol').set(protocolSelect)
      })

      $(".custom-medium-field").on("input",function(){
        var mediumSettings = $('.medium-input-row').map(function() {
          var row = $(this)
          var item = {};
          row.find("input").each(function(){
            var input = $(this)
            item[input.attr("data-key")]=input.val()
          })
          return item
        }).toArray();
        firebase.database().ref('projects/'+newProjectID+'/medium').set(mediumSettings);
      })

      $(".custom-source-field").on("input",function(){
        var sourceSettings = $('.source-input-row').map(function() {
          var row = $(this)
          var item = {};
          row.find("input").each(function(){
            var input = $(this)
            item[input.attr("data-key")]=input.val()
          })
          return item
        }).toArray();
        firebase.database().ref('projects/'+newProjectID+'/source').set(sourceSettings);
      })

      $(".custom-campaign-field").on("input",function(){
        var campaignSettings = $('.campaign-input-row').map(function() {
          var row = $(this)
          var item = {};
          row.find("input").each(function(){
            var input = $(this)
            item[input.attr("data-key")]=input.val()
          })
          return item
        }).toArray();
        firebase.database().ref('projects/'+newProjectID+'/campaign').set(campaignSettings);
      })

      $(".custom-sender-field").on("input",function(){
        var senderSettings = $('.sender-input-row').map(function() {
          var row = $(this)
          var item = {};
          row.find("input").each(function(){
            var input = $(this)
            item[input.attr("data-key")]=input.val()
          })
          return item
        }).toArray();
        firebase.database().ref('projects/'+newProjectID+'/sender').set(senderSettings);
      })

      $(".custom-audience-field").on("input",function(){
        var audienceSettings = $('.audience-input-row').map(function() {
          var row = $(this)
          var item = {};
          row.find("input").each(function(){
            var input = $(this)
            item[input.attr("data-key")]=input.val()
          })
          return item
        }).toArray();
        firebase.database().ref('projects/'+newProjectID+'/audience').set(audienceSettings);
      })

    })

  });


})



$("#new-password-confirm").on("input",function(d){
  console.log("password entered")
  if($("#new-password-confirm").val()===$("#new-password").val()){
          $("#passwords-match").attr("class", "validate fa fa-check");
          $("#passwords-mismatch").attr("class", "hidden validate fa fa-times");
          $("#create-account").attr("disabled",null);
        }else{
          $("#passwords-match").attr("class", "hidden validate fa fa-check");
          $("#passwords-mismatch").attr("class", "validate fa fa-times");
          $("#create-account").attr("disabled","true");
        }

})



var logout = function(){
  console.log("logout")
  $("#hamburger-menu>li").remove();
  loggedOutDropdown.map(function(d){
    $("<li><a></a></li>")
                      .find("a")
                      .attr("class",d.class)
                      .attr("id",d.id)
                      .attr("value",d.label)
                      .attr("data-toggle",d["data-toggle"])
                      .attr("data-target",d["data-target"])
                      .text(d.label)
                      .end()
                      .appendTo($("#hamburger-menu"))
  })

  console.log(state.activeproject)
  state.activeproject = "06fe71ce4a23b1ae"
  console.log(state.activeproject)
  activeProjectSettings()
  window.location.reload()
}


var login = function(){
  state.user = firebase.auth().currentUser
  $("#login-modal").modal('hide');
  $("#signup-modal").modal('hide');
  $("#hamburger-menu>li").remove();


      loggedInDropdown.map(function(d){
        $("<li><a></a></li>")
                          .find("a")
                          .attr("class",d.class)
                          .attr("id",d.id)
                          .attr("value",d.label)
                          .attr("data-toggle",d["data-toggle"])
                          .attr("data-target",d["data-target"])
                          .text(d.label)
                          .end()
                          .appendTo($("#hamburger-menu"))
      });

      $("<li></li>")
        .attr("role","separator")
        .attr("class","divider")
        .appendTo($("#hamburger-menu"))

  var userProjects = firebase.database().ref("users/"+state.user.uid+"/projects").once("value",function(projects){
    var data = projects.val()
    console.log(projects.val())
    var userProjects = []
    Object.keys(data).forEach(function(d){
      data[d].projectname
    var project = {label:data[d].projectname
                  , class:"user-project settings"
                  , id:data[d].projectid}
    userProjects.push(project)


    })

    $("<span></span>")
          .attr("class","caret")
          .appendTo($("#current-project-dropdown"))

    userProjects.map(function(d){
      $("<li><a></a></li>")
                        .find("a")
                        .attr("class",d.class)
                        .attr("id",d.id)
                        .attr("value",d.label)
                        .attr("data-toggle",d["data-toggle"])
                        .attr("data-target",d["data-target"])
                        .text(d.label)
                        .end()
                        .appendTo($("#hamburger-menu"))


    });

    if (userProjects != null){

      console.log(userProjects)
      $("#current-project-dropdown").attr("class","btn btn-primary btn-block dropdown-toggle")
      $("#current-project-dropdown").attr("data-toggle","dropdown")
      $("#current-project-dropdown").attr("disabled",null)
      $("#current-project-dropdown").text("Select a project ")



      userProjects.map(function(d){
        $("<li><a></a></li>")
                          .find("a")
                          .on("click",loadProject())
                          .attr("class","edit-project-select settings")
                          .attr("id",d.id)
                          .attr("value",d.label)
                          .attr("data-toggle","modal")
                          .attr("data-target","new-project-settings-modal")
                          .text(d.label)
                          .end()
                          .appendTo($("#current-projects-edit-menu"))
                              })


  }

    $("a.edit-project-select").on("click",loadProject())

    $("a.user-project").on("click",function(){

      $(".dropdown-menu#medium>li").remove();
      $(".dropdown-menu#source>li").remove();
      $(".dropdown-menu#campaign>li").remove();
      $(".dropdown-menu#sender>li").remove();
      $(".dropdown-menu#audience>li").remove();
      console.log("test")
      var activeProject = $(this).attr("id")
      state.activeproject = activeProject
      activeProjectSettings()

    })





    $(".settings#user-logout").on("click",function(){
      console.log("logouttest")
      firebase.auth().signOut().then(function() {
      logout()
      }).catch(function(error) {
      // An error happened.
    });

    })

})

}







$("#create-account").on("click",function(){
  console.log("test");
  var email = $("#new-username").val()
  var password = $("#new-password").val()
  console.log(email);
  firebase.auth().createUserWithEmailAndPassword(email, password).then(
    function(user){
      firebase.database().ref('users/' + user.uid).set({
        email: email,
        userid: uid
      }).then(function(){
        login()
      })
    }
  ).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});

})

$("#user-login").on("click",function(){
  var email = $("#username").val()
  var password = $("#password").val()
  firebase.auth().signInWithEmailAndPassword(email, password).then(
    function(user){
      firebase.database().ref('users/' + user.uid).set({
        email: email,
        userid: uid
      }).then(function(){
        login()
      })
    }
  ).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
})

$(".remove-line-button").on("click",function(){
  $(this).parent().parent().parent().remove();
})

$(".add-medium-button").on("click",function(){
  $(".medium-input-row").last().clone().appendTo("#custom-medium-input").find("input").val("");

    $(".remove-line-button").on("click",function(){
      $(this).parent().parent().parent().remove();
})

$(".custom-medium-field").on("input",function(){
  var newProjectID = state.projectid;
  var mediumSettings = $('.medium-input-row').map(function() {
    var row = $(this)
    var item = {};
    row.find("input").each(function(){
      var input = $(this)
      item[input.attr("data-key")]=input.val()
    })
    return item
  }).toArray();
  console.log(mediumSettings);
  firebase.database().ref('projects/'+newProjectID+'/medium').set(mediumSettings);
})
})

$(".add-source-button").on("click",function(){
$(".source-input-row").last().clone().appendTo("#custom-source-input").find("input").val("");

  $(".remove-line-button").on("click",function(){
    $(this).parent().parent().parent().remove();
})

$(".custom-source-field").on("input",function(){
  var newProjectID = state.projectid;
  var sourceSettings = $('.source-input-row').map(function() {
    var row = $(this)
    var item = {};
    row.find("input").each(function(){
      var input = $(this)
      item[input.attr("data-key")]=input.val()
    })
    return item
  }).toArray();
  firebase.database().ref('projects/'+newProjectID+'/source').set(sourceSettings);
})
})

$(".add-campaign-button").on("click",function(){
$(".campaign-input-row").last().clone().appendTo("#custom-campaign-input").find("input").val("");

  $(".remove-line-button").on("click",function(){
    $(this).parent().parent().parent().remove();
})

$(".custom-campaign-field").on("input",function(){
  var newProjectID = state.projectid;
  var campaignSettings = $('.campaign-input-row').map(function() {
    var row = $(this)
    var item = {};
    row.find("input").each(function(){
      var input = $(this)
      item[input.attr("data-key")]=input.val()
    })
    return item
  }).toArray();
  firebase.database().ref('projects/'+newProjectID+'/campaign').set(campaignSettings);
})

})


$(".add-sender-button").on("click",function(){
$(".sender-input-row").last().clone().appendTo("#custom-sender-input").find("input").val("");

  $(".remove-line-button").on("click",function(){
    $(this).parent().parent().parent().remove();
})

$(".custom-sender-field").on("input",function(){
  var newProjectID = state.projectid;
  var senderSettings = $('.sender-input-row').map(function() {
    var row = $(this)
    var item = {};
    row.find("input").each(function(){
      var input = $(this)
      item[input.attr("data-key")]=input.val()
    })
    return item
  }).toArray();
  firebase.database().ref('projects/'+newProjectID+'/sender').set(senderSettings);
})
})

$(".add-audience-button").on("click",function(){
$(".audience-input-row").last().clone().appendTo("#custom-audience-input").find("input").val("");

  $(".remove-line-button").on("click",function(){
    $(this).parent().parent().parent().remove();
  })

  $(".custom-audience-field").on("input",function(){
  var newProjectID = state.projectid;
    var audienceSettings = $('.audience-input-row').map(function() {
      var row = $(this)
      var item = {};
      row.find("input").each(function(){
        var input = $(this)
        item[input.attr("data-key")]=input.val()
      })
      return item
    }).toArray();
    firebase.database().ref('projects/'+newProjectID+'/audience').set(audienceSettings);
  })
})

$("#close-create-modal").on("click",function(){
  $("#save-and-close").modal({backdrop: 'static',
            keyboard: false});
})

$("#save").on("click",function(){
  console.log(state.user)
  firebase.database().ref('users/'+state.user.uid+"/projects").once("value",function(snapshot){
    var data = snapshot.val()

      firebase.database().ref('users/'+state.user.uid+"/projects/"+state.projectid).set(
        {
          projectid: state.projectid,
          projectname: $('#project-name').val()
        })


  })

  $("#save-and-close").modal("hide")
  $("#new-project-settings-modal").modal("hide")
  login()
})

$("#discard").on("click",function(){
  $("#save-and-close").modal("hide")
  $("#new-project-settings-modal").modal("hide")
})

$("#edit").on("click",function(){
  $("#save-and-close").modal("hide")
})

dropdownPopulateInput()

$("#return").on("click",function(){
  $("#forgot-password-modal").modal("hide")
})

$(".forgot-password").on("click",function(){
  var auth = firebase.auth();
  var emailAddress = $("#username").val();

  auth.sendPasswordResetEmail(emailAddress).then(function() {
  // Email sent.
  }).catch(function(error) {
  // An error happened.
});

})
//$("nav-tabs>li>a").on("click",function(){
//  console.log("nav tab clicked")
//  $(this).parent().attr("class","active")
//})









//$("#new-password-confirm").on("input",function(d){
//  console.log("password entered")
//  if($("#new-password-confirm").val()===$("#new-password").val()){
//          $("#passwords-match").attr("class", "validate fa fa-check");
//          $("#passwords-mismatch").attr("class", "hidden validate fa fa-times");
//          $("#create-account").attr("disabled",null);
//        }else{
//          $("#passwords-match").attr("class", "hidden validate fa fa-check");
//          $("#passwords-mismatch").attr("class", "validate fa fa-times");
//          $("#create-account").attr("disabled","true");
//        }})




})
