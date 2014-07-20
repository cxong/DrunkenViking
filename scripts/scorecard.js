function getScoreText(map) {
  // Calculate score: pickup % and destruction %
  var pickups = map.countTiles(map.before, map.after, function(before, after) {
    return before.index < 0 && after.index >= 0;
  });
  var destructibles = map.countTiles(map.before, map.after, function(before, after) {
    return before.index >= 0;
  });
  var pickedUp = map.countTiles(map.before, map.after, function(before, after) {
    return before.index < 0 && after.index >= 0 && after.alpha === 0;
  });
  var destroyed = map.countTiles(map.before, map.after, function(before, after) {
    return before.index >= 0 && after.alpha === 0;
  });
  return 'Winner!\n' +
         'Clothes: ' + Math.round(pickedUp * 100 / pickups) + '%\n' +
         'Destruction: ' + Math.round(destroyed * 100 / destructibles) + '%';
}