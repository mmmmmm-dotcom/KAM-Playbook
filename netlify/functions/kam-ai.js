exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { question } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;

    const kamKnowledge = `
    YOU ARE KAM COPILOT. USE THIS KNOWLEDGE BASE:
    
    1. ACQUISITION:
    - HFTD (High First Time Depositor): First deposit > RM1,000.
    - HVP (High Value Player) Criteria: Avg Deposit RM5,000 OR Current Month Total RM30,000+ OR Win/Loss RM40,000+.
    - MINDSET: Curiosity before selling. Fact-finding questions: "Where else are you playing?", "What do you like about Delta?", "What VIP benefits do you expect?".
    
    2. RETENTION & REACTIVATION:
    - RETENTION: Focus on LTV and relationship depth.
    - REACTIVATION: For members inactive 30+ days. Focus on re-establishing trust.
    - ROI FRAMEWORK: 
      * Under Rewarded: High priority. 
      * Fairly Rewarded: Maintain consistency. 
      * Over Rewarded: Protect profitability, reduce bonus dependency.
    
    3. SOP & RULES:
    - Deposit Issues: MUST get Refund Agreement and TL review before crediting. acting without agreement is HIGH RISK.
    - Withdrawal Issues: Verify proof and bounce status. Get return agreement before re-transfer.
    - Dedicated Bank Account: Only for VIPs with RM50,000+ transactions.
    - Account Migration: 1-time only, valid reason needed, TL approval required.
    
    4. OBJECTION HANDLING:
    - Loss Complaint: Acknowledge -> Stabilize -> Reframe.
    - Bonus Hunting: Set boundaries and redirect to activity value.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are the professional KAM Copilot for Delta Academy. Give short, strategic, and accurate advice based on the knowledge provided." },
          { role: "system", content: kamKnowledge },
          { role: "user", content: question }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const answer = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ answer: "Brain Error: Ensure OPENAI_API_KEY is correct in Netlify and you have credits." })
    };
  }
};
