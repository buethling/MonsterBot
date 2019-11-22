function parse_roll(roll_string) {
  var regex1 = /(\d+)?d(\d+)/;
  var results = regex1.exec(roll_string);
  return { count: results[1], type: results[2] };
}

function roll_dice(count, type) {
  var total = 0;
  var i;
  for (i = 0; i < count; i++) {
    total += Math.floor(Math.random() * type);
  }
  return total;
}

// ex. roll("2d6")
exports.roll = function(roll_string) {
  var the_dice = parse_roll(roll_string);
  return roll_dice(the_dice.count, the_dice.type);
};
