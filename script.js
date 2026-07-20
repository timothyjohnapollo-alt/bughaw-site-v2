const hdr = document.getElementById('hdr');
addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 40));
document.getElementById('burger').onclick = () => hdr.classList.toggle('open');
document.querySelectorAll('.navlinks a').forEach(a => a.onclick = () => hdr.classList.remove('open'));

const io = new IntersectionObserver((es) => es.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add('in');
    io.unobserve(e.target);
  }
}), {
  threshold: .12
});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

document.getElementById('filters').addEventListener('click', e => {
  if (!e.target.classList.contains('chip')) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  e.target.classList.add('active');
  const f = e.target.dataset.f;
  document.querySelectorAll('#masonry figure').forEach(fig => {
    fig.classList.toggle('hide', f !== 'all' && fig.dataset.cat !== f);
  });
});

/* ================= VIDEO SECTION — Facebook / Instagram embeds =================
   Reads each <figure class="embed-card"> in #embedGrid and renders the real
   Facebook or Instagram post inside it, plus a credit line underneath.
   The creator's name + link-back come from the embed itself — nothing is
   re-hosted. To add/change videos, edit the blocks in index.html (see the
   comment above #embedGrid there). Nothing to change in this file.
============================================================================= */
(() => {
  const grid = document.getElementById('embedGrid');
  if (!grid) return;

  const cards = [...grid.querySelectorAll('.embed-card')];
  let needFB = false, needIG = false;

  // A URL still holding a REPLACE_… placeholder isn't a real post yet.
  const isPlaceholder = (u) => !u || /REPLACE/i.test(u);

  const makePlaceholder = (title, sub) => {
    const ph = document.createElement('div');
    ph.className = 'embed-placeholder';
    ph.innerHTML =
      '<div class="ph-icon">🎬</div>' +
      '<div class="ph-title">' + title + '</div>' +
      '<div class="ph-sub">' + sub + '</div>';
    return ph;
  };

  cards.forEach(card => {
    const type = (card.dataset.type || '').toLowerCase();
    const url = card.dataset.embed || '';
    const credit = card.dataset.credit || '';

    const frame = document.createElement('div');
    frame.className = 'embed-frame';

    // Always drop in a tidy placeholder first — it fills the reel shape while
    // the real post loads, and stays put if the link isn't set yet.
    if (isPlaceholder(url)) {
      frame.appendChild(makePlaceholder('Coming soon', 'A guest reel will be featured here.'));
    } else {
      frame.appendChild(makePlaceholder('Loading video…', 'Fetching the post from ' + (type === 'instagram' ? 'Instagram' : 'Facebook') + '.'));

      if (type === 'facebook') {
        needFB = true;
        const fb = document.createElement('div');
        fb.className = 'fb-video';
        fb.setAttribute('data-href', url);
        fb.setAttribute('data-show-text', 'false');
        frame.appendChild(fb);
      } else if (type === 'instagram') {
        needIG = true;
        const bq = document.createElement('blockquote');
        bq.className = 'instagram-media';
        bq.setAttribute('data-instgrm-permalink', url);
        bq.setAttribute('data-instgrm-version', '14');
        bq.style.margin = '0';
        bq.style.width = '100%';
        frame.appendChild(bq);
      }

      // When the platform injects its <iframe>, reveal it: hide the loading
      // placeholder and let the real post set its own height.
      const mo = new MutationObserver(() => {
        if (frame.querySelector('iframe')) {
          frame.classList.add('loaded');
          const ph = frame.querySelector('.embed-placeholder');
          if (ph) ph.remove();
          mo.disconnect();
        }
      });
      mo.observe(frame, { childList: true, subtree: true });
    }

    card.appendChild(frame);

    if (credit) {
      const cap = document.createElement('figcaption');
      cap.className = 'embed-credit';
      const handle = credit.trim();
      if (handle.charAt(0) === '@') {
        const link = document.createElement('a');
        link.target = '_blank';
        link.rel = 'noopener';
        link.href = (type === 'instagram')
          ? 'https://www.instagram.com/' + handle.slice(1) + '/'
          : 'https://www.facebook.com/' + handle.slice(1);
        link.textContent = handle;
        cap.appendChild(document.createTextNode('🎥 '));
        cap.appendChild(link);
      } else {
        cap.textContent = '🎥 ' + handle;
      }
      card.appendChild(cap);
    }
  });

  // Load the official SDKs once, only if that platform is actually used.
  if (needFB) {
    const fbs = document.createElement('script');
    fbs.async = true;
    fbs.defer = true;
    fbs.crossOrigin = 'anonymous';
    fbs.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0';
    document.body.appendChild(fbs);
  }
  if (needIG) {
    const igs = document.createElement('script');
    igs.async = true;
    igs.src = 'https://www.instagram.com/embed.js';
    igs.onload = () => { if (window.instgrm) window.instgrm.Embeds.process(); };
    document.body.appendChild(igs);
  }
})();

document.querySelectorAll('.q-item button').forEach(b => b.onclick = () => {
  const it = b.parentElement,
    ans = it.querySelector('.ans'),
    open = it.classList.contains('open');
  document.querySelectorAll('.q-item').forEach(x => {
    x.classList.remove('open');
    x.querySelector('.ans').style.maxHeight = null;
  });
  if (!open) {
    it.classList.add('open');
    ans.style.maxHeight = ans.scrollHeight + 'px';
  }
});

/* ================= CHAT WIDGET ================= */
(() => {
  const MESSENGER = "https://www.facebook.com/messages/t/100076199498338";

  // Knowledge base — each entry: keywords to match + the answer.
  const KB = [
    { k: ["where","location","located","address","how to get","directions","daraitan","tanay","rizal","dela calzada","far","manila"],
      a: "We're at Dela Calzada, Daraitan, Tanay, Rizal — a scenic drive east of Manila. You can grab directions from the map in the Property section above." },
    { k: ["hour","hours","operating","open","time","what time","day tour","daytour","check in","check-in","checkin","check out","checkout"],
      a: "We welcome both day tours and overnight guests.<br>• Day tours: 6:00 AM – 5:00 PM<br>• Overnight: 2:00 PM – 12:00 NN (next day)" },
    { k: ["reserve","reservation","reservation fee","advance","book ahead","secure","hold a date","deposit"],
      a: "Yes, we highly recommend reserving in advance — especially on weekends and holidays. The reservation fee is at least 50% of the rate, with the remaining 50% due on the day of your booking." },
    { k: ["accommodation","stay","sleep","room","hut","huts","nipa","kubo","cabin","how many pax","capacity","main camp","extension"],
      a: "We have Nipa (Kubo) huts for your stay:<br><br><strong>Main Camp</strong><br>• Nipa 1 — 6–8 pax<br>• Nipa 2 — 6–8 pax<br>• Nipa 3 — 4–6 pax<br><br><strong>Extension Camp</strong><br>• Nipa 1 — 4–6 pax<br>• Nipa 2 — 4–6 pax<br>• Nipa 3 — 6–8 pax<br>• Nipa 4 — 6–8 pax" },
    { k: ["activity","activities","things to do","do there","kayak","kayaking","swim","swimming","hike","hiking","tinipak","tubing","water tubing","bonfire"],
      a: "You can enjoy kayaking, swimming, hiking in Tinipak, water tubing, and bonfire." },
    { k: ["food","bring food","own food","cook","cooking","eat","meal","kitchen","grill"],
      a: "Yes! You're welcome to bring your own food to cook." },
    { k: ["park","parking","car","vehicle","drive"],
      a: "Yes, parking is available for guests." },
    { k: ["pet","pets","dog","cat","animal","pet-friendly","pet friendly","fur baby"],
      a: "Yes, Bughaw is a pet-friendly camp!" },
    { k: ["child","children","kid","kids","senior","seniors","elderly","family-friendly","family friendly","suitable","stairs","accessible"],
      a: "Yes, it's suitable for both children and seniors. Our Nipas are built from kawayan with just a few-step stairs for easy access." },
    { k: ["book","booking","how do i book","how to book","reserve a nipa"],
      a: "Just send us a message with your preferred date, number of guests, and chosen Nipa — our team will guide you through the reservation process." },
    { k: ["payment","pay","gcash","maya","bank","transfer","method","how to pay"],
      a: "We accept GCash, Maya, or bank transfer. A reservation fee may be required to confirm your booking — our reservations team will share the details." },
    { k: ["cancel","cancellation","reschedule","rescheduling","change date","move date","refund"],
      a: "Yes, cancellation and rescheduling are possible, subject to our policy. Please contact us as early as possible if your plans change." },
    { k: ["bring","pack","what should","need to bring","packing","what to bring"],
      a: "Just bring your clothes, a towel, and the food you'll cook. We'll handle the rest." },
    { k: ["why","why choose","why bughaw","clean","maintained","staff","friendly"],
      a: "Because the camp is well-maintained, clean, organized, and simply beautiful — and the staff are friendly and accommodating." },
    { k: ["contact","phone","number","call","reach","cellphone"],
      a: "You can call us at 0919 003 8503, or message us on Messenger for the quickest reply." },
  ];

  const chips = [
    { label: "Location", q: "Where is Bughaw located?" },
    { label: "Hours", q: "What are your operating hours?" },
    { label: "Accommodations", q: "What accommodations are available?" },
    { label: "Activities", q: "What activities can we enjoy?" },
    { label: "How to book", q: "How do I book?" },
    { label: "Pet-friendly?", q: "Is Bughaw pet-friendly?" },
  ];

  const cw = document.getElementById("cw");
  if (!cw) return;
  const fab = document.getElementById("cwFab");
  const closeBtn = document.getElementById("cwClose");
  const body = document.getElementById("cwBody");
  const input = document.getElementById("cwText");
  const send = document.getElementById("cwSend");

  let greeted = false;

  function scroll() { body.scrollTop = body.scrollHeight; }

  function addMsg(text, who) {
    const m = document.createElement("div");
    m.className = "cw-msg " + who;
    m.innerHTML = text;
    body.appendChild(m);
    scroll();
    return m;
  }

  function typing() {
    const t = document.createElement("div");
    t.className = "cw-msg bot cw-typing";
    t.innerHTML = "<span></span><span></span><span></span>";
    body.appendChild(t);
    scroll();
    return t;
  }

  function messengerLine(pre) {
    return `${pre}<br><a href="${MESSENGER}" target="_blank" rel="noopener" style="white-space:nowrap">→ chat with us on Messenger&nbsp;</a>`;
  }

  function answer(q) {
    const text = q.toLowerCase();
    let best = null, bestScore = 0;
    KB.forEach(entry => {
      let score = 0;
      entry.k.forEach(kw => { if (text.includes(kw)) score += kw.length; });
      if (score > bestScore) { bestScore = score; best = entry; }
    });
    if (best) {
      return `${best.a}<br><br>${messengerLine("Need anything else?")}`;
    }
    return messengerLine("I'm not sure about that one — for anything more specific, it's best to");
  }

  function respond(q) {
    const t = typing();
    setTimeout(() => {
      t.remove();
      addMsg(answer(q), "bot");
    }, 550 + Math.random() * 350);
  }

  function ask(q) {
    addMsg(q, "user");
    respond(q);
  }

  function greet() {
    if (greeted) return;
    greeted = true;
    addMsg(`Kumusta! 👋 I'm the Bughaw helper. Ask me about hours, booking, activities, pets — or tap a question below.<br><br>To make reservations and transactions,<br><a href="${MESSENGER}" target="_blank" rel="noopener" style="white-space:nowrap">→ chat us on Messenger&nbsp;</a>`, "bot");
    const cwChips = document.createElement("div");
    cwChips.className = "cw-chips";
    chips.forEach(c => {
      const b = document.createElement("button");
      b.textContent = c.label;
      b.onclick = () => ask(c.q);
      cwChips.appendChild(b);
    });
    body.appendChild(cwChips);
    scroll();
  }

  function toggle() {
    cw.classList.toggle("open");
    if (cw.classList.contains("open")) { greet(); setTimeout(() => input.focus(), 350); }
  }

  fab.onclick = toggle;
  closeBtn.onclick = () => cw.classList.remove("open");

  function submit() {
    const q = input.value.trim();
    if (!q) return;
    input.value = "";
    ask(q);
  }
  send.onclick = submit;
  input.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
})();