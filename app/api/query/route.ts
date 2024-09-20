import generate from "@/app/utils/generate";

export async function POST(
  req: Request,
) {
  const { query } = await req.json();

  // const response = await generate(query).then((response) => JSON.stringify({'message': response}));
  const response = await generate(query);

  

  const payload = JSON.stringify({
    'message': response,
    'action': 'bookAppointment'
  });

  return new Response(payload)

}