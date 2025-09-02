
import { GoogleGenAI, Type } from "@google/genai";
import { EC2InstanceCost } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    instanceType: { type: Type.STRING },
    vcpu: { type: Type.INTEGER },
    memory: { type: Type.NUMBER },
    operatingSystem: { type: Type.STRING },
    ebsVolumeType: { type: Type.STRING },
    ebsVolumeSizeGB: { type: Type.INTEGER },
    instanceCostUSD: { type: Type.NUMBER },
    osCostUSD: { type: Type.NUMBER },
    ebsCostUSD: { type: Type.NUMBER },
    totalMonthlyCostUSD: { type: Type.NUMBER },
  },
  required: [
    "instanceType",
    "vcpu",
    "memory",
    "operatingSystem",
    "ebsVolumeType",
    "ebsVolumeSizeGB",
    "instanceCostUSD",
    "osCostUSD",
    "ebsCostUSD",
    "totalMonthlyCostUSD",
  ],
};

export async function fetchEC2Cost(
    instanceType: string,
    os: string,
    ebsVolumeType: string,
    ebsVolumeSizeGB: number
): Promise<EC2InstanceCost> {
  try {
    const prompt = `Provide the estimated monthly on-demand cost breakdown for an AWS EC2 instance of type '${instanceType}' running '${os}' with a ${ebsVolumeSizeGB}GB '${ebsVolumeType}' EBS volume in the 'us-east-1' region. Provide the cost for the instance, the OS (if applicable, otherwise 0), the EBS volume, and the total monthly cost in US dollars. Also provide the instance's vCPU count and memory in GiB.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("The AI returned an empty response. Please try again.");
    }
    
    const parsedData = JSON.parse(jsonText) as EC2InstanceCost;
    
    // Basic validation
    if (typeof parsedData.instanceType !== 'string' || typeof parsedData.totalMonthlyCostUSD !== 'number') {
        throw new Error("Received malformed data from the AI.");
    }
    
    return parsedData;
  } catch (error) {
    console.error("Error fetching EC2 cost from Gemini API:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
        throw new Error("Failed to parse the AI's response. The data format might be incorrect.");
    }
    throw new Error("Could not fetch the cost estimate. The AI service may be temporarily unavailable.");
  }
}
