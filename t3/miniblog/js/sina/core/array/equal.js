/**
 * @id Core.Array.equal 
 * @fileoverview
 * 判断两个数组是否相等
 * @param {Array} array1 参加比较的第一个数组
 * @param {Array} array2 参加比较的第二个数组
 * @return {Boolean} array1==array2 :true | array1!=array2 :false
 * @author L.Ming | liming1@staff.sina.com.cn
 * @version 1.0
 * @since 2009
 */
$import("sina/core/array/_array.js");
Core.Array.equal = function(array1, array2) {
   var temp = [];
   if ( (!array1[0]) || (!array2[0]) ) { // If either is not an array
      return false;
   }
   if (array1.length != array2.length) {
      return false;
   }
   // Put all the elements from array1 into a "tagged" array
   for (var i=0; i<array1.length; i++) {
      key = (typeof array1[i]) + "~" + array1[i];
   // Use "typeof" so a number 1 isn't equal to a string "1".
      if (temp[key]) { temp[key]++; } else { temp[key] = 1; }
   // temp[key] = # of occurrences of the value (so an element could appear multiple times)
   }
   // Go through array2 - if same tag missing in "tagged" array, not equal
   for (var j=0; j<array2.length; j++) {
      key = (typeof array2[j]) + "~" + array2[j];
      if (temp[key]) {
         if (temp[key] == 0) { return false; } else { temp[key]--; }
      // Subtract to keep track of # of appearances in array2
      } else { // Key didn't appear in array1, arrays are not equal.
         return false;
      }
   }
   // If we get to this point, then every generated key in array1 showed up the exact same
   // number of times in array2, so the arrays are equal.
   return true;
};