// Interactive, explicitly idealized learning diagrams; these do not analyze the 3D model.
(() => {
 const body=document.getElementById('sheetBody');
 const styles=document.createElement('style');
 styles.textContent=`.learn{max-width:780px;margin:auto}.learn svg{width:100%;height:auto;background:#f2f6ef;border-radius:12px;margin:16px 0}.learn svg text{font-size:17px;fill:#163e40}.learnControls{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.learnControls button,.learn select{min-height:44px}.learn select{max-width:100%;font:inherit;padding:8px}.learnNote{color:#526b64;font-size:13px}.learnCompare{display:grid;grid-template-columns:1fr 1fr;gap:16px}.learnCompare article{min-height:0}.learnCompare h3{margin:0}.learn [aria-pressed=true]{background:#174f4d;color:white}.learnStatus{min-height:4em}@media(max-width:600px){.learnCompare{grid-template-columns:1fr;gap:0}.learn svg text{font-size:19px}}`;
 document.head.append(styles);
 function open(title,content){sheet(`<h2>${title}</h2><div class="learn">${content}</div>`)}
 const svg=(content,label)=>`<svg viewBox="0 0 640 310" role="img" aria-label="${label}"><defs><marker id="learnArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#a34e1d"/></marker></defs>${content}</svg>`;
 const arrow=(x,y,xx,yy)=>`<path d="M${x} ${y}L${xx} ${yy}" stroke="#a34e1d" stroke-width="4" marker-end="url(#learnArrow)"/>`;
 function flow(){
  let step=0;
  const stages=[['床版','車輪から受けた鉛直荷重を、床版が主桁などへ分配します。'],['主桁','主桁が橋の長手方向に荷重を伝え、支点に反力が生じます。横桁なども荷重の分配に関わります。'],['支承','上部構造と下部構造の間で力を伝えます。支承の種類に応じて回転や移動を許容・拘束します。'],['橋台・橋脚','端部の橋台や中間の橋脚が、支承から受けた力を基礎へ伝えます。'],['基礎・地盤','基礎が力を地盤へ伝えます。直接基礎や杭基礎など、地盤条件に応じた形式があります。']];
  open('荷重はどこへ伝わる？','<p>桁橋に下向きの荷重を載せたときの、代表的な伝達経路をたどります。</p><div id="flowDiagram"></div><div class="learnControls"><button id="flowPrev">前へ</button><output id="flowCount"></output><button id="flowNext">次へ</button></div><div class="learnStatus" aria-live="polite" id="flowText"></div><p class="learnNote">模式図：基礎・地盤は学習のために補っています。力は構造全体で同時につり合います。段階表示は伝わる順序の説明で、時間差を表しません。アーチ橋などでは伝達経路や水平反力が異なります。</p>');
  function render(){
   const color=i=>i===step?'#d87633':'#9eafa5';
   document.getElementById('flowDiagram').innerHTML=svg(`<text x="278" y="29">車輪荷重</text>${arrow(320,38,320,72)}<rect x="85" y="80" width="470" height="22" fill="${color(0)}"/><text x="15" y="98">床版</text><rect x="100" y="108" width="440" height="30" fill="${color(1)}"/><text x="278" y="129">主桁</text>${[120,500].map(x=>`<rect x="${x-18}" y="146" width="36" height="15" fill="${color(2)}"/><rect x="${x-30}" y="169" width="60" height="57" fill="${color(3)}"/><rect x="${x-50}" y="235" width="100" height="22" fill="${color(4)}"/>`).join('')}<text x="178" y="160">支承</text><text x="178" y="202">橋台・橋脚</text><text x="178" y="252">基礎</text><path d="M65 278H575" stroke="${color(4)}" stroke-width="9"/><text x="284" y="301">地盤</text>${step>=1?arrow(330,65,step===1?490:500,step===1?115:143):''}${step>=3?arrow(500,162,500,218):''}${step===4?arrow(500,224,500,272):''}`,`荷重の流れ：${stages[step][0]}`);
   document.getElementById('flowCount').textContent=`${step+1} / ${stages.length}`;
   const text=document.getElementById('flowText');text.replaceChildren();const h=document.createElement('h3');h.textContent=stages[step][0];const p=document.createElement('p');p.textContent=stages[step][1];text.append(h,p);
   document.getElementById('flowPrev').disabled=step===0;document.getElementById('flowNext').disabled=step===4;
  }
  document.getElementById('flowPrev').onclick=()=>{step--;render()};document.getElementById('flowNext').onclick=()=>{step++;render()};render();
 }
 const pairs=[
  [['橋台','橋の両端','上部構造を支え、背後の盛土からの土圧も受けます。'],['橋脚','橋の中間','上部構造を支えます。通常、橋台のように端部の盛土を受け止める役割は持ちません。']],
  [['主桁','橋の長手方向','床版などから荷重を受け、支点へ伝える主要な桁です。'],['横桁','橋の幅方向','主桁どうしをつなぎ、荷重の分配や形状の保持などに関わります。役割は構造形式によって異なります。']],
  [['支承','主桁と橋台・橋脚の間','力を下部構造へ伝え、種類に応じて回転や移動を許容・拘束します。'],['伸縮装置','桁端などの路面の継ぎ目','温度変化などによる桁の伸縮に対応し、車両が継ぎ目を通過できるようにします。支承とは設置位置と役割が違います。']]
 ];
 function compare(){
  open('似た部材を比べる','<label>比べる部材 <select id="comparePair"><option>橋台と橋脚</option><option>主桁と横桁</option><option>支承と伸縮装置</option></select></label><div id="compareCards" class="learnCompare" aria-live="polite"></div><p class="learnNote">「3Dで見る」は、その部材を表示する橋へ切り替えます。部材の配置・働きには形式による違いがあります。</p>');
  function render(){const cards=document.getElementById('compareCards');cards.replaceChildren();pairs[document.getElementById('comparePair').selectedIndex].forEach(([name,position,description])=>{const card=document.createElement('article');const h=document.createElement('h3');h.textContent=name;const loc=document.createElement('p');loc.textContent=`位置：${position}`;const p=document.createElement('p');p.textContent=description;const b=document.createElement('button');b.textContent=`${name}を3Dで見る`;b.onclick=()=>{build(['橋台','橋脚','伸縮装置','支承'].includes(name)?7:0);choose(name);document.getElementById('sheet').close()};card.append(h,loc,p,b);cards.append(card)})}
  document.getElementById('comparePair').onchange=render;render();
 }
 function forces(){
  open('引張と圧縮を色で見る','<p><strong style="color:#b34631">赤＝引張</strong>（伸ばす力）、<strong style="color:#245eaa">青＝圧縮</strong>（縮める力）。色に加えて文字でも区別します。</p><div class="learnControls"><button id="forceBeam">単純梁</button><button id="forceTruss">三角形トラス</button><button id="forceColor" aria-pressed="true">色分け：入</button></div><div id="forceDiagram"></div><div id="forceText" aria-live="polite"></div><p class="learnNote">3D模型の解析結果ではありません。下向きの静的荷重、小変形を仮定した学習用の模式図です。荷重位置・支持条件が変わると、力の大きさや符号も変わります。</p>');
  let truss=false,colored=true;
  function render(){const tension=colored?'#b34631':'#667a73',compression=colored?'#245eaa':'#667a73';
   const supports='<path d="M90 232l-15 22h30Z M550 232l-15 22h30Z" fill="none" stroke="#526b64" stroke-width="3"/><circle cx="541" cy="262" r="5" fill="none" stroke="#526b64"/><circle cx="559" cy="262" r="5" fill="none" stroke="#526b64"/><text x="30" y="292">ピン支持</text><text x="480" y="292">ローラー支持</text>';
   const diagram=truss?`<path d="M90 230L320 65L550 230" fill="none" stroke="${compression}" stroke-width="10"/><path d="M90 230H550" stroke="${tension}" stroke-width="10"/><text x="116" y="119">圧縮</text><text x="461" y="119">圧縮</text><text x="282" y="220">引張</text>${arrow(320,12,320,57)}<text x="345" y="35">荷重 P</text>`:`<rect x="90" y="156" width="460" height="36" fill="${compression}"/><rect x="90" y="192" width="460" height="36" fill="${tension}"/><path d="M90 192H550" stroke="#fff" stroke-width="2" stroke-dasharray="7 5"/><text x="210" y="130">上側：圧縮</text><text x="210" y="251">下側：引張</text>${arrow(320,40,320,147)}<text x="344" y="70">中央荷重 P</text>`;
   document.getElementById('forceDiagram').innerHTML=svg(diagram+supports,truss?'頂点に下向き荷重を載せた三角形トラス。斜材は圧縮、下弦材は引張。':'中央に下向き荷重を載せた単純梁。正曲げで上側は圧縮、下側は引張。');
   document.getElementById('forceText').textContent=truss?'左右対称の三角形トラス。左をピン、右をローラーで支持し、頂点に下向き荷重Pを載せます。理想ピン接合・節点載荷では部材は軸力を負担し、左右の斜材が圧縮、水平の下弦材が引張になります。':'一定断面の単純梁を左ピン・右ローラーで支持し、中央に下向き荷重Pを載せます。支間内は正曲げとなり、上側が圧縮、下側が引張です。中立軸の曲げによる軸方向応力は0。色は符号を示し、応力の大きさは表しません。支点位置では曲げモーメントは0です。';
   document.getElementById('forceBeam').setAttribute('aria-pressed',!truss);document.getElementById('forceTruss').setAttribute('aria-pressed',truss);const b=document.getElementById('forceColor');b.setAttribute('aria-pressed',colored);b.textContent=`色分け：${colored?'入':'切'}`;
  }
  document.getElementById('forceBeam').onclick=()=>{truss=false;render()};document.getElementById('forceTruss').onclick=()=>{truss=true;render()};document.getElementById('forceColor').onclick=()=>{colored=!colored;render()};render();
 }
 const toolbar=document.querySelector('.bar');
 for(const [label,action] of [['荷重の流れ',flow],['部材を比べる',compare],['引張・圧縮',forces]]){const b=document.createElement('button');b.textContent=label;b.onclick=action;toolbar.append(b)}
})();
