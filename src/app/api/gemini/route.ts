// /app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

if (!process.env.API_KEY) {
  throw new Error("API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Verify prompt validity
    const validationResponse = await model.generateContent([
      `Is the following a *plausible* description of a company, project, or business activity? Answer only 'true' or 'false': ${prompt}`,
    ]);
    const isValidPrompt =
      validationResponse.response.text().trim().toLowerCase() === "true";

    if (!isValidPrompt) {
      return NextResponse.json(false);
    }

    const mentors = await prisma.investorMentor.findMany();

    if (mentors.length === 0) {
      return NextResponse.json(
        { error: "No mentors available in the database." },
        { status: 404 }
      );
    }

    const mentorData = mentors
      .map(
        (mentor) =>
          `Name: ${mentor.name}, Category: ${mentor.category}, Type: ${mentor.type}, Email: ${mentor.email}`
      )
      .join("\n");

    // Enhanced prompt for better structured response
    const contentPrompt = `Based on this startup opportunity: "${prompt}"

    Available mentors:
    ${mentorData}
    
    Please provide a detailed analysis in the following format:

    SELECTED MENTOR: [Mentor's Full Name]

    EXPERTISE MATCH:
    - **[Specific expertise that directly relates to the startup's domain]**
    - **[Industry experience and relevant background]**
    - **[Notable achievements or skills that would benefit this startup]**

    VALUE PROPOSITION:
    - **[How the mentor's experience can specifically help this startup]**
    - **[Potential areas of guidance and mentorship]**
    - **[Strategic advantages of this mentor match]**

    COLLABORATION POTENTIAL:
    - **[Specific ways the mentor can contribute to the startup's growth]**
    - **[Possible networking opportunities]**
    - **[Resource access and industry connections]**

    Please ensure each point is wrapped in ** for emphasis and the response is detailed, specific, and directly relates to the startup's needs.`;

    const selectionResponse = await model.generateContent([contentPrompt]);

    return NextResponse.json({
      result: selectionResponse.response.text(),
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
