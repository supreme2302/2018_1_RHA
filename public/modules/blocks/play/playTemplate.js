function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function generatePlay(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;pug_debug_line = 1;pug_debug_filename = "\u002Fhome\u002Fchapay\u002FTechPark\u002Fsem2\u002Ffront\u002F2018_1_RHA\u002Fpublic\u002Fmodules\u002Fblocks\u002Fplay\u002Fplay.pug";
pug_html = pug_html + "\u003Cdiv class=\"btn-wrapper\" id=\"play_wrap\"\u003E";
;pug_debug_line = 2;pug_debug_filename = "\u002Fhome\u002Fchapay\u002FTechPark\u002Fsem2\u002Ffront\u002F2018_1_RHA\u002Fpublic\u002Fmodules\u002Fblocks\u002Fplay\u002Fplay.pug";
pug_html = pug_html + "\u003Cbutton class=\"menu__button btn-up fadeIn-Out\" id=\"play\"\u003E";
;pug_debug_line = 2;pug_debug_filename = "\u002Fhome\u002Fchapay\u002FTechPark\u002Fsem2\u002Ffront\u002F2018_1_RHA\u002Fpublic\u002Fmodules\u002Fblocks\u002Fplay\u002Fplay.pug";
pug_html = pug_html + "Play\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E";} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}