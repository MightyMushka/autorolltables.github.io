// autorolltables
// developed by dangeratio
//
//



// initial variables

var current;
var side_obj;
var obj_current_display;
var obj_history_display;
var mouseover_on = true;
var delete_enabled = false;


function init() {

  // load the menu
  loadmenu();

  // default to dungeons table
  loadleftdisplay("All");

  // check querystring for menuhover
  menuhovercheck();

  //hide initially hidden
  $('#rightview-history').hide();
  $('#rightview-current').hide();
  $('#rightview-history-display').hide();
  $("#success-alert").hide();
  $("#fail-alert").hide();
  $("#collapse-history-tab").hide();
  $("#expand-history-tab").hide();
  $("#clear-history-roll-tab").hide();

  // querystring filter
  var urlParams = new URLSearchParams(window.location.search);
  if ( urlParams.has('filter') ) {
      $('#filter').val(urlParams.get('filter'));
      filter();
  }
}

function log(obj) {
  console.log(obj);
}

function display_side(){
  copyseparator = "------------------------------------------\n";
  displayseparator = ""; // <hr>

  $("#rightview-current").html( $("#rightview-current").html() + side_obj );

  if ( $("#rightview-history").html() == "" ) {
    $("#rightview-history").html( side_obj );
  } else {
    $("#rightview-history").html( $("#rightview-history").html() + copyseparator + side_obj );
  }

  $("#rightview-current-display").html( $("#rightview-current-display").html() + obj_current_display );

  copy_div = "<div class='for-copy'>" + side_obj + "</div></div>";    // inside end of displayed roll

  if ( $("#rightview-history-display").html() == "" ) {
    $("#rightview-history-display").html( obj_history_display + copy_div );
  } else {
    $("#rightview-history-display").html( $("#rightview-history-display").html() + displayseparator + obj_history_display + copy_div );
  }

  rightscrolltop();
}

function output_filter(obj) {
  return obj;
}

function display_filter(obj) {
  return obj;
}

function side(obj) {
  side_obj = side_obj + obj + "\n";
  return 0;
}

function side_display(obj) {
  obj_current_display = obj_current_display + obj + "<br>";
  obj_history_display = obj_history_display + obj + "<br>";
}

function side_display_current(obj) {
  obj_current_display = obj_current_display + obj + "<br>";
}

function side_display_history(obj, show_break) {
  if ( show_break == true ) {
    obj_history_display = obj_history_display + obj + "<br>";
  } else {
    obj_history_display = obj_history_display + obj;
  }
}

function clearright() {
  $("#rightview-current").html('');
  $("#rightview-current-display").html('');
  side_obj = "";
  obj_current_display = "";
  obj_history_display = "";
  return 0;
}


function get_table(table){
  switch(table) {
    case "dungeons":
      return window.dungeons; // CHANGED from top.dungeons
      break;
    case "factions":
      return window.factions; // CHANGED from top.factions
      break;
    case "food":
      return window.food;     // CHANGED from top.food
      break;
    case "magic":
      return window.magic;    // CHANGED from top.magic
      break;
    case "monsters":
      return window.monsters; // CHANGED from top.monsters
      break;
    case "npcs":
      return window.npcs;     // CHANGED from top.npcs
      break;
    case "objects":
      return window.objects;  // CHANGED from top.objects
      break;
    case "plots":
      return window.plots;    // CHANGED from top.plots
      break;
    case "settlements":
      return window.settlements; // CHANGED from top.settlements
      break;
    case "wilderness":
      return window.wilderness; // CHANGED from top.wilderness
      break;
    case "subrolls":
      return window.subrolls;   // CHANGED from top.subrolls
      break;
  }
}

function clearleft() {
  $('#left-display-list').children().remove();
}

function loadleftdisplay(curr_table) {
  clearleft();

  // find the correct menu (from the selected menu item)
  var menu = window.menu; // CHANGED from top.menu
  for(var i=0;i<menu.length;i++){ // Added var for i
    if(menu[i].title==curr_table){
      current = menu[i];
    }
  }

  // top menu css highlight
  var menu_id = "#" + curr_table; // Added var for menu_id
  $(".menuitem").removeClass('menu-selected');
  $(menu_id).addClass('menu-selected');

  // iterate that menu, and add items to select
  for (var i = 0; i < current.items.length; i++) {
    //selectlist.options[selectlist.options.length] = new Option(current.items[i].title,current.items[i].title);
    var display_title = current.items[i].title;
    //var patt = /\/\(\/g/gi;

    if (display_title.match(/\(/gi) != null) {
      display_title = display_title.replace(/\(/gi, "<br><span class='subtext'>(");
      display_title = display_title + "</span>";
    }
    $('#left-display-list').append("<div class='list-item' listid='" + i + "' item=\"" + current.items[i].title + "\">" + display_title + "</div>");
  }

  leftscrolltop();
  blur();

}


// return menu variable from table name
function get_menu(table_name) {
  var menu = window.menu; // CHANGED from top.menu
  for(var i=0;i<menu.length;i++){ // Added var for i
    if(menu[i].id==table_name){
      return menu[i];
    }
  }
}

// get table split from main_roll id
function get_roll_table(id_string){
  var tmp = id_string.split("/");
  return tmp[0];
}

// get id split from main_roll id
function get_roll_id(id_string){
  var tmp = id_string.toString().split("/");
  return tmp[1];
}

// return menu variable from table name
function get_roll_array(roll_name, title) {
  var menu = window.menu; // CHANGED from top.menu
  for(var i=0;i<menu.length;i++){ // Added var for i
    if(menu[i].id==title){
      for(var z=0;z<menu[i].items.length;z++){ // Added var for z
        if(menu[i].items[z].title==roll_name){
          return menu[i].items[z];
        }
      }
    }
  }
}

// get title of roll from roll id and table
function get_roll(id, table){
  table = get_table(table);
  for(var i=0;i<table.length;i++){ // Added var for i
    if(table[i].id==id){
      return table[i];
    }
  }
  return "";
}

//find a roll title
function get_roll_title(val) {
  // IMPORTANT: Ensure that window.rolls is defined in another file
  // (e.g., a roll_rolls.js that does window.rolls = [...])
  // If window.rolls is undefined, this function will cause a TypeError.
  var rolls = window.rolls; // CHANGED from top.rolls
  if (rolls) { // Check if rolls is defined
    for(var i=0; i<rolls.length; i++) { // Added var for i
      if(rolls[i].id == val) {
        return rolls[i].title; // CORRECTED from: return i.title;
      }
    }
  }
  return ""; // Return empty string if rolls is undefined or item not found
}

// used by menuhover querystring: ?menuhover=false on URL turns off menu hover function
function getquerystring(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function menuhovercheck(){
  var menuhover = "";
  try {
    menuhover = getquerystring("menuhover");
  } catch(e) {}

  if ( menuhover == 'false' ){
    togglehovermenu();
  }
}

function loadmenu() {
  var menu = window.menu; // CHANGED from top.menu
  if (menu) { // Check if menu is defined
    for(var i=0;i<menu.length;i++){ // Added var for i
      var item = menu[i].title;
      $("#menu").append("<a href='#' class='menuitem btn' id='" + item + "'>" + item + "</a>")
    }
  }
}

// regex for identifying sub-rolls
var inline_roll_match = /\([dD][\d]{1,3}\) ?:/;
var indicator_match = /\<\*>.? ? ?([^\d]*)/;
var d_match = /^[dD]/;

// sub roll (for inline string rolls)
function inline_roll(roll_text) {

  var result = "";
  var roll_type_str; // Renamed to avoid conflict with numeric roll_type
  var roll_description;

  // identify roll type
  var roll_type_match = roll_text.match(inline_roll_match); // Use a different var for the match object
  if (!roll_type_match) return roll_text; // Return original if no match

  roll_description = roll_text.substring(0, roll_type_match.index).trim();
  var roll_text_without = roll_text.replace(roll_type_match[0],""); // Use match[0]
  roll_type_str = roll_type_match[0].replace(":","").replace(" ","").replace(")","").replace("(","").replace("d","").replace("D","");

  // attempt to pull integer out of it, if not, send back source string
  var roll_type_num; // Use a different var for the numeric roll_type
  try {
    roll_type_num = parseInt(roll_type_str);
    if (isNaN(roll_type_num)) return roll_text; // Return if not a number
  } catch(e) {
    return roll_text;
  }

  // roll a random 1 - roll_type_num
  var rand = Math.ceil(Math.random() * roll_type_num);

  // find that number with a period afterwards, capture next non-whitespace character through until next decimal number detected.
  roll_text_without = roll_text_without.replace(new RegExp("\\b" + rand + "\\b"),"<*>"); // Use RegExp for whole word match

  // regex match for indicator string <*> to the next decimal, capturing
  var indicator_match_result = roll_text_without.match(indicator_match); // Use a different var
  if (!indicator_match_result || !indicator_match_result[1]) return roll_text; // Check if match and group exist

  result = indicator_match_result[1].replace(/^\s+/, '').replace(/\s+$/, '').replace(/[;,.]$/, '');

  // return display in a clear format
  return "(d" + roll_type_num + ") " + roll_description + ": " + result;
}

// test button
function roll_test() {

  var sel = document.getElementById("selectlist");
  // var index = sel.selectedIndex; // sel might be null if "selectlist" doesn't exist
  // var seltext = sel.options; // sel might be null

  clearright();
  side("Tests:");
  side_display("Tests:");

  // This part needs roll_table to be defined.
  // Assuming roll_table is set similarly to how it's set in perform_roll()
  // For testing, you might need to ensure 'current' and 'roll_table' are appropriately set
  // or this function might not work as intended.
  if (typeof roll_table !== 'undefined' && roll_table && roll_table.rolls) {
    for (var z = 0; z < roll_table.length; z++){ // This should likely be roll_table.rolls.length if roll_table has a 'rolls' property
                                                // or just roll_table.length if roll_table itself is the array of rolls.
                                                // The original structure implies roll_table is an object with a 'rolls' array.
                                                // Let's assume roll_table is an array for now based on the original loop.
      if (roll_table[z] && roll_table[z].rolls) { // Added checks
        for (var i = 0; i < roll_table[z].rolls.length; i++) {
          if (roll_table[z].rolls[i] && roll_table[z].rolls[i].roll) { // Added checks
            for (var a = 0; a < roll_table[z].rolls[i].roll.length; a++){
              var returned = roll_table[z].rolls[i].roll[a];
              if(typeof returned === 'string' && returned.match(inline_roll_match)) {
                returned = inline_roll(returned);
              }
            }
          }
        }
      }
    }
  }


  display_side();
  blur();
}

// This get_roll_title is different from the one at line ~228.
// This one takes (id, table_name_param) and is used by roll_sub_roll
function get_roll_title(id, table_name_param) { // Renamed table to table_name_param to avoid conflict
  var table_data = get_table(table_name_param); // Use table_name_param
  if (table_data) {
    for(var i=0;i<table_data.length;i++){
      if(table_data[i].id==id){
        return table_data[i].title;
      }
    }
  }
  return "";
}


function roll_roll(id, table_name_param){ // Renamed table to table_name_param
  var table_data = get_table(table_name_param); // Use table_name_param
  if (table_data) {
    for(var i=0;i<table_data.length;i++){
      if(table_data[i].id==id){
        var length = table_data[i].roll.length;
        // log("roll length:"+length);
        var rand = Math.floor(Math.random() * length);
        return table_data[i].roll[rand];
      }
    }
  }
  return "";
}


function roll_sub_roll(id, table_name_param) { // Renamed table to table_name_param
  var table_data = get_table(table_name_param); // Use table_name_param
  var result = "";

  if (table_data) { // Check if table_data is defined
    for(var i=0;i<table_data.length;i++) {
      if(table_data[i].id==id){
        // found correct sub-roll id

        var title = table_data[i].title;
        var type = table_data[i].roll_type;
        var number = table_data[i].number;
        var percent_of = table_data[i].percent_of;
        var percent_to = table_data[i].percent_to;

        if(Math.ceil(Math.random() * 100)<=percent_to){

          if(type=="type"){
            // execute type roll
            var length = table_data[i].roll.length;
            var amount = get_roll_value(number);
            amount = Math.ceil(amount * (percent_of / 100));

            side( title + " : " + amount );
            side_display(title + " : <b>" + amount + "</b>");

            // roll that many times
            for(var z=0;z<amount;z++){
              // roll for each roll
              var pre_title = "(" + (z+1) + ") ";
              // var pre = "     "; // Not used
              // var pre_display = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"; // Not used

              // for each roll in total amount, roll main (random * length), then roll all sub-attributes accordingly
              var rand = Math.floor(Math.random() * length);  // floor to match array counting (start at 0)
              var rolls = table_data[i].roll[rand].main_rolls;

              // show title of this result
              side(pre_title + table_data[i].roll[rand].title);
              side_display("<b>" + pre_title + table_data[i].roll[rand].title + "</b>");
              side_display("<div class='indent'>");

              for(var x=0; x<rolls.length;x++){
                var sub_id = get_roll_id(rolls[x]); // Renamed id to sub_id
                var sub_table = get_roll_table(rolls[x]);
                var sub_title = get_roll_title(sub_id, sub_table); // Use sub_id
                var value = roll_roll(sub_id, sub_table); // Use sub_id

                if(typeof value === 'string' && value.match(inline_roll_match)) {value = inline_roll(value);}

                side("   " + sub_title + " : " + value); // Added spaces for indentation in text version
                side_display(sub_title + " : <b>" + value + "</b>");
              }
              side_display("</div>");
            }
          } else if(type=="amount") {
            var length = table_data[i].rolls.length;
            var singular_item = table_data[i].singular;
            var amount = get_roll_value(number);
            amount = Math.ceil(amount * (percent_of / 100));

            side(title + " : " + amount);
            side_display(title + " : <b>" + amount + "</b>");

            // roll that many times
            for(var z=0;z<amount;z++){
              // roll for each roll
              side("(" + (z+1) + ") " + singular_item);
              side_display("<b>(" + (z+1) + ") " + singular_item + "</b>");
              // var pre = "     "; // Not used
              // var pre_display = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"; // Not used
              side_display("<div class='indent'>");
              for(var x=0;x<length;x++) {
                // roll sub-roll this number of times
                var sub_id = get_roll_id(table_data[i].rolls[x]); // Renamed id to sub_id
                var sub_table = get_roll_table(table_data[i].rolls[x]);
                var sub_title = get_roll_title(sub_id, sub_table); // Use sub_id
                var value = roll_roll(sub_id, sub_table);         // Use sub_id

                if(typeof value === 'string' && value.match(inline_roll_match)) {value = inline_roll(value);}

                side( "   " + sub_title + " : " + value); // Added spaces for indentation
                side_display( sub_title + " : <b>" + value + "</b>");
              }
              side_display("</div>");
            }
          }
        }
      }
    }
  }


  if( result != "" ){
    return result;
  } else {
    return "";
  }
}

function get_roll_value(str) {
  // interpret various rolls - d10, 1d10, 4d4, maybe even 6d6+10 someday (but not currently)
  // var value=0; // Not used

  if(typeof str !== 'string') return 0; // Handle non-string input

  if(str.match(d_match)) {
    // single roll (no number before the "d")
    // remove the d
    str = str.toLowerCase().replace("d","");
    // roll randomly
    var rand = Math.ceil(Math.random() * parseInt(str));
    return isNaN(rand) ? 0 : rand; // Handle NaN if parseInt fails

  } else {
    // multiple rolls (split on the "d" and execute a random [1] [0] times)
    str = str.toLowerCase().split("d");
    if (str.length < 2) return 0; // Ensure split was successful

    var total = 0;
    var numRolls = parseInt(str[0]);
    var diceSize = parseInt(str[1]);

    if (isNaN(numRolls) || isNaN(diceSize)) return 0; // Handle NaN

    for(var a=0;a<numRolls;a++){
      var rand = Math.ceil(Math.random() * diceSize);
      total = total + rand;
    }
    return total;
  }
  // return ""; // Unreachable due to previous returns
}

// select function
function selectitem(obj) {
  $('.list-selected').removeClass('list-selected');
  obj.addClass('list-selected');
}

function perform_roll() {

  var selected_id = $('.list-selected').attr('listid');

  if ( selected_id == null ) {
    showalert("nothing selected");
    return;
  }

  var seltext = $('.list-selected').attr('item');

  // Ensure 'current' is defined (it's set in loadleftdisplay)
  if (!current || !current.id) {
      console.error("Current menu category not set. Cannot perform roll.");
      showalert("Error: Menu category not selected.");
      return;
  }

  var roll_table_data = get_roll_array(seltext, current.id); // Renamed roll_table to roll_table_data

  if (!roll_table_data) { // Check if roll_table_data was found
      console.error("Roll table data not found for:", seltext, "in category:", current.id);
      showalert("Error: Roll table not found.");
      return;
  }


  var if_zero_dont_show_mainrolls = roll_table_data.main_rolls.length;
  var if_zero_dont_show_subrolls = roll_table_data.sub_rolls.length;

  clearright();

  var roll_table_title = roll_table_data.title;
  if ( roll_table_title.substring(0,2) == "- " ){
    roll_table_title = roll_table_title.substring(2, roll_table_title.length);
  }

  side("Title: " + roll_table_title);
  side(" ");
  side("Suggested Use: " + roll_table_data.use);
  side_display_current("<span class='roll-title'>" + roll_table_title + "</span>");
  side_display_current(" ");
  side_display_history("<div class='accordion roll-title-history'>" + roll_table_title + " <div class='history-item-menu'><div class='delete-history-item glyphicon glyphicon-trash'></div> <div class='expand-collapse glyphicon glyphicon-chevron-down'></div></div></div>", false);
  side_display_history("<div class='panel'>", false); // This panel might not be closed if the next line doesn't add to obj_history_display
  side_display("Suggested Use: <span class='roll-suggested-use'>" + roll_table_data.use + "</span>");


  if ( if_zero_dont_show_mainrolls != 0 ) {
    side(" ");
    side_display(" ");
    // iterate the menu, displaying the values for main rolls
    for (var i = 0; i < roll_table_data.main_rolls.length; i++) {
      var id = get_roll_id(roll_table_data.main_rolls[i]); // Use var for id
      var table = get_roll_table(roll_table_data.main_rolls[i]); // Use var for table
      var roll = get_roll(id, table);
      var value = roll_roll(id, table);

      // care for sub-rolls if they exist
      if(typeof value === 'string' && value.match(inline_roll_match)) {value = inline_roll(value);}

      side(roll.title + " : " + value);
      side_display(roll.title + " : <b>" + value + "</b>");
    }
  }

  if ( if_zero_dont_show_subrolls != 0 ) {
    side(" ");
    side_display(" ");
    // iterate the menu, displaying the values for sub rolls
    for (var i = 0; i < roll_table_data.sub_rolls.length; i++) {
      var id = get_roll_id(roll_table_data.sub_rolls[i]); // Use var for id
      var table = get_roll_table(roll_table_data.sub_rolls[i]); // Use var for table
      // var roll = get_roll(id, table); // roll is not used here
      /* value = */ roll_sub_roll(id, table); // roll_sub_roll handles its own side effects
    }
  }
  
  // Close the panel opened for history
  if (obj_history_display.endsWith("<div class='panel'>")) { // Basic check, might need refinement
    obj_history_display += "</div>"; 
  }


  display_side();
  rightscrolltop();
  blur();
}


// copy to clipboard - current roll
var copyTextareaBtnCurrent = document.querySelector('.current-copy-button'); // Changed var name
if (copyTextareaBtnCurrent) {
  copyTextareaBtnCurrent.addEventListener('click', function(event) {
    if ( $('#rightview-current').html() == "" ) {
      showalert("copy current blank");
      return;
    }
    $('#rightview-current').show();
    var copyTextarea = document.querySelector('.current-textarea');
    copyTextarea.select();
    try {
      var successful = document.execCommand('copy');
      // var msg = successful ? 'successful' : 'unsuccessful'; // msg not used
      blur();
      showalert('copy current');
    } catch (err) {
      showalert('unable to copy');
    }
    $('#rightview-current').hide();
  });
}


// copy to clipboard - history rolls
var copyTextareaBtnHistory = document.querySelector('.history-copy-button'); // Changed var name
if (copyTextareaBtnHistory) {
  copyTextareaBtnHistory.addEventListener('click', function(event) {
    if ( $('#rightview-history').html() == "" && $('#rightview-history-display').html().trim() === "" ) { // Check display too
      showalert("copy history blank");
      return;
    }
    process_history();
    $('#rightview-history').show();
    var copyTextarea = document.querySelector('.history-textarea');
    copyTextarea.select();
    try {
      var successful = document.execCommand('copy');
      // var msg = successful ? 'successful' : 'unsuccessful'; // msg not used
      blur();
      showalert('copy history');
    } catch (err) {
      showalert('unable to copy');
    }
    $('#rightview-history').hide();
  });
}

function process_history() {
  var separator = "------------------------------------------\n";
  var copy_list = document.getElementById("rightview-history-display").getElementsByClassName("for-copy");
  var copy_output = "";
  for (var i = 0; i < copy_list.length; i++) {
      if ( i != 0 ) { copy_output += separator; }
      // Attempt to get text content more robustly
      var textContent = "";
      var children = copy_list[i].childNodes;
      for (var j = 0; j < children.length; j++) {
          if (children[j].nodeType === Node.TEXT_NODE) {
              textContent += children[j].nodeValue;
          } else if (children[j].nodeType === Node.ELEMENT_NODE) {
              textContent += children[j].innerText || children[j].textContent; // Get text from elements
              if (children[j].tagName === 'BR') textContent += '\n';
          }
          if (j < children.length -1 && children[j].tagName !== 'BR' && children[j+1].tagName !== 'BR') {
             // Add a space if not a BR and next is not BR, to prevent words sticking together
             // This is a rough heuristic
             if (!textContent.endsWith('\n') && !textContent.endsWith(' ')) textContent += ' ';
          }
      }
      copy_output = copy_output + textContent.replace(/<br\s*\/?>/gi, '\n').trim();
  }
  $('#rightview-history').html(copy_output);
}


function togglehovermenu() {
  if ( mouseover_on == true ) {
    mouseover_on = false;
    $('.hover-icon').addClass('hoveroff');
    showalert("hover off");
  } else {
    mouseover_on = true;
    $('.hover-icon').removeClass('hoveroff');
    showalert("hover on");
  }
}

function mouseover_loadleftdisplay(obj_id_param) { // Renamed obj to obj_id_param
  if ( mouseover_on == true ) { loadleftdisplay(obj_id_param); } // Use obj_id_param
}

function showhistory() {
  $('#current-roll-tab').removeClass('active');
  $('#history-roll-tab').addClass('active');
  $('#rightview-current-display').hide();
  $('#rightview-history-display').show();
  rightscrolltop();

  // functions
  if ($('#rightview-history-display').html().trim() !== "") { // Only show if history has content
    $("#collapse-history-tab").show();
    $("#expand-history-tab").show();
    $("#clear-history-roll-tab").show();
  }
  blur();
}

function showcurrent() {
  $('#history-roll-tab').removeClass('active');
  $('#current-roll-tab').addClass('active');
  $('#rightview-history-display').hide();
  $('#rightview-current-display').show();
  rightscrolltop();

  // functions
  $("#collapse-history-tab").hide();
  $("#expand-history-tab").hide();
  $("#clear-history-roll-tab").hide();
  blur();
}

function leftscrolltop() {
  $("#left-display-list").animate({ scrollTop: 0 }, "fast");
}

function rightscrolltop() {
  $("#rightview-history-display").animate({ scrollTop: 0 }, "fast");
  $("#rightview-current-display").animate({ scrollTop: 0 }, "fast");
}

function blur() {
  if (document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur();
  }
  if (window.getSelection) { // Modern browsers
    window.getSelection().removeAllRanges();
  } else if (document.selection) { // IE<9
    document.selection.empty();
  }
}

function clearhistory(show) {
  $('#rightview-current').html("");
  $('#rightview-history').html("");
  $('#rightview-current-display').html("");
  $('#rightview-history-display').html("");
  side_obj = "";
  obj_current_display = "";
  obj_history_display = "";

  // also hide history buttons
  $("#collapse-history-tab").hide();
  $("#expand-history-tab").hide();
  $("#clear-history-roll-tab").hide();

  if (show == true) {
    showalert("clear history");
  }
}

function collapse_history() {
  $('.panel').removeClass('show');
  $('.accordion').removeClass('active');
  $('.accordion').children('.history-item-menu').children('.glyphicon-chevron-up').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
  blur();
}

function expand_history() {
  $('.panel').addClass('show');
  $('.accordion').addClass('active');
  $('.accordion').children('.history-item-menu').children('.glyphicon-chevron-down').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
  blur();
}

function create_guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

// jquery regex extender.  source: http://james.padolsey.com/javascript/regex-selector-for-jquery/
jQuery.expr[':'].regex = function(elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ?
                        matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels,'')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
}

function filter() {
  // hide all elements in left nav
  $('#left-display-list').children('.list-item').hide();

  // show only those that match the filter
  var filter_val = $('#filter').val();
  if (filter_val) { // Only run if filter_val is not empty
    var item = 'div:regex(item,' + filter_val + ')';
    $('#left-display-list').children(item).show();
  } else { // Show all if filter is empty
    $('#left-display-list').children('.list-item').show();
  }


  leftscrolltop();
}

function showalert(alert_key){ // Renamed alert to alert_key to avoid conflict with window.alert

  var alert_text = "";
  var alert_type = "";
  var none="false"; // Use boolean false

  switch(alert_key) { // Use alert_key
    case "copy history":
      alert_type = "success";
      alert_text = "Copied History Successfully <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "copy current":
      alert_type = "success";
      alert_text = "Copied Current Roll Successfully <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "clear history":
      alert_type = "success";
      alert_text = "Cleared History <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "hover on":
      alert_type = "success";
      alert_text = "Menu Hover On <span class='glyphicon glyphicon-ok'></span>";
      break;
    case "hover off":
      alert_type = "success";
      alert_text = "Menu Hover Off <span class='glyphicon glyphicon-remove'></span>";
      break;
    case "copy history blank":
      alert_type = "danger";
      alert_text = "History Empty <span class='glyphicon glyphicon-remove'></span>";
      break;
    case "copy current blank":
      alert_type = "danger";
      alert_text = "Current Roll Empty <span class='glyphicon glyphicon-remove'></span>";
      break;
    case "unable to copy":
      alert_type = "danger";
      alert_text = "Error: Unable to Copy <span class='glyphicon glyphicon-remove'></span>";
      break;
    case "nothing selected":
      alert_type = "danger";
      alert_text = "Nothing Selected <span class='glyphicon glyphicon-remove'></span>";
      break;
    case "history item deleted":
      alert_type = "success";
      alert_text = "History Item Deleted <span class='glyphicon glyphicon-remove'></span>";
      break;
    case "none":
      none = true; // Use boolean true
      break;
    default: // Add a default case
      console.warn("Unknown alert key:", alert_key);
      none = true;
      break;
    }


  if (none === false) { // Strict comparison with boolean

    var id = create_guid();
    $('#alerts').append("<div id='" + id + "' class='alert alert-" + alert_type + "' data-alert='alert'>" + alert_text + "</div>");
    var alert_id_selector = "#" + id; // Renamed id to avoid conflict

    $(alert_id_selector).fadeIn("slow", function() {$(this).delay(750).fadeOut(function(){ $(this).remove(); }); }); // Remove alert from DOM after fadeOut

  }
}

function toggle_menu(e) {
  if ($('#index-menu').filter(":visible").length) {
    $('#index-menu').hide();
  } else {
    $('#index-menu').css({top: e.pageY, left: e.pageX-27})
    $('#index-menu').show();
    $('body').one('click',function() { hide_menu(); });
  }
}

function hide_menu() {
  $('#index-menu').hide();
}


// events

$('body').on('mouseenter', '.delete-history-item', function() { delete_enabled = true; });
$('body').on('mouseleave', '.delete-history-item', function() { delete_enabled = false; });
$('body').on('click', '.list-item', function() { selectitem($(this)); perform_roll(); });
$('body').on('mouseover', '.menuitem', function() { mouseover_loadleftdisplay($(this).attr('id')); });
$('body').on('click', '.menuitem', function() { loadleftdisplay($(this).attr('id')); });
$('body').on('click', '#roll', function() { perform_roll(); }); // Assuming #roll is the ID of your main roll button
$('body').on('click', '#test', function() { roll_test(); });
$('body').on('click', '#history-roll-tab', function() { showhistory(); });
$('body').on('click', '#current-roll-tab', function() { showcurrent(); });
$('body').on('click', '#clear-history-roll-tab', function() { clearhistory(true); });
$('body').on('click', '.hover-icon-clickarea', function() { togglehovermenu(); });
$('body').on('click', '#collapse-history-tab', function() { collapse_history(); });
$('body').on('click', '#expand-history-tab', function() { expand_history(); });
$('body').on('keyup', '#filter', function() { filter(); });
$('body').on('click', '#filter-button', function() { filter(); }); // Removed duplicate change event
$('body').on('click', '#filter-clear', function() { $('#filter').val(""); filter(); });

$('body').on('click', '.srd-button', function() { window.location.assign("reference.html"); } ); // Changed replace to assign

// top menu
$('body').on('click', '.menu-button', function(e) { toggle_menu(e); } );
$('body').on('click', '#menu-auto-roll-tables', function() { window.location.assign("./index.html"); } ); // Changed replace to assign
$('body').on('click', '#menu-hex-map-generator', function() { window.location.assign("./hex-map-generator/hex_map_generator.html"); } ); // Changed replace to assign
$('body').on('click', '#menu-region-map-generator', function() { window.location.assign("./region-map-generator/index.html"); } ); // Changed replace to assign



$('body').on('click', '.delete-history-item', function() {
  // This event handler seems to be duplicated; the accordion click handler below also has delete logic.
  // Consolidate or ensure they don't conflict.
  // For now, assuming the accordion one is primary for deletion.
  // $(this).parent().parent().next().remove();
  // $(this).parent().parent().remove();
});

// accordion
$('body').on('click', '.accordion', function(e) {
  if ( delete_enabled == true ) { // delete_enabled is set on mouseenter/mouseleave of .delete-history-item
    $(this).next('.panel').remove(); // Ensure we remove the associated panel
    $(this).remove();
    // process_history(); // May not be needed here, consider if copy needs to be accurate immediately after delete
    showalert("history item deleted");
    delete_enabled = false; // Reset flag
  } else {
    var $icon = $(this).children('.history-item-menu').children('.glyphicon');
    if ( $icon.hasClass('glyphicon-chevron-down') ) {
      $icon.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
    } else {
      $icon.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
    }
    $(this).next('.panel').toggleClass('show'); // Ensure 'show' is CSS defined to display block
    blur();
  }
});

$(document).ready(function() {
  init();
});
