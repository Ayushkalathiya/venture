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

    console.log(prompt);

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Verify prompt validity using Gemini model
    const validationResponse = await model.generateContent([
      `Is the following a *plausible* description of a company, project, or business activity? Answer only 'true' or 'false': ${prompt}`,
    ]);
    const isValidPrompt =
      validationResponse.response.text().trim().toLowerCase() === "true";

    if (!isValidPrompt) {
      return NextResponse.json(false);
    }

    // Retrieve all mentors from the database
    const mentors = await prisma.investorMentor.findMany();

    if (mentors.length === 0) {
      return NextResponse.json(
        { error: "No mentors available in the database." },
        { status: 404 }
      );
    }

    // Format mentor data for Gemini
    const mentorData = mentors
      .map(
        (mentor) =>
          `Name: ${mentor.name}, Category: ${mentor.category}, Type: ${mentor.type}, Email: ${mentor.email}`
      )
      .join("\n");

    // Ask Gemini to select the best-suited mentor
    const contentPrompt = `Based on this opportunity: "${prompt}"

    Available mentors:
    ${mentorData}
    
    Instructions:
    1. Select the single most qualified mentor for this opportunity
    2. List 2-3 concrete reasons why they are the ideal match, focusing on their expertise and relevance
    3. Format your response exactly as:
    Selected Mentor: [Name]
    Reasons:
    - [Specific expertise/experience that matches the opportunity]
    - [Relevant industry/domain knowledge]
    - [Additional value they can provide]`;
    const selectionResponse = await model.generateContent([contentPrompt]);

    // // Reduce user credit by 1 after successful response generation
    // const userId = request.headers.get('user-id'); // Assume user ID is passed in headers
    // if (!userId) {
    //   return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    // }

    // const user = await prisma.user.findUnique({ where: { id: userId } });
    // if (!user) {
    //   return NextResponse.json({ error: 'User not found' }, { status: 404 });
    // }

    // if (user.credits <= 0) {
    //   return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
    // }

    // await prisma.user.update({
    //   where: { id: userId },
    //   data: { credits: user.credits - 1 },
    // });

    return NextResponse.json({
      result: selectionResponse.response.text(),
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
