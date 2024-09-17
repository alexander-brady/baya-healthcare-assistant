import generate from "@/app/utils/generate";

export async function POST(
  req: Request,
) {
  const { query } = await req.json();
  const response = await generate(query).then((response) => JSON.stringify({'message': response}));
  return new Response(response);
}