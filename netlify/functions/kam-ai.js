const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async (request) => {
  try {
    const { question } = await request.json();

    const kamKnowledge = `
    CONSOLIDATED KAM KNOWLEDGE BASE V1:

    1. ACQUISITION MASTERY:
    - Purpose: Identify and nurture high-potential members early.
    - HFTD (High First Time Depositor): First deposit > RM1,000. Objective: Create strong first impression and introduce VIP value.
    - HVP (High Value Player): Avg Deposit RM5k+, Current Month Deposit RM30k+, or Win/Loss RM40k+.
    - Core Mindset: Curiosity before selling, Relationship before conversion.

    2. RETENTION & REACTIVATION (R&R):
    - Retention Goal: Strengthen long-term relationships through personalized engagement and ROI-based value allocation.
    - Reactivation Goal: Re-engage members inactive for 30+ days. Focus on rebuilding trust and human connection.
    - ROI Status Framework: 
       * Under Rewarded (High Priority, increase engagement).
       * Fairly Rewarded (Consistency).
       * Over Rewarded (Protect profitability, avoid bonus stimulation).

    3. OBJECTION HANDLING SCRIPTS:
    - Losses Complaints: Acknowledge emotion -> Stabilize -> Reframe. ("Reset strategy").
    - Bonus Hunting: Set boundaries -> Redirect to overall activity value.
    - Not Interested: Curiosity approach. ("What usually catches your attention?").
    - Formula: Acknowledge -> Diagnose -> Reposition -> Action.

    4. KAM SOP & OPERATIONAL RULES:
    - Deposit Issues: TL review + Refund Agreement BEFORE crediting. High Risk.
    - Withdrawal Issues: Check bounce -> Verify proof -> Return agreement before re-transfer.
    - Dedicated Bank: Only for VIPs depositing RM50k+.
    - Account Privacy: VIP Migration is 1-time only, no bonus, TL approval required.
    - Common Mistakes: Acting before agreement, no proof collection, weak follow-up.

    5. DEEPER FACT FINDING QUESTIONS:
    - Ask about sourcing (Ads/Friends), other platforms they play on, competitor VIP status, and what they like about competitors.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4" if you have access
      messages: [
        { role: "system", content: "You are the KAM Copilot Assistant. Use the provided KAM Knowledge Base to answer team questions professionally and strategically. If a question is about RM limits or SOPs, be extremely precise." },
        { role: "system", content: kamKnowledge },
        { role: "user", content: question }
      ],
      temperature: 0.7,
    });

    return new Response(JSON.stringify({ 
      answer: response.choices[0].message.content 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("AI Error:", error);
    return new Response(JSON.stringify({ answer: "I'm having trouble connecting to my brain. Check Netlify logs." }), {
      status: 500,
    });
  }
};
