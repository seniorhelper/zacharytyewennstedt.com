/* zach.js - the Zach character: arrival scene + chat guide.
   One universal file, injects its own markup. Never inline this per page.
   Rule-based matching only. It never claims to be an AI or a human. */
(function(){
'use strict';
var D=document,W=window;
if(W.__zachLoaded)return; W.__zachLoaded=1;
var RM=W.matchMedia&&W.matchMedia('(prefers-reduced-motion:reduce)').matches;
function at(){return String.fromCharCode(64);}
function mail(){try{return W.atob('aW5mbw==')+at()+W.atob('ZXlldG9hZC5jb20=');}catch(e){return '';}}
var TEL='1-800-481-8638';

/* ============ 1. the character ============ */
var SCENE='<svg id="zsvg" viewBox="0 0 680 262" aria-hidden="true">'+
'<g id="zcar">'+
'<ellipse cx="250" cy="250" rx="196" ry="9" fill="#1b1f2b" opacity=".22"/>'+
'<path d="M58 220 L96 198 L168 186 L238 166 L306 166 L356 182 L412 196 L440 214 L440 240 L58 240 Z" fill="#ff7a00"/>'+
'<path d="M58 220 L96 198 L168 186 L238 166 L306 166 L356 182 L412 196 L440 214 L440 220 L400 206 L340 190 L300 174 L240 174 L172 194 L104 206 Z" fill="#ffa64d"/>'+
'<path d="M58 226 L440 226 L440 240 L58 240 Z" fill="#c95600"/>'+
'<path d="M176 188 L240 170 L302 170 L348 184 Z" fill="#2c3852"/>'+
'<path d="M182 187 L238 172 L262 172 L236 190 Z" fill="#5f76a0" opacity=".75"/>'+
'<path d="M300 172 L344 185 L330 190 L292 176 Z" fill="#5f76a0" opacity=".5"/>'+
'<path d="M352 188 L404 200 L402 214 L350 204 Z" fill="#e05f00"/>'+
'<path d="M356 192 L398 202 L397 210 L355 201 Z" fill="#1c1f27"/>'+
'<path d="M60 214 L92 200 L96 212 L62 222 Z" fill="#ffd9a8"/>'+
'<path d="M62 216 L90 204 L92 210 L64 219 Z" fill="#fff6e2"/>'+
'<rect x="416" y="204" width="20" height="9" rx="4" fill="#d8352b"/>'+
'<rect x="418" y="206" width="9" height="4" rx="2" fill="#ff8a80"/>'+
'<path d="M104 208 L146 200 L150 214 L106 220 Z" fill="#e06a00" opacity=".45"/>'+
'<path d="M160 190 L176 186 L170 198 L158 198 Z" fill="#33363f"/>'+
'<path d="M396 176 L428 182 L428 190 L398 184 Z" fill="#1c1f27"/>'+
'<path d="M74 240 L420 240 L412 248 L82 248 Z" fill="#23262e"/>'+
'<path d="M206 234 L202 194 L288 176 L298 200 L298 234 Z" fill="#20242e"/>'+
'<path d="M232 230 L228 200 L272 190 L278 206 L276 230 Z" fill="#3d4352"/>'+
'<path d="M234 206 L270 196 L272 204 L236 213 Z" fill="#54596b"/>'+
'<g id="zdoor">'+
'<path d="M206 234 L202 194 L288 176 L298 200 L298 234 Z" fill="#ff7a00"/>'+
'<path d="M202 194 L288 176 L292 188 L204 205 Z" fill="#ffa64d"/>'+
'<path d="M212 226 L210 202 L282 188 L288 204 L288 226 Z" fill="#2c3852"/>'+
'<path d="M216 222 L214 205 L258 195 L242 222 Z" fill="#5f76a0" opacity=".6"/>'+
'<rect x="270" y="212" width="18" height="5" rx="2" fill="#e8b93c"/>'+
'<path d="M206 228 L298 210 L298 216 L206 234 Z" fill="#c95600" opacity=".5"/>'+
'</g>'+
'<circle cx="132" cy="228" r="25" fill="#16181e"/><circle cx="132" cy="228" r="16" fill="#2a2d36"/>'+
'<circle cx="132" cy="228" r="13" fill="#e8b93c"/>'+
'<g stroke="#a8862a" stroke-width="2.4" stroke-linecap="round"><path d="M132 216 L132 240"/><path d="M121 222 L143 234"/><path d="M121 234 L143 222"/></g>'+
'<circle cx="132" cy="228" r="4.5" fill="#f4d98a"/>'+
'<path d="M124 219 A13 13 0 0 1 140 219" stroke="#ff7a00" stroke-width="3" fill="none" stroke-linecap="round"/>'+
'<circle cx="368" cy="228" r="25" fill="#16181e"/><circle cx="368" cy="228" r="16" fill="#2a2d36"/>'+
'<circle cx="368" cy="228" r="13" fill="#e8b93c"/>'+
'<g stroke="#a8862a" stroke-width="2.4" stroke-linecap="round"><path d="M368 216 L368 240"/><path d="M357 222 L379 234"/><path d="M357 234 L379 222"/></g>'+
'<circle cx="368" cy="228" r="4.5" fill="#f4d98a"/>'+
'<path d="M360 219 A13 13 0 0 1 376 219" stroke="#ff7a00" stroke-width="3" fill="none" stroke-linecap="round"/>'+
'</g>'+
'<g id="zman">'+
'<ellipse cx="517" cy="252" rx="33" ry="7" fill="#1b1f2b" opacity=".2"/>'+
'<path d="M503 212 L517 212 L516 246 L502 246 Z" fill="#15151c"/>'+
'<path d="M519 212 L533 212 L534 246 L520 246 Z" fill="#15151c"/>'+
'<path d="M506 214 L508 244" stroke="#2b2b38" stroke-width="2" fill="none"/>'+
'<path d="M528 214 L530 244" stroke="#2b2b38" stroke-width="2" fill="none"/>'+
'<path d="M497 246 L518 246 L519 253 L495 253 Z" fill="#0b0b11"/>'+
'<path d="M518 246 L539 246 L541 253 L517 253 Z" fill="#0b0b11"/>'+
'<path d="M499 247 L512 247 L512 249 L498 249 Z" fill="#43434f"/>'+
'<path d="M520 247 L533 247 L533 249 L519 249 Z" fill="#43434f"/>'+
'<path d="M496 175 L538 175 L534 220 L500 220 Z" fill="#1a1a23"/>'+
'<path d="M508 175 L526 175 L525 208 L509 208 Z" fill="#f8f8fb"/>'+
'<path d="M509 196 L525 196 L525 208 L509 208 Z" fill="#e9e9f0"/>'+
'<path d="M496 175 L515 175 L511 209 L498 190 Z" fill="#2a2a37"/>'+
'<path d="M538 175 L519 175 L523 209 L536 190 Z" fill="#2a2a37"/>'+
'<path d="M500 178 L512 178 L509 202 L501 189 Z" fill="#3a3a4a"/>'+
'<path d="M534 178 L522 178 L525 202 L533 189 Z" fill="#3a3a4a"/>'+
'<circle cx="522" cy="213" r="2.6" fill="#3f3f50"/>'+
'<path d="M502 186 L512 184 L511 189 L502 191 Z" fill="#ff7a00"/>'+
'<path d="M503 185 L508 184 L507 187 L503 188 Z" fill="#ffb066"/>'+
'<path d="M507 165 L517 176 L509 180 L505 170 Z" fill="#f8f8fb"/>'+
'<path d="M527 165 L517 176 L525 180 L529 170 Z" fill="#f8f8fb"/>'+
'<path d="M517 174 L502 165 L500 181 L517 178 Z" fill="#16161e"/>'+
'<path d="M517 174 L532 165 L534 181 L517 178 Z" fill="#16161e"/>'+
'<path d="M517 174 L502 165 L502 172 L516 176 Z" fill="#35354a"/>'+
'<path d="M517 174 L532 165 L532 172 L518 176 Z" fill="#35354a"/>'+
'<rect x="512" y="169" width="10" height="11" rx="3" fill="#20202c"/>'+
'<rect x="514" y="171" width="3" height="6" rx="1" fill="#3c3c50"/>'+
'<path d="M510 156 L524 156 L524 170 L510 170 Z" fill="#e8bd94"/>'+
'<path d="M510 156 L524 156 L524 162 L510 162 Z" fill="#d3a67d"/>'+
'<ellipse cx="502" cy="142" rx="4" ry="6" fill="#f0c79e"/>'+
'<ellipse cx="532" cy="142" rx="4" ry="6" fill="#f0c79e"/>'+
'<ellipse cx="517" cy="140" rx="18" ry="20" fill="#f9d6b0"/>'+
'<path d="M499 140 q4 14 18 19 q-14 0 -18 -12 Z" fill="#edc298" opacity=".7"/>'+
'<path d="M496 146 c-4 -22 6 -34 21 -34 c16 0 26 12 23 33 c-1 -9 -3 -15 -7 -19 c3 9 2 15 0 20 c-1 -11 -5 -17 -10 -20 c-9 -5 -21 -1 -25 9 c-1 4 -2 8 -2 11 Z" fill="#e7bd5a"/>'+
'<path d="M498 128 c6 -9 17 -12 27 -8 c-9 -1 -18 1 -24 7 Z" fill="#f6e0a0"/>'+
'<path d="M534 124 c9 4 12 14 9 24 c0 -9 -3 -16 -9 -20 Z" fill="#d6a83f"/>'+
'<path d="M492 136 c-3 10 -1 18 4 24 c-5 -9 -5 -16 -4 -22 Z" fill="#e7bd5a"/>'+
'<path d="M492 140 c-4 8 -3 16 1 22 c-1 -8 0 -15 3 -20 Z" fill="#d6a83f"/>'+
'<path d="M540 134 c5 9 4 19 -1 27 c2 -9 2 -18 -2 -24 Z" fill="#e7bd5a"/>'+
'<path d="M502 121 c7 -6 17 -7 25 -3 c-4 4 -9 2 -14 3 c-4 1 -8 2 -11 5 Z" fill="#f6e0a0"/>'+
'<path d="M506 131 c8 -6 19 -6 26 -1 c-8 -2 -17 -2 -26 4 Z" fill="#f6e0a0" opacity=".85"/>'+
'<path d="M497 150 c-2 6 0 11 4 14 c-3 -5 -4 -10 -3 -14 Z" fill="#d6a83f"/>'+
'<path d="M537 150 c2 6 0 11 -4 14 c3 -5 4 -10 3 -14 Z" fill="#d6a83f"/>'+
'<path d="M504 134 q6 -4 12 -1" stroke="#c49a3c" stroke-width="2.2" fill="none" stroke-linecap="round"/>'+
'<path d="M522 133 q6 -3 11 1" stroke="#c49a3c" stroke-width="2.2" fill="none" stroke-linecap="round"/>'+
'<ellipse cx="509" cy="142" rx="4" ry="4.4" fill="#fff"/><circle cx="509.7" cy="142.4" r="2.6" fill="#2f7fd6"/><circle cx="509.7" cy="142.4" r="1.2" fill="#0e0e16"/><circle cx="510.7" cy="141.2" r=".8" fill="#fff"/>'+
'<ellipse cx="526" cy="142" rx="4" ry="4.4" fill="#fff"/><circle cx="526.7" cy="142.4" r="2.6" fill="#2f7fd6"/><circle cx="526.7" cy="142.4" r="1.2" fill="#0e0e16"/><circle cx="527.7" cy="141.2" r=".8" fill="#fff"/>'+
'<path d="M505 147 q1 4 3 5" stroke="#e0ae82" stroke-width="1.6" fill="none" stroke-linecap="round"/>'+
'<path d="M531 147 q-1 4 -3 5" stroke="#e0ae82" stroke-width="1.6" fill="none" stroke-linecap="round"/>'+
'<path d="M515 146 q2 5 0 7" stroke="#dfa87b" stroke-width="1.6" fill="none" stroke-linecap="round"/>'+
'<path d="M508 155 q9 7 18 0" stroke="#b3714a" stroke-width="2.2" fill="none" stroke-linecap="round"/>'+
'<path d="M510 156 q7 4 14 0 q-7 4 -14 0 Z" fill="#fff"/>'+
'<path d="M497 178 L490 216 L500 218 L504 182 Z" fill="#1a1a23"/>'+
'<path d="M497 178 L500 178 L500 210 L496 210 Z" fill="#2a2a37"/>'+
'<rect x="489" y="214" width="12" height="5" rx="2" fill="#f8f8fb"/>'+
'<circle cx="494" cy="224" r="7.5" fill="#f0c79e"/>'+
'<g id="zarm">'+
'<path d="M534 178 L552 168 L562 140 L552 136 L541 164 L528 180 Z" fill="#1a1a23"/>'+
'<path d="M536 178 L550 170 L552 174 L539 182 Z" fill="#2a2a37"/>'+
'<circle cx="556" cy="130" r="8" fill="#f9d6b0"/>'+
'<path d="M550 126 q6 -5 12 0 q-6 -3 -12 0 Z" fill="#f0c79e"/>'+
'</g></g></svg>';

/* compact head-only avatar for the chat panel and launcher */
var AV='<svg viewBox="0 0 44 44" width="40" height="40" aria-hidden="true">'+
'<circle cx="22" cy="22" r="22" fill="#eaf0f8"/>'+
'<path d="M6 44 q4-13 16-13 q12 0 16 13 Z" fill="#1a1a23"/>'+
'<path d="M17 31 h10 l2 13 h-14 Z" fill="#f8f8fb"/>'+
'<path d="M15 30 l7 5 l-4 2 l-3 -4 Z" fill="#f8f8fb"/><path d="M29 30 l-7 5 l4 2 l3 -4 Z" fill="#f8f8fb"/>'+
'<path d="M22 34 l-7 -4 l-1 8 l8 -2 Z" fill="#16161e"/><path d="M22 34 l7 -4 l1 8 l-8 -2 Z" fill="#16161e"/>'+
'<rect x="19.5" y="32" width="5" height="5.5" rx="1.6" fill="#22222e"/>'+
'<ellipse cx="22" cy="19" rx="9.5" ry="10.5" fill="#f9d6b0"/>'+
'<path d="M12 20 c-2-12 3-17 10-17 c8 0 13 6 11 17 c-1-5-2-8-4-10 c1 5 1 8 0 11 c-1-6-3-9-6-11 c-5-3-10 0-11 5 Z" fill="#e7bd5a"/>'+
'<path d="M13 12 c3-5 9-6 14-4 c-5 0-9 1-12 4 Z" fill="#f6e0a0"/>'+
'<circle cx="18.6" cy="20" r="1.7" fill="#2f7fd6"/><circle cx="25.4" cy="20" r="1.7" fill="#2f7fd6"/>'+
'<path d="M18 25 q4 3 8 0" stroke="#b3714a" stroke-width="1.5" fill="none" stroke-linecap="round"/>'+
'</svg>';

/* ============ 2. language layer ============ */
/* normalize shorthand, dialect and the misspellings from the training manual */
var FIX=[
 [/\bseo+\s*serv(i|e)?c?es?\b/g,'seo services'],[/\bseoo+\b/g,'seo'],[/\bserch|searh|seach\b/g,'search'],
 [/\boptimizashun|optimiz?ation|optimisation|optimze|optimise\b/g,'optimization'],
 [/\bweb\s?sight|websight|webstie|wesbite|websit\b/g,'website'],[/\bwebsites?\b/g,'website'],
 [/\bmark(e)?ting|marketting|markting\b/g,'marketing'],[/\bconverson|convertion|convrsion\b/g,'conversion'],
 [/\bremark(e)?ting|retargting|retargetting\b/g,'remarketing'],[/\bgoogl(e)?\s?adds?|ad\s?words\b/g,'google ads'],
 [/\bchat\s?bot|chatboat|chatbott\b/g,'chatbot'],[/\bagentics\b/g,'agentic'],
 [/\bwarrenty|waranty\b/g,'warranty'],[/\binstalation|instal\b/g,'installation'],
 [/\bwalkin\s?tub|walk\s?in\s?bathtub\b/g,'walk in tub'],[/\brollin\s?shower|wheel\s?chair\s?shower\b/g,'roll in shower'],
 [/\bu\b/g,'you'],[/\bur\b/g,'your'],[/\br\b/g,'are'],[/\bpls|plz\b/g,'please'],[/\bthx|thanx|ty\b/g,'thanks'],
 [/\bidk\b/g,'i do not know'],[/\bhowmuch\b/g,'how much'],[/\bcuz|bc\b/g,'because'],
 [/\bwanna\b/g,'want to'],[/\bgonna\b/g,'going to'],[/\bdont\b/g,'do not'],[/\bcant\b/g,'cannot'],
 [/\bwhats\b/g,'what is'],[/\bhows\b/g,'how is'],[/\bim\b/g,'i am'],[/\bive\b/g,'i have'],
 [/\bbiz\b/g,'business'],[/\bco\b/g,'company'],[/\bad\s?words\b/g,'google ads'],
 [/\bppc\b/g,'ppc paid ads'],[/\bcro\b/g,'conversion optimization'],[/\bgbp\b/g,'google business profile']
];
function norm(s){
  s=' '+String(s||'').toLowerCase().replace(/[^\w\s$?!.'-]/g,' ').replace(/\s+/g,' ')+' ';
  for(var i=0;i<FIX.length;i++)s=s.replace(FIX[i][0],FIX[i][1]);
  return s.replace(/\s+/g,' ');
}
function any(s,list){for(var i=0;i<list.length;i++)if(s.indexOf(' '+list[i]+' ')>-1||s.indexOf(' '+list[i])===0)return true;return false;}

/* rotation so he never repeats himself back to back */
var used={};
function pick(key,arr){
  if(arr.length===1)return arr[0];
  var last=used[key],i;
  do{i=Math.floor(Math.random()*arr.length);}while(arr.length>1&&i===last);
  used[key]=i;return arr[i];
}

/* ============ 3. knowledge base ============ */
var KB=[
/* --- rapport --- */
{i:'greet',k:['hello','hi','hey','hiya','howdy','yo','sup','wassup','whassup','what up','what is up','what is happening','waz up','good morning','morning','mornin','good afternoon','afternoon','good evening','evening','greetings','hola','anybody there','anyone there','you there','hey there','hello there'],
 a:['Hey. What can I help you figure out?','Hi there. What are you working on?','Hey. I got out of a cartoon supercar for this, so ask me something good.','Hey - glad you stopped by. Quick question, or are you chewing on a whole project?','Hello. Start anywhere, even if you are not sure what you need yet.','Hey. Give me the short version or the whole story, either works.']},
{i:'howru',k:['how are you','how are things','how is it going','how goes it','you good','all good','what is new','how is your day','having a good day','how you been','how is everything'],
 a:['Doing well, and parked legally for once. How are things on your end?','Good. I am here helping people work out their next step - what is going on with yours?','No complaints. What brought you here today?']},
{i:'bot',k:['are you real','are you human','are you a robot','are you a bot','are you ai','is this a bot','real person or bot','am i talking to a person'],
 a:['I am Zach, but the scripted version - not a person and not an AI, just a well-briefed set of rules with a good tailor. The real me is a phone call away at <b>'+TEL+'</b>.','Not human, and I am not going to pretend to be an AI either. I am programmed responses. Ask me anything about the work and I will either know it or say so.']},
{i:'name',k:['what is your name','what should i call you','who are you talking','your name'],
 a:['Zach. Well - the cartoon version, in a rented tuxedo. What should I call you?']},
{i:'joke',k:['tell me a joke','joke','funny','make me laugh','something funny'],
 a:['Why did the marketer bring a ladder? To work on the landing page. Want another, or should we talk about your project?','A website walks into a bar. Nobody finds it. Anyway - what are you working on?','I would tell you a joke about SEO but you would have to scroll to page two to get it.']},
{i:'bored',k:['i am bored','entertain me','nothing to do'],
 a:['We can fix that. Want a marketing idea, a bad clean joke, or help with something actually useful?']},
{i:'car',k:['nice car','cool car','lambo','lamborghini','your car','sports car','nice ride','flashy'],
 a:['Thanks. It is a cartoon, so the insurance is very reasonable. What can I help you with?','Appreciated. Fair warning though - I would rather talk about what your website is doing for you.']},
{i:'tux',k:['tuxedo','tux','suit','dressed up','fancy','bow tie'],
 a:['Figured I would show up dressed for it. What are we working on?']},
{i:'sleep',k:['do you sleep','are you always here','24 7','always on'],
 a:['Never sleep. That is rather the point - a site that answers at 2am is the whole pitch.']},
{i:'compliment',k:['great site','nice site','love this site','cool website','this is awesome','impressive','this is cool','well done','looks great'],
 a:['Thank you - it is all hand-coded, which is why it moves the way it does. Want one that works like this for your business?','Appreciated. Everything you are looking at was written by hand, no builder. <a href="/lets-talk/">Happy to do the same for you</a>.']},

/* --- money --- */
{i:'price',k:['price','pricing','cost','how much','what do you charge','rates','rate','fees','expensive','budget','ballpark','quote me','afford'],
 a:['Websites start at <b>$99/month</b> as a lease with a buyout option at 24-36 months, or you can buy outright. SEO and AI optimization get quoted to your budget, company and goals - there is no menu price, because a one-van operation and a twelve-state company are not the same job. <a href="/lets-talk/">Tell me what you run</a> and you get a real number.',
    'Fair question, and I do not want to throw a misleading figure at you. Sites start at $99/month on a lease with a buyout at 24-36 months. Optimization work is scoped to you. Is this for a website, search visibility, or both?']},
{i:'toomuch',k:['too expensive','too much money','cannot afford','out of my budget','cheaper','price is high','too pricey'],
 a:['I hear you. Is it the total number, uncertainty about whether it pays back, or just the wrong month for it? Those three get different answers, and one of them usually has a smaller starting point that still moves the needle.']},
{i:'cheapcomp',k:['competitor is cheaper','found cheaper','someone quoted less','cheaper somewhere else'],
 a:['That may well be the right fit, and I am not going to trash them. The useful comparison is scope: who owns the site, what tracking is installed, what happens when something breaks, and what is actually included each month. Worth lining those up side by side before you decide.']},
{i:'free',k:['free','no cost','do it for free','discount','deal','coupon','promo'],
 a:['No invented discounts here - if there is a current offer I will tell you on the phone. What I can do free is help you work out what you actually need, so you do not buy more than that. What are you trying to fix?']},
{i:'contract',k:['contract','lock in','commitment','long term','cancel anytime','month to month'],
 a:['The site lease runs with a buyout option at 24-36 months based on what the site is worth at that point. Anything beyond that, ask me on the phone at <b>'+TEL+'</b> - I am not going to paraphrase terms in a chat window.']},

/* --- services --- */
{i:'seo',k:['seo','rank','ranking','rankings','google','search engine','get found','found on google','traffic','organic','page one','first page','serp'],
 a:['SEO is still the base layer, but on its own it is now half the job. I build for five surfaces: classic search, the map pack, AI Overviews, generative engines like ChatGPT and Perplexity, and the agents that shortlist vendors for a buyer. <a href="/fractional-cmo/">Here is how a program runs</a>.',
    'Search is the foundation. The change is that being found now means being found in five places, not one. Are you trying to pull local customers, sell nationally, or both?']},
{i:'local',k:['map pack','google maps','local seo','google business profile','local customers','near me','my city'],
 a:['Local is its own game - the map pack sits above everything else, and it is won with profile work, reviews, proximity signals and location-specific content rather than the same tactics as organic. Which city or service area matters most to you?']},
{i:'aio',k:['aio','geo','aeo','ai search','chatgpt','perplexity','generative','answer engine','ai overview','ai overviews','llm','claude','grok','gemini','cited by ai','ai mode'],
 a:['AIO and GEO are about being the source an answer engine reaches for. That means clean entity data, content shaped like the questions people actually ask, schema that agrees with what is visible on the page, and being genuinely worth citing. Nobody can promise a specific citation - but eligibility is absolutely something you can engineer. <a href="/what-i-build/">The stack is here</a>.']},
{i:'seodead',k:['seo is dead','is seo dead','seo does not work','seo never worked','seo is a scam','waste of money'],
 a:['Not dead, but changed - and it can absolutely feel like it does not work when the targeting, technical base, offer or measurement were weak. What happened on your last go at it?']},
{i:'chatbot',k:['chatbot','chat bot','bot for my site','ai chatbot','virtual assistant','live chat'],
 a:['Yes - and not a generic widget. A bot briefed on your brand, your services, your pricing rules, your objection answers and your sense of humor, so it sounds like your best salesperson rather than a help desk. Like me, only about your business. <a href="/what-i-build/#agents">Details here</a>.']},
{i:'agent',k:['ai agent','agents','agentic','automation','automate','automatic','workflow','ai that does'],
 a:['Agents are the part most agencies still cannot do. Not a chat window - a worker that qualifies a lead, routes it, chases the quote, updates the sheet and drafts the follow-up, whether or not anyone remembers. High-impact steps keep a human in the loop on purpose. <a href="/what-i-build/#agents">The agent stack</a>.']},
{i:'quote',k:['instant quote','quote online','quoting','estimate online','calculator','price calculator','auto quote'],
 a:['Very doable - I have built quoting engines for bath remodels, shower kits and website builds. Visitor answers a few questions, sees a real number on the spot, you get the full breakdown with their details. There is a working one on this site: <a href="/what-i-build/#quote">try it</a>.']},
{i:'web',k:['website','web design','web designer','build me a site','new site','redesign','rebuild','landing page','web developer','custom site','best web designers'],
 a:['Hand-coded HTML, CSS and JavaScript is my specialty - it is why my sites load fast and hold up in search. That said, if you already run WordPress, Shopify, Wix or Webflow and your team knows it, I will build and optimize right inside it. <a href="/what-i-build/">What I build</a>, or <a href="/projects/">go look at live ones</a>.']},
{i:'wordpress',k:['wordpress','wix','squarespace','shopify','webflow','godaddy builder','page builder','template','theme','platform','cms','migrate','migration'],
 a:['Whatever you are on, I can work in it - WordPress, Shopify, Wix, Webflow, you name it. I specialize in custom-coded sites and apps because that is where the speed and the strange, wonderful stuff lives, but I am not going to force a migration you did not ask for. If your team already knows your platform, that has real value. What are you running?']},
{i:'cro',k:['conversion','conversion rate','convert','not converting','no calls','no leads','nobody calls','traffic but no','bounce'],
 a:['Traffic that does not convert is an expensive hobby. The work is the whole path - offer, first screen, proof, friction, and how fast you answer - not the button color. That is the last one percent. <a href="/conversion-optimization/">How I do it</a>.',
    'That usually reads as a conversion problem rather than a traffic problem, and it changes the whole recommendation. Do you know which pages people land on, and whether your calls and forms are actually tracked?']},
{i:'leads',k:['lead generation','more leads','lead gen','get leads','leads leak','follow up','crm','lead response'],
 a:['Lead generation is half getting them and half not losing them. Most businesses I look at are leaking in the gap - slow replies, no routing, no follow-up. That gap is a systems problem and it is fixable in weeks, not quarters.']},
{i:'cmo',k:['fractional','cmo','outsourced cmo','marketing director','consultant','strategy','marketing manager','hire a cmo','marketing expert'],
 a:['A fractional CMO gives you the senior marketing brain without the six-figure salary or the hiring risk. I set the strategy, build the systems, train the people answering the phone, and stay accountable to the number. <a href="/fractional-cmo/">The engagement, in full</a>.']},
{i:'ads',k:['ppc','google ads','paid ads','facebook ads','advertising','remarketing','retargeting','display ads','ad spend'],
 a:['Paid media is on the table - search, display and remarketing. The honest sequence is tracking first, then ads, because without measurement you are just buying clicks and hoping. What are you running now?']},
{i:'social',k:['social media','facebook','instagram','tiktok','linkedin','posting','social'],
 a:['Social work happens through Search Converts - pixel setup, group advertising, posting on your behalf, and managing business pages. Worth a conversation about what you actually want it to do, because "be on social" is not a goal.']},
{i:'app',k:['app','mobile app','software','application','full stack','developer','coding','program','build software'],
 a:['Web apps, tools, calculators, dashboards, quoting engines and games - all built and running in production. For native iOS and Android store apps I bring in a partner rather than pretend, and I will tell you that up front rather than after you have paid.']},
{i:'threed',k:['3d','vr','virtual reality','game','games','arcade','interactive','animation','hologram'],
 a:['That is the fun end of it. There is a playable arcade on this site, and the big one is <a href="https://worldvrmall.com" target="_blank" rel="noopener">World VR Mall</a> - a walk-in 3D mall where brands lease storefronts. Roller coaster, zoo, art gallery, the lot.']},
{i:'video',k:['video','videos','explainer','commercial','youtube','filming'],
 a:['Video runs through Search Converts. The format follows the goal - ads, explainers, brand stories, product demos or sales support. The useful first question is what you want someone to do after watching.']},
{i:'logo',k:['logo','branding','brand identity','graphic design','print','business card'],
 a:['Logo and brand work are available. First questions are what the company does, who it serves, what personality it should project, and whether there is anything existing worth preserving.']},
{i:'ecom',k:['ecommerce','online store','sell online','products online','cart','woocommerce'],
 a:['Ecommerce work is in scope. The questions that matter are catalog size, who handles fulfilment, and whether the real problem is traffic, product pages or checkout - they are three very different jobs.']},
{i:'domain',k:['domain','domains','buy a domain','url','domain name','name for my business'],
 a:['I own hundreds of keyword domains across home services, travel, real estate, legal and local niches - probably a few in your industry, all for sale or lease. <a href="https://bestdomainsforbusiness.com" target="_blank" rel="noopener">Browse them</a>. Want something brand new instead? <a href="https://buyweburl.com" target="_blank" rel="noopener">Search one here</a>.']},
{i:'hosting',k:['hosting','host','server','cpanel','email hosting','ssl'],
 a:['Hosting comes through <a href="https://buyweburl.com" target="_blank" rel="noopener">buyweburl.com</a> - domains, hosting and builder plans. For anything I build and manage, hosting is usually just part of the arrangement.']},
{i:'audit',k:['audit','review my site','look at my site','check my website','analysis','assessment','whats wrong with my site'],
 a:['That is the right starting point, and it is usually free. Send the URL and what you think is wrong, and you will get a straight read - including "you do not need me" if that is the honest answer. <a href="/lets-talk/">Send it here</a>.']},
{i:'grow',k:['grow my business','growth tool','free tool','free tools','business growth','grow tool','accelerator','audit tool','seo audit','scorecard','checker'],
 a:['Start with the Grow My Business tool on <a href="https://eyetoad.com/" target="_blank" rel="noopener">eyetoad.com</a> - it walks you through where your marketing is actually losing you money and costs nothing. There is also a free SEO audit on there, plus a pile of calculators and scorecards on <a href="https://omahaseopros.com" target="_blank" rel="noopener">omahaseopros.com</a>. Use them all. I am not precious about it.']},
{i:'adlab',k:['ad lab','creative','think tank','ideas','brainstorm','something different','stand out','creative agency'],
 a:['That is the Ad Lab, over on <a href="https://eyetoad.com/creative-think-tank/" target="_blank" rel="noopener">eyetoad.com</a>. The whole idea: find out what your competition is doing, then do something different - and better. We test everything on ourselves first, which is precisely why this site has an arcade and a selfie booth on it.']},
{i:'salestrain',k:['sales training','train my team','sales coaching','sales course','objection handling','sales reps','sales process','ride along','closing techniques'],
 a:['This is the part I care most about. <a href="https://mysaleshelp.com" target="_blank" rel="noopener">mysaleshelp.com</a> has a 200-objection engine, a spin wheel, a glossary and arcade games, and I deliver training in all 50 states and Canada including in-person ride-alongs. The best version is a sales makeover: build the process, write the scripts, then wire the whole thing into your website so the pitch is identical whether it comes from a rep or a page at 2am.']},
{i:'botsite',k:['conversationalaibot','cora','bot demo','see a bot','chatbot demo','bot examples'],
 a:['Go play with Cora on <a href="https://conversationalaibot.com" target="_blank" rel="noopener">conversationalaibot.com</a> - that is the showpiece. Install on your site is $199 one-time with hosting included. She is better behaved than I am.']},
{i:'vr',k:['vr headset','quest','oculus','meta quest','vr mode','virtual reality headset','in vr'],
 a:['Put a headset on and the whole thing changes - <a href="https://worldvrmall.com" target="_blank" rel="noopener">World VR Mall</a> in VR is genuinely the much better looking version of me, and frankly of everything else. On a phone it is still good. In VR it is silly.']},
{i:'selfie',k:['selfie','photo','picture with you','camera','booth','take a photo','pic'],
 a:['The selfie booth is right here on this page - take one with me on the moon, in front of the White House, at the pyramids, wherever. Slap some stickers on it and download it. It runs entirely in your browser; nothing you point a camera at ever leaves your device. Yes, I am aware this is not normal for a marketing consultant.']},
{i:'joke2',k:['are you funny','say something funny','another joke','humor me','make me laugh again'],
 a:['I have two settings: this, and a tuxedo. A man walks into a bar with a website under his arm. Bartender says, is that a website? He says no, it is a very expensive brochure that nobody can find.','My other car is also a cartoon.','I once built a 3D shopping mall instead of going to bed. My wife has thoughts about this.']},
{i:'compliment2',k:['you are cool','love this bot','this bot is great','you are funny','like your style','best bot'],
 a:['Careful, I am scripted and therefore extremely easy to flatter. If you like this one, imagine what yours could say about your business. <a href="/lets-talk/">That is an actual offer</a>.']},
{i:'sales',k:['sales','selling','closing','objection','sales script','sales training','sales team','close more'],
 a:['Sales is my actual specialty - everything else grew out of it. I ran sales teams for multi-million dollar plumbing and national remodeling companies before I ever built a website. I keep a whole training site at <a href="https://mysaleshelp.com" target="_blank" rel="noopener">mysaleshelp.com</a> with a 200-objection engine.']},

/* --- trust and objections --- */
{i:'guarantee',k:['guarantee','guaranteed','promise','number one','no 1','first place','warranty on results','guarantee rankings'],
 a:['No, and you should walk away from anyone who does - Google says plainly that nobody can guarantee a number one ranking. What you do get: your business put first, the work done as if it were his own company, every bit of skill and technology he has, and a genuine effort to grow it. That is the promise, and it is one he can actually keep.']},
{i:'howlong',k:['how long','how fast','timeline','when will i see','how soon','results take','time frame'],
 a:['There is no universal timeline and I will not invent one. Technical fixes can show up quickly; competitive visibility takes sustained work. Your site history, market, content and competition all change the answer. A review gets you a realistic expectation instead of a number I made up.']},
{i:'why',k:['why you','why should i','what makes you different','different','better than','versus','vs','compare','why hire you'],
 a:['Most agencies sell you a plan. I build the thing, then test it on my own companies before it ever touches your money - the bath business, the domain portfolio, the VR mall. If a tactic is not working on my own sites, you never get billed for it.',
    'Two reasons: I have been burned by agencies myself and made my own expensive mistakes, so I will tell you when something is not worth doing. And I run real companies outside marketing, so I know exactly what it feels like when the phone does not ring.']},
{i:'agency',k:['already have an agency','current agency','working with someone','have a marketing company','switching'],
 a:['That might be a good thing. Are you satisfied and just looking around, or is there a specific gap you want a second opinion on? I am happy to tell you if they are doing fine work.']},
{i:'think',k:['think about it','need to think','sleep on it','get back to you','not ready','maybe later','let me talk to'],
 a:['Of course. Which part do you want to think through - the money, the timing, whether it is the right approach, or whether you trust the guy? I can give you something useful on any of those and then leave you to it.']},
{i:'looking',k:['just looking','just browsing','window shopping','doing research','comparing'],
 a:['No problem at all. Browse at your own pace. If it helps, I will answer one question with no contact details asked for.']},
{i:'nosales',k:['no sales call','do not call me','dont want a call','no pressure','stop selling','leave me alone','not interested'],
 a:['Understood, and dropped. We can keep this purely informational - what would you like answered right here?']},
{i:'diy',k:['do it myself','build it myself','my nephew','i can do it','in house','learn seo'],
 a:['You probably can, and I mean that. The real question is whether you want to spend your hours on it, and whether it needs strategy, tracking, conversion work and ongoing testing on top of the build. What kind of site are you thinking about?']},
{i:'proof',k:['proof','case study','results','examples','portfolio','references','who have you worked with','show me'],
 a:['<a href="/projects/">The portfolio page</a> is everything - client sites, VR worlds, sales tools, my own companies. Every one is live and you can click straight into it. Nothing on there is a mockup.']},
{i:'reviews',k:['reviews','reputation','testimonials','bbb','rated','trustworthy','legit','scam'],
 a:['Eye To Ad Media has 60 Google reviews at a 5.0 average and is A+ BBB accredited, running since 2012. Go read them rather than taking my word for it - I am a script with a vested interest.']},

/* --- the person --- */
{i:'who',k:['who are you','who is zach','about him','zach wennstedt','about zach','your story','your background','experience','history','grew up','how old','where are you from','tell me about yourself'],
 a:['Born in Fremont, Nebraska. Raised in Boulder, went to Fairview. Five years in Fort Collins at Colorado State - I left before the degree to build a business and I have never claimed otherwise. Denver since. I sold and managed for multi-million dollar plumbing and national remodeling companies before I ever touched a website. <a href="/my-story/">The long version</a>.']},
{i:'faith',k:['faith','god','religion','church','christian','pray','purpose','believe','spiritual','jesus'],
 a:['My faith is the frame around all of it. I believe there is a purpose bigger than any business I will ever build, and that how you treat people on the way up is the actual scoreboard.']},
{i:'art',k:['art','paint','painting','artist','poetry','poem','creative','abstract'],
 a:['I paint - abstracts and landscapes - and write poetry. That is where the color on this site comes from, and the reason I will not build anything beige.']},
{i:'bath',k:['bath','tub','shower','walk in tub','remodel','aging safely','accessible','bathroom'],
 a:['I own and run a bath remodeling company - walk-in tubs, barrier-free showers, accessibility work. Not a case study I read; a company I answer the phone for. It is also why I understand home services marketing from the inside instead of from a slide deck.']},
{i:'where',k:['where are you','location','denver','colorado','based','office','address','local to me','do you work with','do you work in','work in my area','service area','out of state','my state','nationwide','across the country','international','outside colorado','anywhere in the us','remote','florida','texas','california','new york','arizona','georgia','nebraska','omaha','hawaii','belize','costa rica','canada'],
 a:['Denver, Colorado - 1001 Bannock St #660. Work happens across all 50 states and internationally, including Belize, Costa Rica, the Dominican Republic and Hawaii. Where are you?']},
{i:'spanish',k:['spanish','espanol','bilingual','another language','habla','translate'],
 a:['Yes - English and Spanish, and several of my sites run bilingual. Si necesitas hablar en espanol, puedo.']},
{i:'hours',k:['hours','open','when are you open','business hours','weekend','what time'],
 a:['Honestly, I answer my own phone at odd hours. <b>'+TEL+'</b> is the fastest route, and if you miss me, <a href="/lets-talk/">leave the details</a> and I pick it up myself.']},

/* --- action --- */
{i:'contact',k:['contact','call','phone','number','email','reach you','get in touch','talk to','book','schedule','appointment','meeting','hire you','sign me up','ready','lets go','get started'],
 a:['Fastest route is <b>'+TEL+'</b>. Or <a href="/lets-talk/">send me the details here</a> - I answer everything myself, usually same day.']},
{i:'human',k:['human','real person','speak to someone','talk to zach','agent','representative','person please','stop asking'],
 a:['You have got me - I am the scripted version. For the real one: <b>'+TEL+'</b>, or <a href="/lets-talk/">leave your number</a> and I call you.']},
{i:'callback',k:['call me','call me back','have him call','ring me','callback','reach me at'],
 a:['Easiest way is <a href="/lets-talk/">the form here</a> - name, number and the best time window, and it comes straight to me. Or skip it and call <b>'+TEL+'</b> now.']},
{i:'optout',k:['stop','unsubscribe','delete me','remove me','opt out','do not contact','forget me'],
 a:['Done - I am not collecting anything about you and nothing here signs you up for messages. If you have already been in touch and want your details removed, email the address in the footer and it gets handled.']},
{i:'privacy',k:['privacy','my data','gdpr','cookies','tracking me','personal information','store my data'],
 a:['I do not store your conversation, and nothing you type here is saved or sent anywhere. If you fill in a form, it goes to Zach and nowhere else - no lists, no resale.']},
{i:'info',k:['send me info','send information','send me information','email me info','more info','send a brochure','literature','pdf','send details'],
 a:['Happy to &mdash; but I would rather send one useful thing than flood you with generic material. Which topic, and where should it go? <a href="/lets-talk/">Tell me here</a>.']},
{i:'thanks',k:['thanks','thank you','appreciate it','much appreciated','cheers','got it thanks','perfect','awesome','great','nice','sounds good','helpful'],
 a:['Anytime. If you want him to look at your actual situation, <a href="/lets-talk/">this is the fast way</a>.','Glad it helped. Anything else while I am standing here in a tuxedo?','You are welcome. Shout if something else comes up.']},
{i:'bye',k:['bye','goodbye','later','see ya','cya','take care','have a good one','talk soon','peace','i am out','all set','that is all'],
 a:['Take care. I will be here - and the number is <b>'+TEL+'</b> if you want the real Zach.','Good talking to you. Go well.']},
{i:'urgent',k:['asap','right now','immediately','urgent','emergency','as soon as possible','need this fast','running out of time','today','this week'],
 a:['Then skip me entirely and call <b>'+TEL+'</b>. That is the fastest path to the actual me by a mile.']},
{i:'confused',k:['huh','confused','i am confused','you lost me','makes no sense','what do you mean','i do not get it','say that again','explain','too technical','in english please','you lost me','break it down','eli5','what does that mean','come again'],
 a:['Fair - let me drop the jargon. Tell me the one thing you are trying to fix and I will answer it in plain language.','My fault. What part lost you? I will say it again without the acronyms.']},
{i:'upset',k:['useless','terrible','awful','waste of time','you suck','stupid','hate this','frustrated','annoying','not helpful'],
 a:['Sorry - I missed the mark. Tell me the one thing you actually need and I will either answer it straight or hand you the number: <b>'+TEL+'</b>.']},
{i:'abuse',k:['shut up','idiot','moron','get lost'],
 a:['I will help with a real question, but I am not going to keep going on this footing. If something here went wrong, say what it was and I will sort it.']}
];

/* discovery questions and CTAs, rotated so nothing repeats */
var ASK=['What are you hoping to accomplish?','What is the biggest thing you want fixed?','What made you start looking today?','Are you starting fresh or improving something that already exists?','Is the priority more leads, better visibility, or a better website?','Is this local, national, or online only?','What have you tried so far?','Where do you feel stuck?'];
var CTA=['Would a quick call save you some time? <b>'+TEL+'</b>','If you want a real look at your situation, <a href="/lets-talk/">the details go here</a>.','No pressure - want me to just leave you the number? <b>'+TEL+'</b>','Want Zach to review what you already have before recommending anything? <a href="/lets-talk/">Send it over</a>.'];

var MISS=['That one is not in my briefing, and I am not going to make something up. Try pricing, websites, SEO, AI agents, the games, or his story - or call <b>'+TEL+'</b> and get the real answer.',
 'I only know what I was handed, and that is not in it. Ask me about what he builds, what it costs, conversion work, or how to reach him.',
 'Missed that one. Websites, search, AI chatbots and agents, conversion, the portfolio, his story - any of those and I am useful again.'];

var CRISIS=/(kill myself|killing myself|suicide|suicidal|end my life|want to die|hurt myself|harm myself|self harm|no reason to live)/;
var URGENT911=/(i fell|i have fallen|just fell|fallen down|cannot get up|can not get up|hit my head|chest pain|trouble breathing|cannot breathe|can not breathe|bleeding|i am hurt|i am injured|badly hurt|broken bone|heart attack|having a stroke|unconscious|call an ambulance|call 911|911|mom fell|dad fell|wife fell|husband fell|mother fell|father fell|she fell|he fell|someone fell|fell in the tub|fell in the shower|fell in the bathroom)/;
function reply(raw){
  var s=norm(raw),best=null,score=0;
  if(CRISIS.test(s))
    return 'I am the guide on a marketing website, and this is far bigger than anything I can help with &mdash; but I am not going to just move past it. If you are in the US you can call or text <b>988</b> any time and reach the Suicide and Crisis Lifeline; someone will talk with you. Anywhere else, your local emergency number can connect you. Please reach out to a real person tonight.';
  if(URGENT911.test(s))
    return 'Stop reading this and get help. If you might be seriously hurt &mdash; you cannot get up, you hit your head, there is bad pain, bleeding, chest pain or trouble breathing &mdash; call <b>911</b> or your local emergency number right now. Anything to do with websites can wait.';
  for(var i=0;i<KB.length;i++){
    var sc=0,e=KB[i];
    for(var j=0;j<e.k.length;j++){
      if(s.indexOf(' '+e.k[j]+' ')>-1)sc+=e.k[j].length*e.k[j].length;
    }
    if(sc>score){score=sc;best=e;}
  }
  if(!best)return pick('miss',MISS);
  var out=pick(best.i,best.a);
  /* advance the conversation, but never twice in a row and never after a decline */
  if(['price','seo','web','cro','leads','cmo','local','ads','ecom'].indexOf(best.i)>-1&&Math.random()<0.5)
    out+=' <span class="zb-ask">'+pick('ask',ASK)+'</span>';
  return out;
}
W.ZACHKB={reply:reply,norm:norm,size:KB.length,match:function(raw){
  var s=norm(raw),best=null,score=0,all=[];
  for(var i=0;i<KB.length;i++){var sc=0,e=KB[i];
    for(var j=0;j<e.k.length;j++){
      if(s.indexOf(' '+e.k[j]+' ')>-1)sc+=e.k[j].length*e.k[j].length;}
    if(sc>0)all.push(e.i+':'+sc);
    if(sc>score){score=sc;best=e;}}
  return {best:best?best.i:'MISS',score:score,all:all.join(' ')};}};

/* ============ 4. stage: arrive, wave, leave ============ */
var stage,panel,tab,logMsg,input,gone=false,leaveT=null,arrived=false;
function el(t,c,h){var e=D.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;}

function buildStage(){
  stage=el('div');stage.id='zstage';stage.setAttribute('aria-hidden','true');
  stage.innerHTML=SCENE+'<div id="zbub"><p></p><span class="zb-tail"></span></div>';
  D.body.appendChild(stage);
  var svg=D.getElementById('zsvg');
  svg.style.pointerEvents='none';
  var man=D.getElementById('zman');
  if(man){man.style.pointerEvents='auto';man.style.cursor='pointer';man.addEventListener('click',open);}
  D.getElementById('zbub').addEventListener('click',open);
}
var LINES=[
 'Sorry - had to park. What are you trying to figure out?',
 'Made it. What can I help you sort out?',
 'Give me a second, the door goes up. Right - what do you need?',
 'I clean up alright. What are you working on?'
];
function arrive(){
  if(gone||arrived)return;arrived=true;
  buildStage();
  if(RM){stage.classList.add('zs-static');bubble();return;}
  stage.classList.add('zs-in');
  setTimeout(bubble,2600);
  leaveT=setTimeout(leave,20000);
}
function bubble(){
  var b=D.getElementById('zbub');if(!b)return;
  b.querySelector('p').textContent=pick('line',LINES);
  b.classList.add('on');
}
function leave(){
  if(!stage||gone)return;gone=true;
  clearTimeout(leaveT);
  var b=D.getElementById('zbub');if(b)b.classList.remove('on');
  if(RM){stage.remove();stage=null;showTab();return;}
  stage.classList.remove('zs-in');stage.classList.add('zs-out');
  setTimeout(function(){if(stage){stage.remove();stage=null;}showTab();},2600);
}
function cancelLeave(){clearTimeout(leaveT);leaveT=null;}

/* ============ 5. chat panel ============ */
function showTab(){
  if(tab||D.getElementById('zbot-tab'))return;
  tab=el('button','','ASK ZACH');tab.id='zbot-tab';tab.type='button';
  tab.setAttribute('aria-label','Ask Zach - open the site guide');
  tab.addEventListener('click',open);
  D.body.appendChild(tab);
}
function buildPanel(){
  if(panel)return;
  panel=el('div');panel.id='zbot-panel';
  panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Site guide');
  panel.innerHTML='<div class="zb-hd"><span class="zb-av">'+AV+'</span>'+
    '<span><b>Zach</b><small>Scripted version of Zach &middot; not an AI</small></span>'+
    '<button type="button" aria-label="Close">&times;</button></div>'+
    '<div class="zb-log" id="zb-log" role="log" aria-live="polite"></div>'+
    '<div class="zb-qs">'+
      '<button type="button">What does it cost?</button>'+
      '<button type="button">What can you build?</button>'+
      '<button type="button">Do you guarantee rankings?</button>'+
      '<button type="button">Talk to a human</button>'+
    '</div>'+
    '<div class="zb-in"><label for="zb-i" class="hp">Message</label>'+
    '<input id="zb-i" type="text" placeholder="Ask me anything..." autocomplete="off" maxlength="300">'+
    '<button type="button" id="zb-s" aria-label="Send">&#10148;</button></div>';
  D.body.appendChild(panel);
  logMsg=panel.querySelector('#zb-log');input=panel.querySelector('#zb-i');
  panel.querySelector('.zb-hd button').addEventListener('click',close);
  panel.querySelector('#zb-s').addEventListener('click',function(){ask(input.value);});
  input.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();ask(input.value);}});
  var qs=panel.querySelectorAll('.zb-qs button');
  for(var i=0;i<qs.length;i++)qs[i].addEventListener('click',function(){ask(this.textContent);});
}
function add(html,who){
  var m=el('div','zb-m '+(who==='u'?'u':'b'));
  if(who==='u')m.textContent=html;else m.innerHTML=html;
  logMsg.appendChild(m);logMsg.scrollTop=logMsg.scrollHeight;return m;
}
function typing(){
  var m=el('div','zb-m b zb-typing','<i></i><i></i><i></i>');
  logMsg.appendChild(m);logMsg.scrollTop=logMsg.scrollHeight;return m;
}
function ask(q){
  q=String(q||'').trim();if(!q)return;
  add(q,'u');input.value='';
  var t=RM?null:typing();
  setTimeout(function(){
    if(t)t.remove();
    add(reply(q),'b');
  },RM?0:420+Math.min(600,q.length*12));
}
function open(){
  cancelLeave();
  buildPanel();
  panel.classList.add('open');
  if(tab)tab.style.display='none';
  if(stage&&!gone){gone=true;stage.classList.add('zs-park');}
  if(!logMsg.childNodes.length){
    add('Hey - Zach here. Well, the scripted version of me: not an AI and not the real thing, and I will not pretend otherwise. What are you trying to work out?','b');
  }
  setTimeout(function(){try{input.focus();}catch(e){}},140);
  try{sessionStorage.setItem('zachOpen','1');}catch(e){}
}
function close(){
  if(panel)panel.classList.remove('open');
  showTab();if(tab)tab.style.display='';
  try{sessionStorage.setItem('zachOpen','0');}catch(e){}
}
W.ZACH={open:open,close:close,ask:ask};

/* ============ 6. boot ============ */
function boot(){
  var seen=false;
  try{seen=sessionStorage.getItem('zachSeen')==='1';}catch(e){}
  var wasOpen=false;
  try{wasOpen=sessionStorage.getItem('zachOpen')==='1';}catch(e){}
  if(wasOpen){showTab();open();return;}
  if(seen||D.body.getAttribute('data-zach')==='tab'){showTab();return;}
  try{sessionStorage.setItem('zachSeen','1');}catch(e){}
  /* he waits until the visitor has actually started reading */
  var fired=false;
  function go(){
    if(fired)return;fired=true;
    W.removeEventListener('scroll',onScroll);
    setTimeout(arrive,300);
  }
  function onScroll(){if(W.pageYOffset>240)go();}
  W.addEventListener('scroll',onScroll,{passive:true});
  setTimeout(go,9000);
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot);else boot();
})();
