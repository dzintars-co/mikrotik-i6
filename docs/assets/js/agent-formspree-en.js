(function () {
  const endpoint = "https://formspree.io/f/mgvnplpg";

  // --- Chat Bubble ---
  const bubble = document.createElement("div");
  bubble.id = "ipv6-agent";
  bubble.style.cssText = `
    position: fixed;
    bottom: 22px;
    right: 22px;
    width: 60px;
    height: 60px;
    background: #0b76ef;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 18px rgba(0,0,0,0.25);
    cursor: pointer;
    z-index: 9999;
    transition: all 0.3s ease;
  `;
  bubble.innerHTML = `
    <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
      <path d="M12 2C6.48 2 2 5.58 2 10c0 2.61 1.68 4.98 4.5 6.39V22l4.02-2.07C12.64 20.02 13.31 20 14 20c5.52 0 10-3.58 10-8s-4.48-8-10-8z"/>
    </svg>`;
  bubble.onmouseenter = () => (bubble.style.transform = "scale(1.1)");
  bubble.onmouseleave = () => (bubble.style.transform = "scale(1)");
  document.body.appendChild(bubble);

  // --- Floating Panel ---
  const panel = document.createElement("div");
  panel.id = "agent-panel";
  panel.style.cssText = `
    display: none;
    position: fixed;
    bottom: 95px;
    right: 22px;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.25);
    width: 320px;
    padding: 18px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui;
    color: #0b1220;
    z-index: 9999;
  `;
  panel.innerHTML = `
    <div style="font-weight:700;font-size:1.1rem;margin-bottom:10px;">IPv6 Assistant</div>
    <label>1️⃣ MikroTik model:</label>
    <input id="agent-model" placeholder="hAP ax3" style="width:100%;padding:6px;margin-bottom:8px;">
    <label>2️⃣ IPv6 enabled?</label>
    <select id="agent-ipv6" style="width:100%;padding:6px;margin-bottom:8px;">
      <option>Unknown</option><option>Yes</option><option>No</option>
    </select>
    <label>3️⃣ Need Back-to-Home tunnel?</label>
    <select id="agent-tunnel" style="width:100%;padding:6px;margin-bottom:8px;">
      <option>No</option><option>Yes</option><option>Maybe</option>
    </select>
    <label>4️⃣ Your email address:</label>
    <input id="agent-email" type="email" placeholder="you@example.com" style="width:100%;padding:6px;margin-bottom:8px;">
    <label>5️⃣ Additional notes:</label>
    <textarea id="agent-notes" rows="3" style="width:100%;padding:6px;margin-bottom:8px;"></textarea>
    <div style="display:flex;justify-content:flex-end;gap:8px;">
      <button id="agent-cancel" style="background:#fff;border:1px solid #ccc;padding:6px 10px;border-radius:8px;">Cancel</button>
      <button id="agent-send" style="background:#0b76ef;border:none;color:#fff;padding:6px 10px;border-radius:8px;">Send</button>
    </div>
    <div id="agent-status" style="margin-top:8px;font-size:0.85rem;display:none;"></div>
  `;
  document.body.appendChild(panel);

  // --- Event Handlers ---
  bubble.onclick = () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  };
  panel.querySelector("#agent-cancel").onclick = () => (panel.style.display = "none");

  panel.querySelector("#agent-send").onclick = async () => {
    const email = panel.querySelector("#agent-email").value.trim();
    const model = panel.querySelector("#agent-model").value.trim();
    const ipv6 = panel.querySelector("#agent-ipv6").value;
    const tunnel = panel.querySelector("#agent-tunnel").value;
    const notes = panel.querySelector("#agent-notes").value.trim();
    const status = panel.querySelector("#agent-status");

    if (!email.includes("@")) {
      status.style.display = "block";
      status.style.color = "crimson";
      status.textContent = "❌ Please enter a valid email!";
      return;
    }

    status.style.display = "block";
    status.style.color = "#0b1220";
    status.textContent = "Sending message...";

    try {
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          router_model: model || "Not specified",
          ipv6_active: ipv6,
          need_tunnel: tunnel,
          _replyto: email,
          notes
        })
      });

      if (resp.ok) {
        status.style.color = "green";
        status.textContent = "✅ Message sent successfully!";
        setTimeout(() => {
          panel.style.display = "none";
          status.style.display = "none";
        }, 2000);
        panel.querySelectorAll("input,textarea").forEach(el => (el.value = ""));
      } else {
        status.style.color = "crimson";
        status.textContent = "❌ Failed to send. Try again later.";
      }
    } catch (err) {
      status.style.color = "crimson";
      status.textContent = "⚠️ Network error. Please check your connection.";
    }
  };
})();
