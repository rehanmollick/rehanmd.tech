// ============================================================
// app.js — rehanmd.tech redesign prototype
// ============================================================
(function(){
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
  const state={view:"home",adminPanel:"dashboard",currentWall:0,editingProject:null,editingDispatch:null,lightbox:{open:false,slides:[],idx:0,title:""}};

  // ---------- Hero marquee ----------
  const marqueeText=["WELCOME ABOARD","THIS IS NOT YOUR USUAL COMMUTE","HOW DID YOU END UP HERE?","THE TUNNEL GOES DEEPER","MIND THE GAP","NOW BOARDING: MARCH 2026","THIS TRAIN RUNS ON CAFFEINE"];
  const mt=$("#marquee-track");
  if(mt){const s=marqueeText.join("  •  ")+"  •  ";mt.textContent=s+s;}

  // ---------- Clock ----------
  function tickClock(){const c=$("#clock");if(!c)return;const d=new Date();c.textContent=String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");}
  tickClock();setInterval(tickClock,30000);

  // ---------- View routing ----------
  function setView(v){
    state.view=v;
    $$(".view").forEach(el=>el.classList.toggle("active",el.id==="view-"+v));
    window.scrollTo(0,0);
    if(v==="admin") renderAdmin();
  }
  $$("[data-view]").forEach(el=>{
    el.addEventListener("click",e=>{
      e.preventDefault();
      const v=el.dataset.view;
      setView(v);
      const s=el.dataset.scroll;
      if(s) setTimeout(()=>{const t=document.getElementById(s);if(t)t.scrollIntoView({behavior:"smooth",block:"start"});},120);
    });
  });

  // ---------- Dispatches wall ----------
  function renderWalls(){
    const PER_WALL=9;
    const dispatches=window.DISPATCHES.slice();
    // Always append a "+" card at the very end for admin-mode feel
    const items=[...dispatches,{_add:true}];
    const walls=[];
    for(let i=0;i<items.length;i+=PER_WALL) walls.push(items.slice(i,i+PER_WALL));
    if(walls.length===0) walls.push([]);

    const track=$("#wall-track");
    track.innerHTML="";
    walls.forEach((wallItems,wi)=>{
      const panel=document.createElement("div");
      panel.className="wall-panel";
      const board=document.createElement("div");
      board.className="pinboard";
      panel.appendChild(board);

      const layout=window.TWEAKS&&window.TWEAKS.dispatches_layout==="grid"?gridLayout:organicLayout;
      const positions=layout(wallItems.length);

      wallItems.forEach((item,i)=>{
        const p=positions[i];
        const el=document.createElement("div");
        if(item._add){
          el.className="dispatch new-dispatch-btn";
          el.innerHTML=`<div style="padding:20px"><div style="font-size:38px;line-height:1">＋</div><div style="font-size:14px;letter-spacing:.2em;margin-top:8px">PIN A DISPATCH</div></div>`;
          el.addEventListener("click",()=>{setView("admin");state.adminPanel="new-dispatch";renderAdmin();});
        }else{
          const variant=["","variant-b","variant-c","variant-d"][i%4];
          el.className="dispatch "+variant;
          el.style.setProperty("--tilt",p.tilt+"deg");
          el.innerHTML=`
            <h3>${escapeHtml(item.title)}</h3>
            <div class="d-meta">${formatDate(item.date)} · ${item.readTime||2} MIN</div>
            <div class="d-excerpt">${escapeHtml(item.excerpt)}</div>
            <div class="d-stamp">Posted</div>`;
          el.addEventListener("click",()=>openBlogPost(item.slug));
        }
        Object.assign(el.style,{
          left:p.x+"%",top:p.y+"%",width:p.w+"px",height:p.h+"px",
          transform:`rotate(${p.tilt}deg)`,zIndex:p.z,
        });
        board.appendChild(el);
      });
      track.appendChild(panel);
    });

    // update indicator
    state.walls=walls;
    updateWallUI();
  }

  function organicLayout(n){
    // Positions on a 3x3 grid with jitter and rotation
    const cells=[];
    for(let r=0;r<3;r++)for(let c=0;c<3;c++) cells.push({r,c});
    const positions=[];
    const seed=(i)=>((Math.sin(i*73.13)+1)/2);
    for(let i=0;i<n;i++){
      const cell=cells[i%9];
      const baseX=6+cell.c*30;
      const baseY=4+cell.r*32;
      const jx=(seed(i*2)-.5)*6;
      const jy=(seed(i*2+1)-.5)*5;
      const w=220+Math.round(seed(i*3)*60);
      const h=180+Math.round(seed(i*4)*50);
      const tilt=(seed(i*5)-.5)*14;
      positions.push({x:baseX+jx,y:baseY+jy,w,h,tilt,z:i+1});
    }
    return positions;
  }
  function gridLayout(n){
    const positions=[];
    for(let i=0;i<n;i++){
      const r=Math.floor(i/3),c=i%3;
      positions.push({x:6+c*30,y:4+r*32,w:240,h:200,tilt:(i%2===0?-1.5:1.5),z:i+1});
    }
    return positions;
  }

  function updateWallUI(){
    const track=$("#wall-track");
    track.style.transform=`translateX(-${state.currentWall*100}%)`;
    const total=state.walls.length;
    $("#wall-indicator").textContent=`WALL ${state.currentWall+1} / ${total}`;
    $("#wall-prev").disabled=state.currentWall===0;
    $("#wall-next").disabled=state.currentWall>=total-1;
  }
  $("#wall-prev").addEventListener("click",()=>{if(state.currentWall>0){state.currentWall--;updateWallUI();}});
  $("#wall-next").addEventListener("click",()=>{if(state.currentWall<state.walls.length-1){state.currentWall++;updateWallUI();}});

  // Ceiling lights
  const wl=$("#wall-lights");
  if(wl){for(let i=0;i<8;i++){const d=document.createElement("div");d.className="wall-light";d.innerHTML='<div class="wall-cord"></div>';wl.appendChild(d);}}

  // ---------- The Line: stations ----------
  // xShift: relative horizontal offset (in px) for that station's center
  const STATION_LAYOUT=[
    {shift:0,  side:"right"},   // Karmen
    {shift:0,  side:"left"},    // GridPulse
    {shift:-60,side:"right"},   // FlightSense (line jogs left)
    {shift:-60,side:"left"},    // SplitPay
    {shift:40, side:"right"},   // Orbit (jogs right)
    {shift:40, side:"left"},    // Aegis
    {shift:-30,side:"right"},   // Mp3 (jogs left)
  ];

  function renderStations(){
    const stationsEl=$("#stations");
    stationsEl.innerHTML="";
    window.PROJECTS.forEach((project,i)=>{
      const layout=STATION_LAYOUT[i]||{shift:0,side:i%2===0?"right":"left"};
      const row=document.createElement("div");
      row.className="station "+layout.side;
      row.dataset.stationIdx=i;
      row.style.setProperty("--shift",layout.shift+"px");
      row.style.transform=`translateX(${layout.shift}px)`;

      const slot=document.createElement("div");
      slot.className="card-slot";
      // card itself does not shift — counter-translate
      slot.style.transform=`translateX(${-layout.shift}px)`;
      slot.appendChild(buildPlaque(project,i));

      const marker=document.createElement("div");
      marker.className="station-marker";
      marker.innerHTML=`
        <div class="station-node"></div>
        <div class="station-sign">
          <div class="station-sign-inner">${escapeHtml(project.stationName||project.title)}</div>
        </div>
        <div class="sign-date" style="font-family:var(--mono);font-size:10px;color:var(--text-muted);letter-spacing:.15em;white-space:nowrap">${escapeHtml(project.dateDisplay)}</div>
      `;

      if(layout.side==="left"){row.appendChild(slot);row.appendChild(marker);row.appendChild(document.createElement("div"));}
      else{row.appendChild(document.createElement("div"));row.appendChild(marker);row.appendChild(slot);}
      stationsEl.appendChild(row);

      // branches
      const bs=window.BRANCHES.filter(b=>b.afterIndex===i);
      bs.forEach(b=>{
        const branchRow=document.createElement("div");
        branchRow.style.cssText=`position:relative;height:36px;transform:translateX(${layout.shift}px)`;
        const wrap=document.createElement("div");
        wrap.style.cssText=`position:absolute;top:0;${b.side==="right"?"left:52%":"right:52%"};display:flex;align-items:center;gap:6px;${b.side==="left"?"flex-direction:row-reverse":""}`;
        const stub=document.createElement("div");
        stub.style.cssText="width:30px;height:2px;background:repeating-linear-gradient(to right,var(--accent-dim) 0 4px,transparent 4px 8px)";
        wrap.appendChild(stub);
        b.names.forEach((n,idx)=>{
          if(idx>0){const sep=document.createElement("div");sep.style.cssText="width:20px;height:2px;background:repeating-linear-gradient(to right,var(--accent-dim) 0 4px,transparent 4px 8px)";wrap.appendChild(sep);}
          const dot=document.createElement("div");dot.className="branch";dot.innerHTML=`<span class="b-dot"></span><span>${escapeHtml(n)}</span>`;
          dot.style.position="static";
          wrap.appendChild(dot);
        });
        branchRow.appendChild(wrap);
        stationsEl.appendChild(branchRow);
      });
    });

    // Draw the SVG metro line after layout
    requestAnimationFrame(drawMetroLine);
  }

  function drawMetroLine(){
    const body=$("#line-body");
    const svg=$("#metro-svg");
    if(!body||!svg)return;
    const bodyRect=body.getBoundingClientRect();
    const W=bodyRect.width, H=body.offsetHeight;
    svg.setAttribute("viewBox",`0 0 ${W} ${H}`);
    svg.style.width=W+"px";svg.style.height=H+"px";

    // Collect node centers (in body-relative coords)
    const points=[];
    // Start from upcoming terminus icon
    const tnIcons=body.querySelectorAll(".terminus .tn-icon");
    if(tnIcons[0]){
      const r=tnIcons[0].getBoundingClientRect();
      points.push({x:r.left-bodyRect.left+r.width/2,y:r.top-bodyRect.top+r.height/2});
    }
    body.querySelectorAll(".station-node").forEach(n=>{
      const r=n.getBoundingClientRect();
      points.push({x:r.left-bodyRect.left+r.width/2,y:r.top-bodyRect.top+r.height/2});
    });
    if(tnIcons[1]){
      const r=tnIcons[1].getBoundingClientRect();
      points.push({x:r.left-bodyRect.left+r.width/2,y:r.top-bodyRect.top+r.height/2});
    }
    if(points.length<2){svg.innerHTML="";return;}

    // Build path with 45° jogs where x changes — metro-map style
    let d=`M ${points[0].x} ${points[0].y}`;
    for(let i=1;i<points.length;i++){
      const a=points[i-1], b=points[i];
      const dx=b.x-a.x, dy=b.y-a.y;
      if(Math.abs(dx)<2){
        // straight vertical
        d+=` L ${b.x} ${b.y}`;
      } else {
        // vertical down, then 45° jog, then vertical to b
        const jogLen=Math.abs(dx);
        const topY=a.y+(dy-jogLen)/2;  // where jog starts
        const botY=topY+jogLen;        // where jog ends
        d+=` L ${a.x} ${topY}`;
        d+=` L ${b.x} ${botY}`;
        d+=` L ${b.x} ${b.y}`;
      }
    }

    // Branch stubs
    let branchPaths="";
    body.querySelectorAll(".branch .b-dot").forEach(dot=>{
      const r=dot.getBoundingClientRect();
      const x=r.left-bodyRect.left+r.width/2;
      const y=r.top-bodyRect.top+r.height/2;
      // find nearest station center x on main line
      let nearest=points[0];
      for(const p of points){if(Math.abs(p.y-y)<Math.abs(nearest.y-y))nearest=p;}
      branchPaths+=`<path class="branch-stub" d="M ${nearest.x} ${nearest.y} L ${x} ${y}"/>`;
    });

    svg.innerHTML=`
      <path class="line-glow" d="${d}"/>
      <path class="line-main" d="${d}"/>
      ${branchPaths}
    `;

    // Redistribute bulbs along the main path
    const bs=$("#bulb-string");
    if(bs){
      bs.innerHTML="";
      const pathEl=svg.querySelector(".line-main");
      if(pathEl){
        const L=pathEl.getTotalLength();
        const count=Math.max(8,Math.floor(L/140));
        for(let i=0;i<count;i++){
          const t=(i+0.5)/count;
          const pt=pathEl.getPointAtLength(L*t);
          const b=document.createElement("div");
          b.className="bulb"+(i%5===3?" dim":"");
          b.style.left=pt.x+"px";b.style.top=pt.y+"px";
          bs.appendChild(b);
        }
      }
    }
  }

  window.addEventListener("resize",()=>{clearTimeout(window._drawT);window._drawT=setTimeout(drawMetroLine,120);});
  window.addEventListener("load",()=>setTimeout(drawMetroLine,100));

  function buildPlaque(project,index){
    const wrap=document.createElement("div");
    wrap.className="plaque";
    const stationNum=String(window.PROJECTS.length-index).padStart(2,"0");
    const slides=(project.slides||[]).length?project.slides:[{type:"placeholder",label:"media coming soon"}];
    const techChips=project.techStack.map(t=>`<span class="tech-chip">${escapeHtml(t.name)}</span>`).join("");
    const techExpanded=project.techStack.map(t=>`<div class="stack-item"><strong>${escapeHtml(t.name)}:</strong> <span class="r">${escapeHtml(t.reason)}</span></div>`).join("");

    wrap.innerHTML=`
      <div class="bolt tl"></div><div class="bolt tr"></div>
      <div class="bolt bl"></div><div class="bolt br"></div>
      <div class="plaque-inner">
        <div class="plaque-top">
          <span class="station-num">STATION ${stationNum}</span>
          <span>ORANGE LINE</span>
          <span class="station-date">${escapeHtml(project.dateDisplay)}</span>
        </div>
        <h3 class="plaque-title">${escapeHtml(project.title)}</h3>
        ${project.context?`<div class="plaque-ctx">▸ ${escapeHtml(project.context)}</div>`:""}
        <div class="plaque-media" data-project="${project.id}">
          <div class="slides">
            ${slides.map(s=>s.type==="placeholder"?`<div class="slide placeholder"><span>${escapeHtml(s.label||"media")}</span></div>`:`<div class="slide" style="background-image:url('${escapeAttr(s.url)}')"></div>`).join("")}
          </div>
          ${slides.length>1?`<button class="nav-arrow prev" data-nav="prev">◀</button><button class="nav-arrow next" data-nav="next">▶</button>`:""}
          ${slides.length>1?`<div class="dots">${slides.map((_,i)=>`<div class="dot${i===0?" active":""}" data-i="${i}"></div>`).join("")}</div>`:""}
          <div class="count-badge"><span class="cur">1</span>/${slides.length}</div>
          <div class="autoplay-bar"></div>
        </div>
        <p class="plaque-desc">${escapeHtml(project.description)}</p>
        <div class="plaque-links">
          ${project.liveUrl?`<a class="plaque-link primary" href="${escapeAttr(project.liveUrl)}" target="_blank">▸ LIVE DEMO</a>`:""}
          ${project.repoUrl?`<a class="plaque-link secondary" href="${escapeAttr(project.repoUrl)}" target="_blank"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.8 8.21 11.39.6.11.82-.26.82-.57 0-.28-.01-1.23-.02-2.24-3.01.55-3.8-.73-4.04-1.41-.13-.35-.72-1.41-1.23-1.7-.42-.22-1.02-.78-.02-.79.95-.01 1.62.87 1.85 1.23 1.08 1.82 2.8 1.3 3.49.99.11-.78.42-1.3.77-1.6-2.67-.3-5.47-1.33-5.47-5.92 0-1.31.47-2.38 1.23-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.44 11.44 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.3 0 .32.22.69.82.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> REPO</a>`:""}
        </div>
        <div class="plaque-tech">
          <div class="plaque-tech-label">▸ BUILT WITH</div>
          <div class="plaque-tech-chips">${techChips}</div>
        </div>
        <button class="stack-toggle"><span class="chev">▸</span> WHY THIS STACK</button>
        <div class="stack-expanded">${techExpanded}</div>
      </div>
    `;

    // carousel wiring
    const media=wrap.querySelector(".plaque-media");
    const slidesEl=media.querySelector(".slides");
    const dots=Array.from(media.querySelectorAll(".dot"));
    const curEl=media.querySelector(".cur");
    const bar=media.querySelector(".autoplay-bar");
    let idx=0;let userStopped=false;let timer=null;let barTimer=null;let barW=0;
    const total=slides.length;

    function go(i){
      idx=(i+total)%total;
      slidesEl.style.transform=`translateX(-${idx*100}%)`;
      dots.forEach((d,di)=>d.classList.toggle("active",di===idx));
      curEl.textContent=idx+1;
      resetBar();
    }
    function resetBar(){barW=0;bar.style.width="0%";}
    function startAutoplay(){
      if(total<2)return;
      stopAutoplay();
      const dur=(window.TWEAKS?.autoplay_seconds||5)*1000;
      const step=50;
      barTimer=setInterval(()=>{
        if(userStopped){resetBar();return;}
        barW+=(step/dur)*100;
        bar.style.width=Math.min(barW,100)+"%";
        if(barW>=100){barW=0;go(idx+1);}
      },step);
    }
    function stopAutoplay(){if(barTimer){clearInterval(barTimer);barTimer=null;}}

    media.querySelectorAll("[data-nav]").forEach(btn=>{
      btn.addEventListener("click",e=>{e.stopPropagation();userStopped=true;go(idx+(btn.dataset.nav==="next"?1:-1));});
    });
    dots.forEach(d=>d.addEventListener("click",e=>{e.stopPropagation();userStopped=true;go(+d.dataset.i);}));
    media.addEventListener("click",e=>{
      if(e.target.closest("[data-nav]")||e.target.classList.contains("dot"))return;
      openLightbox(project,idx);
    });

    // start autoplay when plaque enters viewport
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(ent=>{
        if(ent.isIntersecting)startAutoplay();
        else stopAutoplay();
      });
    },{threshold:.3});
    io.observe(media);

    // stack toggle
    const st=wrap.querySelector(".stack-toggle");
    st.addEventListener("click",()=>st.classList.toggle("open"));

    return wrap;
  }

  // ---------- Lightbox ----------
  function openLightbox(project,startIdx){
    const lb=$("#lightbox");
    const slidesContainer=$("#lb-slides");
    state.lightbox.slides=project.slides||[];
    state.lightbox.idx=startIdx||0;
    $("#lb-title").textContent=project.title.toUpperCase();
    slidesContainer.innerHTML=state.lightbox.slides.map(s=>
      s.type==="placeholder"
      ?`<div class="lb-slide placeholder">${escapeHtml(s.label||"media")}</div>`
      :`<div class="lb-slide" style="background-image:url('${escapeAttr(s.url)}')"></div>`
    ).join("");
    lbUpdate();
    lb.classList.add("open");
    document.body.style.overflow="hidden";
  }
  function lbUpdate(){
    const n=state.lightbox.slides.length||1;
    $("#lb-slides").style.transform=`translateX(-${state.lightbox.idx*100}%)`;
    $("#lb-count").textContent=`${state.lightbox.idx+1} / ${n}`;
  }
  $("#lb-prev").addEventListener("click",()=>{state.lightbox.idx=(state.lightbox.idx-1+state.lightbox.slides.length)%state.lightbox.slides.length;lbUpdate();});
  $("#lb-next").addEventListener("click",()=>{state.lightbox.idx=(state.lightbox.idx+1)%state.lightbox.slides.length;lbUpdate();});
  $("#lb-close").addEventListener("click",closeLightbox);
  $("#lightbox").addEventListener("click",e=>{if(e.target.id==="lightbox")closeLightbox();});
  document.addEventListener("keydown",e=>{
    const lbOpen=$("#lightbox").classList.contains("open");
    if(!lbOpen)return;
    if(e.key==="Escape")closeLightbox();
    if(e.key==="ArrowLeft")$("#lb-prev").click();
    if(e.key==="ArrowRight")$("#lb-next").click();
  });
  function closeLightbox(){$("#lightbox").classList.remove("open");document.body.style.overflow="";}

  // ---------- Blog reader ----------
  function openBlogPost(slug){
    const post=window.DISPATCHES.find(d=>d.slug===slug);
    if(!post)return;
    $("#reader-content").innerHTML=`
      <div class="masthead">
        <div class="nameplate">The Platform Gazette</div>
        <div class="sub">EST. 2026 · A NEWSPAPER OF ONE · PRINTED ON THE ORANGE LINE</div>
      </div>
      <div class="dateline">
        <span>${formatLongDate(post.date)}</span>
        <span>VOL. I · DISPATCH №${String(window.DISPATCHES.indexOf(post)+1).padStart(2,"0")}</span>
        <span>$0.00 · FREE FOR COMMUTERS</span>
      </div>
      ${post.body}
      <a class="back-link" href="#" id="back-to-wall">← Back to the dispatches wall</a>
      <div class="folio">
        <span>rehanmd.tech/blog/${post.slug}</span>
        <span>— END OF DISPATCH —</span>
        <span>PAGE A1</span>
      </div>
    `;
    setView("blog");
    $("#back-to-wall").addEventListener("click",e=>{e.preventDefault();setView("home");setTimeout(()=>{const el=$("#dispatches");if(el)el.scrollIntoView({behavior:"smooth"});},100);});
  }

  // ---------- Admin ----------
  function renderAdmin(){
    $$(".admin-nav button").forEach(b=>b.classList.toggle("active",b.dataset.panel===state.adminPanel));
    const main=$("#admin-main");
    switch(state.adminPanel){
      case "dashboard":main.innerHTML=adminDashboardHTML();break;
      case "projects":main.innerHTML=adminProjectsHTML();wireProjectsList();break;
      case "new-project":main.innerHTML=adminProjectFormHTML(null);wireProjectForm();break;
      case "edit-project":main.innerHTML=adminProjectFormHTML(state.editingProject);wireProjectForm();break;
      case "dispatches":main.innerHTML=adminDispatchesHTML();wireDispatchesList();break;
      case "new-dispatch":main.innerHTML=adminDispatchFormHTML(null);wireDispatchForm();break;
      case "edit-dispatch":main.innerHTML=adminDispatchFormHTML(state.editingDispatch);wireDispatchForm();break;
      case "media":main.innerHTML=adminMediaHTML();break;
      case "settings":main.innerHTML=adminSettingsHTML();break;
    }
  }
  $$(".admin-nav button").forEach(btn=>{
    btn.addEventListener("click",()=>{state.adminPanel=btn.dataset.panel;renderAdmin();});
  });

  function adminDashboardHTML(){
    const totalSlides=window.PROJECTS.reduce((a,p)=>a+(p.slides||[]).length,0);
    return `
      <h2>Stationmaster's Desk</h2>
      <div class="page-sub">WELCOME BACK, REHAN · ${formatLongDate(new Date().toISOString())}</div>
      <div class="admin-stats">
        <div class="stat"><div class="n">${window.PROJECTS.length}</div><div class="l">Stations</div></div>
        <div class="stat"><div class="n">${window.DISPATCHES.length}</div><div class="l">Dispatches</div></div>
        <div class="stat"><div class="n">${totalSlides}</div><div class="l">Media Files</div></div>
        <div class="stat"><div class="n">${window.BRANCHES.reduce((a,b)=>a+b.names.length,0)}</div><div class="l">Abandoned Branches</div></div>
      </div>

      <div class="form-card" style="margin-bottom:14px">
        <h3>▸ Quick Actions</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
          <button class="btn primary" data-quick="new-project">＋ Add a Project</button>
          <button class="btn" data-quick="new-dispatch">＋ Pin a Dispatch</button>
          <button class="btn" data-quick="media">Upload Media</button>
          <button class="btn" data-quick="view-site">View Live Site ↗</button>
        </div>
      </div>

      <div class="form-card">
        <h3>▸ Recent Activity</h3>
        <div style="font-family:var(--mono);font-size:12px;color:var(--text-secondary);line-height:1.9;margin-top:6px">
          <div>◦ <span style="color:var(--accent-light)">KARMEN PLAYGROUND</span> · station added · March 15</div>
          <div>◦ <span style="color:var(--accent-light)">BUILDING REHANMD.TECH</span> · dispatch pinned · March 31</div>
          <div>◦ <span style="color:var(--accent-light)">GRIDPULSE</span> · station added · January 20</div>
          <div>◦ <span style="color:var(--accent-light)">FLIGHTSENSE</span> · 4 slides uploaded · January 12</div>
        </div>
      </div>
    `;
  }

  function adminProjectsHTML(){
    return `
      <h2>The Line · Stations</h2>
      <div class="page-sub">${window.PROJECTS.length} STATIONS · DRAG TO REORDER · CLICK TO EDIT</div>
      <div class="admin-toolbar">
        <input class="admin-search" placeholder="&gt; search stations by name, tech, tag…" />
        <select class="admin-search" style="flex:0 0 160px"><option>All tags</option><option>hackathon</option><option>ai</option><option>web3</option><option>mobile</option></select>
        <button class="btn primary" data-quick="new-project">＋ New Station</button>
      </div>
      <div class="admin-list">
        ${window.PROJECTS.map((p,i)=>`
          <div class="admin-row" data-pid="${p.id}">
            <div class="thumb">IMG</div>
            <div class="meta">
              <div class="t">${escapeHtml(p.title)}</div>
              <div class="s">${escapeHtml((p.techStack||[]).map(t=>t.name).join(" · "))}</div>
            </div>
            <div class="date">${escapeHtml(p.dateDisplay)}</div>
            <div><span class="status published">Published</span></div>
            <div class="actions">
              <button class="btn" data-edit="${p.id}">Edit</button>
              <button class="btn" data-view-live="${p.id}">View</button>
              <button class="btn danger" data-del="${p.id}">Delete</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function adminProjectFormHTML(p){
    p=p||{title:"",dateDisplay:"",date:"",description:"",stationName:"",repoUrl:"",liveUrl:"",context:"",techStack:[{name:"",reason:""}],slides:[],tags:[],featured:false};
    return `
      <h2>${p.id?"Edit Station":"New Station"}</h2>
      <div class="page-sub">${p.id?"Station — "+escapeHtml(p.title):"Add a new stop to The Line. Required fields marked * — everything else is optional and will be omitted if blank."}</div>
      <form class="admin-form" id="project-form">
        <div class="form-main">
          <div class="field">
            <label>Project title <span class="req">*</span></label>
            <input name="title" required value="${escapeAttr(p.title)}" placeholder="e.g. GridPulse" />
          </div>

          <div class="field-row">
            <div class="field">
              <label>Date <span class="req">*</span></label>
              <input type="date" name="date" required value="${p.date?p.date.substring(0,10):''}" />
              <div class="hint">Used for sorting on the line (newest at top)</div>
            </div>
            <div class="field">
              <label>Date display <span class="opt">(auto if blank)</span></label>
              <input name="dateDisplay" value="${escapeAttr(p.dateDisplay)}" placeholder="e.g. January 2026" />
            </div>
          </div>

          <div class="field">
            <label>Station name <span class="opt">(optional · shown on station plate)</span></label>
            <input name="stationName" value="${escapeAttr(p.stationName)}" placeholder="e.g. GridPulse Station · defaults to project title" />
          </div>

          <div class="field">
            <label>Description <span class="req">*</span></label>
            <textarea name="description" required placeholder="What does it do? Who's it for? Why build it?">${escapeHtml(p.description)}</textarea>
          </div>

          <div class="field">
            <label>Context <span class="opt">(optional · hackathon, internship, client, award)</span></label>
            <input name="context" value="${escapeAttr(p.context||"")}" placeholder="e.g. HackTAMU 2026" />
          </div>

          <div class="field-row">
            <div class="field">
              <label>GitHub repo <span class="opt">(optional)</span></label>
              <input name="repoUrl" value="${escapeAttr(p.repoUrl||"")}" placeholder="https://github.com/…" />
            </div>
            <div class="field">
              <label>Live URL <span class="opt">(optional)</span></label>
              <input name="liveUrl" value="${escapeAttr(p.liveUrl||"")}" placeholder="https://…" />
            </div>
          </div>

          <div class="field">
            <label>Tech stack <span class="req">*</span> <span class="opt">— add name + reason for using it</span></label>
            <div class="tech-builder" id="tech-builder">
              ${(p.techStack.length?p.techStack:[{name:"",reason:""}]).map((t,i)=>techRowHTML(t,i)).join("")}
            </div>
            <button type="button" class="btn" id="add-tech" style="margin-top:8px">＋ Add tech</button>
          </div>

          <div class="field">
            <label>Tags <span class="opt">(optional · comma separated)</span></label>
            <input name="tags" value="${escapeAttr((p.tags||[]).join(", "))}" placeholder="ai, hackathon, web3…" />
          </div>
        </div>

        <div class="form-side">
          <div class="form-card">
            <h3>▸ Media</h3>
            <p style="font-family:var(--mono);font-size:10px;color:var(--text-muted);letter-spacing:.1em;margin:0 0 10px">Drag or click to upload images, GIFs, or videos. These show in the project's carousel and lightbox.</p>
            <label class="media-box" style="display:block;cursor:pointer">
              <span class="up-icon">⇪</span>
              DROP MEDIA HERE
              <div style="margin-top:6px;font-size:9px;opacity:.7">OR CLICK TO BROWSE · PNG JPG GIF MP4</div>
              <input type="file" multiple accept="image/*,video/*" style="display:none" />
            </label>
            <div class="media-grid">
              ${(p.slides||[]).map((s,i)=>`<div class="media-thumb"><span class="order-badge">${i+1}</span><span class="rm">✕</span>${s.label||"MEDIA"}</div>`).join("")}
              ${(p.slides||[]).length===0?`<div class="media-thumb">NO MEDIA YET</div>`:""}
            </div>
          </div>

          <div class="form-card">
            <h3>▸ Visibility</h3>
            <label class="switch" style="margin-bottom:10px"><input type="checkbox" ${p.featured?"checked":""}><span class="track"></span>Featured on line</label><br>
            <label class="switch"><input type="checkbox" checked><span class="track"></span>Published</label>
            <div style="font-family:var(--mono);font-size:10px;color:var(--text-muted);letter-spacing:.1em;margin-top:10px">Unpublished stations are hidden from the public line.</div>
          </div>

          <div class="form-card">
            <h3>▸ Station Sign Preview</h3>
            <div style="border:2px solid #2a2a2a;padding:4px;background:#000;margin-top:6px">
              <div style="background:#000;padding:4px 10px;font-family:var(--pixel);font-size:13px;color:var(--accent-light);letter-spacing:.15em;text-transform:uppercase;text-shadow:0 0 6px rgba(255,140,50,.5)" id="sign-preview">${escapeHtml(p.stationName||p.title||"PREVIEW")}</div>
            </div>
          </div>
        </div>

        <div class="save-bar" style="grid-column:1 / -1">
          <button type="button" class="btn" id="cancel-edit">Cancel</button>
          <button type="button" class="btn danger" id="delete-proj" ${p.id?"":"style=display:none"}>Delete station</button>
          <button type="submit" class="btn primary">▸ ${p.id?"Save changes":"Add to line"}</button>
        </div>
      </form>
    `;
  }

  function techRowHTML(t,i){
    return `
      <div class="tech-row">
        <input placeholder="Name (e.g. Next.js)" value="${escapeAttr(t.name)}" data-tech-name="${i}"/>
        <textarea placeholder="Why this tech?" data-tech-reason="${i}">${escapeHtml(t.reason)}</textarea>
        <button type="button" class="remove" data-tech-rm="${i}">✕</button>
      </div>
    `;
  }

  function wireProjectsList(){
    $$("[data-edit]").forEach(b=>b.addEventListener("click",()=>{
      state.editingProject=window.PROJECTS.find(p=>p.id===b.dataset.edit);
      state.adminPanel="edit-project";renderAdmin();
    }));
    $$("[data-del]").forEach(b=>b.addEventListener("click",()=>{
      if(confirm("Delete this station from The Line?"))alert("(Prototype: would delete "+b.dataset.del+")");
    }));
    $$("[data-quick]").forEach(b=>b.addEventListener("click",()=>{state.adminPanel=b.dataset.quick;renderAdmin();}));
  }

  function wireProjectForm(){
    const form=$("#project-form");
    form.addEventListener("submit",e=>{e.preventDefault();alert("(Prototype: would save this project. In production this POSTs to /api/admin/projects)");});
    $("#cancel-edit").addEventListener("click",()=>{state.adminPanel="projects";renderAdmin();});
    $("#add-tech").addEventListener("click",()=>{
      const builder=$("#tech-builder");
      const i=builder.children.length;
      builder.insertAdjacentHTML("beforeend",techRowHTML({name:"",reason:""},i));
      wireTechRows();
    });
    wireTechRows();
    // live station sign preview
    const titleInput=form.querySelector('[name=title]');
    const stationInput=form.querySelector('[name=stationName]');
    const sign=$("#sign-preview");
    function updateSign(){sign.textContent=(stationInput.value||titleInput.value||"PREVIEW");}
    titleInput.addEventListener("input",updateSign);stationInput.addEventListener("input",updateSign);
  }
  function wireTechRows(){
    $$("[data-tech-rm]").forEach(b=>b.onclick=()=>{b.closest(".tech-row").remove();});
  }

  function adminDispatchesHTML(){
    return `
      <h2>Dispatches · Wall</h2>
      <div class="page-sub">${window.DISPATCHES.length} POSTS ON THE WALL · ORGANIC LAYOUT · NEW POSTS PIN THEMSELVES TO THE FIRST OPEN SPOT</div>
      <div class="admin-toolbar">
        <input class="admin-search" placeholder="&gt; search dispatches…"/>
        <button class="btn primary" data-quick="new-dispatch">＋ New Dispatch</button>
      </div>
      <div class="admin-list">
        ${window.DISPATCHES.map(d=>`
          <div class="admin-row">
            <div class="thumb">DOC</div>
            <div class="meta">
              <div class="t">${escapeHtml(d.title)}</div>
              <div class="s">${escapeHtml(d.tags.join(" · "))} · ${d.readTime||2} min read</div>
            </div>
            <div class="date">${formatDate(d.date)}</div>
            <div><span class="status published">Pinned</span></div>
            <div class="actions">
              <button class="btn" data-edit-dispatch="${d.slug}">Edit</button>
              <button class="btn danger">Unpin</button>
            </div>
          </div>`).join("")}
      </div>
    `;
  }
  function wireDispatchesList(){
    $$("[data-edit-dispatch]").forEach(b=>b.addEventListener("click",()=>{
      state.editingDispatch=window.DISPATCHES.find(d=>d.slug===b.dataset.editDispatch);
      state.adminPanel="edit-dispatch";renderAdmin();
    }));
    $$("[data-quick]").forEach(b=>b.addEventListener("click",()=>{state.adminPanel=b.dataset.quick;renderAdmin();}));
  }

  function adminDispatchFormHTML(d){
    d=d||{title:"",slug:"",date:new Date().toISOString().substring(0,10),excerpt:"",tags:[],readTime:3,body:""};
    return `
      <h2>${d.slug?"Edit Dispatch":"Pin a New Dispatch"}</h2>
      <div class="page-sub">WRITE FIRST · POLISH LATER · THE WALL HAS ROOM</div>
      <form class="admin-form" id="dispatch-form">
        <div class="form-main">
          <div class="field">
            <label>Title <span class="req">*</span></label>
            <input name="title" required value="${escapeAttr(d.title)}" placeholder="e.g. What I broke at 3am"/>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Slug <span class="opt">(auto from title if blank)</span></label>
              <input name="slug" value="${escapeAttr(d.slug)}" placeholder="what-i-broke-at-3am"/>
            </div>
            <div class="field">
              <label>Date <span class="req">*</span></label>
              <input type="date" name="date" required value="${d.date?d.date.substring(0,10):''}"/>
            </div>
          </div>
          <div class="field">
            <label>Excerpt <span class="opt">(first line shown on the wall)</span></label>
            <textarea name="excerpt" placeholder="One punchy sentence.">${escapeHtml(d.excerpt)}</textarea>
          </div>
          <div class="field">
            <label>Body <span class="req">*</span> <span class="opt">— MDX · supports headings, code blocks, pull quotes</span></label>
            <textarea name="body" required style="min-height:320px;font-family:var(--mono);font-size:12px" placeholder="## Start writing…">${escapeHtml(d.body)}</textarea>
          </div>
        </div>
        <div class="form-side">
          <div class="form-card">
            <h3>▸ Paper Style</h3>
            <label class="switch" style="margin-bottom:8px"><input type="checkbox" checked><span class="track"></span>Cream paper</label><br>
            <label class="switch" style="margin-bottom:8px"><input type="checkbox" checked><span class="track"></span>Masking tape</label><br>
            <label class="switch"><input type="checkbox"><span class="track"></span>Aged/stained</label>
          </div>
          <div class="form-card">
            <h3>▸ Meta</h3>
            <div class="field">
              <label>Tags <span class="opt">(comma separated)</span></label>
              <input name="tags" value="${escapeAttr(d.tags.join(", "))}" placeholder="meta, rant, postmortem"/>
            </div>
            <div class="field">
              <label>Read time (min)</label>
              <input type="number" name="readTime" value="${d.readTime||3}" min="1" max="60"/>
            </div>
          </div>
          <div class="form-card">
            <h3>▸ Cover Image</h3>
            <label class="media-box" style="display:block;cursor:pointer">
              <span class="up-icon">⇪</span>
              UPLOAD COVER
              <input type="file" accept="image/*" style="display:none"/>
            </label>
          </div>
        </div>
        <div class="save-bar" style="grid-column:1 / -1">
          <button type="button" class="btn" id="cancel-disp">Cancel</button>
          <button type="button" class="btn">Save Draft</button>
          <button type="submit" class="btn primary">▸ ${d.slug?"Save changes":"Pin to wall"}</button>
        </div>
      </form>
    `;
  }
  function wireDispatchForm(){
    $("#dispatch-form").addEventListener("submit",e=>{e.preventDefault();alert("(Prototype: would save this dispatch.)");});
    $("#cancel-disp").addEventListener("click",()=>{state.adminPanel="dispatches";renderAdmin();});
  }

  function adminMediaHTML(){
    const all=[];window.PROJECTS.forEach(p=>(p.slides||[]).forEach(s=>all.push({project:p.title,label:s.label||"media"})));
    return `
      <h2>Media Library</h2>
      <div class="page-sub">${all.length} FILES · DRAG TO REORDER · CLICK TO ATTACH TO A STATION</div>
      <div class="admin-toolbar">
        <input class="admin-search" placeholder="&gt; filter by project, filename…"/>
        <button class="btn primary">⇪ Upload</button>
      </div>
      <div class="media-grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">
        ${all.map((m,i)=>`<div class="media-thumb" style="aspect-ratio:1">
          <span class="order-badge">${m.project}</span>
          ${escapeHtml(m.label)}
        </div>`).join("")}
      </div>
    `;
  }

  function adminSettingsHTML(){
    return `
      <h2>Settings</h2>
      <div class="page-sub">SITE CONFIG · ADMIN AUTH · DEPLOYMENT</div>
      <div class="form-card" style="margin-bottom:14px">
        <h3>▸ Admin Auth</h3>
        <p style="font-family:var(--mono);font-size:11px;color:var(--text-secondary);line-height:1.7;margin:0 0 10px">
          This panel is gated behind a passphrase in an env var for the prototype. For production I'd recommend <strong style="color:var(--accent-light)">NextAuth with GitHub SSO</strong> allow-listed to your GitHub ID.
        </p>
        <div class="field">
          <label>Current auth method</label>
          <select><option>Passphrase (env: ADMIN_PASSPHRASE)</option><option>NextAuth · GitHub</option><option>Magic link · email</option><option>Supabase</option></select>
        </div>
      </div>
      <div class="form-card" style="margin-bottom:14px">
        <h3>▸ Content Storage</h3>
        <div class="field">
          <label>Where content lives</label>
          <select><option>MDX files in /src/content/blog + projects.ts (commit to git)</option><option>Supabase Postgres</option><option>Vercel Blob + KV</option></select>
        </div>
        <p style="font-family:var(--mono);font-size:11px;color:var(--text-muted);line-height:1.7;margin-top:8px">
          Recommendation: <span style="color:var(--accent-light)">Vercel Blob for media + Postgres for metadata</span>. Lets you edit from this panel on mobile without a dev env, while keeping git as the source of truth by committing back on save.
        </p>
      </div>
      <div class="form-card">
        <h3>▸ Theme</h3>
        <div class="field-row">
          <div class="field"><label>Accent color</label><input value="#BF5700"/></div>
          <div class="field"><label>Base font size</label><input type="number" value="16"/></div>
        </div>
      </div>
    `;
  }

  // ---------- Tweaks (toolbar-toggleable) ----------
  window.TWEAKS=Object.assign({},TWEAK_DEFAULTS);
  window.addEventListener("message",e=>{
    if(!e.data||!e.data.type)return;
    if(e.data.type==="__activate_edit_mode")$("#tweaks").classList.add("on");
    if(e.data.type==="__deactivate_edit_mode")$("#tweaks").classList.remove("on");
  });
  try{window.parent.postMessage({type:"__edit_mode_available"},"*");}catch(e){}

  $("#tw-dispatches").value=window.TWEAKS.dispatches_layout;
  $("#tw-dispatches").addEventListener("change",e=>{window.TWEAKS.dispatches_layout=e.target.value;renderWalls();postTweaks({dispatches_layout:e.target.value});});
  $("#tw-autoplay").value=window.TWEAKS.autoplay_seconds;
  $("#tw-autoplay").addEventListener("input",e=>{window.TWEAKS.autoplay_seconds=+e.target.value;postTweaks({autoplay_seconds:+e.target.value});});
  $("#tw-lights").checked=window.TWEAKS.tunnel_lights;
  $("#tw-lights").addEventListener("change",e=>{$("#bulb-string").style.display=e.target.checked?"":"none";postTweaks({tunnel_lights:e.target.checked});});
  $("#tw-font").value=window.TWEAKS.newspaper_font;
  $("#tw-font").addEventListener("change",e=>{
    document.documentElement.style.setProperty("--display",e.target.value==="serif4"?'"Source Serif 4",serif':'"Playfair Display",serif');
    postTweaks({newspaper_font:e.target.value});
  });
  function postTweaks(edits){try{window.parent.postMessage({type:"__edit_mode_set_keys",edits},"*");}catch(e){}}

  // ---------- Utils ----------
  function escapeHtml(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
  function escapeAttr(s){return escapeHtml(s);}
  function formatDate(iso){if(!iso)return"";const d=new Date(iso);return d.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}).toUpperCase();}
  function formatLongDate(iso){if(!iso)return"";const d=new Date(iso);return d.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"}).toUpperCase();}

  // ---------- Init ----------
  renderWalls();
  renderStations();
  // data-view routing: if no active view hash, show home
})();

  // ---------- About poster modal ----------
  (function(){
    const modal=document.getElementById('about-modal');
    const trigger=document.getElementById('open-about');
    const closeBtn=document.getElementById('ap-close');
    if(!modal||!trigger)return;

    function drawRope(){
      const svg=document.getElementById('ap-map-svg');
      const group=document.getElementById('rope-group');
      if(!svg||!group)return;
      // viewBox is "0 0 1000 500"
      const VW=1000, VH=500;
      const pins=[...modal.querySelectorAll('.ap-pin')].sort((a,b)=>+a.dataset.step - +b.dataset.step);
      if(pins.length<2){group.innerHTML='';return;}
      const pts=pins.map(p=>{
        const left=parseFloat(p.style.left)/100;
        const top=parseFloat(p.style.top)/100;
        // pin tip is at left/top% (translate -50%,-100% in CSS puts dot bottom there)
        return {x:left*VW, y:top*VH};
      });
      // Smooth path through points using catmull-rom -> cubic bezier
      let d=`M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      for(let i=0;i<pts.length-1;i++){
        const p0=pts[i-1]||pts[i];
        const p1=pts[i];
        const p2=pts[i+1];
        const p3=pts[i+2]||p2;
        const t=0.18; // tension
        const c1x=p1.x+(p2.x-p0.x)*t;
        const c1y=p1.y+(p2.y-p0.y)*t;
        const c2x=p2.x-(p3.x-p1.x)*t;
        const c2y=p2.y-(p3.y-p1.y)*t;
        d+=` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      }
      group.innerHTML=`
        <path d="${d}" fill="none" stroke="rgba(154,26,26,.35)" stroke-width="6" stroke-linecap="round" filter="url(#rough)"/>
        <path d="${d}" fill="none" stroke="#9a1a1a" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="7 5" opacity=".95" filter="url(#rough)"/>
      `;
    }

    function open(){
      modal.classList.add('on');
      document.body.style.overflow='hidden';
      requestAnimationFrame(()=>setTimeout(drawRope,30));
    }
    function close(){modal.classList.remove('on');document.body.style.overflow='';}
    window.addEventListener('resize',()=>{if(modal.classList.contains('on'))drawRope();});
    window._drawAboutRope=drawRope;
    window.addEventListener('about-opened',drawRope);
    trigger.addEventListener('click',open);
    trigger.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
    closeBtn&&closeBtn.addEventListener('click',close);
    modal.addEventListener('click',e=>{if(e.target===modal)close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('on'))close();});
  })();

  document.addEventListener('click',function(e){
    const a=e.target.closest('[data-open-about]');
    if(a){e.preventDefault();const m=document.getElementById('about-modal');if(m){m.classList.add('on');document.body.style.overflow='hidden';
      requestAnimationFrame(()=>setTimeout(()=>{const svg=document.getElementById('ap-map-svg');if(svg&&window._drawAboutRope)window._drawAboutRope();else{const evt=new Event('about-opened');window.dispatchEvent(evt);}},50));
    }}
  });
