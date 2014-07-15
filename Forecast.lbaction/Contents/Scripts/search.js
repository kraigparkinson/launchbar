
function getNameForGeo(latitude, longitude) {
  var url = 'https://nominatim.openstreetmap.org/reverse?format=json&zoom=12&addressdetails=1&lat='
    + latitude + '&lon=' + longitude;
  try {
    var result = HTTP.getJSON(url, 5.0);
    if (result && result.data && result.data.address ) {
      if (result.data.address.village)
        return result.data.address.village + ', ' + result.data.address.state;
      if (result.data.address.neighbourhood)
        return result.data.address.neighbourhood + ', ' + result.data.address.state;
      if (result.data.address.city)
        return result.data.address.city + ', ' + result.data.address.state;
    }
    if (result && result.data && result.data.display_name)
      return result.data.display_name;
    LaunchBar.log('Cannot find name for geo ' + latitude + ' , ' + longitude 
      + '  ' + url + '  ' + JSON.stringify(result));
  } catch (exception) {
    LaunchBar.log('Error getNameForGeo ' + exception);
    LaunchBar.alert('Error getNameForGeo', exception);
  }
  return null;
}

function locationSearch(query) {
  var url = 'http://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=25&countrycodes=us&q='
    + encodeURIComponent(query);
  try {
    var items = [];
    var result = HTTP.getJSON(url, 5.0);
    if (result && result.data) {
      for (var i = 0; i < result.data.length; i++) {
        var r = result.data[i];
        var n = r.display_name;
        if (n.length > 50)
          n = r.display_name.substring(0,50);
        items.push({'title':n
          ,'subtitle':r.display_name
          ,'name':n
          ,'latitude':r.lat
          ,'longitude':r.lon
          ,'ico':DEFAULT_ICON
          ,'icon':DEFAULT_ICON
          ,'actionRunsInBackground':true
          ,'action':'actionSelect'
        });
      }
    }
    if (Action.debugLogEnabled) {
      items.push({'title':'Search API call','url':url});
    }
  } catch (exception) {
    LaunchBar.log('Error locationSearch ' + exception);
    LaunchBar.alert('Error locationSearch', exception);
  }
  if (items.length == 0)
    return {'title':'No location matches found','icon':'NotFound.icns'};
  return items;
}