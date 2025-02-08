interface Investor {
    id: number
    name: string
    description: string
    keywords: string[]
  }
  
  const investors: Investor[] = [
    {
      id: 1,
      name: "Honia",
      description: "Specializes in video OTT platforms and streaming technologies.",
      keywords: ["video", "OTT", "streaming", "media"],
    },
    {
      id: 2,
      name: "TechVentures",
      description: "Focuses on early-stage tech startups across various sectors.",
      keywords: ["tech", "startup", "early-stage", "innovation"],
    },
    // Add more investors here...
  ]
  
  export async function searchInvestors(query: string): Promise<Investor[]> {
    const lowercaseQuery = query.toLowerCase()
    return investors.filter((investor) => investor.keywords.some((keyword) => lowercaseQuery.includes(keyword)))
  }
  
  