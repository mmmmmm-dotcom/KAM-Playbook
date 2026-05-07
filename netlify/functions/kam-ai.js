export default async (request) => {
  try {
    const { question } = await request.json();

    const kamKnowledge = `
KAM SOP Knowledge Base v1:

Closure Request:
- First understand the real reason.
- Avoid aggressive retention.
- Gold tier and above escalate to senior KAM.

Bonus Request:
- Check recent reward history.
- Check ROI and deposit pattern.
- Do not overpromise approval.

VIP Tone:
- Professional
- Calm
- Trusted
- Relationship focused
`;

    const systemPrompt = `
You are KAM Copilot for a VIP management team.

Use the SOP knowledge below when answering.

Always provide:
1. Recommended handling
2. Suggested reply/script
3. Escalation note if needed

${kamKnowledge}
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();

    return Response.json({
      answer: data.output_text || "No response generated."
    });

  } catch (error) {
    return Response.json({
      answer: "Error: " + error.message
    }, { status: 500 });
  }
};
