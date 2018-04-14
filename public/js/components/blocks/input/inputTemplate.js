function pug_attr(t,e,n,f){return!1!==e&&null!=e&&(e||"class"!==t&&"style"!==t)?!0===e?" "+(f?t:t+'="'+t+'"'):("function"==typeof e.toJSON&&(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"):""}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function generateInput(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;var locals_for_with = (locals || {});(function (error_id, id, placeholder, type, value) {;pug_debug_line = 1;pug_debug_filename = "\u002FUsers\u002Fpetrosadaman\u002FDocuments\u002FТехнопарк\u002F2 sem\u002FJS\u002Ffront\u002F2018_1_RHA\u002Fpublic\u002Fjs\u002Fcomponents\u002Fblocks\u002Finput\u002Finput.pug";
pug_html = pug_html + "\u003Cinput" + (" class=\"input\""+pug_attr("type", type, true, false)+pug_attr("placeholder", placeholder, true, false)+pug_attr("value", value, true, false)+pug_attr("id", id, true, false)) + "\u002F\u003E";
;pug_debug_line = 2;pug_debug_filename = "\u002FUsers\u002Fpetrosadaman\u002FDocuments\u002FТехнопарк\u002F2 sem\u002FJS\u002Ffront\u002F2018_1_RHA\u002Fpublic\u002Fjs\u002Fcomponents\u002Fblocks\u002Finput\u002Finput.pug";
pug_html = pug_html + "\u003Cdiv" + (" class=\"error input__error\""+pug_attr("id", error_id, true, false)) + "\u003E\u003C\u002Fdiv\u003E";}.call(this,"error_id" in locals_for_with?locals_for_with.error_id:typeof error_id!=="undefined"?error_id:undefined,"id" in locals_for_with?locals_for_with.id:typeof id!=="undefined"?id:undefined,"placeholder" in locals_for_with?locals_for_with.placeholder:typeof placeholder!=="undefined"?placeholder:undefined,"type" in locals_for_with?locals_for_with.type:typeof type!=="undefined"?type:undefined,"value" in locals_for_with?locals_for_with.value:typeof value!=="undefined"?value:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}